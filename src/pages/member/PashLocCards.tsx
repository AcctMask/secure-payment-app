import React from "react";
import { Link } from "react-router-dom";
import { Shield, CreditCard } from "lucide-react";

export default function PashLocCardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-xl border border-white/10 bg-black/20 p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">PashLoc Cards</h1>
              <p className="mt-1 text-white/75">
                This is where rotating virtual cards (Issuing) will live once Issuing authority + transaction flow is enabled.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-2 text-white/90">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Status</span>
            </div>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/75">
              <li>
                <b>Funding Source</b> (stored card) is separate and managed in{" "}
                <Link to="/member/funding" className="text-sky-300 hover:underline">
                  Funding Source
                </Link>
                .
              </li>
              <li>
                <b>PashLoc Cards</b> are the rotating virtual cards used at merchants (Issuing).
              </li>
              <li>
                Checkout/payment flows will be added later only when virtual cards can be issued + used.
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/member/funding"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-95"
            >
              Manage Funding Source
            </Link>

            <Link
              to="/member"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              Back to Member Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
