// Rate limiting for the AI widget and lead form.
//
// Storage backend:
// - If REDIS_URL is set, limits are stored in Redis (ioredis) so they are
//   shared correctly across multiple Node instances/processes and survive
//   restarts/deploys.
// - If REDIS_URL is not set, falls back to an in-memory Map — fine for a
//   single-instance deploy (e.g. one VPS process), but each instance/restart
//   gets its own counters. This fallback exists so the app still runs
//   without extra infra, not as a recommended production setup once you
//   scale past one process.
//
// Public function signatures are async so callers don't need to change
// again if the backend changes later.

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

// -----------------------------------------------------------------------
// Optional Redis backend
// -----------------------------------------------------------------------

type RedisLike = {
  multi: () => {
    zremrangebyscore: (key: string, min: number | string, max: number | string) => unknown;
    zadd: (key: string, score: number, member: string) => unknown;
    zcard: (key: string) => unknown;
    expire: (key: string, seconds: number) => unknown;
    exec: () => Promise<Array<[Error | null, unknown]> | null>;
  };
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<unknown>;
};

let redisClientPromise: Promise<RedisLike | null> | null = null;

/**
 * Lazily connects to Redis if REDIS_URL is configured. `ioredis` is an
 * optional dependency — if it isn't installed, or the connection fails,
 * this resolves to null and callers fall back to the in-memory store.
 * Wrapped so a missing/failed dependency never crashes the request path.
 */
async function getRedisClient(): Promise<RedisLike | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!redisClientPromise) {
    redisClientPromise = (async () => {
      try {
        // Dynamic import: no hard dependency on ioredis unless REDIS_URL is set.
        // Run `npm install ioredis` before setting REDIS_URL in production.
        const mod = await import("ioredis").catch(() => null);
        if (!mod) {
          console.warn(
            "[rate-limit] REDIS_URL is set but the 'ioredis' package is not installed. " +
              "Run `npm install ioredis` to enable shared rate limiting. Falling back to in-memory limits.",
          );
          return null;
        }
        const RedisCtor = (mod as { default?: unknown }).default ?? mod;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = new (RedisCtor as any)(url, { lazyConnect: true, maxRetriesPerRequest: 1 });
        await client.connect();
        client.on("error", (err: Error) => {
          console.error("[rate-limit] Redis error:", err.message);
        });
        return client as RedisLike;
      } catch (err) {
        console.error("[rate-limit] Failed to connect to Redis, falling back to in-memory limits:", err);
        return null;
      }
    })();
  }

  return redisClientPromise;
}

// -----------------------------------------------------------------------
// Burst limiter: blocks real flood (bots), never a normal fast typer.
// -----------------------------------------------------------------------

async function checkBurstLimitRedis(
  redis: RedisLike,
  ip: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  const key = `ratelimit:burst:${ip}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const member = `${now}-${Math.random().toString(36).slice(2, 8)}`;

  const tx = redis.multi();
  tx.zremrangebyscore(key, 0, windowStart);
  tx.zadd(key, now, member);
  tx.zcard(key);
  tx.expire(key, windowSeconds + 1);
  const results = await tx.exec();

  const countResult = results?.[2]?.[1];
  const count = typeof countResult === "number" ? countResult : 0;
  return count <= maxRequests;
}

function checkBurstLimitMemory(ip: string, maxRequests: number, windowSeconds: number): boolean {
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

export async function checkBurstLimit(ip: string, maxRequests = 5, windowSeconds = 3): Promise<boolean> {
  const redis = await getRedisClient();
  if (redis) {
    try {
      return await checkBurstLimitRedis(redis, ip, maxRequests, windowSeconds);
    } catch (err) {
      console.error("[rate-limit] Redis burst check failed, falling back to in-memory:", err);
    }
  }
  return checkBurstLimitMemory(ip, maxRequests, windowSeconds);
}

// -----------------------------------------------------------------------
// Daily message cap per IP — protects an AI API budget from abuse.
// -----------------------------------------------------------------------

async function checkDailyLimitRedis(
  redis: RedisLike,
  ip: string,
  namespace: string,
  limit: number,
): Promise<boolean> {
  const key = `ratelimit:daily:${namespace}:${today()}:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    // First hit today for this key — TTL a bit past 24h so clock skew
    // between servers doesn't cut the window short.
    await redis.expire(key, 25 * 60 * 60);
  }
  return count <= limit;
}

function checkDailyLimitMemory(ip: string, namespace: string, limit: number): boolean {
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

export async function checkDailyLimit(ip: string, namespace: string, limit: number): Promise<boolean> {
  const redis = await getRedisClient();
  if (redis) {
    try {
      return await checkDailyLimitRedis(redis, ip, namespace, limit);
    } catch (err) {
      console.error("[rate-limit] Redis daily check failed, falling back to in-memory:", err);
    }
  }
  return checkDailyLimitMemory(ip, namespace, limit);
}

// -----------------------------------------------------------------------
// Off-topic filter
// -----------------------------------------------------------------------

/**
 * Soft, best-effort filter for obvious off-topic "write me code" style
 * requests. This is NOT a security boundary — it's trivially bypassed by
 * rephrasing, typos, or another language. The real defense against
 * jailbreaks/prompt injection is the system prompt's explicit restrictions
 * (see app/api/ai-chat/route.ts) plus, ideally, output-side moderation;
 * this filter only trims the cheapest, most obvious abuse before it
 * reaches the model and burns API budget.
 */
export function isOfftopicCodeRequest(message: string): boolean {
  const patterns = [
    /\b(write|create|build|make)\s+(me\s+)?(a\s+)?(python|javascript|java|c\+\+|c#|php|html|css|sql|bash|code|script|program|programm?e|function|algorithm|app|application|calculator|website|bot|game)\b/i,
    /напиши(те)?\s+(мне\s+)?(код|скрипт|программу|функцию|алгоритм|калькулятор|бота|сайт|игру|приложение)/iu,
    /\b(python|javascript|typescript|c\+\+|c#|java|php|swift|kotlin|golang)\s+(code|script|program|программ)/i,
    /```/,
  ];
  return patterns.some((p) => p.test(message));
}

/** Test-only helper: clears in-memory stores between test runs. */
export function __resetInMemoryStoresForTests(): void {
  burstStore.clear();
  dailyStore.clear();
}
