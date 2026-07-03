import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthSession, AuthUser } from "./types";
import { readStoredSession, storeSession, clearStoredSession, readProfileOverride, storeProfileOverride } from "./storage";
import { fetchCurrentUser } from "./api";

interface AuthContextType {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (session: AuthSession) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  login: () => {},
  updateUser: () => {},
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
        const refreshed = {
          token: stored.token,
          user: {
            ...user,
            ...readProfileOverride(user.id),
          },
        };
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

  const handleUpdateUser = useCallback((updates: Partial<AuthUser>) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const updatedSession = {
        ...currentSession,
        user: {
          ...currentSession.user,
          ...updates,
        },
      };

      storeProfileOverride(currentSession.user.id, updates);
      storeSession(updatedSession);
      return updatedSession;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        login: handleLogin,
        updateUser: handleUpdateUser,
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
