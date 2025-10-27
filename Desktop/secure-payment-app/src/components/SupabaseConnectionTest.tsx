import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function SupabaseConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.from('members').select('count');
      
      if (error) {
        setResult({
          success: false,
          message: `Connection failed: ${error.message}`
        });
      } else {
        setResult({
          success: true,
          message: 'Successfully connected to Supabase! Your database is ready.'
        });
      }
    } catch (err) {
      setResult({
        success: false,
        message: `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Verify your Supabase configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>

        {result && (
          <div className={`flex items-start gap-2 p-4 rounded-lg ${
            result.success ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
          }`}>
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
