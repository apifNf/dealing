"use server";

import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";
import { verifyPasswordResetToken, markPasswordResetTokenUsed } from "@/lib/passwordReset";

export type ResetPasswordResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export async function resetPassword(formData: FormData): Promise<ResetPasswordResult> {
  const token = String(formData.get("token") ?? "");

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const userId = await verifyPasswordResetToken(token);
  if (!userId) {
    return { status: "error", message: "Link reset password tidak valid atau sudah kedaluwarsa." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await markPasswordResetTokenUsed(token);

  return { status: "success", message: "Password berhasil diubah. Silakan login dengan password baru." };
}
