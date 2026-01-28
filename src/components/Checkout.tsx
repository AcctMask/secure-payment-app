import { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

export default function Checkout() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const handlePay = async () => {
    setErrorMsg(null)
    if (!stripe || !elements) return // Stripe.js not yet loaded
    setLoading(true)

    try {
      // 1) Create PaymentIntent via your Edge Function
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ amount: 1999, currency: 'usd', metadata: { plan: 'pro' } }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create PaymentIntent')
      const clientSecret = data.client_secret as string

      // 2) Confirm the payment on the client
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (error) {
        setErrorMsg(error.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true)
        // Navigate to success page or show success UI
        // e.g., window.location.href = '/checkout/success'
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <CardElement options={{ hidePostalCode: true }} />
      <button disabled={!stripe || loading} onClick={handlePay}>
        {loading ? 'Processing…' : 'Pay $19.99'}
      </button>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {succeeded && <p>Payment succeeded!</p>}
    </div>
  )
}