import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Lock, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";

type CustomerDemoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBecomeMember?: () => void;
};

const slides = [
  {
    icon: ShieldCheck,
    title: "Your card number was never meant to live everywhere.",
    body:
      "Every online purchase, saved checkout account, subscription, and merchant system creates another place where your payment details can be exposed.",
  },
  {
    icon: CreditCard,
    title: "PashLoc protects each purchase differently.",
    body:
      "Instead of relying on the same reusable card details over and over, PashLoc is designed around purchase-specific virtual payment credentials.",
  },
  {
    icon: Lock,
    title: "One-time use means less value for thieves.",
    body:
      "If a payment credential is limited to a specific purchase, it becomes dramatically less useful after that transaction is complete.",
  },
  {
    icon: Smartphone,
    title: "Your real funding source stays protected.",
    body:
      "PashLoc helps keep your underlying payment source away from routine merchant exposure while still letting you shop normally.",
  },
  {
    icon: CheckCircle2,
    title: "Less reuse. Less exposure. More confidence.",
    body:
      "PashLoc is built for people who want a safer way to pay online, travel, subscribe, and make everyday purchases without constantly worrying about card fraud.",
  },
  {
    icon: ArrowRight,
    title: "Protect every purchase with PashLoc.",
    body:
      "Join early access and help shape a safer payment experience built around transaction-specific protection.",
  },
];

export default function CustomerDemoModal({
  open,
  onOpenChange,
  onBecomeMember,
}: CustomerDemoModalProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;
  const isLast = index === slides.length - 1;

  const goNext = () => {
    if (isLast) {
      onBecomeMember?.();
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
      <DialogContent className="w-[94vw] max-w-[520px] rounded-3xl border border-cyan-400/20 bg-slate-950 p-0 text-white shadow-2xl shadow-cyan-950/40 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/70 px-5 py-6 sm:px-8 sm:py-8">
          <DialogHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Customer Demo
            </p>

            <DialogTitle className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              PashLoc for everyday buyers
            </DialogTitle>

            <p className="mt-2 text-sm text-slate-300">
              Step {index + 1} of {slides.length}
            </p>
          </DialogHeader>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
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
                  dotIndex <= index ? "bg-cyan-300" : "bg-white/15"
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
              className="w-full rounded-full bg-cyan-300 px-6 py-6 font-semibold text-slate-950 hover:bg-cyan-200 sm:w-auto"
            >
              {isLast ? "Become a Member" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
