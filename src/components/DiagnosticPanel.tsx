import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Play } from 'lucide-react';
import { runDiagnostics, DiagnosticResult } from '@/utils/diagnostics';

export function DiagnosticPanel() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [running, setRunning] = useState(false);

  const handleRunDiagnostics = async () => {
    setRunning(true);
    try {
      const diagnosticResults = await runDiagnostics();
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, DiagnosticResult[]>);

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System Diagnostics</CardTitle>
        <CardDescription>
          Verify Stripe, Supabase, and environment configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleRunDiagnostics} disabled={running} className="w-full">
          {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {running ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{passCount}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failCount}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {Object.entries(groupedResults).map(([category, categoryResults]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-lg">{category}</h3>
                {categoryResults.map((result, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.test}</span>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">{result.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
