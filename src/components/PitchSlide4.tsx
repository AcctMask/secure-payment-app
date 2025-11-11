import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export default function PitchSlide4() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-white print:page-break-after-always print:p-2">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold mb-4 text-center text-slate-900">
          Stripe's Financial Impact
        </h2>
        <div className="mb-6">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1761941889762_0d481811.webp"
            alt="Revenue Growth"
            className="w-full h-48 object-cover rounded-2xl shadow-2xl"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
            <DollarSign className="w-10 h-10 text-green-600 mb-2" />
            <h3 className="text-xl font-bold mb-2 text-slate-900">Year 1 Savings</h3>
            <div className="text-4xl font-bold text-green-600 mb-1">$640M</div>
            <p className="text-base text-slate-600">
              2% fraud reduction on $1T volume = immediate ROI
            </p>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300">
            <TrendingUp className="w-10 h-10 text-blue-600 mb-2" />
            <h3 className="text-xl font-bold mb-2 text-slate-900">3-Year Revenue</h3>
            <div className="text-4xl font-bold text-blue-600 mb-1">$2.4B</div>
            <p className="text-base text-slate-600">
              Premium tier adoption + interchange revenue share
            </p>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
            <TrendingUp className="w-10 h-10 text-purple-600 mb-2" />
            <h3 className="text-xl font-bold mb-2 text-slate-900">Market Advantage</h3>
            <div className="text-4xl font-bold text-purple-600 mb-1">10x</div>
            <p className="text-base text-slate-600">
              Competitive edge over Square, PayPal, Adyen
            </p>
          </Card>
        </div>
        <Card className="p-5 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <h3 className="text-2xl font-bold mb-4">Conservative 5-Year Projection</h3>
          <div className="grid grid-cols-5 gap-3 text-center">
            <div>
              <div className="text-xs mb-1 text-slate-300">Year 1</div>
              <div className="text-2xl font-bold">$640M</div>
            </div>
            <div>
              <div className="text-xs mb-1 text-slate-300">Year 2</div>
              <div className="text-2xl font-bold">$1.2B</div>
            </div>
            <div>
              <div className="text-xs mb-1 text-slate-300">Year 3</div>
              <div className="text-2xl font-bold">$2.4B</div>
            </div>
            <div>
              <div className="text-xs mb-1 text-slate-300">Year 4</div>
              <div className="text-2xl font-bold">$4.1B</div>
            </div>
            <div>
              <div className="text-xs mb-1 text-slate-300">Year 5</div>
              <div className="text-2xl font-bold">$6.8B</div>
            </div>
          </div>
        </Card>
      </div>
    </section>

  );
}
