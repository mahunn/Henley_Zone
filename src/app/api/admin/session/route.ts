import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";

export async function GET() {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return withAdminSessionRefresh(NextResponse.json({ ok: true }));
}
