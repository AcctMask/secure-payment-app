// src/components/Navigation.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={[
        "text-sm font-medium transition-colors",
        isActive ? "text-white" : "text-white/80 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function Navigation() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
    navigate("/");
  };

  const goToAuth = () => {
    // Single source of truth for login / membership
    navigate("/member");
  };

  return (
    <header className="w-full border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-white">
            PashLoc
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/pitch-deck">Pitch Deck</NavLink>

            {session && (
              <>
                <NavLink to="/member">Member Dashboard</NavLink>
                <NavLink to="/member/funding">Funding Cards</NavLink>
              </>
            )}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!session ? (
            <button
              onClick={goToAuth}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Sign In / Get Started
            </button>
          ) : (
            <button
              onClick={signOut}
              disabled={busy}
              className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              {busy ? "Signing out…" : "Sign Out"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navigation;
