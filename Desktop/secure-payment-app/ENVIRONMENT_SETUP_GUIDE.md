# Environment Configuration Guide

## Quick Setup (5 Minutes)

### Step 1: Copy Environment File
```bash
cp .env.local .env.local.backup
```

The `.env.local` file is already created with the structure you need.

### Step 2: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values to `.env.local`:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Get Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy **Publishable key** (starts with `pk_test_`) to `.env.local`:
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here`

### Step 4: Create Stripe Products (Optional)

For Premium/Pro membership features:

1. Go to [Stripe Products](https://dashboard.stripe.com/test/products)
2. Click **+ Add Product**
3. Create two products:
   - **Premium Plan** - $29/month
   - **Professional Plan** - $99/month
4. Copy the **Price IDs** (start with `price_`) to `.env.local`

### Step 5: Test the Application

```bash
npm run dev
```

Visit `http://localhost:5173` and test:
- ✅ Free membership signup (no Stripe needed)
- ✅ Premium/Pro plans (requires Stripe keys)
- ✅ Virtual card generation
- ✅ Payment processing

## Configuration Status Checker

The app includes built-in diagnostics:
- Open browser console to see configuration status
- Green ✅ = properly configured
- Yellow ⚠️ = using fallbacks
- Red ❌ = missing required config

## What Works Without Configuration

- **Free Tier**: Full functionality
- **UI/UX**: All components render
- **Local State**: Cart, accounts, user data
- **Mock Data**: Test members and accounts

## What Requires Configuration

- **Stripe Payments**: Premium/Pro memberships
- **Database Sync**: Persistent storage
- **Production Deploy**: Live payments

## Troubleshooting

### "Stripe not configured" warning
- Add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env.local`
- Restart dev server: `npm run dev`

### "Using fallback Supabase" warning
- Add Supabase credentials to `.env.local`
- Restart dev server

### Premium buttons disabled
- Add Stripe key and Price IDs
- Verify keys start with `pk_test_` and `price_`

## Security Notes

- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ Only publishable keys in frontend
- ✅ Secret keys go in Supabase Edge Functions
- ✅ Test mode keys are safe for development

## Next Steps

1. Test locally with configuration
2. Set up Supabase database tables
3. Deploy Edge Functions for payments
4. Configure webhooks for production
