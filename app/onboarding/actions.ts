"use server";

import { sellerSchema, buyerSchema } from "@/lib/validations/onboarding";

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

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`${label} webhook responded with ${res.status}`);
  }
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
    fileNames: formData.getAll("fileNames").map(String),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await postToWebhook(
      SELLER_WEBHOOK_URL,
      { ...parsed.data, submittedAt: new Date().toISOString(), source: "onboarding-seller" },
      "seller"
    );
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Gagal mengirim listing. Silakan coba lagi dalam beberapa saat." };
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
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await postToWebhook(
      BUYER_WEBHOOK_URL,
      { ...parsed.data, submittedAt: new Date().toISOString(), source: "onboarding-buyer" },
      "buyer"
    );
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Gagal mengirim preferensi Anda. Silakan coba lagi." };
  }

  return {
    status: "success",
    message: "Preferensi investasi tersimpan! Kami akan mengirimkan deal flow yang relevan untuk Anda.",
  };
}
