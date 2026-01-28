import { Footer } from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useEnvReloader } from "@/hooks/useEnvReloader";
import Checkout from "@/components/Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { AppProvider } from "@/contexts/AppContext";

import Index from "./pages/Index";
import PitchDeck from "./pages/PitchDeck";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/checkout/CheckoutCancel";
import MemberDashboard from "./pages/MemberDashboard";
import FundingCardsPage from "./pages/member/FundingCards";

const queryClient = new QueryClient();

const App = () => {
  useEnvReloader();

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <AppProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
                <div className="flex-1">
                  <Elements stripe={stripePromise}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/pitch" element={<PitchDeck />} />
                      <Route path="/privacy" element={<Privacy />} />

                      <Route path="/checkout/success" element={<CheckoutSuccess />} />
                      <Route path="/checkout/cancel" element={<CheckoutCancel />} />
                      <Route path="/checkout" element={<Checkout />} />

                      <Route path="/member" element={<MemberDashboard />} />
                      <Route path="/member/funding" element={<FundingCardsPage />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Elements>
                </div>

                <Footer />
              </div>
            </BrowserRouter>
          </AppProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
