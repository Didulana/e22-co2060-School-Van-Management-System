export const PORTAL_BASE_URL =
  import.meta.env.VITE_PORTAL_URL || "http://localhost:5173";

export const PORTAL_URLS = {
  base: PORTAL_BASE_URL,
  signIn: `${PORTAL_BASE_URL}/login`,
  getStarted: `${PORTAL_BASE_URL}/register`,
  parent: `${PORTAL_BASE_URL}/parent`,
  driver: `${PORTAL_BASE_URL}/driver`,
  admin: `${PORTAL_BASE_URL}/admin`,
};
