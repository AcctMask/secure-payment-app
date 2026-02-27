import { useNavigate } from "react-router-dom";
import { CreditCard, PauseCircle, Trash2, Plus, History } from "lucide-react";

export default function FundingSourceManage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-2">Manage Funding Source</h1>
      <p className="text-muted-foreground mb-8">
        View and manage your saved funding cards. These cards fund your PashLoc
        protected virtual cards.
      </p>

      {/* Saved Card */}
      <div className="rounded-xl border bg-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Visa •••• 1906</p>
              <p className="text-sm text-muted-foreground">
                Active funding source
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
            <History className="h-4 w-4" />
            Transaction History
          </button>

          <button className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent">
            <PauseCircle className="h-4 w-4" />
            Pause Card
          </button>

          <button className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent text-destructive">
            <Trash2 className="h-4 w-4" />
            Remove Card
          </button>

          <button
            onClick={() => navigate("/funding-source")}
            className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
            Add New Card
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md bg-secondary px-4 py-2"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => navigate("/member/pashloc-cards")}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2"
        >
          Go to PashLoc Protected Cards
        </button>
      </div>
    </div>
  );
}
