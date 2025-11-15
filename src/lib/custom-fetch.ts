import { iResponse } from "@/interfaces";
import { ENV } from "./config/env";

type Options = Omit<RequestInit, "body"> & { body?: FormData };

/**
 *! fetchHelper Rules:
 ** - FormData must be passed in the 2nd parameter (options.body).
 ** - JSON or other raw payloads must be passed in the 3rd parameter (`data`).
 ** - If non-FormData is passed through options.body → throw error.
 ** - GET requests must never send a body; any existing body is removed.
 ** - JSON payload automatically applies "Content-Type: application/json".
 ** - FormData never sets any "Content-Type" header (browser sets boundary).
 */

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export async function fetchHelper<TResponse = unknown, TRequest = unknown>(
  api: string,
  requestInit: Options = {},
  data?: TRequest,
): Promise<iResponse<TResponse>> {
  const options = requestInit as RequestInit;

  const method = options.method?.toUpperCase() || "GET";
  const isGet = method === "GET";

  // Combine potential sources of body
  const incomingBody = options.body ?? data;
  const isForm = incomingBody instanceof FormData;

  // --- Body Handling ---
  if (!isGet && incomingBody) {
    // FormData: allowed only in options.body
    if (isForm) options.body = incomingBody as FormData;
    else {
      // JSON payload cannot be placed in options.body
      if (options.body && !(options.body instanceof FormData)) {
        throw new Error(
          "The 2nd parameter (options.body) must be FormData. For JSON/raw payload, use the 3rd parameter.",
        );
      }

      options.headers = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      };

      options.body = JSON.stringify(data);
    }
  } else delete options.body;

  // --- Server-side cookies for SSR compatibility ---
  let tokens = "";
  let baseUrl = "";
  const isServer = typeof window === "undefined";
  if (isServer) {
    baseUrl = ENV.BASE_URL || "http://localhost:3000"; // TODO: remove fallback
    const { headers } = await import("next/headers");
    tokens = (await headers()).get("cookie") ?? "";
  }

  // --- Execute request ---
  const res = await fetch(`${baseUrl}${api}`, {
    ...options,
    method,
    credentials: "include",
    headers: {
      ...(isServer && tokens ? { cookie: tokens } : {}),
      ...(options.headers || {}),
    },
  });

  // --- Error handling ---
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error ${res.status}: ${errorText} | api: ${api}`);
  }

  // --- Safe JSON parse ---
  try {
    return (await res.json()) as iResponse<TResponse>;
  } catch {
    throw new Error(`Invalid JSON in response from ${api}`);
  }
}

export const _fetch = Object.fromEntries(
  methods.map((method) => [
    method.toLowerCase(),
    async <TResponse = unknown, TRequest = unknown>(
      api: string,
      options: Options = {},
      data?: TRequest,
    ): Promise<iResponse<TResponse>> => {
      return fetchHelper<TResponse, TRequest>(
        api,
        { ...options, method },
        data,
      );
    },
  ]),
) as Record<Lowercase<(typeof methods)[number]>, typeof fetchHelper>;
