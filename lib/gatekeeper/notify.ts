import type { Listing, BuyerLead } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { findMatchingBuyerLeads } from "./match";

const MATCH_WEBHOOK_URL = process.env.N8N_MATCH_WEBHOOK_URL;

/**
 * We don't message the buyer's contactInfo directly — Telegram's Bot API
 * can't send to an arbitrary phone number/@username/email a buyer typed
 * into a free-text field (a bot can only message chats that have started
 * a conversation with it), and there's no email-sending infra in this
 * project. Instead, same as the existing seller-listing alert, this
 * notifies the ops team's Telegram (reusing that exact bot/chat) with the
 * match details — including the buyer's contactInfo — so a human follows
 * up over whichever channel the buyer actually gave.
 */
async function postMatchToWebhook(listing: Listing, lead: BuyerLead) {
  const payload = {
    listingId: listing.id,
    category: listing.category,
    revenue: listing.mrr ?? listing.monthlyRevenue,
    buyerLeadId: lead.id,
    buyerBudgetRange: lead.budgetRange,
    buyerContact: lead.contactInfo,
    matchedAt: new Date().toISOString(),
  };

  if (!MATCH_WEBHOOK_URL) {
    console.log("[gatekeeper] match webhook not configured, payload:", payload);
    return;
  }

  console.log("[gatekeeper] POSTing match to webhook:", MATCH_WEBHOOK_URL, JSON.stringify(payload));

  const res = await fetch(MATCH_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`match webhook responded with ${res.status}`);
  }

  console.log("[gatekeeper] match webhook responded with", res.status);
}

/**
 * Runs whenever a listing becomes APPROVED. Finds every BuyerLead whose
 * category + budget matches, records a dedup row per (listing, lead) pair
 * so the same pair is never notified twice, and best-effort relays each
 * new match to the ops Telegram via n8n.
 */
export async function notifyMatchesForListing(listing: Listing): Promise<number> {
  const matches = await findMatchingBuyerLeads(listing);
  let notifiedCount = 0;

  for (const lead of matches) {
    try {
      await prisma.matchNotification.create({
        data: { listingId: listing.id, buyerLeadId: lead.id },
      });
    } catch {
      // Unique constraint on [listingId, buyerLeadId] — already notified, skip.
      continue;
    }

    notifiedCount += 1;

    try {
      await postMatchToWebhook(listing, lead);
    } catch (error) {
      console.error("[gatekeeper] failed to notify buyer lead", lead.id, "for listing", listing.id, error);
    }
  }

  return notifiedCount;
}
