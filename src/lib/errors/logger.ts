// src/lib/errors/logger.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { isProd } from "@/lib/config/env";
import * as Sentry from "@sentry/nextjs";
import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// === 1. LOG DIRECTORY SETUP ===
const logDir = path.resolve(process.cwd(), "logs");

if (isProd && !process.env.VERCEL && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created log directory: ${logDir}`);
}

// === 2. WINSTON TRANSPORTS ===
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      isProd ? winston.format.uncolorize() : winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
];

if (isProd && !process.env.VERCEL) {
  transports.push(
    new DailyRotateFile({
      dirname: logDir,
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),

    new DailyRotateFile({
      level: "error",
      dirname: logDir,
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

// === 3. WINSTON LOGGER ===
const loggerWinston = winston.createLogger({
  level: isProd ? "error" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
  exceptionHandlers:
    isProd && !process.env.VERCEL
      ? [
          new winston.transports.File({
            filename: path.join(logDir, "exceptions.log"),
          }),
        ]
      : [new winston.transports.Console()],
  rejectionHandlers:
    isProd && !process.env.VERCEL
      ? [
          new winston.transports.File({
            filename: path.join(logDir, "rejections.log"),
          }),
        ]
      : [new winston.transports.Console()],
});

// === 4. TYPE-DEFINITIONS ===
type LogLevel = "error" | "warn" | "info" | "debug";

interface LogInput {
  message: string;
  error?: Error | unknown;
  meta?: Record<string, any>;
}

// === 5. CORE LOG FUNCTION ===
function log(level: LogLevel, input: LogInput | string) {
  let message: string;
  let error: unknown | undefined;
  let meta: Record<string, any> = {};

  // Handle string input
  if (typeof input === "string") {
    message = input;
  } else {
    message = input.message;
    error = input.error;
    meta = input.meta || {};
  }

  // Prepare log data
  const logData: any = {
    message,
    ...meta,
    timestamp: new Date().toISOString(),
    environment: isProd ? "production" : "development",
    platform: process.env.VERCEL ? "vercel" : "self-hosted",
  };

  // Attach error details
  if (error instanceof Error) {
    logData.error = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  } else if (error !== undefined) {
    logData.error = error;
  }

  // Log to Winston
  loggerWinston.log(level, message, logData);

  // Send to Sentry (only for error + critical)
  if (level === "error" && isProd) {
    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: { ...meta, environment: logData.environment },
        level: "error",
      });
    } else {
      // Fallback: capture message as exception
      Sentry.captureMessage(message, {
        level: "error",
        tags: { ...meta, environment: logData.environment },
      });
    }
  }
}

// === 6. EXPORT LOGGER WITH OVERLOADS ===
export const logger = {
  error: (
    message: string,
    error?: Error | unknown,
    meta?: Record<string, any>,
  ) => log("error", { message, error, meta }),

  warn: (
    message: string,
    error?: Error | unknown,
    meta?: Record<string, any>,
  ) => log("warn", { message, error, meta }),

  info: (message: string, meta?: Record<string, any>) =>
    log("info", { message, meta }),

  debug: (message: string, meta?: Record<string, any>) =>
    !isProd && log("debug", { message, meta }),
} as const;

// === 7. BACKWARD COMPATIBILITY (Optional) ===
export const logError = (
  error: unknown,
  meta: Record<string, any> = {},
  isCritical = false,
) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  loggerWinston.error(message, error, { ...meta, isCritical });
};
