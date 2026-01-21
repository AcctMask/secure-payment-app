import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MemberDashboard: React.FC = () => {
  const { memberData } = useAppContext();

  const displayName = useMemo(() => {
    const first = memberData?.firstName?.trim() ?? "";
    const last = memberData?.lastName?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || memberData?.email || "Member";
  }, [memberData]);

  // If your edge function returns a date field (activated_at / memberSince),
  // we’ll show it. Otherwise it displays “—”.
  const memberSince = (memberData as any)?.activated_at || (memberData as any)?.memberSince || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10 text-white">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">PashLoc Member Dashboard</h1>
              <p className="text-white/70 mt-1">Secure access to your cards, purchases, and account controls.</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/60">Signed in as</div>
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-xs text-white/50 mt-1">
                Member since:{" "}
                <span className="text-white/70">
                  {memberSince ? new Date(memberSince).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-wider text-white/60">Membership Status</h3>
              <p className="text-xl font-medium mt-2 text-green-400">
                {(memberData as any)?.membershipActive === false ? "Inactive" : "Active"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-wider text-white/60">Virtual Cards</h3>
              <p className="text-xl font-medium mt-2">None issued yet</p>
              <p className="text-sm text-white/50 mt-1">Next: issue your first card once funding is saved.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xs uppercase tracking-wider text-white/60">Funding Source</h3>
              <p className="text-xl font-medium mt-2">On file (or add one)</p>
              <p className="text-sm text-white/50 mt-1">We’ll use Stripe SetupIntents to store securely.</p>
            </CardContent>
          </Card>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-2">Add / Manage Funding Cards</h2>
              <p className="text-sm text-white/60 mb-4">
                Add the payment methods that fund your PashLoc virtual cards.
              </p>

              <Button asChild className="w-full">
                <Link to="/member/funding">Manage Funding Cards</Link>
              </Button>

              <p className="text-xs text-white/40 mt-3">
                Your card is tokenized by Stripe. PashLoc does not store full PAN or CVC.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-2">Issue Your First Virtual Card</h2>
              <p className="text-sm text-white/60 mb-4">
                After a funding method is saved, we’ll generate and display your first virtual card here.
              </p>

              <Button disabled className="w-full">
                Issue Card (Coming Next)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
