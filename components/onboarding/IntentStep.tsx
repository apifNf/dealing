import { ArrowUpRight, Rocket, TrendingUp } from "lucide-react";
import type { OnboardingIntent } from "./OnboardingFlow";

type IntentStepProps = {
  onSelect: (intent: OnboardingIntent) => void;
};

export function IntentStep({ onSelect }: IntentStepProps) {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-12 text-center">
      <div>
        <div className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-surfaceGlass px-5 py-2 text-xs font-medium text-primary backdrop-blur-2xl">
          Mulai Perjalanan Anda
        </div>
        <h1 className="font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
          Apa tujuan Anda hari ini?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-textMuted sm:text-base">
          Pilih jalur yang sesuai, dan kami akan menyesuaikan seluruh pengalaman DEALING untuk Anda.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("sell")}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surfaceGlass p-10 text-left backdrop-blur-2xl transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.05] hover:shadow-[0_0_60px_rgba(194,65,12,0.2)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-500 group-hover:scale-110">
                <Rocket className="h-7 w-7" />
              </div>
              <ArrowUpRight className="h-6 w-6 text-textMuted transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-white sm:text-3xl">Saya Ingin Menjual Bisnis</h3>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">
                Ubah aset digital Anda &mdash; konten, website, SaaS, newsletter, atau toko online &mdash; menjadi
                likuiditas lewat listing yang melalui review admin sebelum tayang.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect("buy")}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surfaceGlass p-10 text-left backdrop-blur-2xl transition-all duration-500 hover:border-primary/50 hover:bg-white/[0.05] hover:shadow-[0_0_60px_rgba(194,65,12,0.2)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="relative flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-500 group-hover:scale-110">
                <TrendingUp className="h-7 w-7" />
              </div>
              <ArrowUpRight className="h-6 w-6 text-textMuted transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-white sm:text-3xl">Saya Ingin Mengakuisisi</h3>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">
                Simpan preferensi budget dan kategori Anda, dan dapatkan info lebih dulu begitu ada listing yang
                cocok.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
