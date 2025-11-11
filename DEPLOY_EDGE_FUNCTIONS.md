# Deploy Supabase Edge Functions

## The Issue
You're getting `FunctionsFetchError` because the edge functions exist in your code but **aren't deployed to Supabase yet**.

## Quick Fix - Deploy Edge Functions

### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Install Supabase CLI if not already installed
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link your project
supabase link --project-ref oxkrsmhccberdhvdhgyz

# 4. Set your Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY

# 5. Deploy all edge functions
supabase functions deploy create-checkout-session
supabase functions deploy create-payment-intent
supabase functions deploy create-subscription
supabase functions deploy create-virtual-card
supabase functions deploy process-virtual-payment
supabase functions deploy stripe-webhook
```

### Option 2: Deploy via Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/oxkrsmhccberdhvdhgyz
2. Navigate to **Edge Functions** in the left sidebar
3. Click **Deploy new function**
4. Upload each function from `supabase/functions/` directory
5. Set environment variables:
   - `STRIPE_SECRET_KEY` = your Stripe secret key (sk_live_...)

### Option 3: Deploy Single Function for Testing

```bash
# Just deploy the checkout session function first
supabase functions deploy create-checkout-session --project-ref oxkrsmhccberdhvdhgyz
```

## Verify Deployment

After deploying, test with:

```bash
curl -X POST https://oxkrsmhccberdhvdhgyz.supabase.co/functions/v1/create-checkout-session \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_xxx","email":"test@example.com","membershipType":"premium"}'
```

## What This Fixes
- ✅ Edge function will be accessible
- ✅ "Test Edge Function" button will work
- ✅ Membership purchases will process
- ✅ Stripe checkout sessions will be created

## Next Steps
After deployment, click "Test Edge Function" button in your app - it should return success!
