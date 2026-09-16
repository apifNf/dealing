import { config as loadEnv } from "dotenv";
// Next's own CLI (`next dev`/`next start`) auto-loads .env.local/.env; a
// custom server bypasses that entirely, so without this, everything that
// reads process.env at module-load time (like lib/prisma.ts's DATABASE_URL)
// sees undefined. Must run before any local module is imported below —
// since those use dynamic `import()` (not hoisted, unlike static imports),
// this synchronous call is guaranteed to complete first.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { createServer, type IncomingMessage } from "node:http";
import { parse } from "node:url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import type { resolveChatAccess as ResolveChatAccessFn, ChatRoomAccess } from "./lib/chat/access";

const port = Number(process.env.PORT) || 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

type RoomSocket = { ws: WebSocket; role: ChatRoomAccess; userId: string | null };
const roomSockets = new Map<string, Set<RoomSocket>>();

function broadcast(roomId: string, payload: unknown) {
  const sockets = roomSockets.get(roomId);
  if (!sockets) return;
  const data = JSON.stringify(payload);
  for (const { ws } of sockets) {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  }
}

async function main() {
  // Deferred until after env vars are loaded above — see the dotenv note.
  const { prisma } = await import("./lib/prisma");
  const { verifySessionToken, USER_SESSION_COOKIE } = await import("./lib/userAuth");
  const { isValidSessionToken, ADMIN_SESSION_COOKIE } = await import("./lib/adminAuth");
  const { resolveChatAccess } = (await import("./lib/chat/access")) as { resolveChatAccess: typeof ResolveChatAccessFn };
  const { looksLikeOffPlatformContact } = await import("./lib/chat/moderation");
  const { postOpsNotification } = await import("./lib/ops/notify");
  const { ChatRoomStatus } = await import("./generated/prisma/client");

  await app.prepare();

  const server = createServer((req, res) => {
    handle(req, res);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const parsedUrl = parse(req.url || "", true);

    if (parsedUrl.pathname !== "/api/chat/socket") {
      socket.destroy();
      return;
    }

    const roomId = String(parsedUrl.query.roomId || "");
    if (!roomId) {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
      return;
    }

    const cookies = parseCookies(req.headers.cookie);
    const userId = verifySessionToken(cookies[USER_SESSION_COOKIE]);
    const isAdmin = isValidSessionToken(cookies[ADMIN_SESSION_COOKIE]);

    prisma.chatRoom
      .findUnique({ where: { id: roomId } })
      .then((room) => {
        if (!room) {
          socket.end("HTTP/1.1 404 Not Found\r\n\r\n");
          return;
        }

        const access = resolveChatAccess(room, { userId, isAdmin });
        if (!access) {
          socket.end("HTTP/1.1 403 Forbidden\r\n\r\n");
          return;
        }

        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit("connection", ws, req, { roomId, role: access, userId });
        });
      })
      .catch((error) => {
        console.error("[chat-ws] upgrade authorization failed:", error);
        socket.end("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      });
  });

  wss.on(
    "connection",
    (ws: WebSocket, _req: IncomingMessage, context: { roomId: string; role: ChatRoomAccess; userId: string | null }) => {
      const { roomId, role, userId } = context;
      const entry: RoomSocket = { ws, role, userId };

      if (!roomSockets.has(roomId)) roomSockets.set(roomId, new Set());
      roomSockets.get(roomId)!.add(entry);

      ws.on("message", async (raw) => {
        // Admins are read-only monitors — never allowed to post as a
        // participant, regardless of what a tampered client sends.
        if (role !== "buyer" && role !== "seller") return;

        let parsed: { type?: string; content?: string };
        try {
          parsed = JSON.parse(raw.toString());
        } catch {
          return;
        }
        if (parsed.type !== "message" || typeof parsed.content !== "string") return;

        const content = parsed.content.trim().slice(0, 4000);
        if (!content || !userId) return;

        // Re-check current status on every send — a room approved at
        // connection time could since have been rejected/closed.
        const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
        if (!room || room.status !== ChatRoomStatus.ACTIVE) return;

        const flagged = looksLikeOffPlatformContact(content);

        const saved = await prisma.chatMessage.create({
          data: { chatRoomId: roomId, senderUserId: userId, content, flagged },
          include: { sender: { select: { email: true } } },
        });

        broadcast(roomId, {
          type: "message",
          message: {
            id: saved.id,
            content: saved.content,
            senderUserId: saved.senderUserId,
            senderEmail: saved.sender.email,
            createdAt: saved.createdAt,
            flagged: saved.flagged,
          },
        });

        if (flagged) {
          postOpsNotification(
            `⚠️ Pesan mencurigakan (kemungkinan berbagi kontak di luar platform) di chat room ${roomId} oleh ${saved.sender.email}:\n"${content}"`,
            "chat-flagged"
          ).catch((error) => console.error("[chat-ws] flagged-message notification failed:", error));
        }
      });

      ws.on("close", () => {
        roomSockets.get(roomId)?.delete(entry);
      });
    }
  );

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} (${dev ? "development" : "production"})`);
  });
}

main().catch((error) => {
  console.error("[server] fatal startup error:", error);
  process.exit(1);
});
