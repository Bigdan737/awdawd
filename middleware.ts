import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage =
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login");

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(
    req.cookies.get(SESSION_COOKIE)?.value
  );

  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};