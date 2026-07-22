const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const currentHost = typeof window !== "undefined" ? window.location.hostname : "";
const isLocalHost = ["localhost", "127.0.0.1", ""].includes(currentHost);

export const API_CONFIG_ERROR =
  import.meta.env.PROD && !configuredApiUrl && !isLocalHost
    ? "VITE_API_URL is not configured. Set it in Vercel to your Render backend URL, for example https://your-service.onrender.com."
    : "";

export function ensureApiConfigured() {
  if (API_CONFIG_ERROR) {
    throw new Error(API_CONFIG_ERROR);
  }
}

export const API_ORIGIN = (
  configuredApiUrl || "http://127.0.0.1:5001"
).replace(/\/+$/, "");

export const API_BASE_URL = `${API_ORIGIN}/api`;
