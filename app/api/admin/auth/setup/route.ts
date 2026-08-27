import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../../db";
import { adminUsers } from "../../../../../db/schema";
import { hashPassword, isPasswordStrongEnough } from "../../../../../lib/admin/crypto";
import { checkBurstLimit, getClientIp } from "../../../rate-limit";

export const runtime = "nodejs";

/**
 * One-time setup: creates the first admin account. Only usable when:
 *   1. `admin_users` is empty (so it can never be re-run to add a rogue admin
 *      once the panel is in use), AND
 *   2. the caller supplies the ADMIN_SETUP_TOKEN platform secret.
 *
 * Set ADMIN_SETUP_TOKEN as a platform secret, open
 * /admin/login?setup=<token> once to create your account, then you can
 * remove the secret — the empty-table check locks this endpoint afterwards
 * regardless.
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!checkBurstLimit(`setup:${ip}`, 5, 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const setupToken = process.env.ADMIN_SETUP_TOKEN;
  if (!setupToken) {
    return NextResponse.json(
      { error: "Setup is disabled. Set ADMIN_SETUP_TOKEN to enable first-run setup." },
      { status: 403 }
    );
  }

  let body: { token?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.token !== setupToken) {
    return NextResponse.json({ error: "Invalid setup token." }, { status: 403 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!isPasswordStrongEnough(password)) {
    return NextResponse.json({ error: "Password must be at least 12 characters." }, { status: 400 });
  }

  const db = await getDb();
  const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "An admin account already exists. Setup can only run once." },
      { status: 409 }
    );
  }

  await db.insert(adminUsers).values({
    email,
    passwordHash: hashPassword(password),
  });

  return NextResponse.json({ message: "Admin account created. You can now log in." });
}
