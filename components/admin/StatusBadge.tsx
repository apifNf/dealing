import { ListingStatus } from "@/generated/prisma/client";

const STATUS_STYLES: Record<ListingStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  REJECTED: "border-red-500/30 bg-red-500/10 text-red-300",
};

const STATUS_LABELS: Record<ListingStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xl ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
