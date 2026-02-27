import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FundingSourceDetails() {
  const navigate = useNavigate();

  // TEMP STUB — backend already proved reachable
  const fundingCard = {
    brand: "Visa",
    last4: "1906",
    exp: "12 / 27",
    status: "Active",
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Funding Source</h1>
        <p className="text-muted-foreground mt-2">
          Manage your stored funding card used to back PashLoc protected cards.
        </p>
      </div>

      {/* Card Summary */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Stored Funding Card</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-400">
            {fundingCard.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Card Brand</span>
            <div>{fundingCard.brand}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Last 4 Digits</span>
            <div>•••• {fundingCard.last4}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Expiration</span>
            <div>{fundingCard.exp}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h3 className="font-medium">Funding Source Controls</h3>

          <Button variant="secondary" className="w-full">
            Pause Funding Source
          </Button>

          <Button variant="destructive" className="w-full">
            Remove Funding Source
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h3 className="font-medium">Activity</h3>

          <p className="text-sm text-muted-foreground">
            Transaction history will appear here once activity begins.
          </p>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate("/funding-source")}
          >
            Add Another Funding Source
          </Button>
        </div>
      </div>

      <Button variant="ghost" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </Button>
    </div>
  );
}
