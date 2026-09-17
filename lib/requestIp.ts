import { headers } from "next/headers";

/**
 * Best-effort client IP for rate limiting and NDA acceptance records.
 * `cf-connecting-ip` is set by Cloudflare's edge and is the most reliable
 * source behind our tunnel; the rest are fallbacks for local/direct access.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("cf-connecting-ip") ||
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown"
  );
}
