import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark, ShieldAlert, KeyRound, Network, TrendingUp, Building2, ArrowRight } from "lucide-react";

type InvestorDemoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContact?: () => void;
};

const slides = [
  {
    icon: ShieldAlert,
    title: "The legacy weakness is credential reuse.",
    body:
      "Card networks, issuers, merchants, and fraud systems have improved dramatically, but most consumer payment credentials are still reusable after exposure.",
  },
  {
    icon: KeyRound,
    title: "PashLoc changes the credential lifecycle.",
    body:
      "PashLoc is designed around transaction-specific virtual credentials that reduce replay value and limit the usefulness of compromised payment data.",
  },
  {
    icon: Network,
    title: "This is not just fraud detection.",
    body:
      "Most fraud tools respond after risk appears. PashLoc is designed to reduce the reusable attack surface before exposed credentials can become long-term liabilities.",
  },
  {
    icon: Landmark,
    title: "Strategic fit for banks and issuing partners.",
    body:
      "The model supports a safer consumer payment experience while aligning with issuer priorities around fraud reduction, digital card controls, and customer trust.",
  },
  {
    icon: TrendingUp,
    title: "Large upside, controlled rollout.",
    body:
      "PashLoc can begin as a focused consumer protection product and mature into broader infrastructure for safer online commerce, subscriptions, travel, and high-risk purchase categories.",
  },
  {
    icon: Building2,
    title: "Built for partnership, not disruption for disruption’s sake.",
    body:
      "The goal is to work with established issuing, banking, and network partners to bring transaction-specific protection to market responsibly.",
  },
  {
    icon: ArrowRight,
    title: "PashLoc is a new security layer for payments.",
    body:
      "The investment opportunity is a payment-security model focused on eliminating the continued usefulness of exposed credentials.",
  },
];

export default function InvestorDemoModal({
  open,
  onOpenChange,
  onContact,
}: InvestorDemoModalProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;
  const isLast = index === slides.length - 1;

  const goNext = () => {
    if (isLast) {
      onContact?.();
      onOpenChange(false);
      setIndex(0);
      return;
    }

    setIndex((current) => current + 1);
  };

  const closeModal = () => {
    onOpenChange(false);
    setIndex(0);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!nextOpen) setIndex(0);
      onOpenChange(nextOpen);
    }}>
      <DialogContent className="w-[94vw] max-w-[560px] rounded-3xl border border-violet-400/20 bg-slate-950 p-0 text-white shadow-2xl shadow-violet-950/40 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/60 px-5 py-6 sm:px-8 sm:py-8">
          <DialogHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              Investor / Partner Demo
            </p>

            <DialogTitle className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              PashLoc as payment-security infrastructure
            </DialogTitle>

            <p className="mt-2 text-sm text-slate-300">
              Step {index + 1} of {slides.length}
            </p>
          </DialogHeader>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
              <Icon className="h-7 w-7" />
            </div>

            <h3 className="text-2xl font-semibold leading-tight text-white">
              {slide.title}
            </h3>

            <p className="mt-4 text-base leading-7 text-slate-300">
              {slide.body}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {slides.map((_, dotIndex) => (
              <div
                key={dotIndex}
                className={`h-1.5 flex-1 rounded-full ${
                  dotIndex <= index ? "bg-violet-300" : "bg-white/15"
                }`}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                className="text-slate-300 hover:bg-white/10 hover:text-white"
              >
                Skip
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={index === 0}
                onClick={() => setIndex((current) => Math.max(0, current - 1))}
                className="text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                Back
              </Button>
            </div>

            <Button
              type="button"
              onClick={goNext}
              className="w-full rounded-full bg-violet-300 px-6 py-6 font-semibold text-slate-950 hover:bg-violet-200 sm:w-auto"
            >
              {isLast ? "Discuss Partnership" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
