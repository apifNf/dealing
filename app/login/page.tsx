import type { Metadata } from "next";
import Link from "next/link";
import { PageBackground } from "@/components/shared/PageBackground";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | DEALING",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <PageBackground mainClassName="flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-white">Masuk</h1>
          <p className="mt-2 text-sm text-textMuted">Masuk untuk melanjutkan ke DEALING.</p>
        </div>
        <LoginForm next={next ?? "/onboarding"} />
        <p className="text-center text-xs text-textMuted">
          Belum punya akun?{" "}
          <Link
            href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="text-primary hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </PageBackground>
  );
}
