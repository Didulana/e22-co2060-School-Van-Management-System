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
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = window.localStorage.getItem("school-van-auth-session");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  // If we already have a session in localStorage, we can skip the loading screen!
  const [isLoading, setIsLoading] = useState(() => {
    return !window.localStorage.getItem("school-van-auth-session");
  });

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
      if (!mounted) return;

      if (supabaseSession) {
        mapSupabaseSessionToAuthSession(supabaseSession);
      } else {
        setSession(null);
        window.localStorage.removeItem("school-van-auth-session");
        setIsLoading(false);
      }

      // 2. Listen for auth changes ONLY after getSession completes
      const {
        data: { subscription: authSub },
      } = supabase.auth.onAuthStateChange((event, latestSession) => {
        if (!mounted) return;
        if (event === "INITIAL_SESSION") return; // Let getSession handle it

        if (latestSession) {
          mapSupabaseSessionToAuthSession(latestSession);
        } else {
          setSession(null);
          window.localStorage.removeItem("school-van-auth-session");
          setIsLoading(false);
        }
      });

      subscription = authSub;
    });

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
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
    window.localStorage.setItem("school-van-auth-session", JSON.stringify(authSession));
    setIsLoading(false);
  };

  const handleLogin = useCallback((newSession: AuthSession) => {
    setSession(newSession);
    window.localStorage.setItem("school-van-auth-session", JSON.stringify(newSession));
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    window.localStorage.removeItem("school-van-auth-session");
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
