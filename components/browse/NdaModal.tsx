"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { getChatEligibility, acceptNdaAndRequestChat, type ChatEligibility } from "@/app/browse/actions";
import { NDA_TEXT } from "@/lib/nda";

type NdaModalProps = {
  listingId: string;
  onClose: () => void;
};

type Phase = "loading" | "ready" | "submitting" | "submitted" | "error";

export function NdaModal({ listingId, onClose }: NdaModalProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [eligibility, setEligibility] = useState<ChatEligibility | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRoomId, setSubmittedRoomId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getChatEligibility(listingId).then((result) => {
      if (cancelled) return;
      setEligibility(result);
      setPhase("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleAccept = async () => {
    setPhase("submitting");
    setErrorMessage(null);
    const result = await acceptNdaAndRequestChat(listingId);
    if (result.status === "error") {
      setErrorMessage(result.message);
      setPhase("error");
      return;
    }
    setSubmittedRoomId(result.roomId);
    setPhase("submitted");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl border border-white/10 bg-[#141416] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-textMuted transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <h2 className="font-serif text-lg text-white">Perjanjian Kerahasiaan (NDA)</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {phase === "loading" && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-textMuted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memeriksa status...
            </div>
          )}

          {phase !== "loading" && eligibility?.kind === "no-seller" && (
            <p className="text-sm text-textMuted">
              Listing ini diajukan sebelum fitur chat aktif, sehingga belum mendukung permintaan diskusi in-app.
            </p>
          )}

          {phase !== "loading" && eligibility?.kind === "own-listing" && (
            <p className="text-sm text-textMuted">Anda tidak bisa mengajukan diskusi pada listing milik Anda sendiri.</p>
          )}

          {phase !== "loading" && eligibility?.kind === "not-logged-in" && (
            <p className="text-sm text-textMuted">
              Anda harus{" "}
              <Link href="/login?next=/browse" className="text-primary hover:underline">
                masuk
              </Link>{" "}
              terlebih dahulu untuk mengajukan diskusi.
            </p>
          )}

          {phase !== "loading" && eligibility?.kind === "existing" && eligibility.status === "REQUESTED" && (
            <p className="text-sm text-textMuted">
              Permintaan diskusi Anda untuk listing ini sudah terkirim dan sedang menunggu persetujuan admin.
            </p>
          )}

          {phase !== "loading" && eligibility?.kind === "existing" && eligibility.status === "ACTIVE" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-textMuted">Room chat Anda untuk listing ini sudah aktif.</p>
              <Link
                href={`/chat/${eligibility.roomId}`}
                className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
              >
                Buka Chat Room
              </Link>
            </div>
          )}

          {phase !== "loading" &&
            eligibility?.kind !== "no-seller" &&
            eligibility?.kind !== "own-listing" &&
            eligibility?.kind !== "not-logged-in" &&
            eligibility?.kind !== "existing" &&
            phase !== "submitted" && (
              <>
                <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.02] p-4 font-sans text-xs leading-relaxed text-textMuted">
                  {NDA_TEXT}
                </pre>
                {eligibility?.kind === "ready" && (
                  <p className="mt-3 text-xs text-textMuted">
                    Anda sudah menyetujui NDA ini untuk listing yang sama sebelumnya.
                  </p>
                )}
              </>
            )}

          {phase === "submitted" && (
            <p className="text-sm text-emerald-300">
              Permintaan diskusi terkirim! Tim kami akan meninjau dan mengaktifkan room chat Anda secepatnya.
            </p>
          )}

          {phase === "error" && errorMessage && <p className="mt-3 text-sm text-red-400">{errorMessage}</p>}
        </div>

        {phase !== "loading" &&
          phase !== "submitted" &&
          eligibility?.kind !== "no-seller" &&
          eligibility?.kind !== "own-listing" &&
          eligibility?.kind !== "not-logged-in" &&
          eligibility?.kind !== "existing" && (
            <div className="flex gap-3 border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-textMuted transition-all hover:bg-white/[0.05]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={phase === "submitting"}
                onClick={handleAccept}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
                Saya Setuju & Ajukan Diskusi
              </button>
            </div>
          )}

        {(phase === "submitted" ||
          eligibility?.kind === "no-seller" ||
          eligibility?.kind === "own-listing" ||
          eligibility?.kind === "not-logged-in") && (
          <div className="border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-textMuted transition-all hover:bg-white/[0.05]"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
