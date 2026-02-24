import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { session, signOut } = useAppContext();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white",
    ].join(" ");

  const handleSignInClick = () => {
    // Keep it dead-simple and reliable.
    navigate("/sign-in");
  };

  const handleSignOut = async () => {
    try {
      await signOut?.();
    } catch (e) {
      console.error("Sign out failed:", e);
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div
            className="cursor-pointer text-base font-semibold tracking-tight text-white"
            onClick={() => navigate("/")}
          >
            PashLoc
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>

            <NavLink to="/pitch-deck" className={linkClass}>
              Pitch Deck
            </NavLink>

            {session ? (
              <>
                <NavLink to="/member" className={linkClass}>
                  Member Dashboard
                </NavLink>

                <NavLink to="/member/funding" className={linkClass}>
                  Funding Cards
                </NavLink>
              </>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!session ? (
            <button
              type="button"
              onClick={handleSignInClick}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
            >
              Sign In / Get Started
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
