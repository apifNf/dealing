import { z } from "zod";
import { isValidWhatsAppNumber } from "./contact";

// Source of truth for membership pricing — also what gets snapshotted onto
// Member.priceSnapshot at application time. Update here if pricing changes;
// existing applications keep their original snapshotted price regardless.
export const MEMBERSHIP_PLANS = [
  {
    value: "MONTHLY",
    label: "Bulanan",
    price: 189_000,
    priceLabel: "Rp189.000/bulan",
  },
  {
    value: "YEARLY",
    label: "Tahunan",
    price: 1_899_000,
    priceLabel: "Rp1.899.000/tahun",
    savingsLabel: "Hemat ~16%",
  },
] as const;

export const membershipPlanEnum = z.enum(["MONTHLY", "YEARLY"], {
  error: "Pilih paket membership untuk melanjutkan",
});
export type MembershipPlanValue = z.infer<typeof membershipPlanEnum>;

export function getPlanMeta(plan: MembershipPlanValue) {
  return MEMBERSHIP_PLANS.find((p) => p.value === plan)!;
}

export const membershipSchema = z
  .object({
    name: z.string().min(2, "Nama wajib diisi"),
    contactInfo: z.string().min(1, "Nomor WhatsApp wajib diisi"),
    reason: z.string().optional(),
    plan: membershipPlanEnum,
  })
  .superRefine((data, ctx) => {
    if (!isValidWhatsAppNumber(data.contactInfo)) {
      ctx.addIssue({
        code: "custom",
        message: "Masukkan nomor WhatsApp yang valid (contoh: 08812xxxxxxx atau +62812xxxxxxx)",
        path: ["contactInfo"],
      });
    }
  });

export type MembershipFormValues = z.infer<typeof membershipSchema>;
