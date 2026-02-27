import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const email = session?.user?.email ?? "";

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  const linkBase =
    "rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition";

  const activeClass = "text-white bg-white/10";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-white font-semibold">PashLoc</div>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) => cn(linkBase, isActive && activeClass)}
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/pitch-deck"
              className={({ isActive }) => cn(linkBase, isActive && activeClass)}
            >
              Pitch Deck
            </NavLink>

            {session ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => cn(linkBase, isActive && activeClass)}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/funding-source"
                  className={({ isActive }) => cn(linkBase, isActive && activeClass)}
                >
                  Funding Source
                </NavLink>

                <NavLink
                  to="/member/pashloc-cards"
                  className={({ isActive }) => cn(linkBase, isActive && activeClass)}
                >
                  PashLoc Protected Cards
                </NavLink>
              </>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="hidden sm:block text-xs text-white/60">{email}</div>

              <button
                onClick={signOut}
                className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/sign-in")}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15 transition"
            >
              Sign In / Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
