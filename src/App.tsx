import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import Navigation from "./components/Navigation";

// Pages
import Home from "./pages/Index";
import PitchDeck from "./pages/PitchDeck";
import Privacy from "./pages/Privacy";
import MemberDashboard from "./pages/MemberDashboard";
import FundingCardsPage from "./pages/member/FundingCards";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Navigation />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Member */}
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/funding" element={<FundingCardsPage />} />

        {/* Checkout */}
        <Route path="/checkout/success" element={<CheckoutSuccess />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </Router>
  );
}
