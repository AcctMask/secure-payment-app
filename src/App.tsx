import { Routes, Route } from "react-router-dom";

import AppLayout from "@/components/AppLayout";

import Index from "@/pages/Index";
import PitchDeck from "@/pages/PitchDeck";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

import MemberDashboard from "@/pages/MemberDashboard";
import FundingCardsPage from "@/pages/member/FundingCards";

import SignIn from "@/pages/SignIn";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/sign-in" element={<SignIn />} />

        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/funding" element={<FundingCardsPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
