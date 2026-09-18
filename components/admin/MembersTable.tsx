"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Banknote, Check, Eye, Loader2, X } from "lucide-react";
import type { Member, MemberPaymentStatus } from "@/generated/prisma/client";
import { approveMember, rejectMember, markMemberPaid } from "@/app/admin/dashboard/actions";
import { getPlanMeta } from "@/lib/validations/membership";
import { StatusBadge } from "./StatusBadge";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { CopyButton } from "@/components/shared/CopyButton";

const PAYMENT_STATUS_STYLES: Record<MemberPaymentStatus, string> = {
  PendingPayment: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Expired: "border-white/20 bg-white/[0.05] text-textMuted",
};

const PAYMENT_STATUS_LABELS: Record<MemberPaymentStatus, string> = {
  PendingPayment: "Menunggu Pembayaran",
  Active: "Aktif",
  Expired: "Expired",
};

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

type MembersTableProps = {
  members: Member[];
};

export function MembersTable({ members }: MembersTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const mounted = useHasMounted();

  const handleAction = (id: string, action: (id: string) => Promise<void>) => {
    setPendingId(id);
    startTransition(async () => {
      await action(id);
      setPendingId(null);
    });
  };

  if (members.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surfaceGlass p-12 text-center text-sm text-textMuted backdrop-blur-2xl">
        Belum ada aplikasi membership yang masuk.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-surfaceGlass backdrop-blur-2xl">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-textMuted">
            <th className="px-6 py-4 font-medium">Nama</th>
            <th className="px-6 py-4 font-medium">Kontak</th>
            <th className="px-6 py-4 font-medium">Paket</th>
            <th className="px-6 py-4 font-medium">Diajukan</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Pembayaran</th>
            <th className="px-6 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isRowPending = isPending && pendingId === member.id;
            const planMeta = getPlanMeta(member.plan);

            return (
              <tr key={member.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-textMain">{member.name}</td>
                <td className="max-w-[180px] px-6 py-4 text-textMuted" title={member.contactInfo}>
                  <span className="flex items-center gap-2">
                    <span className="truncate">{mounted ? member.contactInfo : "···"}</span>
                    {mounted && <CopyButton value={member.contactInfo} />}
                  </span>
                </td>
                <td className="px-6 py-4 text-textMuted">
                  <div>{planMeta.label}</div>
                  <div className="text-xs text-textMuted/70">{formatRupiah(member.priceSnapshot)}</div>
                </td>
                <td className="px-6 py-4 text-textMuted">{formatDate(member.createdAt)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={member.status} />
                </td>
                <td className="px-6 py-4">
                  {member.status === "APPROVED" ? (
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xl ${PAYMENT_STATUS_STYLES[member.paymentStatus]}`}
                    >
                      {PAYMENT_STATUS_LABELS[member.paymentStatus]}
                    </span>
                  ) : (
                    <span className="text-xs text-textMuted/50">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isRowPending || member.status === "APPROVED"}
                      onClick={() => handleAction(member.id, approveMember)}
                      className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={isRowPending || member.status === "REJECTED"}
                      onClick={() => handleAction(member.id, rejectMember)}
                      className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      Reject
                    </button>
                    {member.status === "APPROVED" && member.paymentStatus === "PendingPayment" && (
                      <button
                        type="button"
                        disabled={isRowPending}
                        onClick={() => handleAction(member.id, markMemberPaid)}
                        className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Banknote className="h-3.5 w-3.5" />}
                        Tandai Sudah Bayar
                      </button>
                    )}
                    {member.status === "APPROVED" && (
                      <Link
                        href={`/membership/payment/${member.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-textMuted transition-colors hover:bg-white/[0.05] hover:text-textMain"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Lihat Instruksi Bayar
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
