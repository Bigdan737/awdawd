import { NextRequest, NextResponse } from "next/server";
import { eq, and, gt } from "drizzle-orm";
import { getDb } from "../../db";
import { adminSessions, adminUsers } from "../../db/schema";
import { generateSessionToken, hashSessionToken, generateCsrfToken } from "./crypto";
import {
  SESSION_COOKIE,
  CSRF_COOKIE,
  SESSION_TTL_MS,
  verifyCsrf,
  isAdminUser,
  SHARED_ADMIN_PASSWORD,
  SHARED_ADMIN_EMAIL,
  type AdminUser,
} from "./auth-csrf";

// SESSION_COOKIE, CSRF_COOKIE, SESSION_TTL_MS, verifyCsrf, isAdminUser, and
// the AdminUser type live in ./auth-csrf.ts — they have no DB dependency,
// which keeps them unit-testable without pulling in the Drizzle/DB import
// graph. Re-exported here so existing imports of "./auth" (or "../../lib/admin/auth")
// across the app keep working unchanged.
export {
  SESSION_COOKIE,
  CSRF_COOKIE,
  SESSION_TTL_MS,
  verifyCsrf,
  isAdminUser,
  SHARED_ADMIN_PASSWORD,
  SHARED_ADMIN_EMAIL,
};
export type { AdminUser };

/** Creates a DB-backed session row and returns the raw token to put in a cookie. */
export async function createAdminSession(
  userId: number,
  ip: string,
  userAgent: string
): Promise<{ token: string; csrfToken: string; expiresAt: Date }> {
  const db = await getDb();
  const token = generateSessionToken();
  const csrfToken = generateCsrfToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(adminSessions).values({
    tokenHash: hashSessionToken(token),
    userId,
    expiresAt: expiresAt.toISOString(),
    ip,
    userAgent: userAgent.slice(0, 300),
  });

  return { token, csrfToken, expiresAt };
}

export async function destroySessionByToken(token: string): Promise<void> {
  const db = await getDb();
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashSessionToken(token)));
}

/** Looks up the session by raw token, transparently dropping expired ones. */
export async function getAdminByToken(token: string | undefined | null): Promise<AdminUser | null> {
  if (!token) return null;
  const db = await getDb();
  const tokenHash = hashSessionToken(token);
  const nowIso = new Date().toISOString();

  const rows = await db
    .select({ id: adminUsers.id, email: adminUsers.email })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, nowIso)))
    .limit(1);

  return rows[0] ?? null;
}

/** For use inside Route Handlers (app/api/admin/**). */
export async function getAdminFromRequest(req: NextRequest): Promise<AdminUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return getAdminByToken(token);
}

/** For use inside Server Components / layouts (app/admin/**). */
export async function getAdminForPage(): Promise<AdminUser | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return getAdminByToken(token);
}

/**
 * Whether the current request reached us over HTTPS. Browsers silently
 * refuse to store a cookie marked `Secure` unless the page was loaded over
 * HTTPS (an exception is made for `http://localhost` in Chrome/Firefox,
 * which is why this bug doesn't show up in local dev but breaks login on
 * any real server that isn't behind TLS yet — the cookie is "set" by the
 * server, silently dropped by the browser, and every subsequent request
 * looks unauthenticated, which is what makes project creation and every
 * other admin action fail after an apparently successful login).
 */
function isHttpsRequest(req?: NextRequest): boolean {
  if (!req) return process.env.NODE_ENV === "production";
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return req.nextUrl.protocol === "https:";
}

export function setSessionCookies(
  response: NextResponse,
  token: string,
  csrfToken: string,
  expiresAt: Date,
  req?: NextRequest
): void {
  const secure = isHttpsRequest(req);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
  // Readable by admin-panel JS on purpose (double-submit CSRF pattern) —
  // it carries no authentication power on its own, only the httpOnly
  // session cookie does.
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure,
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookies(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", { path: "/", expires: new Date(0) });
  response.cookies.set(CSRF_COOKIE, "", { path: "/", expires: new Date(0) });
}

/**
 * Guards an admin API route. Returns the admin user on success, or a
 * NextResponse to return immediately on failure.
 */
export async function requireAdminApi(
  req: NextRequest,
  opts: { requireCsrf?: boolean } = {}
): Promise<AdminUser | NextResponse> {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const requireCsrf = opts.requireCsrf ?? true;
  if (requireCsrf && !verifyCsrf(req)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }
  return admin;
}