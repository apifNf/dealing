import type { Metadata } from "next";
import Link from "next/link";
import { PageBackground } from "@/components/shared/PageBackground";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Password | DEALING",
};

export default function ForgotPasswordPage() {
  return (
    <PageBackground mainClassName="flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-white">Lupa Password</h1>
          <p className="mt-2 text-sm text-textMuted">
            Masukkan email Anda, kami akan kirim link untuk reset password.
          </p>
        </div>
        <ForgotPasswordForm />
        <Link href="/login" className="text-center text-xs text-textMuted hover:text-textMain transition-colors">
          Kembali ke Masuk
        </Link>
      </div>
    </PageBackground>
  );
}
