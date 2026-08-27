import test from "node:test";
import assert from "node:assert/strict";

process.env.ADMIN_SECRETS_KEY = process.env.ADMIN_SECRETS_KEY || "0".repeat(64);

// NOTE: verifyCsrf/isAdminUser/CSRF_COOKIE live in lib/admin/auth-csrf.ts —
// split out of lib/admin/auth.ts specifically so they can be unit-tested
// without pulling in auth.ts's DB (Drizzle) import graph, which plain
// `node --test` can't resolve the way Next's bundler does. auth.ts
// re-exports everything from here for existing app code.
//
// Separately: plain `node --test` also needs the explicit `.js` extension
// to resolve the bare `next/server` specifier that auth-csrf.ts imports —
// Next's own build/dev pipeline resolves it fine. `--import
// ./tests/register-next-resolve-hook.mjs` (see package.json) patches that
// resolution for the test run only; production code is unaffected.
const { verifyCsrf, isAdminUser, CSRF_COOKIE } = await import("../lib/admin/auth-csrf.ts");
const { NextResponse } = await import("next/server");

/** Minimal fake of the subset of NextRequest that verifyCsrf touches. */
function fakeRequest({ cookieValue, headerValue }) {
  return {
    cookies: {
      get: (name) => (name === CSRF_COOKIE && cookieValue !== undefined ? { value: cookieValue } : undefined),
    },
    headers: {
      get: (name) => (name === "x-csrf-token" ? headerValue ?? null : null),
    },
  };
}

test("verifyCsrf: matching cookie and header token passes", () => {
  const req = fakeRequest({ cookieValue: "same-token-value", headerValue: "same-token-value" });
  assert.equal(verifyCsrf(req), true);
});

test("verifyCsrf: mismatched cookie/header fails", () => {
  const req = fakeRequest({ cookieValue: "token-a", headerValue: "token-b" });
  assert.equal(verifyCsrf(req), false);
});

test("verifyCsrf: missing cookie fails", () => {
  const req = fakeRequest({ headerValue: "some-token" });
  assert.equal(verifyCsrf(req), false);
});

test("verifyCsrf: missing header fails", () => {
  const req = fakeRequest({ cookieValue: "some-token" });
  assert.equal(verifyCsrf(req), false);
});

test("verifyCsrf: both missing fails", () => {
  const req = fakeRequest({});
  assert.equal(verifyCsrf(req), false);
});

test("isAdminUser: distinguishes an admin user object from a NextResponse", () => {
  const user = { id: 1, email: "admin@example.com" };
  const response = NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  assert.equal(isAdminUser(user), true);
  assert.equal(isAdminUser(response), false);
});
