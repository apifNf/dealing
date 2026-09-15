"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, USER_SESSION_COOKIE, USER_SESSION_MAX_AGE_SECONDS } from "@/lib/userAuth";

export type LoginResult = {
  status: "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

/** Only ever redirect within our own app — never trust `next` blindly. */
function safeNext(next: FormDataEntryValue | null): string {
  const value = String(next ?? "");
  return value.startsWith("/") && !value.startsWith("//") ? value : "/onboarding";
}

export async function loginUser(formData: FormData): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Beberapa data belum valid. Periksa kembali form Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  // Deliberately generic message for both "no such user" and "wrong
  // password" — don't leak which emails are registered.
  const invalidCredentials: LoginResult = {
    status: "error",
    message: "Email atau password salah.",
  };

  if (!user) return invalidCredentials;

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return invalidCredentials;

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
