import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Copy, Download, ExternalLink } from 'lucide-react';

interface EnvVar {
  key: string;
  name: string;
  value: string;
  valid: boolean;
  placeholder: string;
  dashboardLink: string;
  instructions: string[];
}

export const SetupWizard = () => {
  const [step, setStep] = useState(1);
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    {
      key: 'VITE_SUPABASE_URL',
      name: 'Supabase URL',
      value: '',
      valid: false,
      placeholder: 'https://xxxxx.supabase.co',
      dashboardLink: 'https://supabase.com/dashboard/project/_/settings/api',
      instructions: [
        'Go to your Supabase Dashboard',
        'Select your project',
        'Click "Settings" → "API"',
        'Copy the "Project URL"'
      ]
    },
    {
      key: 'VITE_SUPABASE_ANON_KEY',
      name: 'Supabase Anon Key',
      value: '',
      valid: false,
      placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      dashboardLink: 'https://supabase.com/dashboard/project/_/settings/api',
      instructions: [
        'Same page as Supabase URL',
        'Scroll to "Project API keys"',
        'Copy the "anon public" key',
        'This key is safe to use in the browser'
      ]
    },
    {
      key: 'VITE_STRIPE_PUBLISHABLE_KEY',
      name: 'Stripe Publishable Key',
      value: '',
      valid: false,
      placeholder: 'pk_test_...',
      dashboardLink: 'https://dashboard.stripe.com/test/apikeys',
      instructions: [
        'Go to Stripe Dashboard',
        'Click "Developers" → "API keys"',
        'Copy the "Publishable key"',
        'Use test key (pk_test_) for development'
      ]
    }
  ]);

  const validateVar = (key: string, value: string): boolean => {
    if (!value.trim()) return false;
    
    switch (key) {
      case 'VITE_SUPABASE_URL':
        return value.startsWith('https://') && value.includes('.supabase.co');
      case 'VITE_SUPABASE_ANON_KEY':
        return value.startsWith('eyJ') && value.length > 100;
      case 'VITE_STRIPE_PUBLISHABLE_KEY':
        return value.startsWith('pk_test_') || value.startsWith('pk_live_');
      default:
        return value.trim().length > 0;
    }
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...envVars];
    updated[index].value = value;
    updated[index].valid = validateVar(updated[index].key, value);
    setEnvVars(updated);
  };

  const generateEnvFile = () => {
    return envVars.map(v => `${v.key}=${v.value}`).join('\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEnvFile());
    alert('Copied to clipboard! Paste into .env.local file');
  };

  const downloadFile = () => {
    const blob = new Blob([generateEnvFile()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.local';
    a.click();
  };

  const currentVar = envVars[step - 1];
  const allValid = envVars.every(v => v.valid);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Environment Setup Wizard</CardTitle>
          <CardDescription>Step {step} of {envVars.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step <= envVars.length ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-white text-lg">{currentVar.name}</Label>
                  <p className="text-sm text-slate-400 mt-1">Variable: {currentVar.key}</p>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500">
                  <ExternalLink className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-100">
                    <div className="space-y-2">
                      <p className="font-semibold">Where to find this:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {currentVar.instructions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ol>
                      <Button 
                        onClick={() => window.open(currentVar.dashboardLink, '_blank')}
                        size="sm"
                        className="mt-2"
                      >
                        Open Dashboard <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentVar.value}
                      onChange={(e) => handleChange(step - 1, e.target.value)}
                      placeholder={currentVar.placeholder}
                      className="flex-1 bg-slate-900 border-slate-600 text-white"
                    />
                    {currentVar.valid ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : currentVar.value ? (
                      <XCircle className="h-6 w-6 text-red-500" />
                    ) : null}
                  </div>
                  {currentVar.value && !currentVar.valid && (
                    <p className="text-sm text-red-400">Invalid format</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  onClick={() => setStep(step - 1)} 
                  disabled={step === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setStep(step + 1)} 
                  disabled={!currentVar.valid}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Alert className={allValid ? "bg-green-500/20 border-green-500" : "bg-yellow-500/20 border-yellow-500"}>
                <AlertDescription className="text-white">
                  {allValid ? 'All variables configured!' : 'Some variables need attention'}
                </AlertDescription>
              </Alert>

              <div className="bg-slate-900 p-4 rounded-lg">
                <pre className="text-xs text-green-400 overflow-x-auto">
                  {generateEnvFile()}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button onClick={copyToClipboard} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button onClick={downloadFile} className="flex-1">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>

              <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                Edit Variables
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
