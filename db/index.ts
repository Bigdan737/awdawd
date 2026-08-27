import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { seedKeymanProject } from "./seed";

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
`
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

declare global {
  // eslint-disable-next-line no-var
  var __adminLibsqlClient: Client | undefined;
  // eslint-disable-next-line no-var
  var __adminDrizzleDb: LibSQLDatabase<typeof schema> | undefined;
  // eslint-disable-next-line no-var
  var __adminDbBootstrapped: Promise<void> | undefined;
}

function openClient(): Client {
  if (globalThis.__adminLibsqlClient) return globalThis.__adminLibsqlClient;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const client = createClient({ url: `file:${DB_PATH}` });
  globalThis.__adminLibsqlClient = client;
  return client;
}

async function bootstrap(client: Client): Promise<void> {
  for (const statement of BOOTSTRAP_SQL) {
    await client.execute(statement);
  }
}

/**
 * Returns a ready-to-use Drizzle client backed by a local SQLite file
 * (via @libsql/client, which ships prebuilt native bindings for Windows/
 * macOS/Linux — unlike better-sqlite3, no C++ compiler / Visual Studio
 * Build Tools needed). The database file and every table are created
 * automatically on first use — no separate migration step.
 *
 * Works on any plain Node.js host (VPS, cPanel with Node, Docker, etc.)
 * via `npm run build && npm start`.
 *
 * Override the file location with ADMIN_DB_PATH if you want the SQLite
 * file somewhere other than <project>/data/admin.sqlite3.
 */
export async function getDb(): Promise<LibSQLDatabase<typeof schema>> {
  const client = openClient();

  if (!globalThis.__adminDbBootstrapped) {
    globalThis.__adminDbBootstrapped = bootstrap(client).then(async () => {
      const db = drizzle(client, { schema });
      globalThis.__adminDrizzleDb = db;
      try {
        await seedKeymanProject(db);
      } catch (err) {
        // Seeding is a convenience, not a requirement — never let it block
        // the admin panel/site from working if it fails for any reason.
        console.error("[db] KeyMan seed failed:", err);
      }
    });
  }
  await globalThis.__adminDbBootstrapped;

  if (!globalThis.__adminDrizzleDb) {
    globalThis.__adminDrizzleDb = drizzle(client, { schema });
  }
  return globalThis.__adminDrizzleDb;
}
