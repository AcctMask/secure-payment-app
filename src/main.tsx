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

