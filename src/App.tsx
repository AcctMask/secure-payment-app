import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PitchDeck from "./pages/PitchDeck";
import MemberDashboard from "./pages/member/Dashboard";
import FundingCardsPage from "./pages/member/FundingCards";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pitch" element={<PitchDeck />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/funding" element={<FundingCardsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
