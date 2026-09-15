import Link from "next/link";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  filtered?: boolean;
};

export function EmptyState({ filtered = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-surfaceGlass p-16 text-center backdrop-blur-2xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="font-serif text-xl text-white">
        {filtered ? "Belum Ada Listing di Kategori Ini" : "Belum ada listing tersedia saat ini"}
      </h3>
      <p className="max-w-sm text-sm text-textMuted">
        {filtered
          ? "Tapi jangan khawatir — simpan preferensi Anda dan kami akan menghubungi Anda begitu ada listing baru yang cocok."
          : "Tim kurasi kami sedang meninjau listing yang masuk. Cek lagi nanti, atau jadi yang pertama menjual aset digital Anda."}
      </p>
      {filtered && (
        <div className="flex items-center gap-4">
          <Link href="/onboarding?intent=buy" className="text-xs font-medium text-primary hover:underline">
            Simpan preferensi saya
          </Link>
          <Link href="/browse" className="text-xs font-medium text-textMuted hover:text-white hover:underline">
            Lihat semua listing
          </Link>
        </div>
      )}
    </div>
  );
}
