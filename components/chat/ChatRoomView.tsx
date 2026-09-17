"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Eye, Loader2, Send, ShieldAlert } from "lucide-react";
import type { ChatRoomStatus } from "@/generated/prisma/client";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

type ChatMessageView = {
  id: string;
  content: string;
  senderUserId: string;
  createdAt: string;
  flagged: boolean;
};

type ChatRole = "buyer" | "seller" | "admin";

type ChatRoomViewProps = {
  roomId: string;
  status: ChatRoomStatus;
  role: ChatRole;
  categoryLabel: string;
  counterpartEmail: string | null;
  buyerEmail: string;
  sellerEmail: string;
  buyerUserId: string;
  sellerUserId: string;
  initialMessages: ChatMessageView[];
  currentUserId: string | null;
};

const STATUS_LABELS: Record<ChatRoomStatus, string> = {
  REQUESTED: "Menunggu Persetujuan Admin",
  ACTIVE: "Aktif",
  REJECTED: "Ditolak",
  CLOSED: "Ditutup",
};

const STATUS_STYLES: Record<ChatRoomStatus, string> = {
  REQUESTED: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  REJECTED: "border-red-500/30 bg-red-500/10 text-red-300",
  CLOSED: "border-white/20 bg-white/[0.05] text-textMuted",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

export function ChatRoomView({
  roomId,
  status,
  role,
  categoryLabel,
  counterpartEmail,
  buyerEmail,
  sellerEmail,
  buyerUserId,
  sellerUserId,
  initialMessages,
  currentUserId,
}: ChatRoomViewProps) {
  const [messages, setMessages] = useState<ChatMessageView[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const canSend = (role === "buyer" || role === "seller") && status === "ACTIVE";
  const mounted = useHasMounted();

  useEffect(() => {
    if (status !== "ACTIVE") return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/chat/socket?roomId=${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "message") {
          setMessages((prev) => [...prev, payload.message]);
        }
      } catch {
        // ignore malformed frames
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const headerLabel = useMemo(() => {
    if (!mounted) return "Diskusi";
    if (role === "admin") return `Monitoring: ${buyerEmail} ↔ ${sellerEmail}`;
    return counterpartEmail ? `Diskusi dengan ${counterpartEmail}` : "Diskusi";
  }, [mounted, role, counterpartEmail, buyerEmail, sellerEmail]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    setSending(true);
    wsRef.current.send(JSON.stringify({ type: "message", content }));
    setDraft("");
    setSending(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-surfaceGlass p-6 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">{categoryLabel}</p>
            <h1 className="mt-1 font-serif text-xl text-white">{headerLabel}</h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xl ${STATUS_STYLES[status]}`}
          >
            {status === "ACTIVE" && (
              <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-textMuted"}`} />
            )}
            {STATUS_LABELS[status]}
          </span>
        </div>
        {role === "admin" && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-textMuted">
            <Eye className="h-3.5 w-3.5" />
            Mode monitoring admin — read-only, tidak ikut sebagai partisipan.
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Demi keamanan, lakukan seluruh negosiasi hanya di dalam chat room ini. Jangan membagikan nomor telepon,
          email, atau kontak pribadi lain, dan jangan bertransaksi di luar platform. Pelanggaran dapat menyebabkan
          akun seller di-banned oleh platform.
        </p>
      </div>

      {status === "REQUESTED" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-textMuted">
          Permintaan diskusi ini masih menunggu persetujuan admin. Anda akan bisa mulai mengirim pesan setelah
          disetujui.
        </div>
      )}
      {status === "REJECTED" && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-textMuted">
          Permintaan diskusi ini ditolak oleh admin.
        </div>
      )}
      {status === "CLOSED" && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-textMuted">
          Chat room ini sudah ditutup.
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex h-[50vh] flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-surfaceGlass p-6 backdrop-blur-2xl"
      >
        {messages.length === 0 && (
          <p className="m-auto text-sm text-textMuted">Belum ada pesan.</p>
        )}
        {messages.map((message) => {
          const isMine = role !== "admin" && message.senderUserId === currentUserId;
          const isFromBuyer = message.senderUserId === buyerUserId;
          const adminSenderLabel = mounted
            ? isFromBuyer
              ? `Buyer · ${buyerEmail}`
              : `Seller · ${sellerEmail}`
            : isFromBuyer
              ? "Buyer"
              : "Seller";

          return (
            <div key={message.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.flagged
                    ? "border border-amber-500/40 bg-amber-500/10 text-amber-100"
                    : isMine
                      ? "bg-primary/90 text-white"
                      : "border border-white/10 bg-white/[0.04] text-textMain"
                }`}
              >
                {role === "admin" && (
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-textMuted">
                    {adminSenderLabel}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                {message.flagged && (
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                    <ShieldAlert className="h-3 w-3" />
                    Terdeteksi kontak eksternal
                  </p>
                )}
              </div>
              <span className="mt-1 text-[10px] text-textMuted">{formatTime(message.createdAt)}</span>
            </div>
          );
        })}
      </div>

      {canSend && (
        <div className="flex items-end gap-3 rounded-3xl border border-white/10 bg-surfaceGlass p-3 backdrop-blur-2xl">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Tulis pesan..."
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-textMain placeholder:text-textMuted/50 outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || sending || !connected}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
