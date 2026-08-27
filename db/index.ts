import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = process.env.ADMIN_DB_PATH || path.join(process.cwd(), "data", "admin.sqlite3");

const BOOTSTRAP_SQL = `
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS admin_sessions_user_idx ON admin_sessions(user_id);

CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  email TEXT NOT NULL,
  success INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS login_attempts_ip_idx ON login_attempts(ip);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  is_secret INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locales_json TEXT NOT NULL DEFAULT '{}',
  categories_json TEXT NOT NULL DEFAULT '[]',
  shape TEXT NOT NULL DEFAULT 'standard',
  cover_media_id INTEGER,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);

CREATE TABLE IF NOT EXISTS project_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS project_media_project_idx ON project_media(project_id);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact TEXT NOT NULL,
  task TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'quick_request',
  page_url TEXT,
  locale TEXT,
  ip TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  telegram_sent INTEGER NOT NULL DEFAULT 0,
  email_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at);
`;

declare global {
  // eslint-disable-next-line no-var
  var __adminSqliteDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __adminDrizzleDb: BetterSQLite3Database<typeof schema> | undefined;
}

function openDatabase(): Database.Database {
  if (globalThis.__adminSqliteDb) return globalThis.__adminSqliteDb;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(BOOTSTRAP_SQL);

  globalThis.__adminSqliteDb = sqlite;
  return sqlite;
}

/**
 * Returns a ready-to-use Drizzle client backed by a local SQLite file.
 * The database file and every table are created automatically on first use
 * — no separate migration step needed. Works on any plain Node.js host
 * (VPS, cPanel with Node, Docker, etc.) via `npm run build && npm start`.
 *
 * Override the file location with ADMIN_DB_PATH if you want the SQLite
 * file somewhere other than <project>/data/admin.sqlite3 (e.g. a mounted
 * persistent volume in a container setup).
 */
export function getDb(): BetterSQLite3Database<typeof schema> {
  if (globalThis.__adminDrizzleDb) return globalThis.__adminDrizzleDb;
  const sqlite = openDatabase();
  const db = drizzle(sqlite, { schema });
  globalThis.__adminDrizzleDb = db;
  return db;
}
