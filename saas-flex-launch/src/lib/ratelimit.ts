import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL ?? "";
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? "";
const hasUpstash =
  upstashUrl.startsWith("https://") &&
  !upstashUrl.includes("xxx") &&
  upstashToken.length > 10;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

function createLimiter(requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  if (!redis) {
    return {
      limit: async () => ({ success: true, limit: requests, remaining: requests, reset: 0 }),
    };
  }
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "flex_launch",
  });
}

export const ratelimits = {
  auth: createLimiter(5, "1 m"),
  generate: createLimiter(10, "1 m"),
  api: createLimiter(60, "1 m"),
  webhook: createLimiter(100, "1 m"),
};

export async function checkRateLimit(
  bucket: keyof typeof ratelimits,
  identifier: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const result = await ratelimits[bucket].limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
