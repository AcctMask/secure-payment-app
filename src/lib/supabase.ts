import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-project-url' && 
  supabaseAnonKey !== 'your-anon-key';

// Create client with placeholder values if not configured (prevents crashes)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Export flag to check if Supabase is actually configured
export const isSupabaseConfigured = isConfigured;
