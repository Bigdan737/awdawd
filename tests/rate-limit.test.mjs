import test from "node:test";
import assert from "node:assert/strict";

delete process.env.REDIS_URL; // force the in-memory fallback path

const {
  checkBurstLimit,
  checkDailyLimit,
  getClientIp,
  isOfftopicCodeRequest,
  __resetInMemoryStoresForTests,
} = await import("../app/api/rate-limit.ts");

test("getClientIp: prefers x-forwarded-for, falls back to x-real-ip, then default", () => {
  const withForwarded = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
  assert.equal(getClientIp(withForwarded), "1.2.3.4");

  const withReal = new Headers({ "x-real-ip": "9.9.9.9" });
  assert.equal(getClientIp(withReal), "9.9.9.9");

  const withNeither = new Headers();
  assert.equal(getClientIp(withNeither), "0.0.0.0");
});

test("checkBurstLimit: allows up to the limit, then blocks within the window", async () => {
  __resetInMemoryStoresForTests();
  const ip = "10.0.0.1";
  for (let i = 0; i < 5; i++) {
    assert.equal(await checkBurstLimit(ip, 5, 3), true, `request ${i + 1} should pass`);
  }
  assert.equal(await checkBurstLimit(ip, 5, 3), false);
});

test("checkBurstLimit: different IPs have independent counters", async () => {
  __resetInMemoryStoresForTests();
  for (let i = 0; i < 5; i++) {
    assert.equal(await checkBurstLimit("10.0.0.2", 5, 3), true);
  }
  assert.equal(await checkBurstLimit("10.0.0.2", 5, 3), false);
  // A different IP should not be affected by 10.0.0.2's exhausted limit.
  assert.equal(await checkBurstLimit("10.0.0.3", 5, 3), true);
});

test("checkDailyLimit: allows up to the limit, then blocks for the rest of the day", async () => {
  __resetInMemoryStoresForTests();
  const ip = "10.0.1.1";
  for (let i = 0; i < 3; i++) {
    assert.equal(await checkDailyLimit(ip, "test-ns", 3), true, `request ${i + 1} should pass`);
  }
  assert.equal(await checkDailyLimit(ip, "test-ns", 3), false);
});

test("checkDailyLimit: namespaces isolate counters for the same IP", async () => {
  __resetInMemoryStoresForTests();
  const ip = "10.0.1.2";
  assert.equal(await checkDailyLimit(ip, "chat", 1), true);
  assert.equal(await checkDailyLimit(ip, "chat", 1), false);
  // A different namespace for the same IP should have its own budget.
  assert.equal(await checkDailyLimit(ip, "lead", 1), true);
});

test("isOfftopicCodeRequest: flags obvious 'write me code' requests in English and Russian", () => {
  assert.equal(isOfftopicCodeRequest("write me a python script"), true);
  assert.equal(isOfftopicCodeRequest("напиши мне код калькулятора"), true);
  assert.equal(isOfftopicCodeRequest("```js\nconsole.log(1)\n```"), true);
});

test("isOfftopicCodeRequest: leaves normal produp-related questions alone", () => {
  assert.equal(isOfftopicCodeRequest("How much does a promo video usually cost?"), false);
  assert.equal(isOfftopicCodeRequest("Сколько стоит съёмка ролика для YouTube?"), false);
});
