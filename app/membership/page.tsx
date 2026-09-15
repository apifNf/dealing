import type { Metadata } from "next";
import { PageBackground } from "@/components/shared/PageBackground";
import { MembershipForm } from "@/components/membership/MembershipForm";

export const metadata: Metadata = {
  title: "Daftar Member | DEALING",
  description: "Ajukan aplikasi membership DEALING untuk mendapatkan early access ke listing pilihan.",
};

export default function MembershipPage() {
  return (
    <PageBackground mainClassName="flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="text-center">
          <div className="mx-auto mb-6 w-fit rounded-full border border-white/10 bg-surfaceGlass px-5 py-2 text-xs font-medium text-primary backdrop-blur-2xl">
            Membership Eksklusif
          </div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Daftar Jadi Member</h1>
          <p className="mt-3 text-sm leading-relaxed text-textMuted">
            Aplikasi Anda akan ditinjau oleh tim kami. Setelah disetujui, Anda akan mendapat info listing
            pilihan lebih dulu sebelum ramai ditemukan lewat Browse.
          </p>
        </div>
        <MembershipForm />
      </div>
    </PageBackground>
  );
}
