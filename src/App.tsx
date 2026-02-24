import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Index from "./pages/Index";
import PitchDeck from "./pages/PitchDeck";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import MemberDashboard from "./pages/MemberDashboard";
import FundingCardsPage from "./pages/member/FundingCards";
import Success from "./pages/Success";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import SystemReadiness from "./pages/SystemReadiness";

// IMPORTANT:
// Do NOT render <Navigation /> here.
// AppLayout renders Navigation once for all pages.
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Member area */}
        <Route path="/member" element={<Navigate to="/member/dashboard" replace />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member/funding" element={<FundingCardsPage />} />

        {/* Existing pages */}
        <Route path="/success" element={<Success />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/system-readiness" element={<SystemReadiness />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
