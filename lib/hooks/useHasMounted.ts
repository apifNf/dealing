"use client";

import { useEffect, useState } from "react";

/**
 * True only after the client has mounted. Used to delay rendering raw email
 * addresses (admin tables, chat headers) until after the initial SSR
 * response — Cloudflare's edge "Email Address Obfuscation" rewrites any
 * bare email it finds in that response into a data-cfemail placeholder
 * decoded by a cdn-cgi script, which our strict CSP (script-src
 * 'strict-dynamic') correctly blocks since that script isn't ours and can't
 * carry our nonce. If the email only appears after mount, Cloudflare's
 * rewriter never sees it, so there's nothing to obfuscate and nothing for
 * our CSP to block.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
