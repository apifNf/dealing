"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

type ChatEntry = {
  role: "user" | "assistant" | "error";
  content: string;
};

const GREETING: ChatEntry = {
  role: "assistant",
  content:
    "Halo! Saya asisten DEALING. Ada yang bisa saya bantu soal cara kerja platform — fee, proses review listing, membership, chat room, atau hal umum lainnya?",
};

export function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || sending) return;

    const nextMessages: ChatEntry[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setSending(true);

    try {
      const history = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(0, -1)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "error", content: data.error ?? "Terjadi kesalahan." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Gagal terhubung ke server. Silakan coba lagi." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141416] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-surfaceGlass px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">DEALING Assistant</p>
                <p className="text-[11px] text-textMuted">Tanya seputar cara kerja platform</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-textMuted transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      entry.role === "user"
                        ? "bg-primary text-white"
                        : entry.role === "error"
                          ? "border border-red-500/30 bg-red-500/10 text-red-300"
                          : "border border-white/10 bg-white/[0.04] text-textMain"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{entry.content}</p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-textMuted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Mengetik...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2 border-t border-white/10 p-3">
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
              placeholder="Tulis pertanyaan Anda..."
              className="max-h-24 flex-1 resize-none rounded-2xl bg-white/[0.02] px-3.5 py-2.5 text-sm text-textMain placeholder:text-textMuted/50 outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim() || sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_30px_rgba(194,65,12,0.4)] transition-all hover:bg-primary-hover"
        aria-label={open ? "Tutup chat" : "Buka chat bantuan"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
