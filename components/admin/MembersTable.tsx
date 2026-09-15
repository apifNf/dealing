"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import type { Member } from "@/generated/prisma/client";
import { approveMember, rejectMember } from "@/app/admin/dashboard/actions";
import { StatusBadge } from "./StatusBadge";

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

type MembersTableProps = {
  members: Member[];
};

export function MembersTable({ members }: MembersTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-textMuted">
            <th className="px-6 py-4 font-medium">Nama</th>
            <th className="px-6 py-4 font-medium">Kontak</th>
            <th className="px-6 py-4 font-medium">Alasan</th>
            <th className="px-6 py-4 font-medium">Diajukan</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const isRowPending = isPending && pendingId === member.id;

            return (
              <tr key={member.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-textMain">{member.name}</td>
                <td className="max-w-[200px] truncate px-6 py-4 text-textMuted" title={member.contactInfo}>
                  {member.contactInfo}
                </td>
                <td className="max-w-[240px] truncate px-6 py-4 text-textMuted" title={member.reason ?? undefined}>
                  {member.reason || "-"}
                </td>
                <td className="px-6 py-4 text-textMuted">{formatDate(member.createdAt)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={member.status} />
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
