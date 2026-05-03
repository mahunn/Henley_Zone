import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

function isAdminProtectedPath(pathname: string) {
  return pathname.startsWith("/admin/orders") || pathname === "/admin/products";
}

export function middleware(request: NextRequest) {
  if (!isAdminProtectedPath(request.nextUrl.pathname)) {
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
  matcher: ["/admin/orders", "/admin/orders/:path*", "/admin/products"]
};

