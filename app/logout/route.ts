import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { USER_SESSION_COOKIE } from "@/lib/userAuth";

// Built from APP_BASE_URL rather than the incoming request's URL: behind the
// Cloudflare Tunnel, `request.url` resolves to the internal localhost:3001
// origin, not the public domain, which would otherwise redirect the browser
// to an unreachable https://localhost:3001/.
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_SESSION_COOKIE);
  const baseUrl = process.env.APP_BASE_URL ?? "https://app.dealingn8n.online";
  return NextResponse.redirect(new URL("/", baseUrl));
}
