import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const SystemDiagnostics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostics = async () => {
    setTesting(true);
    const checks: any = {};

    // Check Supabase
    try {
      const { error } = await supabase.from('members').select('count').limit(1);
      checks.supabase = { success: !error, message: error ? error.message : 'Connected' };
    } catch (e) {
      checks.supabase = { success: false, message: 'Connection failed' };
    }

    // Check Stripe keys
    checks.stripe = {
      success: !!(import.meta.env.VITE_STRIPE_PUBLIC_KEY),
      message: import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 'Keys configured' : 'Missing keys'
    };

    // Check environment
    checks.env = {
      success: true,
      message: import.meta.env.MODE || 'development'
    };

    setResults(checks);
    setTesting(false);
  };

  return (
    <>
      <Button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen && !results) runDiagnostics(); }}
        variant="outline"
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
      >
        🔧 System Check
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">System Readiness Check</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              {testing && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="ml-3 text-white">Running diagnostics...</span>
                </div>
              )}

              {results && !testing && (
                <div className="space-y-4">
                  {Object.entries(results).map(([key, value]: [string, any]) => (
                    <div key={key} className={`p-4 rounded-lg border ${
                      value.success ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        {value.success ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <div>
                          <div className="font-semibold text-white capitalize">{key}</div>
                          <div className="text-sm text-gray-400">{value.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={runDiagnostics} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                    Re-run Diagnostics
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
