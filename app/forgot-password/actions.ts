"use server";

import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { createPasswordResetToken } from "@/lib/passwordReset";
import { sendResetEmail } from "@/lib/email/sendResetEmail";
import { getClientIp } from "@/lib/requestIp";
import { rateLimitMessage } from "@/lib/rateLimit";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export type ForgotPasswordResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

export async function requestPasswordReset(formData: FormData): Promise<ForgotPasswordResult> {
  const ip = await getClientIp();
  const limitMessage = rateLimitMessage(`forgot-password:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (limitMessage) {
    return { status: "error", message: limitMessage };
  }

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Email tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  // Only send/log a reset link if the account exists, but always return the
  // same success message either way — don't leak which emails are registered.
  if (user) {
    const token = await createPasswordResetToken(user.id);
    const baseUrl = process.env.APP_BASE_URL ?? "https://app.dealingn8n.online";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    try {
      await sendResetEmail(user.email, resetUrl);
    } catch (error) {
      console.error("[forgot-password] failed to send reset email:", error);
    }
  }

  return {
    status: "success",
    message: "Jika email terdaftar, link reset password sudah dikirim. Cek email Anda.",
  };
}
