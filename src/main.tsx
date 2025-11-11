// NUCLEAR CACHE BUST - Fri Oct 31 2025 6:20pm - v4.0.0
// TIMESTAMP: 1730400000000
// This is a completely new build - ignore all previous versions

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
