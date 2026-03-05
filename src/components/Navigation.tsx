import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

function classNames(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function Navigation() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const signedIn = !!session?.user?.id;

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

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-white font-semibold tracking-tight">PashLoc</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              classNames(
                "rounded-md px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10",
                isActive && "bg-white/10 text-white"
              )
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pitch-deck"
            className={({ isActive }) =>
              classNames(
                "rounded-md px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10",
                isActive && "bg-white/10 text-white"
              )
            }
          >
            Pitch Deck
          </NavLink>

          {signedIn && (
            <>
              <NavLink
                to="/member"
                className={({ isActive }) =>
                  classNames(
                    "rounded-md px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10",
                    isActive && "bg-white/10 text-white"
                  )
                }
              >
                Member Dashboard
              </NavLink>

              <NavLink
                to="/member/funding-cards"
                className={({ isActive }) =>
                  classNames(
                    "rounded-md px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10",
                    isActive && "bg-white/10 text-white"
                  )
                }
              >
                Funding Cards
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {signedIn ? (
            <>
              <button
                type="button"
                onClick={() => navigate("/member")}
                className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
              >
                Member Dashboard
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/sign-in")}
                className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => navigate("/become-member")}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Become a Member
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
