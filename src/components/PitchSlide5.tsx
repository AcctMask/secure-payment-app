import { Card } from "@/components/ui/card";
import { Users, Building2, Handshake } from "lucide-react";

export default function PitchSlide5() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 print:page-break-after-always print:p-2">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold mb-6 text-center text-slate-900">Partnership Models</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <Handshake className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold mb-3 text-slate-900">Integration Partnership</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-blue-600">30-40%</div>
              <p className="text-base text-slate-700">Interchange revenue share</p>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Stripe API integration</li>
                <li>• Co-branded solution</li>
                <li>• Joint go-to-market</li>
                <li>• Fastest time to revenue</li>
              </ul>
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <Building2 className="w-12 h-12 text-green-600 mb-3" />
            <h3 className="text-xl font-bold mb-3 text-slate-900">White-Label License</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-green-600">$2-5M</div>
              <p className="text-base text-slate-700">Upfront + 15-25% revenue</p>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Full technology transfer</li>
                <li>• Stripe-branded product</li>
                <li>• Ongoing support</li>
                <li>• Patent licensing</li>
              </ul>
            </div>
          </Card>
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <Users className="w-12 h-12 text-purple-600 mb-3" />
            <h3 className="text-xl font-bold mb-3 text-slate-900">Strategic Acquisition</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-purple-600">$50-150M</div>
              <p className="text-base text-slate-700">Full acquisition range</p>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Complete IP ownership</li>
                <li>• Team integration</li>
                <li>• Market dominance</li>
                <li>• Eliminate competition</li>
              </ul>
            </div>
          </Card>
        </div>
        <Card className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h3 className="text-2xl font-bold mb-3">Recommended: Integration Partnership First</h3>
          <p className="text-base mb-3">
            Start with revenue-sharing integration to prove market fit, then negotiate acquisition based on performance metrics.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-xs text-blue-100 mb-1">Phase 1 (Months 1-6)</div>
              <div className="text-lg font-bold">Integration</div>
            </div>
            <div>
              <div className="text-xs text-blue-100 mb-1">Phase 2 (Months 7-18)</div>
              <div className="text-lg font-bold">Scale & Prove</div>
            </div>
            <div>
              <div className="text-xs text-blue-100 mb-1">Phase 3 (Months 19-24)</div>
              <div className="text-lg font-bold">Acquisition</div>
            </div>
          </div>
        </Card>
      </div>
    </section>

  );
}
