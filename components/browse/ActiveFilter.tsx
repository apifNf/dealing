import Link from "next/link";
import { X } from "lucide-react";

type ActiveFilterProps = {
  labels: string[];
};

export function ActiveFilter({ labels }: ActiveFilterProps) {
  if (labels.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-textMuted">Filter aktif:</span>
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
        >
          {label}
        </span>
      ))}
      <Link
        href="/browse"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-textMuted transition-colors hover:text-white"
      >
        <X className="h-3 w-3" />
        Lihat Semua
      </Link>
    </div>
  );
}
