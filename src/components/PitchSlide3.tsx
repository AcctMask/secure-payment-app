import { Card } from "@/components/ui/card";
import { Shield, RefreshCw, Lock, Zap } from "lucide-react";

export default function PitchSlide3() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 print:page-break-after-always print:p-2">
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold mb-4 text-center text-slate-900">The Solution</h2>
        <div className="mb-6 text-center">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1761941888952_7cd699ab.webp"
            alt="Security"
            className="w-full h-48 object-cover rounded-2xl shadow-2xl mx-auto"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <RefreshCw className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Rotating Virtual Cards</h3>
            <p className="text-lg text-slate-700 mb-3">
              Card numbers that automatically rotate every 30-60 seconds, making stolen credentials worthless.
            </p>
            <ul className="space-y-2 text-base text-slate-600">
              <li>• Dynamic CVV codes</li>
              <li>• Time-based expiration</li>
              <li>• Merchant-specific locking</li>
              <li>• Real-time generation</li>
            </ul>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <Shield className="w-12 h-12 text-green-600 mb-3" />
            <h3 className="text-2xl font-bold mb-3 text-slate-900">Proven Results</h3>
            <div className="space-y-4">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-1">60-80%</div>
                <div className="text-lg text-slate-700">Fraud Reduction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-1">$0</div>
                <div className="text-lg text-slate-700">Data Breach Impact</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-1">100%</div>
                <div className="text-lg text-slate-700">Customer Satisfaction</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

  );
}
