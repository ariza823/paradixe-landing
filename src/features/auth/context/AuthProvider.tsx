import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient, isDemoMode, supabaseConfig } from "@core/api/supabaseClient.ts";
import { checkIsAdmin, signInWithPassword } from "../services/authService.ts";
import { AuthContext } from "./AuthContext.tsx";

const DEMO_SESSION_KEY = "paradixe:demo-admin";

function readDemoSession(): boolean {
  try {
    return sessionStorage.getItem(DEMO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => isDemoMode && readDemoSession());
  const [isLoading, setIsLoading] = useState(!isDemoMode);

  useEffect(() => {
    if (!supabaseConfig) return undefined;
    let isActive = true;
    let unsubscribe = () => {};

    void getSupabaseClient(supabaseConfig).then((client) => {
      if (!isActive) return;
      const apply = async (next: Session | null) => {
        const admin = await checkIsAdmin(client, next);
        if (!isActive) return;
        setSession(next);
        setIsAdmin(admin);
        setIsLoading(false);
      };
      void client.auth.getSession().then(({ data }) => apply(data.session));
      const { data } = client.auth.onAuthStateChange((_event, next) => {
        setTimeout(() => void apply(next), 0);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabaseConfig) return;
    await signInWithPassword(await getSupabaseClient(supabaseConfig), email, password);
  }, []);

  const enterDemo = useCallback(() => {
    try {
      sessionStorage.setItem(DEMO_SESSION_KEY, "1");
    } catch {
      return;
    } finally {
      setIsAdmin(true);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (supabaseConfig) {
      await (await getSupabaseClient(supabaseConfig)).auth.signOut();
      return;
    }
    try {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
    } finally {
      setIsAdmin(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      email: session?.user.email ?? null,
      isAdmin,
      isLoading,
      isDemo: isDemoMode,
      signIn,
      enterDemo,
      signOut,
    }),
    [session, isAdmin, isLoading, signIn, enterDemo, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
