"use server";

import { redirect } from "next/navigation";
import { sellerSchema, buyerSchema } from "@/lib/validations/onboarding";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/currentUser";

export type OnboardingResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

const SELLER_WEBHOOK_URL = process.env.N8N_SELLER_WEBHOOK_URL;
const BUYER_WEBHOOK_URL = process.env.N8N_BUYER_WEBHOOK_URL;

async function postToWebhook(url: string | undefined, payload: Record<string, unknown>, label: string) {
  if (!url) {
    console.log(`[onboarding] ${label} webhook not configured, payload:`, payload);
    return;
  }

  console.log(`[onboarding] POSTing ${label} payload to ${url}:`, JSON.stringify(payload, null, 2));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`${label} webhook responded with ${res.status}`);
  }

  console.log(`[onboarding] ${label} webhook responded with ${res.status}`);
}

export async function submitSellerListing(formData: FormData): Promise<OnboardingResult> {
  const parsed = sellerSchema.safeParse({
    category: formData.get("category") || undefined,
    repositoryLink: formData.get("repositoryLink") || undefined,
    mrr: formData.get("mrr") || undefined,
    techStack: formData.get("techStack") || undefined,
    assetUrl: formData.get("assetUrl") || undefined,
    avgWatchTime: formData.get("avgWatchTime") || undefined,
    monthlyTraffic: formData.get("monthlyTraffic") || undefined,
    monthlyRevenue: formData.get("monthlyRevenue") || undefined,
    platformName: formData.get("platformName") || undefined,
    subscriberCount: formData.get("subscriberCount") || undefined,
    openRate: formData.get("openRate") || undefined,
    niche: formData.get("niche") || undefined,
    storeName: formData.get("storeName") || undefined,
    skuCount: formData.get("skuCount") || undefined,
    reasonForSelling: formData.get("reasonForSelling") || undefined,
    fileNames: formData.getAll("fileNames").map(String),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { mrr, monthlyTraffic, monthlyRevenue, subscriberCount, openRate, skuCount, ...rest } = parsed.data;
  const numericFields = {
    mrr: mrr ? Number(mrr) : undefined,
    monthlyTraffic: monthlyTraffic ? Number(monthlyTraffic) : undefined,
    monthlyRevenue: monthlyRevenue ? Number(monthlyRevenue) : undefined,
    subscriberCount: subscriberCount ? Number(subscriberCount) : undefined,
    openRate: openRate ? Number(openRate) : undefined,
    skuCount: skuCount ? Number(skuCount) : undefined,
  };

  // The database row is the source of truth for the listing, so it must
  // succeed before we report success — a failed webhook afterwards shouldn't
  // undo or hide a submission that was already safely persisted.
  try {
    const userId = await getCurrentUserId();
    await prisma.listing.create({
      data: {
        category: rest.category,
        repositoryLink: rest.repositoryLink,
        techStack: rest.techStack,
        assetUrl: rest.assetUrl,
        avgWatchTime: rest.avgWatchTime,
        platformName: rest.platformName,
        niche: rest.niche,
        storeName: rest.storeName,
        reasonForSelling: rest.reasonForSelling,
        fileNames: rest.fileNames ?? [],
        ...numericFields,
        ...(userId ? { userId } : {}),
      },
    });
  } catch (error) {
    console.error("[onboarding] failed to save listing to database:", error);
    return { status: "error", message: "Gagal menyimpan listing ke database. Silakan coba lagi." };
  }

  try {
    await postToWebhook(
      SELLER_WEBHOOK_URL,
      { ...rest, ...numericFields, submittedAt: new Date().toISOString(), source: "onboarding-seller" },
      "seller"
    );
  } catch (error) {
    console.error("[onboarding] seller webhook failed (listing was still saved to the database):", error);
  }

  return {
    status: "success",
    message: "Listing berhasil dikirim! Tim kurasi DEALING akan meninjau dalam 1x24 jam.",
  };
}

export async function submitBuyerInterest(formData: FormData): Promise<OnboardingResult> {
  const parsed = buyerSchema.safeParse({
    budgetRange: formData.get("budgetRange") || undefined,
    categoriesOfInterest: formData.getAll("categoriesOfInterest").map(String),
    contactInfo: formData.get("contactInfo") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Same pattern as submitSellerListing: the DB row is the source of truth
  // and must succeed before we redirect — a failed webhook afterwards
  // shouldn't lose a lead that was already safely captured.
  try {
    const userId = await getCurrentUserId();
    await prisma.buyerLead.create({
      data: {
        budgetRange: parsed.data.budgetRange,
        categoriesOfInterest: parsed.data.categoriesOfInterest,
        contactInfo: parsed.data.contactInfo,
        ...(userId ? { userId } : {}),
      },
    });
  } catch (error) {
    console.error("[onboarding] failed to save buyer lead to database:", error);
    return { status: "error", message: "Gagal menyimpan preferensi Anda. Silakan coba lagi." };
  }

  try {
    await postToWebhook(
      BUYER_WEBHOOK_URL,
      { ...parsed.data, submittedAt: new Date().toISOString(), source: "onboarding-buyer" },
      "buyer"
    );
  } catch (error) {
    console.error("[onboarding] buyer webhook failed (lead was still saved to the database):", error);
  }

  const categoriesParam = parsed.data.categoriesOfInterest.join(",");
  redirect(`/browse?categories=${encodeURIComponent(categoriesParam)}`);
}
