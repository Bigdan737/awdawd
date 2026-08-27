import test from "node:test";
import assert from "node:assert/strict";

process.env.ADMIN_SECRETS_KEY =
  process.env.ADMIN_SECRETS_KEY ||
  "0".repeat(64); // deterministic 32-byte hex key for the test run only

const {
  hashPassword,
  verifyPassword,
  isPasswordStrongEnough,
  generateSessionToken,
  hashSessionToken,
  generateCsrfToken,
  csrfTokensMatch,
  encryptSecret,
  decryptSecret,
} = await import("../lib/admin/crypto.ts");

test("hashPassword/verifyPassword: correct password verifies", () => {
  const hash = hashPassword("correct horse battery staple");
  assert.equal(verifyPassword("correct horse battery staple", hash), true);
});

test("hashPassword/verifyPassword: wrong password fails", () => {
  const hash = hashPassword("correct horse battery staple");
  assert.equal(verifyPassword("wrong password", hash), false);
});

test("hashPassword: two hashes of the same password differ (random salt)", () => {
  const a = hashPassword("same-password");
  const b = hashPassword("same-password");
  assert.notEqual(a, b);
  assert.equal(verifyPassword("same-password", a), true);
  assert.equal(verifyPassword("same-password", b), true);
});

test("verifyPassword: malformed stored hash never throws, returns false", () => {
  assert.equal(verifyPassword("anything", "not-a-valid-hash"), false);
  assert.equal(verifyPassword("anything", ""), false);
  assert.equal(verifyPassword("anything", "scrypt$bad$format"), false);
});

test("isPasswordStrongEnough: enforces the 12-char minimum", () => {
  assert.equal(isPasswordStrongEnough("short"), false);
  assert.equal(isPasswordStrongEnough("exactly12chr"), true);
  assert.equal(isPasswordStrongEnough(""), false);
});

test("session tokens: generated tokens are unique and hash deterministically", () => {
  const t1 = generateSessionToken();
  const t2 = generateSessionToken();
  assert.notEqual(t1, t2);
  assert.equal(hashSessionToken(t1), hashSessionToken(t1));
  assert.notEqual(hashSessionToken(t1), hashSessionToken(t2));
});

test("csrfTokensMatch: equal tokens match, unequal/missing tokens don't", () => {
  const token = generateCsrfToken();
  assert.equal(csrfTokensMatch(token, token), true);
  assert.equal(csrfTokensMatch(token, generateCsrfToken()), false);
  assert.equal(csrfTokensMatch(token, null), false);
  assert.equal(csrfTokensMatch(undefined, token), false);
  assert.equal(csrfTokensMatch("", ""), false);
});

test("encryptSecret/decryptSecret: round-trips plaintext", () => {
  const plaintext = "sk-super-secret-api-key-12345";
  const encrypted = encryptSecret(plaintext);
  assert.notEqual(encrypted, plaintext);
  assert.match(encrypted, /^v1\.[0-9a-f]+\.[0-9a-f]+\.[0-9a-f]+$/);
  assert.equal(decryptSecret(encrypted), plaintext);
});

test("encryptSecret: same plaintext encrypts differently each time (random IV)", () => {
  const a = encryptSecret("same-secret");
  const b = encryptSecret("same-secret");
  assert.notEqual(a, b);
  assert.equal(decryptSecret(a), "same-secret");
  assert.equal(decryptSecret(b), "same-secret");
});

test("decryptSecret: tampered ciphertext fails to decrypt (auth tag mismatch)", () => {
  const encrypted = encryptSecret("tamper-test");
  const parts = encrypted.split(".");
  // Flip a byte in the ciphertext portion.
  const tamperedHex = parts[3].slice(0, -2) + (parts[3].slice(-2) === "00" ? "01" : "00");
  const tampered = [parts[0], parts[1], parts[2], tamperedHex].join(".");
  assert.throws(() => decryptSecret(tampered));
});

test("decryptSecret: malformed payload throws instead of returning garbage", () => {
  assert.throws(() => decryptSecret("not-a-valid-payload"));
  assert.throws(() => decryptSecret("v2.aa.bb.cc"));
});
