import { NextRequest, NextResponse } from "next/server";
import { eq, ne, and } from "drizzle-orm";
import { getDb } from "../../../../db";
import { adminUsers, adminSessions } from "../../../../db/schema";
import { hashPassword, verifyPassword, isPasswordStrongEnough } from "../../../../lib/admin/crypto";
import { isAdminUser, requireAdminApi, SESSION_COOKIE } from "../../../../lib/admin/auth";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (!isPasswordStrongEnough(newPassword)) {
    return NextResponse.json({ error: "New password must be at least 12 characters." }, { status: 400 });
  }

  const db = getDb();
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, admin.id)).limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await db.update(adminUsers).set({ passwordHash: hashPassword(newPassword) }).where(eq(adminUsers.id, admin.id));

  // Invalidate every other session for this account; keep the current one.
  const currentToken = req.cookies.get(SESSION_COOKIE)?.value ?? "";
  const { hashSessionToken } = await import("../../../../lib/admin/crypto");
  const currentHash = hashSessionToken(currentToken);
  await db
    .delete(adminSessions)
    .where(and(eq(adminSessions.userId, admin.id), ne(adminSessions.tokenHash, currentHash)));

  return NextResponse.json({ message: "Password updated." });
}
