import { NextRequest, NextResponse } from "next/server";
import { isAdminUser, requireAdminApi } from "../../../../../lib/admin/auth";
import { getSetting } from "../../../../../lib/admin/settings";
import { sendTelegramMessage } from "../../../../../lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const token = await getSetting("telegram_bot_token");
  const chatId = await getSetting("telegram_chat_id");

  const result = await sendTelegramMessage(
    token,
    chatId,
    "✅ Тестовое уведомление из админ-панели produp. Если вы это видите — Telegram настроен правильно."
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to send." }, { status: 400 });
  }
  return NextResponse.json({ message: "Test message sent." });
}
