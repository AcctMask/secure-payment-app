import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Hook that shows a toast notification when environment variables are reloaded
 */
export function useEnvReloader() {
  useEffect(() => {
    // Only run in development mode
    if (import.meta.env.MODE !== 'development') {
      return;
    }

    // Listen for Vite full-reload events
    if (import.meta.hot) {
      import.meta.hot.on('vite:beforeFullReload', () => {
        toast.info('Environment variables updated', {
          description: 'Reloading application...',
          duration: 2000,
        });
      });
    }

    // Check if we just reloaded due to env change
    const envReloaded = sessionStorage.getItem('env-reloaded');
    if (envReloaded === 'true') {
      sessionStorage.removeItem('env-reloaded');
      toast.success('Environment variables loaded', {
        description: 'Application is now using updated configuration',
        duration: 3000,
      });
    }

    // Set flag before reload
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('env-reloaded', 'true');
    });
  }, []);
}
