export interface EnvCheck {
  name: string;
  key: string;
  required: boolean;
  present: boolean;
  valid: boolean;
  message: string;
  value?: string;
}

export interface ConnectionTest {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: string;
}

export const checkEnvVariables = (): EnvCheck[] => {
  const checks: EnvCheck[] = [
    {
      name: 'Supabase URL',
      key: 'VITE_SUPABASE_URL',
      required: true,
      present: !!import.meta.env.VITE_SUPABASE_URL,
      valid: false,
      message: '',
      value: import.meta.env.VITE_SUPABASE_URL
    },
    {
      name: 'Supabase Anon Key',
      key: 'VITE_SUPABASE_ANON_KEY',
      required: true,
      present: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      valid: false,
      message: '',
      value: import.meta.env.VITE_SUPABASE_ANON_KEY
    },
    {
      name: 'Stripe Publishable Key',
      key: 'VITE_STRIPE_PUBLISHABLE_KEY',
      required: true,
      present: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      valid: false,
      message: '',
      value: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    },
    {
      name: 'Stripe Premium Price ID',
      key: 'VITE_STRIPE_PREMIUM_PRICE_ID',
      required: true,
      present: !!import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
      valid: false,
      message: '',
      value: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID
    },
    {
      name: 'Stripe Pro Price ID',
      key: 'VITE_STRIPE_PRO_PRICE_ID',
      required: true,
      present: !!import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
      valid: false,
      message: '',
      value: import.meta.env.VITE_STRIPE_PRO_PRICE_ID
    }
  ];

  checks.forEach(check => {
    if (!check.present) {
      check.valid = false;
      check.message = check.required ? 'Missing required variable' : 'Optional variable not set';
    } else {
      const val = check.value || '';
      if (check.key.includes('SUPABASE_URL')) {
        check.valid = val.startsWith('https://') && val.includes('.supabase.co');
        check.message = check.valid ? 'Valid Supabase URL' : 'Invalid format';
      } else if (check.key.includes('SUPABASE_ANON_KEY')) {
        check.valid = val.length > 100;
        check.message = check.valid ? 'Valid anon key' : 'Key too short';
      } else if (check.key.includes('STRIPE_PUBLISHABLE_KEY')) {
        check.valid = val.startsWith('pk_test_') || val.startsWith('pk_live_');
        check.message = check.valid ? 'Valid Stripe key' : 'Must start with pk_test_ or pk_live_';
      } else if (check.key.includes('PRICE_ID')) {
        check.valid = val.startsWith('price_');
        check.message = check.valid ? 'Valid price ID' : 'Must start with price_';
      }
    }
  });

  return checks;
};
