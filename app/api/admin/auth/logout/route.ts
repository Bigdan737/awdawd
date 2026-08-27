import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookies, destroySessionByToken, SESSION_COOKIE } from "../../../../../lib/admin/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await destroySessionByToken(token);
  }
  const response = NextResponse.json({ message: "Logged out." });
  clearSessionCookies(response);
  return response;
}
