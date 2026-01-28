// main.tsx
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SyncProvider } from './contexts/SyncContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <SyncProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </SyncProvider>
  </ErrorBoundary>
)




