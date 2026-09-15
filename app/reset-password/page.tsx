import type { Metadata } from "next";
import Link from "next/link";
import { PageBackground } from "@/components/shared/PageBackground";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { SubmitStatus } from "@/components/onboarding/shared/SubmitStatus";

export const metadata: Metadata = {
  title: "Reset Password | DEALING",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <PageBackground mainClassName="flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-textMuted">Atur password baru untuk akun Anda.</p>
        </div>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <SubmitStatus status="error" message="Link reset password tidak lengkap. Silakan minta link baru." />
        )}

        <Link href="/forgot-password" className="text-center text-xs text-textMuted hover:text-textMain transition-colors">
          Minta link reset baru
        </Link>
      </div>
    </PageBackground>
  );
}
