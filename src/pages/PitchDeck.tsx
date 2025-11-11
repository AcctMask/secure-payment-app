import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, DollarSign, Users, Zap, Target, FileText } from "lucide-react";
import PitchSlide3 from "@/components/PitchSlide3";
import PitchSlide4 from "@/components/PitchSlide4";
import PitchSlide5 from "@/components/PitchSlide5";
import PitchSlide6 from "@/components/PitchSlide6";
import PitchSlide7 from "@/components/PitchSlide7";
import PatentDocumentation from "@/components/PatentDocumentation";
import PatentSpecification from "@/components/PatentSpecification";
import { PatentExportModal } from "@/components/PatentExportModal";
import { useState } from "react";





export default function PitchDeck() {
  const [showPatentExport, setShowPatentExport] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-white">
      {/* Action Buttons - Hidden in Print */}
      <div className="fixed top-4 right-4 z-50 print:hidden flex gap-3">
        <Button onClick={() => setShowPatentExport(true)} size="lg" className="shadow-lg bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          USPTO Patent Package
        </Button>
        <Button onClick={handlePrint} size="lg" className="shadow-lg">
          Download Pitch Deck
        </Button>
      </div>

      {/* Patent Export Modal */}
      <PatentExportModal isOpen={showPatentExport} onClose={() => setShowPatentExport(false)} />


      {/* Slide 1: Title */}
      <section className="min-h-screen flex items-center justify-center p-4 print:page-break-after-always print:p-2">
        <div className="text-center max-w-5xl">
          <div className="mb-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1761941888170_51cf4c2d.webp"
              alt="Growth"
              className="w-full h-48 object-cover rounded-2xl shadow-2xl mb-6"
            />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Revolutionary Fraud Prevention
          </h1>
          <p className="text-2xl text-slate-600 mb-4">
            Rotating Virtual Card Technology
          </p>
          <p className="text-lg text-slate-500 mb-6">
            Eliminating 60-80% of Card Fraud Losses
          </p>
          <div className="flex gap-4 justify-center text-base text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Patent-Pending Technology</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Billion-Dollar Savings Potential</span>
            </div>
          </div>
        </div>
      </section>


      {/* Slide 2: The Problem */}
      <section className="min-h-screen flex items-center justify-center p-4 bg-white print:page-break-after-always print:p-2">
        <div className="max-w-6xl w-full">
          <h2 className="text-5xl font-bold mb-6 text-center text-slate-900">The $32 Billion Problem</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-2xl font-bold mb-3 text-red-900">Card Fraud Epidemic</h3>
              <ul className="space-y-3 text-lg text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>$32B</strong> annual fraud losses (US alone)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>$1 Trillion+</strong> processed by Stripe annually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>3.2%</strong> average fraud rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Static card numbers = easy targets</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 bg-orange-50 border-orange-200">
              <h3 className="text-2xl font-bold mb-3 text-orange-900">Current Solutions Fail</h3>
              <ul className="space-y-3 text-lg text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Fraud detection = reactive, not preventive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>False positives hurt legitimate customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Data breaches expose millions of cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Card replacement costs $5-10 per card</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>


      {/* Slide 3-7: Import Components */}
      <PitchSlide3 />
      <PitchSlide4 />
      <PitchSlide5 />
      <PatentDocumentation />
      <PatentSpecification />
      <PitchSlide7 />
      <PitchSlide6 />


    </div>
  );
}
