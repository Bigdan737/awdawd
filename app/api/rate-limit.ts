// Simple in-memory rate limiting, ported from the CloudxBear AI Widget plugin.
// Works per running Node process — fine for a single-instance deploy (e.g. Vercel
// with a persistent Node runtime, or a VPS). For multi-instance deploys, swap this
// for a shared store (Redis, Upstash, etc.) — the interface below stays the same.

type BurstEntry = number[];

const burstStore = new Map<string, BurstEntry>();
const dailyStore = new Map<string, { count: number; day: string }>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real;
  return "0.0.0.0";
}

/** Burst limiter: blocks real flood (bots), never a normal fast typer. */
export function checkBurstLimit(ip: string, maxRequests = 5, windowSeconds = 3): boolean {
  const now = Date.now();
  const entries = (burstStore.get(ip) ?? []).filter((t) => now - t < windowSeconds * 1000);

  if (entries.length >= maxRequests) {
    burstStore.set(ip, entries);
    return false;
  }

  entries.push(now);
  burstStore.set(ip, entries);
  return true;
}

/** Daily message cap per IP — protects an AI API budget from abuse. */
export function checkDailyLimit(ip: string, namespace: string, limit: number): boolean {
  const key = `${namespace}:${ip}`;
  const day = today();
  const record = dailyStore.get(key);

  if (!record || record.day !== day) {
    dailyStore.set(key, { count: 1, day });
    return true;
  }

  if (record.count >= limit) return false;

  record.count += 1;
  return true;
}

/** Hard server-side filter for off-topic "write me code" style requests. */
export function isOfftopicCodeRequest(message: string): boolean {
  const patterns = [
    /\b(write|create|build|make)\s+(me\s+)?(a\s+)?(python|javascript|java|c\+\+|c#|php|html|css|sql|bash|code|script|program|programm?e|function|algorithm|app|application|calculator|website|bot|game)\b/i,
    /напиши(те)?\s+(мне\s+)?(код|скрипт|программу|функцию|алгоритм|калькулятор|бота|сайт|игру|приложение)/iu,
    /\b(python|javascript|typescript|c\+\+|c#|java|php|swift|kotlin|golang)\s+(code|script|program|программ)/i,
    /```/,
  ];
  return patterns.some((p) => p.test(message));
}
