import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { RealMembershipModal } from "./RealMembershipModal";
import { useAppContext } from "@/contexts/AppContext";

export const Navigation = () => {
  const navigate = useNavigate();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const { memberData } = useAppContext();

  return (
    <>
      <nav
        style={{
          background:
            "linear-gradient(90deg, #1C3F94 0%, #0F2350 50%, #1C3F94 100%)",
        }}
        className="text-white p-4 shadow-lg border-b border-gray-700"
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Virtual Card System
          </h1>

          <div className="flex gap-4 items-center">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Home
            </Button>

            {memberData && (
              <Link
                to="/member"
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white"
              >
                Member Dashboard
              </Link>
            )}

            {!memberData && (
              <Button
                onClick={() => setShowMembershipModal(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Become a Member
              </Button>
            )}

            <Button
              onClick={() => navigate("/pitch")}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              View Pitch Deck
            </Button>
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

export default Navigation;
