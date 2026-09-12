"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma/client";

export async function approveListing(id: string) {
  await prisma.listing.update({ where: { id }, data: { status: ListingStatus.APPROVED } });
  revalidatePath("/admin/dashboard");
}

export async function rejectListing(id: string) {
  await prisma.listing.update({ where: { id }, data: { status: ListingStatus.REJECTED } });
  revalidatePath("/admin/dashboard");
}
