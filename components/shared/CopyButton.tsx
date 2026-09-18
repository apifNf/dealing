"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — no crash,
      // the value is still shown as plain text so the user can select it
      // manually either way.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className ?? "text-textMuted transition-colors hover:text-primary"}
      aria-label={copied ? "Tersalin" : "Salin ke clipboard"}
      title={copied ? "Tersalin!" : "Salin"}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
