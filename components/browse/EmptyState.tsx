import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-surfaceGlass p-16 text-center backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="font-serif text-xl text-white">Belum ada listing tersedia saat ini</h3>
      <p className="max-w-sm text-sm text-textMuted">
        Tim kurasi kami sedang meninjau listing yang masuk. Cek lagi nanti, atau jadi yang pertama menjual aset digital Anda.
      </p>
    </div>
  );
}
