import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie, setAdminSessionCookie } from "@/lib/admin-auth";

/** Re-attach the session cookie on successful admin responses so it survives navigation. */
export async function withAdminSessionRefresh(response: NextResponse): Promise<NextResponse> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (isValidSessionCookie(existing)) {
    setAdminSessionCookie(response, existing!);
  }
  return response;
}
