import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { settings } from "../../db/schema";
import { encryptSecret, decryptSecret } from "./crypto";

/**
 * Every setting the admin panel can manage. `secret: true` fields are
 * encrypted at rest (see lib/admin/crypto.ts) and are only ever decrypted
 * server-side when actually needed (sending an email, calling the AI
 * provider, notifying Telegram) — the admin UI never receives the decrypted
 * value back, only a masked placeholder.
 */
export const SETTINGS_SCHEMA = {
  // AI assistant
  ai_system_prompt: { secret: false, default: "" },
  ai_model: { secret: false, default: "" },
  ai_base_url: { secret: false, default: "" },
  ai_api_key: { secret: true, default: "" },

  // Outgoing email (SMTP)
  smtp_host: { secret: false, default: "" },
  smtp_port: { secret: false, default: "587" },
  smtp_secure: { secret: false, default: "false" },
  smtp_user: { secret: false, default: "" },
  smtp_pass: { secret: true, default: "" },
  smtp_from: { secret: false, default: "" },
  lead_notify_email: { secret: false, default: "" },

  // Telegram notifications
  telegram_bot_token: { secret: true, default: "" },
  telegram_chat_id: { secret: false, default: "" },
  telegram_enabled: { secret: false, default: "true" },
} as const;

export type SettingKey = keyof typeof SETTINGS_SCHEMA;

const MASK = "••••••••••••";

/** Reads and decrypts a single setting. Returns "" if unset. */
export async function getSetting(key: SettingKey): Promise<string> {
  const db = getDb();
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  const row = rows[0];
  if (!row || !row.value) return SETTINGS_SCHEMA[key].default;
  if (SETTINGS_SCHEMA[key].secret) {
    try {
      return decryptSecret(row.value);
    } catch {
      return "";
    }
  }
  return row.value;
}

export async function getSettings(keys: SettingKey[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    out[key] = await getSetting(key);
  }
  return out;
}

/** Writes a setting, encrypting it first if it's marked secret. Empty string clears it. */
export async function setSetting(key: SettingKey, value: string): Promise<void> {
  const db = getDb();
  const isSecret = SETTINGS_SCHEMA[key].secret;
  const stored = isSecret && value ? encryptSecret(value) : value;

  await db
    .insert(settings)
    .values({ key, value: stored, isSecret, updatedAt: new Date().toISOString() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: stored, isSecret, updatedAt: new Date().toISOString() },
    });
}

/**
 * Returns settings for display in the admin UI: secret fields that have a
 * value are replaced with a mask so the raw secret is never sent back to the
 * browser after the first save. An empty secret field is returned as "" so
 * the UI can show it as genuinely unset.
 */
export async function getSettingsForDisplay(keys: SettingKey[]): Promise<Record<string, string>> {
  const db = getDb();
  const out: Record<string, string> = {};
  for (const key of keys) {
    const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    const row = rows[0];
    if (!row || !row.value) {
      out[key] = "";
      continue;
    }
    out[key] = SETTINGS_SCHEMA[key].secret ? MASK : row.value;
  }
  return out;
}

/** Sentinel the admin UI sends back for a masked secret field the user didn't touch. */
export const UNCHANGED_SECRET_SENTINEL = MASK;
