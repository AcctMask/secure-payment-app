import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
