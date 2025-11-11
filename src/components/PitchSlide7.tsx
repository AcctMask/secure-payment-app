import { Card } from "@/components/ui/card";
import { Award, FileCheck, Shield, Lightbulb } from "lucide-react";

export default function PitchSlide7() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 print:page-break-after-always print:p-2">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl font-bold mb-6 text-center text-slate-900">
          Intellectual Property & Market Uniqueness
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-5 bg-white border-blue-300 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-10 h-10 text-blue-600" />
              <h3 className="text-2xl font-bold text-slate-900">USPTO Protection</h3>
            </div>
            <ul className="space-y-3 text-base text-slate-700">
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <span><strong>Patent Pending:</strong> Rotating virtual card membership system</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <span><strong>Trademark Pending:</strong> Brand and technology protection</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span>First-to-market advantage with IP protection</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-10 h-10 text-green-600" />
              <h3 className="text-2xl font-bold text-slate-900">Market First</h3>
            </div>
            <div className="space-y-3 text-base text-slate-700">
              <p className="font-semibold text-green-800">
                No existing competitor offers this combination:
              </p>
              <ul className="space-y-2">
                <li>• Membership-based rotating virtual cards</li>
                <li>• Real-time card generation for members</li>
                <li>• Stripe Issuing integration at scale</li>
                <li>• Consumer-focused fraud prevention</li>
              </ul>
            </div>
          </Card>
        </div>

        <Card className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center">Competitive Analysis: We Stand Alone</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold mb-2">Virtual Card Patents</div>
              <div className="text-sm opacity-90">Focus on one-time use or physical cards with generators</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-2">Privacy.com & Similar</div>
              <div className="text-sm opacity-90">Static virtual cards, not rotating membership model</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-2">Our Innovation</div>
              <div className="text-sm opacity-90">ONLY membership platform with rotating virtual cards</div>
            </div>
          </div>
        </Card>
      </div>
    </section>

  );
}
