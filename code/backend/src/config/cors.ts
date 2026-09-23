import { CorsOptions } from "cors";

const DEFAULT_FRONTEND_URLS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

export function getAllowedOrigins(): string[] {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URLS,
  ]
    .filter(Boolean)
    .join(",");

  const origins = configuredOrigins
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_FRONTEND_URLS, ...origins]));
}

export function isOriginAllowed(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  const allowed = getAllowedOrigins();
  const normalized = normalizeOrigin(origin);

  // Match wildcard or exact values
  if (allowed.includes("*") || allowed.includes(normalized)) {
    return true;
  }

  // Support Vercel app subdomains and custom deployments dynamically
  if (normalized.endsWith(".vercel.app") || normalized.includes("vercel")) {
    return true;
  }

  return false;
}

export function getCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false); // Decline CORS without throwing a 500 server crash
      }
    },
    credentials: true,
  };
}
