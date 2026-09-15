import crypto from "crypto";

export const USER_SESSION_COOKIE = "user_session";
export const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.USER_SESSION_SECRET;
  if (!secret) {
    throw new Error("USER_SESSION_SECRET is not set. Add it to your environment before using user auth.");
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Session token: `<userId>.<expiresAtEpochMs>.<hmacSignatureHex>`, signed
 * with USER_SESSION_SECRET as the key — same shape as admin_session in
 * lib/adminAuth.ts, but namespaced under its own cookie/secret so a forged
 * or leaked admin session can never authenticate as a user (or vice versa).
 */
export function createSessionToken(userId: string): string {
  const expiresAt = Date.now() + USER_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the userId encoded in a valid, unexpired token, or null. */
export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;

  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);

  const [userId, expiresAtStr] = payload.split(".");
  if (!userId || !expiresAtStr || !signature) return null;
  if (!timingSafeStringEqual(signature, sign(payload))) return null;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

  return userId;
}
