import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, CreditCard, Clock, Building2, ShieldCheck, ArrowRight } from "lucide-react";

type FraudStatsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const slides = [
  {
    icon: BarChart3,
    stat: "$12.5B+",
    title: "reported consumer fraud losses in 2024",
    body:
      "Americans reported more than $12.5 billion in fraud losses to the FTC in 2024. The real-world impact is bigger than a number: lost money, frozen accounts, stress, and time spent recovering.",
  },
  {
    icon: CreditCard,
    stat: "$14.32B",
    title: "in U.S.-issued card fraud losses reported for 2023",
    body:
      "Payment card fraud remains a major financial problem. For consumers, even when money is reimbursed, the disruption is real: replacement cards, updated subscriptions, declined payments, and uncertainty.",
  },
  {
    icon: Clock,
    stat: "Hours lost",
    title: "for ordinary people after card compromise",
    body:
      "Fraud is not only about the charge. It often means calling banks, replacing cards, updating saved payments, watching accounts, and waiting for disputes or reimbursements.",
  },
  {
    icon: Building2,
    stat: "$33B+",
    title: "in global card fraud losses annually",
    body:
      "Card fraud is not a small edge case. It is a global payments problem affecting consumers, merchants, banks, issuers, and payment networks.",
  },
  {
    icon: ShieldCheck,
    stat: "Less reuse",
    title: "means less value for stolen credentials",
    body:
      "PashLoc focuses on reducing the continued usefulness of exposed payment credentials. A credential designed for one transaction is far less valuable than a reusable card number.",
  },
  {
    icon: ArrowRight,
    stat: "The shift",
    title: "from fraud response to exposure reduction",
    body:
      "Most systems detect fraud after risk appears. PashLoc is designed to reduce the reusable attack surface before exposed credentials can continue being abused.",
  },
];

export default function FraudStatsModal({ open, onOpenChange }: FraudStatsModalProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;
  const isLast = index === slides.length - 1;

  const closeModal = () => {
    onOpenChange(false);
    setIndex(0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setIndex(0);
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="w-[94vw] max-w-[560px] overflow-hidden rounded-3xl border border-emerald-400/20 bg-slate-950 p-0 text-white shadow-2xl shadow-emerald-950/40">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/60 px-5 py-6 sm:px-8 sm:py-8">
          <DialogHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Why Fraud Persists
            </p>

            <DialogTitle className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Understanding the fraud problem
            </DialogTitle>

            <p className="mt-2 text-sm text-slate-300">
              Step {index + 1} of {slides.length}
            </p>
          </DialogHeader>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              <Icon className="h-7 w-7" />
            </div>

            <div className="text-4xl font-bold tracking-tight text-emerald-300 sm:text-5xl">
              {slide.stat}
            </div>

            <h3 className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
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
                  dotIndex <= index ? "bg-emerald-300" : "bg-white/15"
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
                Close
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
              onClick={() => {
                if (isLast) {
                  closeModal();
                  return;
                }
                setIndex((current) => current + 1);
              }}
              className="w-full rounded-full bg-emerald-300 px-6 py-6 font-semibold text-slate-950 hover:bg-emerald-200 sm:w-auto"
            >
              {isLast ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
