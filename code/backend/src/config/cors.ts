import { CorsOptions } from "cors";

const DEFAULT_FRONTEND_URLS = ["http://localhost:5173", "http://localhost:5174"];

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

  return origins.length > 0 ? origins : DEFAULT_FRONTEND_URLS;
}

export function isOriginAllowed(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(normalizeOrigin(origin));
}

export function getCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  };
}
