import { prisma } from "@/lib/prisma";
import type { Listing, BuyerLead } from "@/generated/prisma/client";

/**
 * Listing only ever captures revenue (MRR / monthly revenue), never an
 * actual asking price — there's no "harga jual" field in the schema. To
 * still honor a buyer's budget range, we estimate an asking price as a
 * multiple of monthly revenue. 24x (~2 years of revenue) is a common
 * rough-and-ready heuristic for small digital assets (SaaS/content/etc.
 * typically trade in the 20-40x monthly range) — it's a deliberate
 * approximation, not a real valuation model. Adjust freely; nothing else
 * depends on this exact number.
 */
const VALUATION_MULTIPLIER = 24;

const BUDGET_RANGE_BOUNDARIES: Record<string, [number, number]> = {
  "10-50": [10_000_000, 50_000_000],
  "50-100": [50_000_000, 100_000_000],
  "100-500": [100_000_000, 500_000_000],
  "500-1000": [500_000_000, 1_000_000_000],
  "1000-plus": [1_000_000_000, Infinity],
};

function isWithinBudget(listing: Listing, budgetRange: string): boolean {
  const revenue = listing.mrr ?? listing.monthlyRevenue;
  // No revenue captured for this category/listing — don't let a missing
  // number silently exclude an otherwise-matching buyer.
  if (revenue === null) return true;

  const bounds = BUDGET_RANGE_BOUNDARIES[budgetRange];
  if (!bounds) return true;

  const estimatedValuation = revenue * VALUATION_MULTIPLIER;
  const [min, max] = bounds;
  return estimatedValuation >= min && estimatedValuation < max;
}

export async function findMatchingBuyerLeads(listing: Listing): Promise<BuyerLead[]> {
  const candidates = await prisma.buyerLead.findMany({
    where: { categoriesOfInterest: { has: listing.category } },
  });

  return candidates.filter((lead) => isWithinBudget(listing, lead.budgetRange));
}
