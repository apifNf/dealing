import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { token, userId, expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS) },
  });
  return token;
}

/** Returns the associated userId for a valid, unused, unexpired token, or null. */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  if (!token) return null;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;
  return record.userId;
}

export async function markPasswordResetTokenUsed(token: string): Promise<void> {
  await prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } });
}
