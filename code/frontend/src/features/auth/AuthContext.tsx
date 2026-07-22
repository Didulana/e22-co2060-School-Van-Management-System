import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthSession, AuthUser } from "./types";
import { readStoredSession, storeSession, clearStoredSession } from "./storage";
import { fetchCurrentUser } from "./api";

interface AuthContextType {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session from localStorage
  useEffect(() => {
    async function restore() {
      const stored = readStoredSession();
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await fetchCurrentUser(stored.token);
        const refreshed = { token: stored.token, user };
        setSession(refreshed);
        storeSession(refreshed);
      } catch {
        clearStoredSession();
      } finally {
        setIsLoading(false);
      }
    }

    restore();
  }, []);

  const handleLogin = useCallback((newSession: AuthSession) => {
    setSession(newSession);
    storeSession(newSession);
  }, []);

  const handleLogout = useCallback(() => {
    setSession(null);
    clearStoredSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
