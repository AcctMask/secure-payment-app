import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

// Public pages
import Home from "@/pages/Index";
import PitchDeck from "@/pages/PitchDeck";
import SignIn from "@/pages/SignIn";
import Privacy from "@/pages/Privacy";

// Member pages
import MemberDashboard from "@/pages/MemberDashboard";
import FundingSource from "@/pages/FundingSource";
import FundingSourceDetails from "@/pages/FundingSourceDetails";
import PashLocCards from "@/pages/member/PashLocCards";
import FundingCards from "@/pages/member/FundingCards";
import FundingSourceManage from "@/pages/FundingSourceManage";

// Other pages
import SystemReadiness from "@/pages/SystemReadiness";
import Success from "@/pages/Success";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import CheckoutCancel from "@/pages/checkout/CheckoutCancel";

// 404
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Member */}
        <Route path="/dashboard" element={<MemberDashboard />} />

        {/* Funding */}
        <Route path="/funding-source" element={<FundingSource />} />
        <Route
          path="/funding-source/details"
          element={<FundingSourceDetails />}
        />

        {/* Cards */}
        <Route path="/member/pashloc-cards" element={<PashLocCards />} />
        <Route path="/member/funding-cards" element={<FundingCards />} />

        {/* System / Misc */}
        <Route path="/system-readiness" element={<SystemReadiness />} />
        <Route path="/success" element={<Success />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/funding-source/manage" element={<FundingSourceManage />} />

        {/* Safety redirect */}
        <Route path="/member" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
