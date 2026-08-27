import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { leads } from "../../../../../db/schema";
import { isAdminUser, requireAdminApi } from "../../../../../lib/admin/auth";

export const runtime = "nodejs";

const VALID_STATUSES = new Set(["new", "in_progress", "done", "spam"]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const { id } = await context.params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const db = getDb();
  await db.update(leads).set({ status: body.status }).where(eq(leads.id, Number(id)));

  return NextResponse.json({ message: "Updated." });
}
