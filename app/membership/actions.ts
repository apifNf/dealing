"use server";

import { prisma } from "@/lib/prisma";
import { membershipSchema } from "@/lib/validations/membership";
import { postOpsNotification } from "@/lib/ops/notify";

export type MembershipResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export async function submitMembershipApplication(formData: FormData): Promise<MembershipResult> {
  const parsed = membershipSchema.safeParse({
    name: formData.get("name") || undefined,
    contactInfo: formData.get("contactInfo") || undefined,
    reason: formData.get("reason") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // The DB row is the source of truth for the application; it must succeed
  // before we report success — a failed ops notification afterwards
  // shouldn't lose an application that was already safely captured.
  let member;
  try {
    member = await prisma.member.create({ data: parsed.data });
  } catch (error) {
    console.error("[membership] failed to save application:", error);
    return { status: "error", message: "Gagal menyimpan aplikasi. Silakan coba lagi." };
  }

  try {
    await postOpsNotification(
      `🆕 Aplikasi Membership Baru!\n\nNama: ${member.name}\nKontak: ${member.contactInfo}\nAlasan: ${member.reason ?? "-"}\n\nReview di /admin/dashboard`,
      "membership-application"
    );
  } catch (error) {
    console.error("[membership] ops notification failed (application was still saved):", error);
  }

  return {
    status: "success",
    message: "Aplikasi membership Anda sudah kami terima! Tim kami akan meninjau dalam 1x24 jam.",
  };
}
