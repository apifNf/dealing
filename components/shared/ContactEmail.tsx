"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

// Split so the literal address never appears as plain text in the
// server-rendered HTML — Cloudflare's edge "Email Address Obfuscation"
// rewrites any bare email it sees in the response body into a data-cfemail
// placeholder decoded by a cdn-cgi script, which our strict CSP
// (script-src 'strict-dynamic') correctly blocks since that script isn't
// ours and can't carry our nonce. Assembling the address client-side after
// mount means Cloudflare's rewriter — which only sees the initial response
// bytes — never encounters it, so there's nothing to obfuscate and nothing
// for our CSP to block.
const EMAIL_PARTS = ["atechlabshello", "gmail.com"];

function useContactEmail(): string | null {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => setEmail(EMAIL_PARTS.join("@")), []);
  return email;
}

type ContactEmailLinkProps = {
  className?: string;
  showIcon?: boolean;
};

export function ContactEmailLink({ className, showIcon = false }: ContactEmailLinkProps) {
  const email = useContactEmail();

  return (
    <a href={email ? `mailto:${email}` : undefined} className={className}>
      {showIcon && <Mail className="h-4 w-4" />}
      {email ?? ""}
    </a>
  );
}
