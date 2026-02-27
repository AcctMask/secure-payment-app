import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type MemberData = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  memberId?: string | null;
  memberSince?: string | null;
  [key: string]: any;
};

type AppContextValue = {
  session: Session | null;
  authReady: boolean;
  memberData: MemberData | null;
  setMemberData: React.Dispatch<React.SetStateAction<MemberData | null>>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [memberData, setMemberData] = useState<MemberData | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setAuthReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setAuthReady(true);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ session, authReady, memberData, setMemberData }),
    [session, authReady, memberData]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within <AppProvider />");
  return ctx;
}
