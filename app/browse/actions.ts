"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ChatRoomStatus, ListingStatus } from "@/generated/prisma/client";
import { getCurrentUserId } from "@/lib/currentUser";
import { postOpsNotification } from "@/lib/ops/notify";
import { ASSET_CATEGORIES } from "@/lib/validations/onboarding";

export type ChatEligibility =
  | { kind: "not-logged-in" }
  | { kind: "no-seller" }
  | { kind: "own-listing" }
  | { kind: "needs-nda" }
  | { kind: "ready" }
  | { kind: "existing"; roomId: string; status: ChatRoomStatus };

const OPEN_ROOM_STATUSES = [ChatRoomStatus.REQUESTED, ChatRoomStatus.ACTIVE] as const;

export async function getChatEligibility(listingId: string): Promise<ChatEligibility> {
  const userId = await getCurrentUserId();
  if (!userId) return { kind: "not-logged-in" };

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || !listing.userId) return { kind: "no-seller" };
  if (listing.userId === userId) return { kind: "own-listing" };

  const existingRoom = await prisma.chatRoom.findFirst({
    where: { listingId, buyerUserId: userId, status: { in: [...OPEN_ROOM_STATUSES] } },
    orderBy: { createdAt: "desc" },
  });
  if (existingRoom) return { kind: "existing", roomId: existingRoom.id, status: existingRoom.status };

  const ndaAccepted = await prisma.ndaAcceptance.findUnique({
    where: { listingId_userId: { listingId, userId } },
  });

  return ndaAccepted ? { kind: "ready" } : { kind: "needs-nda" };
}

export type RequestChatResult = { status: "success"; roomId: string } | { status: "error"; message: string };

/**
 * Records the NDA acceptance (idempotent per listing+buyer) then creates a
 * REQUESTED ChatRoom, reusing an already-open one if the buyer already has
 * a Requested/Active room for this listing. Called after the buyer accepts
 * the NDA text in the modal (see components/browse/NdaModal.tsx).
 */
export async function acceptNdaAndRequestChat(listingId: string): Promise<RequestChatResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "error", message: "Anda harus login untuk mengajukan diskusi." };

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return { status: "error", message: "Listing tidak ditemukan." };
  if (listing.status !== ListingStatus.APPROVED) {
    return { status: "error", message: "Listing ini belum tersedia untuk diskusi." };
  }
  if (!listing.userId) {
    return {
      status: "error",
      message: "Listing ini diajukan sebelum fitur chat aktif, sehingga belum mendukung permintaan diskusi.",
    };
  }
  if (listing.userId === userId) {
    return { status: "error", message: "Anda tidak bisa mengajukan diskusi pada listing milik Anda sendiri." };
  }

  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || null;

  await prisma.ndaAcceptance.upsert({
    where: { listingId_userId: { listingId, userId } },
    update: { acceptedAt: new Date(), ipAddress },
    create: { listingId, userId, ipAddress },
  });

  const existingRoom = await prisma.chatRoom.findFirst({
    where: { listingId, buyerUserId: userId, status: { in: [...OPEN_ROOM_STATUSES] } },
    orderBy: { createdAt: "desc" },
  });
  if (existingRoom) {
    return { status: "success", roomId: existingRoom.id };
  }

  const room = await prisma.chatRoom.create({
    data: { listingId, buyerUserId: userId, sellerUserId: listing.userId, status: ChatRoomStatus.REQUESTED },
  });

  const categoryLabel = ASSET_CATEGORIES.find((c) => c.value === listing.category)?.label ?? listing.category;
  const message = [
    "💬 Permintaan Chat Room Baru",
    "",
    `Listing: ${categoryLabel} (${listing.id})`,
    `Room: ${room.id}`,
    "",
    "Tinjau dan approve/reject dari admin dashboard.",
  ].join("\n");

  try {
    await postOpsNotification(message, "chat-request");
  } catch (error) {
    console.error("[chat] ops notification failed for new chat request", room.id, error);
  }

  revalidatePath("/admin/dashboard");
  return { status: "success", roomId: room.id };
}
