# Admin Panel — setup & usage

The site now has a full admin panel at **`/admin`** for managing projects
(photos/videos), reviewing "Quick Request" leads, and configuring the AI
assistant, outgoing email, and Telegram notifications — all without a
redeploy.

For the fastest path to running it, see **QUICKSTART.md**. This file covers
the details.

## 1. Hosting requirement

The admin panel stores its data on the local filesystem:
- a SQLite database file (`data/admin.sqlite3` by default)
- uploaded project photos/videos (`storage/media/` by default, one folder
  per project)

This means it needs a **normal, persistent Node.js server** — a VPS, a
Docker container with a mounted volume, or any host you run
`npm run build && npm start` on. It will **not** work correctly on
serverless/edge platforms whose filesystem resets on every request (data
would disappear between requests).

Both paths can be overridden via `ADMIN_DB_PATH` and `MEDIA_STORAGE_DIR` if
you want them on a different disk/volume — see `.env.example`.

**Back these up.** They're the only copy of your admin account, settings,
projects, and uploaded media — include `data/` and `storage/` in your backup
routine (they're gitignored on purpose, since they're runtime data, not
source code).

## 2. First run

```bash
npm install
npm run build
npm start
```

The database and storage folder are created automatically on first run —
no migration command needed.

Then create your admin account once at:

```
https://yourdomain.com/admin/login?setup=YOUR_ADMIN_SETUP_TOKEN
```

using the `ADMIN_SETUP_TOKEN` value from your `.env`. This works **exactly
once** — the endpoint refuses to run again as soon as one admin account
exists, regardless of the token. After that, you can remove
`ADMIN_SETUP_TOKEN` from `.env` (optional).

Then log in normally at `/admin/login`.

## 3. What you can do from the panel

- **Dashboard** (`/admin`) — quick stats + latest leads.
- **Projects** (`/admin/projects`) — create/edit/delete case studies: slug,
  category tags, card shape, per-language title/services/challenge/approach
  text, publish toggle, featured toggle, and a photo/video gallery (upload,
  delete, set cover image).
- **Leads** (`/admin/leads`) — every "Quick Request" submission from the
  site, with delivery status (Telegram/email) and a status field
  (new / in_progress / done / spam).
- **Settings** (`/admin/settings`):
  - **AI assistant** — system prompt, model, provider base URL, API key.
    Leave blank to fall back to the `AI_WIDGET_*` env vars.
  - **Email** — SMTP host/port/user/password/from address, and which inbox
    receives lead notifications. Has a "send test email" button.
  - **Telegram** — bot token + chat ID. Has a "send test message" button.
- **Account** (`/admin/account`) — change your password (this signs out
  every other active session for your account).

## 4. Getting a Telegram bot token + chat ID

1. Message **@BotFather** on Telegram → `/newbot` → follow the prompts →
   copy the token it gives you.
2. Add the bot to the chat/group you want notifications in (or just message
   it directly for a personal chat).
3. Get the chat ID either via **@userinfobot**, or by opening
   `https://api.telegram.org/bot<token>/getUpdates` after sending the bot a
   message — look for `"chat":{"id": ...}`.
4. Paste both into **Settings → Telegram** in the admin panel and hit
   "send test message".

## 5. Security notes

- Passwords are hashed with scrypt; sessions are opaque tokens — only a
  SHA-256 hash of the token is stored in the database, so a database-only
  leak can't be used to log in.
- Secrets (SMTP password, Telegram bot token, AI API key) are encrypted at
  rest with AES-256-GCM using `ADMIN_SECRETS_KEY` from `.env` — never stored
  in plaintext in the database.
- Login is rate-limited per IP (in-memory burst limit + a persisted
  15-minute lockout after repeated failures).
- All state-changing admin API requests require a CSRF token (double-submit
  cookie), in addition to the session cookie.
- Uploaded media is validated by content-type and size (15MB images / 250MB
  videos) before being written to disk, and is only ever served back
  through a route that checks the database first — nothing in
  `storage/media/` is served directly.
- Keep `.env` out of version control (it's in `.gitignore`) — it contains
  your encryption key.

## 6. Known limitation / next step

The public site's **Work** grid, case-study pages, and homepage still read
project data from the static `app/content.ts` file, not from the database
yet. Projects created in the admin panel are fully stored (including
photos/videos) but won't appear on the live site until that rendering layer
is wired up to read from the database — this is a separate, larger change
(touches `work-client.tsx`, `work/[slug]/page.tsx`, and the homepage's
featured-work section) that wasn't done in this pass to avoid risking the
site's existing animations without the ability to test-build in the
environment this was written in. Happy to do that next.
