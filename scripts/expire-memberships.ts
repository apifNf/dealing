/**
 * Daily membership expiry check — run by the dealing-membership-expiry
 * systemd timer (see /etc/systemd/system/dealing-membership-expiry.timer),
 * mirroring the pattern already used for the DB backup timer.
 *
 * Flips any Active member whose expiresAt has passed to Expired. Early-
 * access notifications (shareListingToMembership in
 * app/admin/dashboard/actions.ts) already only query paymentStatus: Active,
 * so an Expired member simply stops matching that query — no separate
 * "stop notifying" step needed.
 *
 * Run manually with: npx tsx --env-file=.env scripts/expire-memberships.ts
 */
import { prisma } from "../lib/prisma";
import { MemberPaymentStatus } from "../generated/prisma/client";

async function main() {
  const now = new Date();
  const result = await prisma.member.updateMany({
    where: { paymentStatus: MemberPaymentStatus.Active, expiresAt: { lt: now } },
    data: { paymentStatus: MemberPaymentStatus.Expired },
  });
  console.log(`[expire-memberships] ${now.toISOString()} Expired ${result.count} membership(s).`);
}

main()
  .catch((error) => {
    console.error("[expire-memberships] failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
