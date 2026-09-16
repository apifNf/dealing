"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Eye, Loader2, X } from "lucide-react";
import type { ChatRoom, ChatRoomStatus, Listing, User } from "@/generated/prisma/client";
import { approveChatRoom, rejectChatRoom } from "@/app/admin/dashboard/actions";
import { ASSET_CATEGORIES } from "@/lib/validations/onboarding";

const STATUS_STYLES: Record<ChatRoomStatus, string> = {
  REQUESTED: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  REJECTED: "border-red-500/30 bg-red-500/10 text-red-300",
  CLOSED: "border-white/20 bg-white/[0.05] text-textMuted",
};

const STATUS_LABELS: Record<ChatRoomStatus, string> = {
  REQUESTED: "Requested",
  ACTIVE: "Active",
  REJECTED: "Rejected",
  CLOSED: "Closed",
};

function formatDate(value: Date) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export type ChatRoomWithRelations = ChatRoom & {
  listing: Listing;
  buyer: User;
  seller: User;
  _count: { messages: number };
};

type ChatRoomsTableProps = {
  rooms: ChatRoomWithRelations[];
};

export function ChatRoomsTable({ rooms }: ChatRoomsTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (id: string, action: (id: string) => Promise<void>) => {
    setPendingId(id);
    startTransition(async () => {
      await action(id);
      setPendingId(null);
    });
  };

  if (rooms.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surfaceGlass p-12 text-center text-sm text-textMuted backdrop-blur-xl">
        Belum ada permintaan chat room.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-surfaceGlass backdrop-blur-xl">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-textMuted">
            <th className="px-6 py-4 font-medium">Listing</th>
            <th className="px-6 py-4 font-medium">Buyer</th>
            <th className="px-6 py-4 font-medium">Seller</th>
            <th className="px-6 py-4 font-medium">Pesan</th>
            <th className="px-6 py-4 font-medium">Diminta</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const isRowPending = isPending && pendingId === room.id;
            const categoryLabel = ASSET_CATEGORIES.find((c) => c.value === room.listing.category)?.label ?? room.listing.category;

            return (
              <tr key={room.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-textMain">{categoryLabel}</td>
                <td className="max-w-[180px] truncate px-6 py-4 text-textMuted" title={room.buyer.email}>
                  {room.buyer.email}
                </td>
                <td className="max-w-[180px] truncate px-6 py-4 text-textMuted" title={room.seller.email}>
                  {room.seller.email}
                </td>
                <td className="px-6 py-4 text-textMuted">{room._count.messages}</td>
                <td className="px-6 py-4 text-textMuted">{formatDate(room.createdAt)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xl ${STATUS_STYLES[room.status]}`}
                  >
                    {STATUS_LABELS[room.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {room.status === "REQUESTED" && (
                      <>
                        <button
                          type="button"
                          disabled={isRowPending}
                          onClick={() => handleAction(room.id, approveChatRoom)}
                          className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={isRowPending}
                          onClick={() => handleAction(room.id, rejectChatRoom)}
                          className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isRowPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                          Reject
                        </button>
                      </>
                    )}
                    <Link
                      href={`/chat/${room.id}`}
                      className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Lihat Percakapan
                    </Link>
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
