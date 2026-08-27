import { NextRequest, NextResponse } from "next/server";
import { isAdminUser, requireAdminApi } from "../../../../lib/admin/auth";
import {
  SETTINGS_SCHEMA,
  SettingKey,
  getSettingsForDisplay,
  setSetting,
  UNCHANGED_SECRET_SENTINEL,
} from "../../../../lib/admin/settings";

export const runtime = "nodejs";

const ALL_KEYS = Object.keys(SETTINGS_SCHEMA) as SettingKey[];

export async function GET(req: NextRequest) {
  const admin = await requireAdminApi(req, { requireCsrf: false });
  if (!isAdminUser(admin)) return admin;

  const values = await getSettingsForDisplay(ALL_KEYS);
  return NextResponse.json({ settings: values });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const updates: Partial<Record<SettingKey, string>> = {};
  for (const key of ALL_KEYS) {
    if (!(key in body)) continue;
    const raw = body[key];
    if (typeof raw !== "string") continue;
    // A masked value means "the admin didn't change this secret" — skip it.
    if (SETTINGS_SCHEMA[key].secret && raw === UNCHANGED_SECRET_SENTINEL) continue;
    if (raw.length > 8000) {
      return NextResponse.json({ error: `${key} is too long.` }, { status: 400 });
    }
    updates[key] = raw;
  }

  if (updates.smtp_port && !/^\d{1,5}$/.test(updates.smtp_port)) {
    return NextResponse.json({ error: "SMTP port must be a number." }, { status: 400 });
  }
  if (updates.lead_notify_email && updates.lead_notify_email.length > 0 && !updates.lead_notify_email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid notification email." }, { status: 400 });
  }

  try {
    for (const [key, value] of Object.entries(updates)) {
      await setSetting(key as SettingKey, value);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const values = await getSettingsForDisplay(ALL_KEYS);
  return NextResponse.json({ settings: values });
}
