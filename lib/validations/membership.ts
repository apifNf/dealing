import { z } from "zod";
import { isValidContactInfo } from "./contact";

export const membershipSchema = z
  .object({
    name: z.string().min(2, "Nama wajib diisi"),
    contactInfo: z.string().min(5, "Masukkan email atau nomor WA/Telegram Anda"),
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidContactInfo(data.contactInfo)) {
      ctx.addIssue({
        code: "custom",
        message: "Masukkan email atau nomor WA/Telegram yang valid",
        path: ["contactInfo"],
      });
    }
  });

export type MembershipFormValues = z.infer<typeof membershipSchema>;
