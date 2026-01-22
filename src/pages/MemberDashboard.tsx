import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatMemberSince(dateLike?: string) {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const MemberDashboard: React.FC = () => {
  const { memberData } = useAppContext();

  const displayName = useMemo(() => {
    if (!memberData) return "Member";
    const fn = (memberData as any).firstName ?? "";
    const ln = (memberData as any).lastName ?? "";
    const joined = `${fn} ${ln}`.trim();
    return joined || memberData.email || "Member";
  }, [memberData]);

  const memberSince = useMemo(() => {
    const activated = (memberData as any)?.activated_at || (memberData as any)?.joinDate || null;
    return formatMemberSince(activated ?? undefined);
  }, [memberData]);

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            PashLoc Member Dashboard
          </h1>
          <p className="text-white/70 mt-2">
            Welcome, <span className="text-white font-medium">{displayName}</span>
            {memberData?.email ? (
              <>
                {" "}• <span className="text-white/70">{memberData.email}</span>
              </>
            ) : null}
          </p>
          <p className="text-sm text-white/60 mt-1">
            Member since: <span className="text-white/80">{memberSince}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/member/funding">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Add Funding Card
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm uppercase text-white/60">Membership</h3>
            <p className="text-xl font-medium mt-2 text-green-300">
              {memberData ? "Active" : "Not Verified"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm uppercase text-white/60">Funding Cards</h3>
            <p className="text-xl font-medium mt-2">
              Manage in Funding Cards
            </p>
            <p className="text-sm text-white/60 mt-2">
              Add / set default payment methods.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-6">
            <h3 className="text-sm uppercase text-white/60">Virtual Cards</h3>
            <p className="text-xl font-medium mt-2">
              Coming next
            </p>
            <p className="text-sm text-white/60 mt-2">
              Issue your first controlled virtual card after funding is set.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next steps */}
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-lg font-medium">Next Step</h2>
          <p className="text-sm text-white/70">
            Add a funding card (stored securely by Stripe) so we can issue your first PashLoc virtual card.
          </p>
          <Link to="/member/funding">
            <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
              Go to Funding Cards
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
