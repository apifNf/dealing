"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ListingStatus, ChatRoomStatus } from "@/generated/prisma/client";
import { notifyMatchesForListing } from "@/lib/gatekeeper/notify";
import { postOpsNotification } from "@/lib/ops/notify";
import { ASSET_CATEGORIES } from "@/lib/validations/onboarding";

export async function approveListing(id: string) {
  const listing = await prisma.listing.update({ where: { id }, data: { status: ListingStatus.APPROVED } });
  revalidatePath("/admin/dashboard");

  // Best-effort: the approval itself must never fail because matching or
  // notifying buyers hit a snag.
  try {
    await notifyMatchesForListing(listing);
  } catch (error) {
    console.error("[gatekeeper] matching failed for listing", listing.id, error);
  }
}

export async function rejectListing(id: string) {
  await prisma.listing.update({ where: { id }, data: { status: ListingStatus.REJECTED } });
  revalidatePath("/admin/dashboard");
}

export async function approveMember(id: string) {
  await prisma.member.update({ where: { id }, data: { status: ListingStatus.APPROVED } });
  revalidatePath("/admin/dashboard");
}

export async function rejectMember(id: string) {
  await prisma.member.update({ where: { id }, data: { status: ListingStatus.REJECTED } });
  revalidatePath("/admin/dashboard");
}

/**
 * Deliberate, manual, per-listing admin action — available for PENDING and
 * APPROVED listings (not REJECTED), so an admin can share a promising listing
 * to members before formally approving it for /browse. We can't message each
 * member's own contact directly (same Telegram Bot API limitation as
 * Gatekeeper), so this notifies ops with the listing details plus the full
 * list of APPROVED members' contacts, for a human to broadcast manually.
 */
export async function shareListingToMembership(listingId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status === ListingStatus.REJECTED) return;

  const approvedMembers = await prisma.member.findMany({ where: { status: ListingStatus.APPROVED } });

  const categoryLabel = ASSET_CATEGORIES.find((c) => c.value === listing.category)?.label ?? listing.category;
  const detail = listing.repositoryLink || listing.assetUrl || listing.storeName || listing.platformName || "-";
  const revenue = listing.mrr ?? listing.monthlyRevenue;
  const memberList =
    approvedMembers.length > 0
      ? approvedMembers.map((member, index) => `${index + 1}. ${member.name} - ${member.contactInfo}`).join("\n")
      : "(belum ada member approved)";

  const message = [
    "📢 Share Listing ke Membership",
    "",
    `Kategori: ${categoryLabel}`,
    `Detail: ${detail}`,
    `Revenue: ${revenue ? `Rp${revenue.toLocaleString("id-ID")}` : "-"}`,
    "",
    `Broadcast info listing ini ke ${approvedMembers.length} member approved:`,
    memberList,
  ].join("\n");

  try {
    await postOpsNotification(message, "share-to-membership");
  } catch (error) {
    console.error("[membership] share notification failed for listing", listing.id, error);
  }

  // DB state records the share regardless of notification delivery — same
  // "DB is the source of truth, notification is best-effort" pattern used
  // everywhere else in this app.
  await prisma.listing.update({ where: { id: listingId }, data: { sharedToMembershipAt: new Date() } });
  revalidatePath("/admin/dashboard");
}

export async function approveChatRoom(id: string) {
  await prisma.chatRoom.update({ where: { id }, data: { status: ChatRoomStatus.ACTIVE } });
  revalidatePath("/admin/dashboard");
}

export async function rejectChatRoom(id: string) {
  await prisma.chatRoom.update({ where: { id }, data: { status: ChatRoomStatus.REJECTED } });
  revalidatePath("/admin/dashboard");
}
