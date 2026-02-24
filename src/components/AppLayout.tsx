import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Render header/nav exactly once */}
      <Navigation />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
