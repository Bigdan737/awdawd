import { NextRequest, NextResponse } from "next/server";
import { eq, and, gt, sql } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { adminUsers, loginAttempts } from "../../../../../db/schema";
import { verifyPassword } from "../../../../../lib/admin/crypto";
import { createAdminSession, setSessionCookies } from "../../../../../lib/admin/auth";
import { checkBurstLimit, getClientIp } from "../../../rate-limit";

export const runtime = "nodejs";

const LOCKOUT_WINDOW_MIN = 15;
const LOCKOUT_MAX_FAILURES = 8;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Fast in-memory flood guard (per running instance).
  if (!checkBurstLimit(`login:${ip}`, 8, 30)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const db = getDb();

  // Persisted lockout: too many recent failures for this IP -> blocked
  // regardless of which email is being tried (protects against brute force
  // that rotates through emails, and survives cold starts / new isolates).
  const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MIN * 60 * 1000).toISOString();
  const recentFailures = await db
    .select({ count: sql<number>`count(*)` })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ip, ip),
        eq(loginAttempts.success, false),
        gt(loginAttempts.createdAt, windowStart)
      )
    );

  if ((recentFailures[0]?.count ?? 0) >= LOCKOUT_MAX_FAILURES) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please try again later." },
      { status: 429 }
    );
  }

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  const user = rows[0];

  // Constant-shape check: still run verifyPassword against a dummy hash when
  // the user doesn't exist, so response timing doesn't reveal which emails
  // are registered.
  const passwordOk = user
    ? verifyPassword(password, user.passwordHash)
    : verifyPassword(password, "scrypt$16384$8$1$00$00");

  await db.insert(loginAttempts).values({ ip, email, success: Boolean(user && passwordOk) });

  if (!user || !passwordOk) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const { token, csrfToken, expiresAt } = await createAdminSession(
    user.id,
    ip,
    req.headers.get("user-agent") ?? ""
  );

  await db.update(adminUsers).set({ lastLoginAt: new Date().toISOString() }).where(eq(adminUsers.id, user.id));

  const response = NextResponse.json({ email: user.email });
  setSessionCookies(response, token, csrfToken, expiresAt);
  return response;
}
