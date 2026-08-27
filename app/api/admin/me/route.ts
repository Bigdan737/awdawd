import { NextRequest, NextResponse } from "next/server";
import { isAdminUser, requireAdminApi } from "../../../../lib/admin/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = await requireAdminApi(req, { requireCsrf: false });
  if (!isAdminUser(admin)) return admin;
  return NextResponse.json({ email: admin.email });
}
