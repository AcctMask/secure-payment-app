import { Card } from "@/components/ui/card";

export default function PatentSpecification() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-white print:page-break-after-always print:p-2">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Patent Specification Details</h2>
        
        <div className="space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-xl font-bold mb-2 text-blue-900">Field of Invention</h3>
            <p className="text-sm text-slate-700">
              Payment security and fraud prevention systems, specifically time-based rotating virtual payment credentials 
              with dynamic validation protocols.
            </p>
          </Card>

          <Card className="p-4 bg-purple-50 border-purple-200">
            <h3 className="text-xl font-bold mb-2 text-purple-900">Background of Invention</h3>
            <p className="text-sm text-slate-700">
              Current payment systems rely on static card credentials vulnerable to theft. The $32B annual fraud problem 
              stems from unchanging card numbers that remain valid until manually cancelled. Existing virtual cards are 
              single-use only, limiting flexibility.
            </p>
          </Card>

          <Card className="p-4 bg-green-50 border-green-200">
            <h3 className="text-xl font-bold mb-2 text-green-900">Summary of Invention</h3>
            <p className="text-sm text-slate-700 mb-2">
              Novel rotating virtual card system that generates time-limited credentials with automatic regeneration cycles. 
              Key innovations include:
            </p>
            <ul className="text-sm text-slate-700 space-y-1 ml-4">
              <li>• 30-60 second rotation intervals making stolen data worthless</li>
              <li>• Merchant-specific locking preventing unauthorized use</li>
              <li>• Real-time validation without infrastructure changes</li>
              <li>• 60-80% fraud reduction while maintaining user convenience</li>
            </ul>
          </Card>

          <Card className="p-4 bg-orange-50 border-orange-200">
            <h3 className="text-xl font-bold mb-2 text-orange-900">Competitive Advantages</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>✓ Time-based rotation (not just single-use)</li>
              <li>✓ Automatic regeneration without user action</li>
              <li>✓ Zero impact from data breaches</li>
              <li>✓ Backward compatible with existing payment networks</li>
              <li>✓ No merchant integration required</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
