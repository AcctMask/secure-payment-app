// APP VERSION 4.0.0 - NO SYSTEM READINESS CHECK
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useEnvReloader } from "@/hooks/useEnvReloader";
import Index from "./pages/Index";
import PitchDeck from "./pages/PitchDeck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => {
  // Enable automatic environment variable reloading in development
  useEnvReloader();

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pitch" element={<PitchDeck />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};


export default App;
