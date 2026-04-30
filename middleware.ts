import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin/orders")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login?type=admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/orders/:path*"]
};

