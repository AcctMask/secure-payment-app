# Live Payment Setup Instructions

## Overview
This application now supports real financial transactions through Stripe for both membership subscriptions and secure virtual card payments.

## Prerequisites
1. Stripe Account (Test mode for development)
2. Supabase Project
3. Environment variables configured

## Step 1: Stripe Dashboard Setup

### A. Create Your Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for a free account
3. Complete the onboarding process

### B. Get Your API Keys
1. Navigate to Developers → API Keys
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

### C. Create Subscription Products
1. Go to Products → Add Product
2. Create "Premium Membership":
   - Name: Premium Membership
   - Price: $29.99/month
   - Recurring: Monthly
   - Note the Price ID (e.g., `price_1ABC...`)
3. Create "Professional Membership":
   - Name: Professional Membership
   - Price: $49.99/month
   - Recurring: Monthly
   - Note the Price ID

### D. Enable Stripe Issuing (for Virtual Cards)
1. Go to Issuing → Get Started
2. Complete the Issuing application
3. Add funds to your Issuing balance for testing

## Step 2: Environment Configuration

### A. Local Development (.env.local)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### B. Supabase Edge Functions Environment
1. Go to your Supabase Dashboard
2. Navigate to Settings → Edge Functions
3. Add these secrets:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PREMIUM_PRICE_ID`: Premium plan price ID
   - `STRIPE_PRO_PRICE_ID`: Professional plan price ID
   - `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (from Step 3)

## Step 3: Webhook Configuration

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint:
   - URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `issuing_authorization.request`
3. Copy the Signing Secret and add to Supabase environment

## Step 4: Database Setup

Run these migrations in your Supabase SQL editor:

```sql
-- Run the migration file: supabase/migrations/002_stripe_tables.sql
```

## Step 5: Deploy Edge Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy create-virtual-card
supabase functions deploy create-subscription
supabase functions deploy process-virtual-payment
supabase functions deploy stripe-webhook
```

## Step 6: Testing

### Test Membership Purchase:
1. Click "Join Premium" in the app
2. Select a plan (Premium or Professional)
3. Use test card: 4242 4242 4242 4242
4. Any future expiry date and any CVC
5. Complete the subscription

### Test Secure Purchase:
1. Add an account in the app
2. Click "Generate New Code"
3. Click "Copy or Tap for Secure Purchase"
4. The system will create a virtual card automatically
5. Enter test amount and merchant name
6. Confirm the payment

## Test Card Numbers

For testing different scenarios:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995
- **Expired Card**: 4000 0000 0000 0069

## Monitoring Transactions

1. **Stripe Dashboard**: View all transactions at dashboard.stripe.com
2. **Supabase Logs**: Check Edge Function logs in Supabase dashboard
3. **Database**: Query the tables to see transaction records

## Security Notes

- Never expose your Secret Key in client-side code
- Always use HTTPS in production
- Enable webhook signature verification
- Implement proper user authentication before production
- Use Stripe's test mode for development

## Troubleshooting

### "Invalid API Key" Error
- Verify your Stripe keys are correctly set in environment variables
- Ensure you're using test keys for development

### Virtual Card Creation Fails
- Check that Stripe Issuing is enabled on your account
- Ensure you have funds in your Issuing balance

### Subscription Not Creating
- Verify Price IDs are correctly set in Edge Functions
- Check Stripe Dashboard for error logs

### Webhook Not Receiving Events
- Verify webhook URL is correct
- Check Supabase Edge Function logs
- Test with Stripe CLI: `stripe listen --forward-to your-webhook-url`

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Issuing Guide](https://stripe.com/docs/issuing)

## Going Live

Before going to production:
1. Switch to live Stripe keys
2. Update all environment variables
3. Add production webhook endpoints
4. Enable additional security measures
5. Implement proper user authentication
6. Add comprehensive error handling
7. Set up monitoring and alerts