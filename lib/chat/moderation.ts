const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/i;
const PHONE_PATTERN = /(?:\+?62|0)8[0-9]{8,12}/;
const EXTERNAL_HANDLE_PATTERN = /\b(wa\.me|t\.me|whatsapp|telegram|instagram|line\s*id|@[a-z0-9_]{4,})\b/i;

/**
 * Best-effort heuristic, not a filter — messages are never blocked, only
 * flagged for admin monitoring (see ChatMessage.flagged). False positives
 * are expected and acceptable; the goal is visibility, not enforcement.
 */
export function looksLikeOffPlatformContact(content: string): boolean {
  return EMAIL_PATTERN.test(content) || PHONE_PATTERN.test(content) || EXTERNAL_HANDLE_PATTERN.test(content);
}
