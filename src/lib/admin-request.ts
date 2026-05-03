import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from "@/lib/admin-auth";

export async function isAdminAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidSessionCookie(sessionCookie);
}
