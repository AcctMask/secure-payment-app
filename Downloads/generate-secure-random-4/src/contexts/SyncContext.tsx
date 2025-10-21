import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SecureAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  bankName: string;
  secureCode: string;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
  version: number;
  isDeleted: boolean;
}

interface SyncContextType {
  accounts: SecureAccount[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncAccounts: () => Promise<void>;
  addAccount: (account: Omit<SecureAccount, 'id' | 'createdAt' | 'updatedAt' | 'deviceId' | 'version' | 'isDeleted'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<SecureAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  isAuthenticated: boolean;
}

const SyncContext = createContext<SyncContextType | null>(null);

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within SyncProvider');
  }
  return context;
};

const DEVICE_ID = localStorage.getItem('deviceId') || crypto.randomUUID();
localStorage.setItem('deviceId', DEVICE_ID);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<SecureAccount[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        syncAccounts();
      } else {
        // Clear accounts when signed out for security
        setAccounts([]);
        localStorage.removeItem('secureAccounts');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load local accounts on mount
  useEffect(() => {
    const localAccounts = localStorage.getItem('secureAccounts');
    if (localAccounts) {
      setAccounts(JSON.parse(localAccounts));
    }
  }, []);

  // Save accounts to local storage
  const saveToLocal = useCallback((accounts: SecureAccount[]) => {
    localStorage.setItem('secureAccounts', JSON.stringify(accounts));
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (isAuthenticated) {
        syncAccounts();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated]);

  const syncAccounts = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return;

    setIsSyncing(true);
    try {
      // Fetch remote accounts
      const { data: remoteAccounts, error } = await supabase
        .from('secure_accounts')
        .select('*')
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const localAccounts = [...accounts];
      const mergedAccounts: SecureAccount[] = [];
      const processed = new Set<string>();

      // Process remote accounts
      remoteAccounts?.forEach(remote => {
        const local = localAccounts.find(l => l.id === remote.id);
        
        if (!local) {
          // New remote account
          mergedAccounts.push({
            id: remote.id,
            accountName: remote.account_name,
            accountNumber: remote.account_number,
            routingNumber: remote.routing_number,
            accountType: remote.account_type,
            bankName: remote.bank_name,
            secureCode: remote.secure_code,
            createdAt: remote.created_at,
            updatedAt: remote.updated_at,
            deviceId: remote.device_id,
            version: remote.version,
            isDeleted: remote.is_deleted
          });
        } else {
          // Conflict resolution: use latest version
          const remoteTime = new Date(remote.updated_at);
          const localTime = new Date(local.updatedAt);
          
          if (remoteTime > localTime) {
            mergedAccounts.push({
              id: remote.id,
              accountName: remote.account_name,
              accountNumber: remote.account_number,
              routingNumber: remote.routing_number,
              accountType: remote.account_type,
              bankName: remote.bank_name,
              secureCode: remote.secure_code,
              createdAt: remote.created_at,
              updatedAt: remote.updated_at,
              deviceId: remote.device_id,
              version: remote.version,
              isDeleted: remote.is_deleted
            });
          } else {
            mergedAccounts.push(local);
          }
        }
        processed.add(remote.id);
      });

      // Process local-only accounts (upload to remote)
      for (const local of localAccounts) {
        if (!processed.has(local.id)) {
          // Upload local account to remote
          const { error: uploadError } = await supabase
            .from('secure_accounts')
            .insert({
              id: local.id,
              account_name: local.accountName,
              account_number: local.accountNumber,
              routing_number: local.routingNumber,
              account_type: local.accountType,
              bank_name: local.bankName,
              secure_code: local.secureCode,
              created_at: local.createdAt,
              updated_at: local.updatedAt,
              device_id: local.deviceId,
              version: local.version,
              is_deleted: local.isDeleted
            });

          if (!uploadError) {
            mergedAccounts.push(local);
          }
        }
      }

      setAccounts(mergedAccounts);
      saveToLocal(mergedAccounts);
      setLastSyncTime(new Date());
      
      toast({
        title: "Sync Complete",
        description: "Your accounts have been synchronized across devices.",
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize accounts. Changes saved locally.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [accounts, isAuthenticated, isOnline, toast, saveToLocal]);

  const addAccount = useCallback(async (accountData: Omit<SecureAccount, 'id' | 'createdAt' | 'updatedAt' | 'deviceId' | 'version' | 'isDeleted'>) => {
    const newAccount: SecureAccount = {
      ...accountData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deviceId: DEVICE_ID,
      version: 1,
      isDeleted: false
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    saveToLocal(updatedAccounts);

    if (isAuthenticated && isOnline) {
      try {
        await supabase.from('secure_accounts').insert({
          id: newAccount.id,
          account_name: newAccount.accountName,
          account_number: newAccount.accountNumber,
          routing_number: newAccount.routingNumber,
          account_type: newAccount.accountType,
          bank_name: newAccount.bankName,
          secure_code: newAccount.secureCode,
          created_at: newAccount.createdAt,
          updated_at: newAccount.updatedAt,
          device_id: newAccount.deviceId,
          version: newAccount.version,
          is_deleted: newAccount.isDeleted
        });
      } catch (error) {
        console.error('Failed to sync new account:', error);
      }
    }
  }, [accounts, isAuthenticated, isOnline, saveToLocal]);

  const updateAccount = useCallback(async (id: string, updates: Partial<SecureAccount>) => {
    const updatedAccounts = accounts.map(account => 
      account.id === id 
        ? { 
            ...account, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            version: account.version + 1,
            deviceId: DEVICE_ID
          }
        : account
    );
    
    setAccounts(updatedAccounts);
    saveToLocal(updatedAccounts);

    if (isAuthenticated && isOnline) {
      const account = updatedAccounts.find(a => a.id === id);
      if (account) {
        try {
          await supabase.from('secure_accounts')
            .update({
              account_name: account.accountName,
              account_number: account.accountNumber,
              routing_number: account.routingNumber,
              account_type: account.accountType,
              bank_name: account.bankName,
              secure_code: account.secureCode,
              updated_at: account.updatedAt,
              version: account.version,
              device_id: account.deviceId
            })
            .eq('id', id);
        } catch (error) {
          console.error('Failed to sync account update:', error);
        }
      }
    }
  }, [accounts, isAuthenticated, isOnline, saveToLocal]);

  const deleteAccount = useCallback(async (id: string) => {
    const updatedAccounts = accounts.map(account => 
      account.id === id 
        ? { 
            ...account, 
            isDeleted: true,
            updatedAt: new Date().toISOString(),
            version: account.version + 1,
            deviceId: DEVICE_ID
          }
        : account
    ).filter(account => !account.isDeleted);
    
    setAccounts(updatedAccounts);
    saveToLocal(updatedAccounts);

    if (isAuthenticated && isOnline) {
      try {
        await supabase.from('secure_accounts')
          .update({
            is_deleted: true,
            updated_at: new Date().toISOString(),
            version: accounts.find(a => a.id === id)?.version || 1 + 1,
            device_id: DEVICE_ID
          })
          .eq('id', id);
      } catch (error) {
        console.error('Failed to sync account deletion:', error);
      }
    }
  }, [accounts, isAuthenticated, isOnline, saveToLocal]);

  // Real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = supabase
      .channel('secure_accounts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'secure_accounts' 
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          // Trigger sync to get latest data
          syncAccounts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, syncAccounts]);

  return (
    <SyncContext.Provider value={{
      accounts,
      isOnline,
      isSyncing,
      lastSyncTime,
      syncAccounts,
      addAccount,
      updateAccount,
      deleteAccount,
      isAuthenticated
    }}>
      {children}
    </SyncContext.Provider>
  );
};