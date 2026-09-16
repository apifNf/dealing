"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { NdaModal } from "./NdaModal";

type AjukanDiskusiButtonProps = {
  listingId: string;
  hasSeller: boolean;
};

export function AjukanDiskusiButton({ listingId, hasSeller }: AjukanDiskusiButtonProps) {
  const [open, setOpen] = useState(false);

  if (!hasSeller) {
    return (
      <button
        type="button"
        disabled
        title="Listing ini belum mendukung fitur chat (diajukan sebelum sistem chat aktif)"
        className="relative mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm font-semibold text-textMuted opacity-40"
      >
        <MessageSquareText className="h-4 w-4" />
        Ajukan Diskusi
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm font-semibold text-white transition-all hover:border-primary/50 hover:bg-primary/10"
      >
        <MessageSquareText className="h-4 w-4" />
        Ajukan Diskusi
      </button>
      {open && <NdaModal listingId={listingId} onClose={() => setOpen(false)} />}
    </>
  );
}
