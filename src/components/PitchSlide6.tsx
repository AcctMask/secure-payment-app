import { Card } from "@/components/ui/card";
import { Target, Zap, TrendingUp, Award } from "lucide-react";

export default function PitchSlide6() {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center p-4 bg-white print:page-break-after-always print:p-2">
        <div className="max-w-6xl w-full">
          <h2 className="text-5xl font-bold mb-6 text-center text-slate-900">Competitive Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50">
              <Zap className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold mb-3">vs. Stripe Radar</h3>
              <ul className="space-y-2 text-base text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Preventive</strong> vs reactive detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Zero false positives</strong> vs 15-20%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Complementary</strong> technology stack</span>
                </li>
              </ul>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50">
              <Award className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="text-xl font-bold mb-3">vs. Competitors</h3>
              <ul className="space-y-2 text-base text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Square, PayPal lack this technology</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Patent-pending = 2-3 year lead</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>First-mover advantage in rotating cards</span>
                </li>
              </ul>
            </Card>
          </div>
          <Card className="p-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Market Comparisons</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-green-100 mb-1">Sardine (Fraud Prevention)</div>
                <div className="text-3xl font-bold mb-1">$680M</div>
                <div className="text-xs text-green-100">Valuation (2023)</div>
              </div>
              <div>
                <div className="text-xs text-green-100 mb-1">Socure (Identity)</div>
                <div className="text-3xl font-bold mb-1">$1.3B</div>
                <div className="text-xs text-green-100">Valuation (2024)</div>
              </div>
              <div>
                <div className="text-xs text-green-100 mb-1">Your Technology</div>
                <div className="text-3xl font-bold mb-1">$100M+</div>
                <div className="text-xs text-green-100">Conservative valuation</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final Slide: Call to Action */}
      <section className="min-h-screen flex items-center justify-center p-4 print:page-break-after-always print:p-2">
        <div className="max-w-5xl w-full text-center">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Let's Eliminate Fraud Together
          </h2>
          <p className="text-2xl text-slate-700 mb-8">
            The future of payments is rotating, dynamic, and secure.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">$640M+</div>
              <div className="text-lg text-slate-700">Year 1 Savings</div>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">60-80%</div>
              <div className="text-lg text-slate-700">Fraud Reduction</div>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">10x</div>
              <div className="text-lg text-slate-700">Market Advantage</div>
            </Card>
          </div>
          <div className="text-xl text-slate-600 mb-6">
            Ready to discuss partnership opportunities?
          </div>
          <div className="text-lg text-slate-500">
            Contact: partnerships@yourcompany.com
          </div>
        </div>
      </section>

    </>
  );
}
