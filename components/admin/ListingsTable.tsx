"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Megaphone, X } from "lucide-react";
import type { Listing } from "@/generated/prisma/client";
import { approveListing, rejectListing, shareListingToMembership } from "@/app/admin/dashboard/actions";
import { StatusBadge } from "./StatusBadge";

const CATEGORY_LABELS: Record<string, string> = {
  content: "Content Account",
  website: "Website / Media",
  saas: "SaaS / Micro-Tools",
  newsletter: "Newsletter & Komunitas",
  ecommerce: "E-Commerce & Toko Digital",
};

function formatRupiah(value: number | null) {
  if (value === null) return "-";
  return `Rp${value.toLocaleString("id-ID")}`;
}

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

type ListingsTableProps = {
  listings: Listing[];
};

export function ListingsTable({ listings }: ListingsTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (id: string, action: (id: string) => Promise<void>) => {
    setPendingId(id);
    startTransition(async () => {
      await action(id);
      setPendingId(null);
    });
  };

  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surfaceGlass p-12 text-center text-sm text-textMuted backdrop-blur-xl">
        Belum ada listing yang masuk.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-surfaceGlass backdrop-blur-xl">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-textMuted">
            <th className="px-6 py-4 font-medium">Kategori</th>
            <th className="px-6 py-4 font-medium">Detail</th>
            <th className="px-6 py-4 font-medium">Kontak</th>
            <th className="px-6 py-4 font-medium">MRR / Revenue</th>
            <th className="px-6 py-4 font-medium">Dokumen</th>
            <th className="px-6 py-4 font-medium">Dikirim</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => {
            const isRowPending = isPending && pendingId === listing.id;
            const detail = listing.repositoryLink || listing.assetUrl || listing.storeName || listing.platformName || "-";
            const revenue = listing.mrr ?? listing.monthlyRevenue ?? null;

            return (
              <tr key={listing.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-textMain">{CATEGORY_LABELS[listing.category] ?? listing.category}</td>
                <td className="max-w-[240px] truncate px-6 py-4 text-textMuted" title={detail}>
                  {detail}
                </td>
                <td className="max-w-[160px] truncate px-6 py-4 text-textMuted" title={listing.contactInfo ?? undefined}>
                  {listing.contactInfo ?? "-"}
                </td>
                <td className="px-6 py-4 text-textMain">{formatRupiah(revenue)}</td>
                <td className="px-6 py-4 text-textMuted">
                  {listing.fileNames.length > 0 ? `${listing.fileNames.length} file` : "-"}
                </td>
                <td className="px-6 py-4 text-textMuted">{formatDate(listing.createdAt)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={listing.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isRowPending || listing.status === "APPROVED"}
                      onClick={() => handleAction(listing.id, approveListing)}
                      className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={isRowPending || listing.status === "REJECTED"}
                      onClick={() => handleAction(listing.id, rejectListing)}
                      className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      Reject
                    </button>
                    {listing.status !== "REJECTED" && (
                      <button
                        type="button"
                        disabled={isRowPending || !!listing.sharedToMembershipAt}
                        onClick={() => handleAction(listing.id, shareListingToMembership)}
                        title={
                          listing.sharedToMembershipAt
                            ? `Sudah di-share ${formatDate(listing.sharedToMembershipAt)}`
                            : "Broadcast listing ini ke member approved"
                        }
                        className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isRowPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Megaphone className="h-3.5 w-3.5" />
                        )}
                        {listing.sharedToMembershipAt ? "Sudah Di-share" : "Share ke Membership"}
                      </button>
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
