import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { checkDailyLimit, getClientIp } from "../rate-limit";
import { getDb } from "../../../db";
import { leads } from "../../../db/schema";
import { getSettings } from "../../../lib/admin/settings";
import { sendTelegramMessage, escapeTelegramHtml } from "../../../lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  let body: {
    contact?: string;
    task?: string;
    consent?: boolean;
    website?: string; // honeypot
    pageUrl?: string;
    openedAt?: number;
    locale?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill every field, humans never see this one.
  if (body.website) {
    return NextResponse.json({ message: "Request sent! We will contact you shortly." });
  }

  // Anti-bot: submitted suspiciously fast after the form rendered.
  if (body.openedAt && Date.now() - body.openedAt < 3000) {
    return NextResponse.json(
      { error: "Please try submitting the request again." },
      { status: 400 },
    );
  }

  if (!(await checkDailyLimit(ip, "lead", 30))) {
    return NextResponse.json(
      { error: "Too many requests from your address today. Please contact us directly." },
      { status: 429 },
    );
  }

  const contact = (body.contact ?? "").toString().trim().slice(0, 300);
  const task = (body.task ?? "").toString().trim().slice(0, 3000);

  if (!contact || !task) {
    return NextResponse.json({ error: "Please fill in both fields." }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json(
      { error: "You must agree to the processing of personal data." },
      { status: 400 },
    );
  }

  // The database record is the source of truth (it's what shows up in the
  // admin panel's Leads inbox) — save it before attempting any notification
  // channel, so a flaky SMTP/Telegram provider never loses a lead.
  let leadId: number | null = null;
  try {
    const db = await getDb();
    const inserted = await db
      .insert(leads)
      .values({
        contact,
        task,
        source: "quick_request",
        pageUrl: (body.pageUrl ?? "").slice(0, 500),
        locale: (body.locale ?? "").slice(0, 10),
        ip,
      })
      .returning({ id: leads.id });
    leadId = inserted[0]?.id ?? null;
  } catch (err) {
    console.error("[ai-lead] Failed to save lead to database:", err);
    // Fall through — still try to notify by email/Telegram even if the DB
    // write failed, so the request isn't silently lost.
  }

  const settings = await getSettings([
    "telegram_bot_token",
    "telegram_chat_id",
    "telegram_enabled",
    "smtp_host",
    "smtp_port",
    "smtp_secure",
    "smtp_user",
    "smtp_pass",
    "smtp_from",
    "lead_notify_email",
  ]);

  let telegramOk = false;
  if (settings.telegram_enabled !== "false" && settings.telegram_bot_token && settings.telegram_chat_id) {
    const text = [
      "🆕 <b>Новая заявка с сайта produp</b>",
      "",
      `<b>Контакт:</b> ${escapeTelegramHtml(contact)}`,
      `<b>Задача:</b> ${escapeTelegramHtml(task)}`,
      "",
      `Страница: ${escapeTelegramHtml(body.pageUrl ?? "-")}`,
    ].join("\n");
    const result = await sendTelegramMessage(settings.telegram_bot_token, settings.telegram_chat_id, text);
    telegramOk = result.ok;
    if (!result.ok) console.error("[ai-lead] Telegram notify failed:", result.error);
  }

  const smtpHost = settings.smtp_host || process.env.SMTP_HOST;
  const notifyEmail = settings.lead_notify_email || process.env.LEAD_NOTIFY_EMAIL;

  let emailOk = false;
  if (smtpHost && notifyEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(settings.smtp_port || process.env.SMTP_PORT || 587),
        secure: (settings.smtp_secure || process.env.SMTP_SECURE) === "true",
        auth: (settings.smtp_user || process.env.SMTP_USER)
          ? { user: settings.smtp_user || process.env.SMTP_USER, pass: settings.smtp_pass || process.env.SMTP_PASS }
          : undefined,
      });

      await transporter.sendMail({
        from: settings.smtp_from || process.env.SMTP_FROM || `"produp website" <${settings.smtp_user || process.env.SMTP_USER}>`,
        to: notifyEmail,
        subject: "New request from produp.com",
        text: [
          `New request from the "Quick Request" widget`,
          ``,
          `Contact: ${contact}`,
          `Task: ${task}`,
          ``,
          `Page: ${body.pageUrl ?? "-"}`,
          `Date: ${new Date().toISOString()}`,
        ].join("\n"),
      });
      emailOk = true;
    } catch (err) {
      console.error("[ai-lead] Failed to send email:", err);
    }
  }

  // Best-effort: reflect delivery status on the saved lead row.
  if (leadId) {
    try {
      const db = await getDb();
      await db.update(leads).set({ telegramSent: telegramOk, emailSent: emailOk }).where(eq(leads.id, leadId));
    } catch {
      // non-fatal
    }
  }

  if (!leadId && !telegramOk && !emailOk) {
    return NextResponse.json(
      { error: "Request could not be sent right now. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Request sent! We will contact you shortly." });
}
