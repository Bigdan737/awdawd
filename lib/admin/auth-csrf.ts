import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { csrfTokensMatch } from "./crypto";

export const SESSION_COOKIE = "admin_session";
export const CSRF_COOKIE = "admin_csrf";
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h — re-login required after that

/**
 * TEMPORARY test mode: a single shared password for the whole admin panel,
 * no per-user accounts. Change this via the ADMIN_PASSWORD env var before
 * going live — anyone with this password gets full admin access.
 */
export const SHARED_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123123";
export const SHARED_ADMIN_EMAIL = "admin@site.local";

export type AdminUser = {
  id: number;
  email: string;
};

/** Double-submit CSRF check for state-changing admin API requests. */
export function verifyCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get("x-csrf-token");
  // Constant-time comparison: a naive `===` here leaks timing information
  // that an attacker could in principle use to guess the token byte by byte.
  return csrfTokensMatch(cookieToken, headerToken);
}

export function isAdminUser(value: AdminUser | NextResponse): value is AdminUser {
  return !(value instanceof NextResponse);
}