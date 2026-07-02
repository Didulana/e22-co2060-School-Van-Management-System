import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthSession, AuthUser, UserRole } from "./types";
import { supabase } from "../../config/supabase";

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

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
      if (supabaseSession) {
        mapSupabaseSessionToAuthSession(supabaseSession);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      if (supabaseSession) {
        mapSupabaseSessionToAuthSession(supabaseSession);
      } else {
        setSession(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseSessionToAuthSession = (supabaseSession: any) => {
    const userMetadata = supabaseSession.user.user_metadata;
    const authSession: AuthSession = {
      token: supabaseSession.access_token,
      user: {
        id: supabaseSession.user.id,
        email: supabaseSession.user.email,
        name: userMetadata?.name || "",
        role: (userMetadata?.role as UserRole) || "parent",
      },
    };
    setSession(authSession);
    setIsLoading(false);
  };

  const handleLogin = useCallback((newSession: AuthSession) => {
    setSession(newSession);
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const handleUpdateUser = useCallback(async (updates: Partial<AuthUser>) => {
    setSession((currentSession) => {
      if (!currentSession) return currentSession;
      return {
        ...currentSession,
        user: { ...currentSession.user, ...updates },
      };
    });
    // Fire-and-forget update to Supabase user metadata
    if (updates.name || updates.role) {
      await supabase.auth.updateUser({
        data: {
          name: updates.name || undefined,
          role: updates.role || undefined,
        },
      });
    }
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
