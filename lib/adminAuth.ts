import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

function getPasscode(): string {
  const passcode = process.env.ADMIN_PASSCODE;
  if (!passcode) {
    throw new Error("ADMIN_PASSCODE is not set. Add it to your environment before using admin auth.");
  }
  return passcode;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getPasscode()).update(payload).digest("hex");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPasscode(input: string): boolean {
  if (!input) return false;
  return timingSafeStringEqual(input, getPasscode());
}

/**
 * Session token: `<expiresAtEpochMs>.<hmacSignatureHex>`, signed with
 * ADMIN_PASSCODE as the key. Forging a valid token requires knowing the
 * passcode, so this is safe to store as a plain (non-encrypted) cookie value.
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!timingSafeStringEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() <= expiresAt;
}
