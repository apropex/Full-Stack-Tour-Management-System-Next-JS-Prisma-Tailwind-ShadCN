//

import { envChecker } from "@/utils/env-checker";

interface EnvConfig {
  DATABASE_URL: string;

  BCRYPT_SALT_ROUND: number;

  NEXT_AUTH_SECRET: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;

  SENTRY_DSN: string;

  RESEND: {
    API_KEY: string;
    FROM: string;
  };

  REDIS: {
    REDIS_USERNAME: string;
    REDIS_PASS: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
  };
}

// === 1. Raw env values ===
const rawEnv = {
  DATABASE_URL: process.env.DATABASE_URL,

  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,

  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  SENTRY_DSN: process.env.SENTRY_DSN,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,

  REDIS: {
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASS: process.env.REDIS_PASS,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
  },
} as const;

// === 2. Validate at runtime (only once) ===
let isValidated = false;
export function validateEnv() {
  if (isValidated) return;
  envChecker(rawEnv);
  isValidated = true;
}

// === 3. Export type-safe, validated config ===
export const ENV = (() => {
  validateEnv();

  return {
    DATABASE_URL: process.env.DATABASE_URL!,

    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND!),

    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET!,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

    SENTRY_DSN: process.env.SENTRY_DSN!,

    RESEND: {
      API_KEY: process.env.RESEND_API_KEY!,
      FROM: process.env.RESEND_FROM_EMAIL!,
    },

    REDIS: {
      REDIS_USERNAME: process.env.REDIS_USERNAME!,
      REDIS_PASS: process.env.REDIS_PASS!,
      REDIS_HOST: process.env.REDIS_HOST!,
      REDIS_PORT: Number(process.env.REDIS_PORT!),
    },
  } as Readonly<EnvConfig>;
})();

export const isProd = process.env.NODE_ENV === "production";
