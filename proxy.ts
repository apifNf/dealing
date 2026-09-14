import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/adminAuth";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new
 * name/export) — see node_modules/next/dist/docs/.../file-conventions/proxy.md.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Must stay open, or a logged-out visitor can never reach the login page.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
