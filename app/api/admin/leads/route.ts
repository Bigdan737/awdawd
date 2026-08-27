import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { leads } from "../../../../db/schema";
import { isAdminUser, requireAdminApi } from "../../../../lib/admin/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = await requireAdminApi(req, { requireCsrf: false });
  if (!isAdminUser(admin)) return admin;

  const db = await getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(500);
  return NextResponse.json({ leads: rows });
}
