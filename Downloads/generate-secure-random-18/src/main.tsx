// FORCE REBUILD - October 21, 2025 @ 6:09 PM - CACHE BUST v4 - DOMAIN FIX - sp4all.com

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SyncProvider } from './contexts/SyncContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <SyncProvider>
      <App />
    </SyncProvider>
  </ErrorBoundary>
);

