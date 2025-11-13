/* eslint-disable @typescript-eslint/no-explicit-any */

// lib/errors/logger.ts

import { isProd } from "@/lib/config/env";
import * as Sentry from "@sentry/nextjs";
import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// === 1. LOG DIRECTORY SETUP ===
const logDir = path.resolve(process.cwd(), "logs");

// Auto-create logs directory only in production + non-Vercel
if (isProd && !process.env.VERCEL && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`Created log directory: ${logDir}`);
}

// === 2. WINSTON TRANSPORTS ===
const transports: winston.transport[] = [
  // Always: Console (colorized in dev)
  new winston.transports.Console({
    format: winston.format.combine(
      isProd ? winston.format.uncolorize() : winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
];

// === 3. FILE LOGS: Only in production + non-Vercel ===
if (isProd && !process.env.VERCEL) {
  transports.push(
    // All logs (rotated daily)
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

    // Error-only logs
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

// === 4. WINSTON LOGGER ===
const logger = winston.createLogger({
  level: isProd ? "error" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
  // Uncaught exceptions & promise rejections
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

// === 5. EXPORT LOG FUNCTIONS ===
export function logError(
  error: unknown,
  meta: Record<string, any> = {},
  isCritical = false,
) {
  const level = isCritical ? "error" : "warn";

  const logData = {
    error:
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error,
    ...meta,
    timestamp: new Date().toISOString(),
    environment: isProd ? "production" : "development",
    platform: process.env.VERCEL ? "vercel" : "self-hosted",
  };

  // Log to Winston (file + console)
  logger.log(level, "API Error", logData);

  // Send to Sentry (only critical + production)
  if (isCritical && error instanceof Error && isProd) {
    Sentry.captureException(error, {
      tags: { ...meta, environment: logData.environment },
      level: "error",
    });
  }
}

// Optional: General info/debug logging
export const logInfo = (message: string, meta: Record<string, any> = {}) => {
  logger.info(message, { ...meta, timestamp: new Date().toISOString() });
};

export const logDebug = (message: string, meta: Record<string, any> = {}) => {
  if (!isProd) {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  }
};
