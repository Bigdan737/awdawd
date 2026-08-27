import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

/**
 * Admin CMS schema.
 *
 * Design notes (see ADMIN.md for the full write-up):
 * - Secrets (SMTP password, Telegram bot token, AI provider API key) are stored
 *   ENCRYPTED (AES-256-GCM) using a key that only ever lives in an environment
 *   secret (ADMIN_SECRETS_KEY). Nobody with read-only DB access can recover them.
 * - Session tokens are never stored in plaintext: only a SHA-256 hash of the
 *   token lives in `admin_sessions`. The raw token only ever exists in the
 *   admin's browser cookie and in-memory during the request that created it.
 * - Passwords are hashed with scrypt (Node's built-in, no extra dependency),
 *   salted per-user.
 */

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(), // format: scrypt$N$r$p$saltHex$hashHex
  totpSecret: text("totp_secret"), // reserved for future 2FA, unused for now
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  lastLoginAt: text("last_login_at"),
}, (table) => ({
  emailIdx: uniqueIndex("admin_users_email_idx").on(table.email),
}));

export const adminSessions = sqliteTable("admin_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tokenHash: text("token_hash").notNull(), // sha256(raw token) — raw token never stored
  userId: integer("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
}, (table) => ({
  tokenIdx: uniqueIndex("admin_sessions_token_idx").on(table.tokenHash),
  userIdx: index("admin_sessions_user_idx").on(table.userId),
}));

export const loginAttempts = sqliteTable("login_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ip: text("ip").notNull(),
  email: text("email").notNull(),
  success: integer("success", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  ipIdx: index("login_attempts_ip_idx").on(table.ip),
}));

// ---------------------------------------------------------------------------
// Settings (key/value; secret values are stored pre-encrypted by the caller)
// ---------------------------------------------------------------------------

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  isSecret: integer("is_secret", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ---------------------------------------------------------------------------
// Projects & media
// ---------------------------------------------------------------------------

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  // Per-locale JSON blob: { en: { title, services, challenge, approach, ... }, ru: {...}, uk: {...} }
  localesJson: text("locales_json").notNull().default("{}"),
  categoriesJson: text("categories_json").notNull().default("[]"), // string[] e.g. ["youtube","commercial"]
  shape: text("shape").notNull().default("standard"), // "wide" | "portrait" | "standard"
  coverMediaId: integer("cover_media_id"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  slugIdx: uniqueIndex("projects_slug_idx").on(table.slug),
}));

export const projectMedia = sqliteTable("project_media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "photo" | "video"
  // R2 object key, e.g. "projects/samal-construction/1730-hero.jpg"
  storageKey: text("storage_key").notNull(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull().default(0),
  alt: text("alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  projectIdx: index("project_media_project_idx").on(table.projectId),
}));

// ---------------------------------------------------------------------------
// Leads ("Quick Request" submissions from the AI widget + lead magnet form)
// ---------------------------------------------------------------------------

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contact: text("contact").notNull(),
  task: text("task").notNull(),
  source: text("source").notNull().default("quick_request"), // "quick_request" | "lead_magnet" | "ai_chat"
  pageUrl: text("page_url"),
  locale: text("locale"),
  ip: text("ip"),
  status: text("status").notNull().default("new"), // "new" | "in_progress" | "done" | "spam"
  telegramSent: integer("telegram_sent", { mode: "boolean" }).notNull().default(false),
  emailSent: integer("email_sent", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  statusIdx: index("leads_status_idx").on(table.status),
  createdIdx: index("leads_created_idx").on(table.createdAt),
}));
