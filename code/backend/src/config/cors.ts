const DEFAULT_FRONTEND_URL = "http://localhost:5173";

export function getAllowedOrigins(): string[] {
  return (process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
