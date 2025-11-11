# 🎯 Setup Real Stripe Payments - Complete Guide

## ✅ What You Have
You mentioned these are already in your Supabase edge function secrets:
- `STRIPE_WEBHOOK_SECRET`
- `VITE_STRIPE_PREMIUM_PRICE_ID`
- `VITE_STRIPE_PRO_PRICE_ID`
- `STRIPE_SECRET_KEY`

## 🚀 What You Need to Do

### Step 1: Add Frontend Environment Variables
The frontend needs these variables in `.env.local`:

```bash
# Copy your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key

# Add your Stripe PUBLISHABLE key (pk_live_... for real payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Add the same Price IDs from Supabase
VITE_STRIPE_PREMIUM_PRICE_ID=price_...
VITE_STRIPE_PRO_PRICE_ID=price_...
```

### Step 2: Get Your Stripe Publishable Key
1. Go to https://dashboard.stripe.com
2. **Toggle to LIVE mode** (top right corner)
3. Go to Developers → API keys
4. Copy your **Publishable key** (starts with `pk_live_...`)

### Step 3: Restart Dev Server
```bash
npm run dev
```

### Step 4: Test Real Payment
1. Click the **"Purchase Membership Now"** button
2. Choose Premium ($29.99/mo) or Pro ($49.99/mo)
3. Enter your email
4. You'll be redirected to Stripe's secure checkout page
5. Use a **real credit card** to complete the purchase

## 🔒 Important Notes

### Live vs Test Mode
- **Test Mode**: Uses `pk_test_...` keys and test cards (4242 4242 4242 4242)
- **Live Mode**: Uses `pk_live_...` keys and real cards (charges real money)

### Edge Function Configuration
Your Supabase edge functions already have:
- `STRIPE_SECRET_KEY` - Backend secret key
- `STRIPE_WEBHOOK_SECRET` - For webhook verification
- Price IDs - For creating checkout sessions

### What Happens After Payment
1. User completes payment on Stripe
2. Stripe redirects back to your app with `?success=true&session_id=...`
3. The `MembershipSuccessFlow` component displays success message
4. User gets access to premium features

## 🧪 Testing Flow

### Demo Mode (Current)
- No Stripe keys configured
- Simulated payment flow
- No real charges

### Live Mode (After Setup)
- Real Stripe integration
- Actual payment processing
- Real credit card charges

## 📝 Checklist

- [ ] Add `VITE_SUPABASE_URL` to `.env.local`
- [ ] Add `VITE_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Add `VITE_STRIPE_PUBLISHABLE_KEY` (pk_live_...) to `.env.local`
- [ ] Add `VITE_STRIPE_PREMIUM_PRICE_ID` to `.env.local`
- [ ] Add `VITE_STRIPE_PRO_PRICE_ID` to `.env.local`
- [ ] Restart dev server
- [ ] Click "Purchase Membership Now"
- [ ] Complete payment with real card

## 🎉 Success Indicators

When properly configured, you'll see:
- ✅ No "Demo Mode" warnings
- ✅ Real Stripe checkout page
- ✅ Actual payment processing
- ✅ Success redirect after payment
