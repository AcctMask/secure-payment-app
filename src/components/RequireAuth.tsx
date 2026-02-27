import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { session, authReady } = useAppContext();

  // Wait until we have definitively checked for a session
  if (!authReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-white/80">Loading…</div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
