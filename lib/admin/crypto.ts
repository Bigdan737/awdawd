import { randomBytes, scryptSync, timingSafeEqual, createHash, createCipheriv, createDecipheriv } from "node:crypto";

// ---------------------------------------------------------------------------
// Password hashing (scrypt — built into Node, no extra dependency, resistant
// to GPU brute force). Format: scrypt$N$r$p$saltHex$hashHex
// ---------------------------------------------------------------------------

const SCRYPT_N = 16384; // CPU/memory cost
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const N = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    const salt = Buffer.from(parts[4], "hex");
    const expected = Buffer.from(parts[5], "hex");
    const actual = scryptSync(password, salt, expected.length, { N, r, p });
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Minimum bar for admin passwords created/changed through the panel. */
export function isPasswordStrongEnough(password: string): boolean {
  return typeof password === "string" && password.length >= 12;
}

// ---------------------------------------------------------------------------
// Session tokens — the raw token lives only in the browser cookie; the DB
// only ever stores sha256(token), so a DB leak alone can't be used to log in.
// ---------------------------------------------------------------------------

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ---------------------------------------------------------------------------
// CSRF (double-submit cookie pattern for the admin panel's own fetch calls)
// ---------------------------------------------------------------------------

export function generateCsrfToken(): string {
  return randomBytes(24).toString("base64url");
}

export function csrfTokensMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Secret encryption at rest (AES-256-GCM). Used for SMTP password, Telegram
// bot token, AI provider API key stored in the `settings` table. The key
// comes ONLY from the ADMIN_SECRETS_KEY environment secret — it never touches
// the database, so a DB-only leak cannot decrypt stored secrets.
// ---------------------------------------------------------------------------

function getEncryptionKey(): Buffer {
  const raw = process.env.ADMIN_SECRETS_KEY;
  if (!raw) {
    throw new Error(
      "ADMIN_SECRETS_KEY is not set. Generate one with `openssl rand -hex 32` and set it as a platform secret before saving any secret setting (SMTP password, Telegram token, AI API key)."
    );
  }
  // Accept either a 64-char hex string or any string (hashed down to 32 bytes).
  if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, "hex");
  return createHash("sha256").update(raw).digest();
}

export function encryptSecret(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // format: v1.<iv-hex>.<tag-hex>.<ciphertext-hex>
  return `v1.${iv.toString("hex")}.${tag.toString("hex")}.${encrypted.toString("hex")}`;
}

export function decryptSecret(payload: string): string {
  const key = getEncryptionKey();
  const parts = payload.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") {
    throw new Error("Malformed encrypted secret payload.");
  }
  const iv = Buffer.from(parts[1], "hex");
  const tag = Buffer.from(parts[2], "hex");
  const data = Buffer.from(parts[3], "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}
