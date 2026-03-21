import { AuthSession } from "./types";

const SESSION_STORAGE_KEY = "school-van-auth-session";

export function readStoredSession(): AuthSession | null {
  const session = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}
