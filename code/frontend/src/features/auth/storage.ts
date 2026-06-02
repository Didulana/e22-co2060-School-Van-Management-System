import { AuthSession, AuthUser } from "./types";

const SESSION_STORAGE_KEY = "school-van-auth-session";
const PROFILE_OVERRIDES_KEY = "school-van-profile-overrides";

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

export function readProfileOverride(userId: number): Partial<AuthUser> {
  const stored = window.localStorage.getItem(PROFILE_OVERRIDES_KEY);

  if (!stored) {
    return {};
  }

  try {
    const overrides = JSON.parse(stored) as Record<string, Partial<AuthUser>>;
    return overrides[String(userId)] || {};
  } catch {
    window.localStorage.removeItem(PROFILE_OVERRIDES_KEY);
    return {};
  }
}

export function storeProfileOverride(userId: number, updates: Partial<AuthUser>): void {
  const stored = window.localStorage.getItem(PROFILE_OVERRIDES_KEY);
  let overrides: Record<string, Partial<AuthUser>> = {};

  if (stored) {
    try {
      overrides = JSON.parse(stored) as Record<string, Partial<AuthUser>>;
    } catch {
      overrides = {};
    }
  }

  overrides[String(userId)] = {
    ...(overrides[String(userId)] || {}),
    ...updates,
  };

  window.localStorage.setItem(PROFILE_OVERRIDES_KEY, JSON.stringify(overrides));
}
