import React from "react";
import { Link } from "react-router-dom";
import { Shield, CreditCard } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export default function MemberDashboard() {
  const { memberData, session } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <h1 className="text-3xl font-semibold tracking-tight">PashLoc Member Dashboard</h1>

          <p className="mt-2 text-white/75">
            {session
              ? "You’re signed in. Manage your Funding Source now, and PashLoc Cards will activate when Issuing is enabled."
              : "Please sign in to access membership features."}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-2 text-white/90">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm font-medium">Funding Source</span>
              </div>

              <p className="mt-2 text-sm text-white/75">
                Store and manage the card used as your underlying funding method. This is separate from PashLoc Cards.
              </p>

              <div className="mt-4">
                <Link
                  to="/member/funding"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-95"
                >
                  Manage Funding Source
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">PashLoc Cards</span>
              </div>

              <p className="mt-2 text-sm text-white/75">
                Rotating virtual cards (Issuing). These will be used at merchants once Issuing authority + transaction flow is enabled.
              </p>

              <div className="mt-4">
                <Link
                  to="/member/pashloc"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                >
                  View PashLoc Cards
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm text-white/80">
              <b>Membership:</b>{" "}
              {memberData?.membershipActive ? (
                <span className="text-emerald-300">Active</span>
              ) : (
                <span className="text-yellow-300">Not confirmed</span>
              )}
              {memberData?.membershipType ? (
                <span className="text-white/70"> • {memberData.membershipType}</span>
              ) : null}
            </div>

            <div className="mt-2 text-xs text-white/50">
              Funding Source = stored payment method (SetupIntent). PashLoc Cards = Issuing virtual cards. Keeping these separate prevents Stripe config conflicts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
