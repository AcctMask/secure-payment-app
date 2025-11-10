import { supabase } from '@/lib/supabase';

export interface DiagnosticResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export async function runDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];

  // 1. Environment Variables
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  results.push({
    category: 'Environment',
    test: 'Stripe Publishable Key',
    status: stripeKey ? 'pass' : 'fail',
    message: stripeKey ? `Configured (${stripeKey.substring(0, 20)}...)` : 'Missing VITE_STRIPE_PUBLISHABLE_KEY',
    details: stripeKey ? `Mode: ${stripeKey.startsWith('pk_live') ? 'LIVE' : 'TEST'}` : undefined
  });

  const premiumPrice = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
  results.push({
    category: 'Environment',
    test: 'Premium Price ID',
    status: premiumPrice ? 'pass' : 'fail',
    message: premiumPrice || 'Missing VITE_STRIPE_PREMIUM_PRICE_ID',
    details: premiumPrice ? `${premiumPrice}` : undefined
  });

  const proPrice = import.meta.env.VITE_STRIPE_PRO_PRICE_ID;
  results.push({
    category: 'Environment',
    test: 'Pro Price ID',
    status: proPrice ? 'pass' : 'fail',
    message: proPrice || 'Missing VITE_STRIPE_PRO_PRICE_ID',
    details: proPrice ? `${proPrice}` : undefined
  });

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  results.push({
    category: 'Environment',
    test: 'Supabase URL',
    status: supabaseUrl ? 'pass' : 'fail',
    message: supabaseUrl ? 'Configured' : 'Missing VITE_SUPABASE_URL'
  });

  // 2. Supabase Connection
  try {
    const { error } = await supabase.from('members').select('count').limit(1);
    results.push({
      category: 'Database',
      test: 'Supabase Connection',
      status: error ? 'fail' : 'pass',
      message: error ? error.message : 'Connected successfully',
      details: error ? `Code: ${error.code}` : undefined
    });
  } catch (err: any) {
    results.push({
      category: 'Database',
      test: 'Supabase Connection',
      status: 'fail',
      message: err.message || 'Connection failed'
    });
  }

  // 3. Database Tables
  const tables = ['members', 'virtual_cards', 'transactions', 'stripe_webhooks'];
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);
      results.push({
        category: 'Database',
        test: `Table: ${table}`,
        status: error ? 'fail' : 'pass',
        message: error ? `Missing or inaccessible` : 'Exists and accessible'
      });
    } catch (err) {
      results.push({
        category: 'Database',
        test: `Table: ${table}`,
        status: 'fail',
        message: 'Check failed'
      });
    }
  }

  // 4. Webhook Status Check
  try {
    const { data, error } = await supabase
      .from('stripe_webhooks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      results.push({
        category: 'Webhooks',
        test: 'Webhook History',
        status: 'warning',
        message: 'Cannot access webhook table'
      });
    } else if (!data || data.length === 0) {
      results.push({
        category: 'Webhooks',
        test: 'Webhook History',
        status: 'warning',
        message: 'No webhooks received yet',
        details: 'Webhooks will appear after first Stripe event'
      });
    } else {
      const lastWebhook = data[0];
      results.push({
        category: 'Webhooks',
        test: 'Webhook History',
        status: 'pass',
        message: `Last webhook: ${lastWebhook.event_type}`,
        details: `Received: ${new Date(lastWebhook.created_at).toLocaleString()}`
      });
    }
  } catch (err) {
    results.push({
      category: 'Webhooks',
      test: 'Webhook History',
      status: 'fail',
      message: 'Error checking webhooks'
    });
  }

  return results;
}
