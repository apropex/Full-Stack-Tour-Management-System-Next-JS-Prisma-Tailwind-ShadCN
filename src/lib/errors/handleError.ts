/* eslint-disable @typescript-eslint/no-explicit-any */

// lib/errors/handleError.ts

import { isProd } from "@/lib/config/env";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { AppError } from "./AppError";
import { logError } from "./logger";

type ErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    context?: Record<string, any>;
  };
  stack?: string;
};

export function handleError(err: unknown): NextResponse<ErrorResponse> {
  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";
  let context: Record<string, any> | undefined;

  // 1. Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    context = err.context;
  }

  // 2. Prisma Known Request Error
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate entry";
        code = "PRISMA_UNIQUE_VIOLATION";
        context = { target: (err.meta as any)?.target };
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        code = "PRISMA_NOT_FOUND";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        code = "PRISMA_FOREIGN_KEY";
        break;
      default:
        statusCode = 500;
        message = "Database error";
        code = `PRISMA_${err.code}`;
    }
  }

  // 3. Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid query parameters";
    code = "PRISMA_VALIDATION_ERROR";
  }

  // 4. Zod Validation Error
  else if (err instanceof Error && err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    code = "ZOD_VALIDATION_ERROR";
    try {
      const issues = JSON.parse(err.message);
      context = {
        issues: issues.map((i: any) => ({ path: i.path, message: i.message })),
      };
    } catch {
      context = { raw: err.message };
    }
  }

  // 5. Generic Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message || "Something went wrong";
    code = "UNHANDLED_ERROR";
  }

  // === LOGGING (Always in dev, conditionally in prod) ===
  if (!isProd) {
    logError(err, { statusCode, code, path: "unknown" });
  } else {
    // In prod: log only operational errors + critical
    if (err instanceof AppError && err.isOperational) {
      logError(err, { statusCode, code });
    } else {
      logError(err, { statusCode, code }, true); // critical
    }
  }

  // === RESPONSE ===
  const response: ErrorResponse = {
    success: false,
    message,
    error: { code, ...(context && { context }) },
  };

  if (!isProd) {
    response.stack = err instanceof Error ? err.stack : undefined;
  }

  return NextResponse.json(response, { status: statusCode });
}
