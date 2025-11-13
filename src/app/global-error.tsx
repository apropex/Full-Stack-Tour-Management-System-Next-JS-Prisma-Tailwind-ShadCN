"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isProd } from "@/lib/config/env";
import { captureException } from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

export default function GlobalError({ error }: GlobalErrorProps) {
  const router = useRouter();

  // === 1️⃣ LOG THE ERROR ===
  useEffect(() => {
    console.error("🔥 GLOBAL ERROR:", error);

    try {
      if (error.digest) {
        captureException(error, { tags: { digest: error.digest } });
      } else {
        captureException(error);
      }

      // optional API logging
      fetch("/api/log-critical-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {}
  }, [error]);

  // === 2️⃣ AUTO REDIRECT ===
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  // === 3️⃣ COUNTDOWN ===
  useEffect(() => {
    let count = 10;
    const el = document.getElementById("countdown");
    const interval = setInterval(() => {
      count--;
      if (el) el.textContent = String(count);
      if (count <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-linear-to-br from-red-50 to-orange-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-4xl font-bold text-red-600 dark:text-red-400">
                500
              </CardTitle>
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mt-2">
                Something went wrong
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We&apos;ve been notified and are working on it.
              </p>
            </CardHeader>

            <CardContent className="text-center mt-2 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push("/")} variant="default">
                  Go Home
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Reload Page
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Redirecting to home in{" "}
                <span id="countdown" className="font-semibold">
                  10
                </span>{" "}
                seconds...
              </p>

              {!isProd && (
                <details className="mt-4 bg-muted p-3 rounded-md text-left text-xs">
                  <summary className="cursor-pointer text-gray-600 dark:text-gray-300 font-mono">
                    Debug Info
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto text-gray-700 dark:text-gray-300">
                    {JSON.stringify(
                      {
                        message: error.message,
                        digest: error.digest,
                        stack: error.stack?.split("\n").slice(0, 5).join("\n"),
                      },
                      null,
                      2,
                    )}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </body>
    </html>
  );
}
