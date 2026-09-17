import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/adminAuth";
import { USER_SESSION_COOKIE, verifySessionToken } from "@/lib/userAuth";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new
 * name/export) — see node_modules/next/dist/docs/.../file-conventions/proxy.md.
 *
 * Also where the app's security headers live, including a per-request CSP
 * nonce. Nonce-based CSP normally costs static rendering (see the Next.js
 * CSP guide), but every page here already reads cookies in the root layout
 * (for the logged-in navbar), so the whole app is dynamic already — there's
 * no static-generation benefit being traded away.
 */
// next/image's `fill` prop hardcodes a fixed inline `style=""` attribute on
// the underlying <img> (position/size/color), used by our logo in
// Navbar/Footer. Nonces don't cover inline style *attributes* (only <style>
// elements) per the CSP spec, so this needs 'unsafe-hashes' plus the exact
// hash of that one known, framework-generated style string — not a blanket
// 'unsafe-inline'. Re-derive with the browser's reported hash if next/image
// ever changes this output.
const FILL_IMAGE_STYLE_HASH = "'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='";

function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' ${FILL_IMAGE_STYLE_HASH};
    img-src 'self' data: blob:;
    font-src 'self';
    connect-src 'self' wss: ws:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

function applySecurityHeaders(response: NextResponse, cspHeader: string): NextResponse {
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = buildCspHeader(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const next = () => NextResponse.next({ request: { headers: requestHeaders } });
  const redirect = (url: URL) => NextResponse.redirect(url);

  if (pathname.startsWith("/admin")) {
    // Must stay open, or a logged-out visitor can never reach the login page.
    if (pathname.startsWith("/admin/login")) {
      return applySecurityHeaders(next(), cspHeader);
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!isValidSessionToken(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return applySecurityHeaders(redirect(loginUrl), cspHeader);
    }

    return applySecurityHeaders(next(), cspHeader);
  }

  if (pathname.startsWith("/onboarding")) {
    const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
      return applySecurityHeaders(redirect(loginUrl), cspHeader);
    }

    return applySecurityHeaders(next(), cspHeader);
  }

  return applySecurityHeaders(next(), cspHeader);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};
