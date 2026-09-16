import type { Listing } from "@/generated/prisma/client";
import { ASSET_CATEGORIES } from "@/lib/validations/onboarding";

/**
 * Public-safe projection of a Listing — deliberately built as a brand new
 * object (not a subset of the Prisma row) so nothing sensitive (exact
 * URLs, exact revenue, business/store name, documents) can leak into what
 * gets rendered on the public /browse page, even by accident later.
 */
export type PublicListing = {
  id: string;
  category: string;
  categoryLabel: string;
  detail: string;
  revenueRange: string | null;
  postedAt: Date;
  /** Whether the listing has a seller User account — required for the
   * in-app chat request flow (listings submitted before auth existed
   * don't have one). See components/browse/AjukanDiskusiButton.tsx. */
  hasSeller: boolean;
};

function formatRevenueRange(value: number | null): string | null {
  if (value === null) return null;
  if (value < 5_000_000) return "< Rp5 Juta";
  if (value < 10_000_000) return "Rp5 - 10 Juta";
  if (value < 20_000_000) return "Rp10 - 20 Juta";
  if (value < 50_000_000) return "Rp20 - 50 Juta";
  if (value < 100_000_000) return "Rp50 - 100 Juta";
  return "> Rp100 Juta";
}

function formatNumber(value: number | null): string | null {
  return value === null ? null : value.toLocaleString("id-ID");
}

function buildDetail(listing: Listing): string {
  switch (listing.category) {
    case "saas":
      return listing.techStack ? `Tech stack: ${listing.techStack}` : "SaaS / Micro-Tools";
    case "content":
      return listing.avgWatchTime ? `Rata-rata watch time: ${listing.avgWatchTime}` : "Content Account";
    case "website": {
      const traffic = formatNumber(listing.monthlyTraffic);
      return traffic ? `${traffic} pengunjung/bulan` : "Website / Media";
    }
    case "newsletter": {
      const subs = formatNumber(listing.subscriberCount);
      const parts = [listing.platformName, listing.niche, subs ? `${subs} subscriber` : null].filter(Boolean);
      return parts.length > 0 ? parts.join(" · ") : "Newsletter & Komunitas";
    }
    case "ecommerce": {
      const sku = formatNumber(listing.skuCount);
      const parts = [listing.platformName, sku ? `${sku} SKU` : null].filter(Boolean);
      return parts.length > 0 ? parts.join(" · ") : "E-Commerce & Toko Digital";
    }
    default:
      return "";
  }
}

export function toPublicListing(listing: Listing): PublicListing {
  const categoryMeta = ASSET_CATEGORIES.find((c) => c.value === listing.category);
  const revenue = listing.mrr ?? listing.monthlyRevenue;

  return {
    id: listing.id,
    category: listing.category,
    categoryLabel: categoryMeta?.label ?? listing.category,
    detail: buildDetail(listing),
    revenueRange: formatRevenueRange(revenue),
    postedAt: listing.createdAt,
    hasSeller: listing.userId !== null,
  };
}
