import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Cloud, CloudOff, RefreshCw, Wifi, WifiOff, User, LogIn } from 'lucide-react';
import { useSyncContext } from '@/contexts/SyncContext';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
const SyncStatus: React.FC = () => {
  const { 
    isOnline, 
    isSyncing, 
    lastSyncTime, 
    syncAccounts, 
    isAuthenticated,
    accounts 
  } = useSyncContext();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      setShowProfileModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        {/* Online/Offline Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={isOnline ? "default" : "secondary"} className="gap-1">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isOnline ? 'Connected to internet' : 'Working offline - changes will sync when connected'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Authentication Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={isAuthenticated ? "default" : "outline"} className="gap-1">
                <User className="w-3 h-3" />
                {isAuthenticated ? 'Synced' : 'Local Only'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAuthenticated ? 'Accounts are synced across devices' : 'Sign in to sync across devices'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Sync Status */}
        {isAuthenticated && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="gap-1">
                  {isSyncing ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Cloud className="w-3 h-3" />
                  )}
                  {isSyncing ? 'Syncing...' : `Last: ${formatLastSync(lastSyncTime)}`}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSyncing ? 'Synchronizing accounts...' : `${accounts.length} accounts synced`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAuthAction}
                  className="gap-1"
                >
                  {isAuthenticated ? <User className="w-3 h-3" /> : <LogIn className="w-3 h-3" />}
                  {isAuthenticated ? 'Profile' : 'Sign In'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAuthenticated ? 'Manage your profile' : 'Sign in to sync your accounts across devices'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isAuthenticated && isOnline && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={syncAccounts}
                    disabled={isSyncing}
                    className="gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manually sync your accounts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Profile Modal */}
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};

export default SyncStatus;