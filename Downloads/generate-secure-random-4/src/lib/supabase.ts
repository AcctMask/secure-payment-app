import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client with environment variables or fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ygongssudngqrseklkah.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wv3dVbHSmLwa7h7DfJntLw_DdDQ0aAS';

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('Using fallback Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };