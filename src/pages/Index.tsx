import React, { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

const IndexInner: React.FC = () => {
  const { setMemberData } = useAppContext();

  useEffect(() => {
    const url = new URL(window.location.href);
    const success = url.searchParams.get('success');
    const sessionId = url.searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
            body: { sessionId },
          });

          if (error) throw error;

          if (data?.memberData) {
            setMemberData(data.memberData);
          }

          // Clean URL so refresh doesn't re-run
          url.search = '';
          window.history.replaceState({}, '', url.toString());
        } catch (e) {
          console.error('Failed to verify checkout session:', e);
        }
      })();
    }
  }, [setMemberData]);

  return <AppLayout />;
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexInner />
    </AppProvider>
  );
};

export default Index;
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

const IndexInner: React.FC = () => {
  const { setMemberData } = useAppContext();

  useEffect(() => {
    const url = new URL(window.location.href);
    const success = url.searchParams.get('success');
    const sessionId = url.searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
            body: { sessionId },
          });

          if (error) throw error;

          if (data?.memberData) {
            setMemberData(data.memberData);
          }

          // Clean URL so refresh doesn't re-run
          url.search = '';
          window.history.replaceState({}, '', url.toString());
        } catch (e) {
          console.error('Failed to verify checkout session:', e);
        }
      })();
    }
  }, [setMemberData]);

  return <AppLayout />;
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <IndexInner />
    </AppProvider>
  );
};

export default Index;

