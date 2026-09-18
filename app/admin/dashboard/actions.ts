"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ListingStatus, ChatRoomStatus, MemberPaymentStatus } from "@/generated/prisma/client";
import { notifyMatchesForListing } from "@/lib/gatekeeper/notify";
import { postOpsNotification } from "@/lib/ops/notify";
import { ASSET_CATEGORIES } from "@/lib/validations/onboarding";
import { getPlanMeta } from "@/lib/validations/membership";

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

/**
 * Approves the APPLICATION only — does not activate membership. Payment
 * stays PendingPayment (the schema default) until an admin confirms
 * payment via markMemberPaid, so early-access benefits don't kick in until
 * actually paid. Notifies ops with the payment-instructions link since we
 * have no way to email/message the applicant's arbitrary contactInfo
 * directly (same limitation as Gatekeeper/share-to-membership) — a human
 * forwards this link manually.
 */
export async function approveMember(id: string) {
  const member = await prisma.member.update({ where: { id }, data: { status: ListingStatus.APPROVED } });
  revalidatePath("/admin/dashboard");

  const planMeta = getPlanMeta(member.plan);
  const baseUrl = process.env.APP_BASE_URL ?? "https://app.dealingn8n.online";
  const paymentUrl = `${baseUrl}/membership/payment/${member.id}`;

  try {
    await postOpsNotification(
      `✅ Aplikasi Membership Disetujui\n\nNama: ${member.name}\nKontak: ${member.contactInfo}\nPaket: ${planMeta.label} (${planMeta.priceLabel})\n\nTeruskan link instruksi pembayaran ini ke applicant:\n${paymentUrl}`,
      "membership-approved"
    );
  } catch (error) {
    console.error("[membership] approval notification failed for member", member.id, error);
  }
}

export async function rejectMember(id: string) {
  await prisma.member.update({ where: { id }, data: { status: ListingStatus.REJECTED } });
  revalidatePath("/admin/dashboard");
}

/**
 * Manual payment confirmation — see app/membership/payment/[id]/page.tsx
 * for why this exists (temporary, until Midtrans is wired up). Only valid
 * for an application that's already APPROVED and still PendingPayment;
 * anything else is a no-op so this can't be double-clicked into extending
 * an already-active or already-expired membership.
 */
export async function markMemberPaid(id: string) {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member || member.status !== ListingStatus.APPROVED || member.paymentStatus !== MemberPaymentStatus.PendingPayment) {
    return;
  }

  const paidAt = new Date();
  const expiresAt = new Date(paidAt);
  if (member.plan === "YEARLY") {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  await prisma.member.update({
    where: { id },
    data: { paymentStatus: MemberPaymentStatus.Active, paidAt, expiresAt },
  });
  revalidatePath("/admin/dashboard");
}

/**
 * Deliberate, manual, per-listing admin action — available for PENDING and
 * APPROVED listings (not REJECTED), so an admin can share a promising listing
 * to members before formally approving it for /browse. We can't message each
 * member's own contact directly (same Telegram Bot API limitation as
 * Gatekeeper), so this notifies ops with the listing details plus the full
 * list of paid-active members' contacts, for a human to broadcast manually.
 */
export async function shareListingToMembership(listingId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status === ListingStatus.REJECTED) return;

  // Early-access is a paid benefit — application-approved but still
  // PendingPayment (or Expired) members don't get it.
  const activeMembers = await prisma.member.findMany({
    where: { status: ListingStatus.APPROVED, paymentStatus: MemberPaymentStatus.Active },
  });

  const categoryLabel = ASSET_CATEGORIES.find((c) => c.value === listing.category)?.label ?? listing.category;
  const detail = listing.repositoryLink || listing.assetUrl || listing.storeName || listing.platformName || "-";
  const revenue = listing.mrr ?? listing.monthlyRevenue;
  const memberList =
    activeMembers.length > 0
      ? activeMembers.map((member, index) => `${index + 1}. ${member.name} - ${member.contactInfo}`).join("\n")
      : "(belum ada member aktif)";

  const message = [
    "📢 Share Listing ke Membership",
    "",
    `Kategori: ${categoryLabel}`,
    `Detail: ${detail}`,
    `Revenue: ${revenue ? `Rp${revenue.toLocaleString("id-ID")}` : "-"}`,
    "",
    `Broadcast info listing ini ke ${activeMembers.length} member aktif:`,
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
