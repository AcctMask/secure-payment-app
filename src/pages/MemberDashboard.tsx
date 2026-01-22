import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { memberData } = useAppContext();
  const [issuingLoading, setIssuingLoading] = useState(false);
  const [issuingMsg, setIssuingMsg] = useState<string | null>(null);

  const email = memberData?.email ?? null;

  const memberSince = useMemo(() => {
    // If you later store a real join date, swap this out.
    return "Jan 20, 2026";
  }, []);

  const displayName = useMemo(() => {
    const first = memberData?.firstName?.trim();
    const last = memberData?.lastName?.trim();
    const full = [first, last].filter(Boolean).join(" ");
    return full || "Member";
  }, [memberData?.firstName, memberData?.lastName]);

  const issueVirtualCard = async () => {
    setIssuingMsg(null);

    if (!email) {
      setIssuingMsg("No member email found. Please complete checkout verification first.");
      return;
    }

    setIssuingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-virtual-card", {
        body: { email },
      });

      if (error) throw error;

      // We don't know your function’s exact shape, so we handle a few common patterns.
      if (data?.error) throw new Error(data.error);
      if (data?.card) {
        setIssuingMsg("✅ Virtual card created. (We’ll display it in the dashboard next.)");
      } else {
        setIssuingMsg("✅ Request sent. If Issuing is enabled, the card should be created server-side.");
      }
    } catch (e: any) {
      setIssuingMsg(
        `⚠️ Could not issue a virtual card yet: ${e?.message ?? String(e)}`
      );
    } finally {
      setIssuingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="px-6 py-10 max-w-6xl mx-auto text-white space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">PashLoc Member Dashboard</h1>
            <p className="text-white/70 mt-2">
              Welcome, <span className="text-white font-semibold">{displayName}</span> •{" "}
              <span className="text-white/80">{email ?? "—"}</span>
            </p>
            <p className="text-white/50 mt-1">Member since: {memberSince}</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => navigate("/member/funding")}>
              Add Funding Card
            </Button>
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-sm uppercase text-white/60">Membership</h3>
              <p className="text-xl font-semibold mt-2 text-green-300">Active</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-sm uppercase text-white/60">Funding Cards</h3>
              <p className="text-lg font-semibold mt-2">Manage in Funding Cards</p>
              <p className="text-sm text-white/60 mt-1">Add / set default payment methods.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-sm uppercase text-white/60">Virtual Cards</h3>
              <p className="text-lg font-semibold mt-2">Coming next</p>
              <p className="text-sm text-white/60 mt-1">Issue your first controlled virtual card after funding is set.</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Step */}
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold">Next Step</h2>
            <p className="text-sm text-white/70">
              Add a funding card (stored securely by Stripe) so we can issue your first PashLoc virtual card.
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <Button onClick={() => navigate("/member/funding")} className="md:w-56">
                Go to Funding Cards
              </Button>

              <Button
                onClick={issueVirtualCard}
                disabled={issuingLoading}
                className="md:w-56"
              >
                {issuingLoading ? "Issuing…" : "Issue Virtual Card (Try Now)"}
              </Button>
            </div>

            {issuingMsg && (
              <div className="text-sm mt-2 text-white/80 border border-white/10 bg-black/30 rounded-lg p-3">
                {issuingMsg}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
