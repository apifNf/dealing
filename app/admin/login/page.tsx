import type { Metadata } from "next";
import { PageBackground } from "@/components/shared/PageBackground";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | DEALING",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { next } = await searchParams;

  return (
    <PageBackground mainClassName="flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-textMuted">Masukkan passcode untuk mengakses dashboard admin.</p>
        </div>
        <LoginForm next={next ?? "/admin/dashboard"} />
      </div>
    </PageBackground>
  );
}
