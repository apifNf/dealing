/**
 * In-memory, per-process rate limiter keyed by an arbitrary string (usually
 * `${action}:${ip}`). Deliberately simple — no Redis, no shared state across
 * instances — which is a real fit here since the app already runs as a
 * single persistent Node process (see server.ts's custom-server rationale),
 * not multiple serverless instances that would each have their own map.
 */
type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Periodic sweep so IPs that hit an endpoint once and never return don't
// accumulate forever in memory.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, SWEEP_INTERVAL_MS).unref();

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  return { allowed: true };
}

function formatRetryAfter(retryAfterSeconds: number): string {
  if (retryAfterSeconds < 60) return `${retryAfterSeconds} detik`;
  return `${Math.ceil(retryAfterSeconds / 60)} menit`;
}

/** Convenience wrapper: returns a ready-to-display error message, or null if within limits. */
export function rateLimitMessage(key: string, limit: number, windowMs: number): string | null {
  const result = checkRateLimit(key, limit, windowMs);
  if (result.allowed) return null;
  return `Terlalu banyak percobaan. Silakan coba lagi dalam ${formatRetryAfter(result.retryAfterSeconds)}.`;
}
