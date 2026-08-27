import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdminUser, requireAdminApi } from "../../../../../lib/admin/auth";
import { getSettings } from "../../../../../lib/admin/settings";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const s = await getSettings(["smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_pass", "smtp_from", "lead_notify_email"]);

  if (!s.smtp_host || !s.lead_notify_email) {
    return NextResponse.json({ error: "Заполните и сохраните SMTP-хост и email для уведомлений." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: s.smtp_host,
      port: Number(s.smtp_port || 587),
      secure: s.smtp_secure === "true",
      auth: s.smtp_user ? { user: s.smtp_user, pass: s.smtp_pass } : undefined,
    });

    await transporter.sendMail({
      from: s.smtp_from || `"produp website" <${s.smtp_user}>`,
      to: s.lead_notify_email,
      subject: "Тестовое письмо из админ-панели produp",
      text: "Если вы получили это письмо — SMTP настроен правильно.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Не удалось отправить письмо.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ message: "Тестовое письмо отправлено." });
}
