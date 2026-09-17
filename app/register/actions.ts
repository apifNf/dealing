"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";
import { createSessionToken, USER_SESSION_COOKIE, USER_SESSION_MAX_AGE_SECONDS } from "@/lib/userAuth";
import { getClientIp } from "@/lib/requestIp";
import { rateLimitMessage } from "@/lib/rateLimit";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

export type RegisterResult = {
  status: "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

/** Only ever redirect within our own app — never trust `next` blindly. */
function safeNext(next: FormDataEntryValue | null): string {
  const value = String(next ?? "");
  return value.startsWith("/") && !value.startsWith("//") ? value : "/onboarding";
}

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const ip = await getClientIp();
  const limitMessage = rateLimitMessage(`register:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (limitMessage) {
    return { status: "error", message: limitMessage };
  }

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      status: "error",
      message: "Email sudah terdaftar.",
      fieldErrors: { email: ["Email ini sudah terdaftar. Coba login."] },
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, createSessionToken(user.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: USER_SESSION_MAX_AGE_SECONDS,
  });

  redirect(safeNext(formData.get("next")));
}
