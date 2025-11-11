import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkEnvVariables, EnvCheck, ConnectionTest } from '@/utils/envValidation';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SetupWizard } from '@/components/SetupWizard';

const SystemReadiness = () => {
  const navigate = useNavigate();
  const [envChecks, setEnvChecks] = useState<EnvCheck[]>([]);
  const [connectionTests, setConnectionTests] = useState<ConnectionTest[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    performChecks();
  }, []);

  const performChecks = async () => {
    setTesting(true);
    const checks = checkEnvVariables();
    setEnvChecks(checks);

    const tests: ConnectionTest[] = [];

    // Test Supabase
    try {
      const { data, error } = await supabase.from('members').select('count').limit(1);
      if (error) throw error;
      tests.push({
        name: 'Supabase Database',
        status: 'success',
        message: 'Connected successfully',
        details: 'Database is accessible'
      });
    } catch (err: any) {
      tests.push({
        name: 'Supabase Database',
        status: 'error',
        message: 'Connection failed',
        details: err.message || 'Could not connect to database'
      });
    }

    // Test Stripe (basic validation)
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (stripeKey && (stripeKey.startsWith('pk_test_') || stripeKey.startsWith('pk_live_'))) {
      tests.push({
        name: 'Stripe Configuration',
        status: 'success',
        message: 'Stripe key format valid',
        details: stripeKey.startsWith('pk_test_') ? 'Using test mode' : 'Using live mode'
      });
    } else {
      tests.push({
        name: 'Stripe Configuration',
        status: 'error',
        message: 'Invalid or missing Stripe key',
        details: 'Check VITE_STRIPE_PUBLISHABLE_KEY'
      });
    }

    setConnectionTests(tests);
    setTesting(false);
  };

  const allEnvValid = envChecks.filter(c => c.required).every(c => c.valid);
  const allTestsPassed = connectionTests.every(t => t.status === 'success');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">System Configuration</h1>
            <p className="text-slate-300">Setup wizard and system validation</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">Back to Home</Button>
        </div>

        {allEnvValid && allTestsPassed && (
          <Alert className="bg-green-500/20 border-green-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-100">
              All systems operational! Your application is ready for production.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="wizard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="wizard" className="data-[state=active]:bg-purple-600">Setup Wizard</TabsTrigger>
            <TabsTrigger value="validation" className="data-[state=active]:bg-purple-600">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="mt-6">
            <SetupWizard />
          </TabsContent>

          <TabsContent value="validation" className="mt-6 space-y-6">


        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Environment Variables
              <Button onClick={performChecks} disabled={testing} size="sm" variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
                Recheck
              </Button>
            </CardTitle>
            <CardDescription>Required configuration variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {envChecks.map((check) => (
              <div key={check.key} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{check.name}</span>
                    {check.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  <p className="text-sm text-slate-400 font-mono">{check.key}</p>
                  <p className="text-sm text-slate-300 mt-1">{check.message}</p>
                </div>
                <div>
                  {check.valid ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : check.present ? (
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Connection Tests</CardTitle>
            <CardDescription>Live service connectivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectionTests.map((test) => (
              <div key={test.name} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-white">{test.name}</span>
                  <p className="text-sm text-slate-300 mt-1">{test.message}</p>
                  {test.details && <p className="text-xs text-slate-400 mt-1">{test.details}</p>}
                </div>
                <div>
                  {test.status === 'success' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  {test.status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
                  {test.status === 'warning' && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Create .env.local file</h3>
              <p className="text-sm">Copy .env.example and fill in your credentials</p>

            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Get Supabase credentials</h3>
              <p className="text-sm">Project Settings → API → Project URL and anon public key</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">3. Get Stripe credentials</h3>
              <p className="text-sm">Developers → API keys → Publishable key</p>
              <p className="text-sm">Products → Create prices → Copy price IDs</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">4. Restart dev server</h3>
              <p className="text-sm">Run: npm run dev</p>
            </div>
          </CardContent>
        </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemReadiness;
