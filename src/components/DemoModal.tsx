import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  CreditCard,
  Lock,
  Users,
  Building2,
} from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBecomeMember?: () => void;
}

const slides = [
  {
    title: "The Problem",
    icon: <CreditCard className="w-8 h-8 text-blue-400" />,
    content: (
      <>
        <p className="text-slate-300">
          Credit card fraud costs consumers, banks, and merchants tens of
          billions of dollars every year.
        </p>
        <p className="text-slate-400 mt-3">
          Once a card number is exposed, it can be reused, resold, and abused —
          often without detection until damage is done.
        </p>
      </>
    ),
  },
  {
    title: "The PashLoc Solution",
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    content: (
      <>
        <p className="text-slate-300">
          PashLoc replaces your real card with a secure, randomized virtual card
          for every transaction.
        </p>
        <p className="text-slate-400 mt-3">
          Each purchase uses a new card number that expires immediately after
          use.
        </p>
      </>
    ),
  },
  {
    title: "How It Works",
    icon: <Lock className="w-8 h-8 text-green-400" />,
    content: (
      <ul className="list-disc list-inside text-slate-300 space-y-2">
        <li>Tap to pay or checkout online</li>
        <li>One-time virtual card is generated instantly</li>
        <li>Transaction completes securely</li>
        <li>Card becomes useless after purchase</li>
      </ul>
    ),
  },
  {
    title: "Member Benefits",
    icon: <Users className="w-8 h-8 text-blue-400" />,
    content: (
      <ul className="list-disc list-inside text-slate-300 space-y-2">
        <li>Zero fraud liability</li>
        <li>No exposure of real card details</li>
        <li>Instant card rotation</li>
        <li>Peace of mind on every purchase</li>
      </ul>
    ),
  },
  {
    title: "Partner & Bank Benefits",
    icon: <Building2 className="w-8 h-8 text-purple-400" />,
    content: (
      <ul className="list-disc list-inside text-slate-300 space-y-2">
        <li>Dramatically reduced fraud losses</li>
        <li>Lower chargeback rates</li>
        <li>Improved customer trust</li>
        <li>Seamless Stripe Issuing integration</li>
      </ul>
    ),
  },
  {
    title: "Ready to Protect Every Purchase?",
    icon: <CreditCard className="w-8 h-8 text-green-400" />,
    content: (
      <p className="text-slate-300">
        Join PashLoc today and take control of your payment security with
        next-generation virtual card protection.
      </p>
    ),
  },
];

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onBecomeMember,
}) => {
  const [index, setIndex] = useState(0);

  const isFirst = index === 0;
  const isLast = index === slides.length - 1;

  const goNext = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));
  const goEnd = () => setIndex(slides.length - 1);

  const slide = slides[index];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className="max-w-2xl text-white border border-indigo-300/30
  bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950
  shadow-[0_0_60px_rgba(99,102,241,0.25)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {slide.icon}
            {slide.title}
          </DialogTitle>
<p className="text-xs text-indigo-200/90 mt-1">
  Step {index + 1} of {slides.length}
</p>
        </DialogHeader>

        <div className="mt-4">{slide.content}</div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10"
              onClick={goBack}
              disabled={isFirst}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10"
              onClick={goEnd}
              disabled={isLast}
            >
              Skip
            </Button>
          </div>

          <div className="flex gap-2">
            {isLast && onBecomeMember ? (
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => {
                  onClose();
                  onBecomeMember();
                }}
              >
                Become a Member
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={goNext}
                disabled={isLast}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
