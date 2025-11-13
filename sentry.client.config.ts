// sentry.client.config.ts //* root path
import * as Sentry from "@sentry/nextjs";
import "dotenv/config";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  // Optional: Hide source maps in prod
  enabled: process.env.NODE_ENV !== "development",
});
