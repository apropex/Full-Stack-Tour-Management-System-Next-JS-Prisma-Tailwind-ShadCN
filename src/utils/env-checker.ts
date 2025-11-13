/* eslint-disable @typescript-eslint/no-explicit-any */

import { isProd } from "@/lib/config/env";
import { AppError } from "@/lib/errors/AppError";

export function envChecker<T extends Record<string, any>>(
  envConfig: T,
  parentKey = "",
): asserts envConfig is Required<T> {
  Object.entries(envConfig).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}/${key}` : key;

    if (typeof value === "object" && value !== null) {
      envChecker(value, fullKey);
      return;
    }

    if (value === undefined || value === null || value === "") {
      const errorMessage = `Environment variable "${fullKey}" is missing or empty.`;
      console.error("❌", errorMessage);
      throw new AppError(404, errorMessage, {
        code: "ENV_MISSING",
        statusCode: 500,
        context: { key: fullKey },
      });
    }

    // Validate numbers
    if (key.includes("PORT") || key.includes("ROUND")) {
      if (isNaN(Number(value))) {
        throw new AppError(500, `"${fullKey}" must be a valid number.`, {
          code: "ENV_INVALID_NUMBER",
        });
      }
    }
  });

  if (!isProd && !parentKey) {
    console.log("All required environment variables are loaded.");
  }
}
