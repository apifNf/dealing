"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma/client";
import { notifyMatchesForListing } from "@/lib/gatekeeper/notify";

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
