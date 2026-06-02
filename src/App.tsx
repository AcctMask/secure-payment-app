import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

import Index from "@/pages/Index";
import PitchDeck from "@/pages/PitchDeck";
import SignIn from "@/pages/SignIn";
import BecomeMember from "@/pages/BecomeMember";
import MemberDashboard from "@/pages/MemberDashboard";
import FundingCards from "@/pages/member/FundingCards";
import Terms from "@/pages/Terms";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/become-member" element={<BecomeMember />} />
        <Route path="/terms" element={<Terms />} />

        {/* Member */}
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/funding-cards" element={<FundingCards />} />

        {/* Back-compat redirects */}
        <Route path="/member-dashboard" element={<Navigate to="/member" replace />} />
        <Route path="/dashboard" element={<Navigate to="/member" replace />} />
        <Route path="/funding-source" element={<Navigate to="/member/funding-cards" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
