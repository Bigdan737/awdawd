import { NextRequest, NextResponse } from "next/server";
import { eq, and, gt } from "drizzle-orm";
import { getDb } from "../../db";
import { adminSessions, adminUsers } from "../../db/schema";
import { generateSessionToken, hashSessionToken, generateCsrfToken } from "./crypto";

export const SESSION_COOKIE = "admin_session";
export const CSRF_COOKIE = "admin_csrf";
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h — re-login required after that

export type AdminUser = {
  id: number;
  email: string;
};

/** Creates a DB-backed session row and returns the raw token to put in a cookie. */
export async function createAdminSession(
  userId: number,
  ip: string,
  userAgent: string
): Promise<{ token: string; csrfToken: string; expiresAt: Date }> {
  const db = getDb();
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
  const db = getDb();
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashSessionToken(token)));
}

/** Looks up the session by raw token, transparently dropping expired ones. */
export async function getAdminByToken(token: string | undefined | null): Promise<AdminUser | null> {
  if (!token) return null;
  const db = getDb();
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

export function setSessionCookies(
  response: NextResponse,
  token: string,
  csrfToken: string,
  expiresAt: Date
): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
  // Readable by admin-panel JS on purpose (double-submit CSRF pattern) —
  // it carries no authentication power on its own, only the httpOnly
  // session cookie does.
  response.cookies.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookies(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", { path: "/", expires: new Date(0) });
  response.cookies.set(CSRF_COOKIE, "", { path: "/", expires: new Date(0) });
}

/** Double-submit CSRF check for state-changing admin API requests. */
export function verifyCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken) return false;
  return cookieToken === headerToken;
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

export function isAdminUser(value: AdminUser | NextResponse): value is AdminUser {
  return !(value instanceof NextResponse);
}
