# Real Stripe Payment Setup

## Quick Setup (5 minutes)

### 1. Get Stripe Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment
Create `.env.local` in your project root:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### 3. Deploy Edge Function
```bash
supabase functions deploy create-checkout-session
```

### 4. Test Payment
1. Click "Join Premium" in your app
2. Enter your email
3. Click "Subscribe"
4. Use test card: `4242 4242 4242 4242`
5. Any future date and CVC

## How It Works
- User selects Premium ($29.99/mo) or Pro ($49.99/mo)
- Redirects to Stripe Checkout (secure hosted page)
- Payment processed by Stripe
- Subscription created in your Stripe account
- User redirected back to your app

## View Payments
https://dashboard.stripe.com/test/payments

All payments go directly to YOUR Stripe account!
