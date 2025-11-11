import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RealMembershipModal } from "./RealMembershipModal";

export const Navigation = () => {
  const navigate = useNavigate();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  
  return (
    <>
      <nav style={{ background: 'linear-gradient(90deg, #1C3F94 0%, #0F2350 50%, #1C3F94 100%)' }} className="text-white p-4 shadow-lg border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Virtual Card System</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/")} variant="ghost" className="text-white hover:bg-white/10">Home</Button>
            <Button onClick={() => setShowMembershipModal(true)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              Become a Member
            </Button>
            <Button onClick={() => navigate("/pitch")} variant="ghost" className="text-white hover:bg-white/10">View Pitch Deck</Button>
          </div>

        </div>
      </nav>
      
      <RealMembershipModal 
        isOpen={showMembershipModal} 
        onClose={() => setShowMembershipModal(false)} 
      />
    </>
  );
};

