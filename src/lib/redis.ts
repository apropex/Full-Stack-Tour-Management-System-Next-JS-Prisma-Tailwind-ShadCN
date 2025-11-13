// src/lib/redis.ts
import { ENV, isProd } from "@/lib/config/env";
import { createClient } from "redis";
import { logger } from "./errors/logger";

// Prevent multiple instances in development (HMR)
declare global {
  var redis: ReturnType<typeof createClient> | undefined;
}

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient>;
};

// Redis URL priority: REDIS_URL > individual configs
const redisUrl = ENV.REDIS.REDIS_URL;

const redis =
  globalForRedis.redis ??
  (redisUrl
    ? createClient({ url: redisUrl })
    : createClient({
        username: ENV.REDIS.REDIS_USERNAME,
        password: ENV.REDIS.REDIS_PASS,
        socket: {
          host: ENV.REDIS.REDIS_HOST,
          port: ENV.REDIS.REDIS_PORT,
          ...(isProd && { tls: true as const }),
        },
      }));

// Only save in dev to avoid memory leak on HMR
if (!isProd) {
  globalForRedis.redis = redis;
}

// === Event Listeners ===
redis.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("ready", () => {
  logger.info("Redis ready");
});

redis.on("reconnecting", () => {
  logger.warn("Redis reconnecting...");
});

redis.on("end", () => {
  logger.warn("Redis connection closed");
});

// === Graceful Shutdown ===
process.on("SIGTERM", async () => {
  logger.info("SIGTERM: Closing Redis...");
  await redis.quit();
});

process.on("SIGINT", async () => {
  logger.info("SIGINT: Closing Redis...");
  await redis.quit();
});

// === Connect Function ===
export const connectRedis = async (): Promise<void> => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};

// Optional: Auto-connect on import (safe in serverless)
if (ENV.REDIS.AUTO_CONNECT_REDIS === "true") {
  connectRedis().catch((err) => logger.error("Redis auto-connect failed", err));
}

export default redis;
