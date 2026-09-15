import { cookies } from "next/headers";
import { USER_SESSION_COOKIE, verifySessionToken } from "@/lib/userAuth";

/**
 * Server Components / Server Actions only (reads the request's cookies via
 * next/headers, which isn't available in proxy.ts's edge runtime — that's
 * why this lives apart from lib/userAuth.ts's pure token helpers).
 */
export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(USER_SESSION_COOKIE)?.value);
}
