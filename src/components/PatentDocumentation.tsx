import { Card } from "@/components/ui/card";
import { Shield, FileText, CheckCircle } from "lucide-react";

export default function PatentDocumentation() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 print:page-break-after-always print:p-2">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 mx-auto mb-3 text-blue-600" />
          <h2 className="text-4xl font-bold text-slate-900 mb-2">USPTO Patent Application</h2>
          <p className="text-lg text-slate-600">Mechanical Patent Documentation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-3 text-blue-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Title & Abstract
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-900">
                "System and Method for Dynamic Rotating Virtual Payment Card Generation"
              </p>
              <p className="text-slate-700">
                A fraud prevention system generating time-based rotating virtual payment card credentials. 
                Creates temporary card numbers with dynamic CVV codes that automatically expire and regenerate 
                every 30-60 seconds, rendering stolen credentials worthless.
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-3 text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Key Claims
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">1.</span>
                <span>Time-limited virtual card generation linked to master account</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">2.</span>
                <span>Dynamic CVV with 30-60 second rotation interval</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">3.</span>
                <span>Merchant-specific card locking mechanism</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">4.</span>
                <span>Real-time credential validation system</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1762117746242_457a7e02.webp"
            alt="System Architecture"
            className="w-full rounded-lg shadow-lg"
          />
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1762117747018_4b9d728a.webp"
            alt="Process Flowchart"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
