import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
          🚀 Next-Gen Payment Security
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Protect Every Purchase with{" "}
              <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                PashLoc
              </span>{" "}
              Virtual Card System
            </h1>

            <p className="mt-6 text-lg text-white/75">
              Shield your real payment information with rotating virtual cards. Each transaction gets a unique, secure card
              number that expires after use.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/member"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white shadow hover:opacity-95"
              >
                Start Protecting Now →
              </Link>

              <Link
                to="/pitch-deck"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                ▶ Watch Demo
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 shadow-xl">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="relative grid aspect-[16/9] w-full place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-black/40 via-indigo-900/30 to-purple-900/30">
              <div className="grid place-items-center gap-4 px-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  {/* Inline SVG so it can’t 404 on Vercel */}
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
                      className="stroke-sky-300"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8.6 12.2l2.1 2.1 4.7-4.7"
                      className="stroke-purple-300"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="text-white/80 text-sm">
                  Secure, rotating virtual cards
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div className="text-xs text-white/70">
                    Fraud-resistant checkout flow
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-[0.25]">
                <div className="absolute left-10 top-10 h-10 w-10 rounded-full border border-white/20" />
                <div className="absolute right-12 top-12 h-16 w-16 rounded-full border border-white/10" />
                <div className="absolute bottom-10 left-14 h-24 w-24 rounded-full border border-white/10" />
                <div className="absolute bottom-12 right-14 h-10 w-10 rounded-full border border-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
