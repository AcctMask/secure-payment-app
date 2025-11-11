import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const SupabaseCheck: React.FC = () => {
  // Debug: Log what we're seeing
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('=== SUPABASE DEBUG ===');
  console.log('URL exists:', !!url);
  console.log('Key exists:', !!key);
  console.log('URL value:', url);
  console.log('Key length:', key?.length || 0);
  console.log('isConfigured:', isSupabaseConfigured);
  console.log('All env vars:', import.meta.env);
  
  if (isSupabaseConfigured) {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <div className="bg-green-900/90 border border-green-700 rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">Supabase Connected</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      <div className="bg-red-900/90 border border-red-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-300 mb-2">Supabase Not Configured</h3>
            <p className="text-sm text-gray-300 mb-2">
              Debug Info:
            </p>
            <div className="bg-black/30 rounded p-2 text-xs font-mono text-gray-300 mb-3">
              URL: {url ? '✓ Set' : '✗ Missing'}<br/>
              Key: {key ? '✓ Set' : '✗ Missing'}<br/>
              Check browser console for details
            </div>
            <p className="text-xs text-gray-400">
              If variables are set, try: rm -rf node_modules/.vite && npm run dev
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
