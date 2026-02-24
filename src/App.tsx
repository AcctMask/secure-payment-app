import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";

import Index from "./pages/Index";
import PitchDeck from "./pages/PitchDeck";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import MemberDashboard from "./pages/MemberDashboard";

// Funding Cards page
import FundingCardsPage from "./pages/member/FundingCards";

// If you have these pages, keep them. If build fails saying a file is missing,
// tell me the exact error line and I’ll adjust.
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import CheckoutSuccessPage from "./pages/CheckoutSuccess";
import Success from "./pages/Success";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/funding" element={<FundingCardsPage />} />

        {/* Optional existing routes */}
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
        <Route path="/success" element={<Success />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
