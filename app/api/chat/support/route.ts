import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/currentUser";
import { getClientIp } from "@/lib/requestIp";
import { checkRateLimit } from "@/lib/rateLimit";
import { getChatCompletion, OpenAiError, type ChatMessage } from "@/lib/openai/client";
import { SUPPORT_SYSTEM_PROMPT } from "@/lib/openai/systemPrompt";

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_MESSAGE_LENGTH = 2000;
// Only a few recent turns for context — this is a stateless FAQ bot, not a
// long-running conversation partner.
const MAX_HISTORY_MESSAGES = 6;

type IncomingHistoryItem = { role: "user" | "assistant"; content: string };

function formatRetryAfter(retryAfterSeconds: number): string {
  if (retryAfterSeconds < 60) return `${retryAfterSeconds} detik`;
  return `${Math.ceil(retryAfterSeconds / 60)} menit`;
}

function sanitizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const items = raw
    .filter(
      (item): item is IncomingHistoryItem =>
        !!item &&
        typeof item === "object" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    )
    .slice(-MAX_HISTORY_MESSAGES);

  return items.map((item) => ({
    role: item.role,
    content: item.content.slice(0, MAX_MESSAGE_LENGTH),
  }));
}

export async function POST(request: Request) {
  const ip = await getClientIp();

  const rateLimit = checkRateLimit(`support-chat:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak pesan. Silakan coba lagi dalam ${formatRetryAfter(rateLimit.retryAfterSeconds)}.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const rawMessage = typeof (body as { message?: unknown })?.message === "string" ? (body as { message: string }).message : "";
  const message = rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);

  if (!message) {
    return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
  }

  const history = sanitizeHistory((body as { history?: unknown })?.history);

  const messages: ChatMessage[] = [
    { role: "system", content: SUPPORT_SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  let reply: string;
  try {
    reply = await getChatCompletion(messages);
  } catch (error) {
    if (error instanceof OpenAiError) {
      console.error("[support-chat] OpenAI call failed:", error.message);
    } else {
      console.error("[support-chat] unexpected error:", error);
    }
    return NextResponse.json(
      { error: "Maaf, chatbot sedang tidak bisa merespons. Silakan coba lagi sebentar lagi." },
      { status: 502 }
    );
  }

  try {
    const userId = await getCurrentUserId();
    await prisma.supportChatLog.create({
      data: {
        userId: userId ?? undefined,
        ipAddress: ip,
        userMessage: message,
        botReply: reply,
      },
    });
  } catch (error) {
    // Logging is for admin quality review, not a functional dependency —
    // never fail the actual reply because logging hiccuped.
    console.error("[support-chat] failed to save chat log:", error);
  }

  return NextResponse.json({ reply });
}
