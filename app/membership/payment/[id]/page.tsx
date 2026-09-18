import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Landmark, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageBackground } from "@/components/shared/PageBackground";
import { CopyButton } from "@/components/shared/CopyButton";
import { getPlanMeta } from "@/lib/validations/membership";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instruksi Pembayaran Membership | DEALING",
};

// ============================================================================
// TEMPORARY MANUAL PAYMENT FLOW — this whole page (and the "Tandai Sudah
// Bayar" admin action it pairs with) exists only because Midtrans isn't
// wired up yet. Once automated payment is live, replace this manual bank
// transfer + admin-confirmation flow with a real checkout/webhook and this
// page should redirect into that instead of showing static account details.
// ============================================================================
const BANK_NAME = "BNI";
const BANK_ACCOUNT_NUMBER = "1940956832";
const BANK_ACCOUNT_NAME = "APIF NOFAL";

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

type PaymentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MembershipPaymentPage({ params }: PaymentPageProps) {
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } });

  if (!member) notFound();

  const planMeta = getPlanMeta(member.plan);

  return (
    <PageBackground mainClassName="flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-8 rounded-3xl border border-white/10 bg-surfaceGlass p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        {member.status !== "APPROVED" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl text-white">Aplikasi Belum Disetujui</h1>
            <p className="text-sm leading-relaxed text-textMuted">
              Aplikasi membership Anda masih dalam peninjauan tim kami. Instruksi pembayaran akan tersedia di
              halaman ini setelah aplikasi Anda disetujui.
            </p>
          </div>
        )}

        {member.status === "APPROVED" && member.paymentStatus === "Active" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl text-white">Membership Aktif</h1>
            <p className="text-sm leading-relaxed text-textMuted">
              Pembayaran Anda sudah dikonfirmasi. Membership {planMeta.label.toLowerCase()} Anda aktif
              {member.expiresAt && <> hingga {formatDate(member.expiresAt)}</>}.
            </p>
          </div>
        )}

        {member.status === "APPROVED" && member.paymentStatus === "Expired" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
              <XCircle className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl text-white">Membership Berakhir</h1>
            <p className="text-sm leading-relaxed text-textMuted">
              Membership {planMeta.label.toLowerCase()} Anda sudah berakhir. Silakan ajukan aplikasi baru lewat
              halaman Membership untuk memperpanjang.
            </p>
          </div>
        )}

        {member.status === "APPROVED" && member.paymentStatus === "PendingPayment" && (
          <div className="flex w-full flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Landmark className="h-6 w-6" />
              </div>
              <h1 className="font-serif text-2xl text-white">Instruksi Pembayaran</h1>
              <p className="mt-2 text-sm leading-relaxed text-textMuted">
                Aplikasi Anda sudah disetujui! Selesaikan pembayaran berikut untuk mengaktifkan membership.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">Paket</span>
                <span className="font-medium text-textMain">{planMeta.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">Nominal Transfer</span>
                <span className="font-semibold text-primary">{formatRupiah(member.priceSnapshot)}</span>
              </div>
              <div className="my-1 border-t border-white/10" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">Bank</span>
                <span className="font-medium text-textMain">{BANK_NAME}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">No. Rekening</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono font-medium text-textMain">{BANK_ACCOUNT_NUMBER}</span>
                  <CopyButton value={BANK_ACCOUNT_NUMBER} />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-textMuted">Atas Nama</span>
                <span className="font-medium text-textMain">{BANK_ACCOUNT_NAME}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs leading-relaxed text-textMain">
              Setelah transfer, tidak perlu mengirim bukti secara terpisah — konfirmasi pembayaran akan diproses
              admin dalam 24 jam. Anda akan menerima link undangan Channel WhatsApp internal langsung dari admin
              begitu pembayaran terverifikasi.
            </div>
          </div>
        )}
      </div>
    </PageBackground>
  );
}
