# Stripe Webhook Debugging Guide

## Common Issues and Solutions

### 1. "Failed to send a request to the Edge Function"

This error typically occurs due to one of these issues:

#### A. Missing Environment Variables
Check that these are set in your Supabase project:
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_WEBHOOK_SECRET` - Your webhook endpoint secret (starts with `whsec_`)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

#### B. Database Tables Missing
The webhook function requires these tables to exist:
- `payment_logs`
- `memberships` 
- `subscriptions`
- `invoice_logs`

**Solution**: The tables have been created automatically. Verify with:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payment_logs', 'memberships', 'subscriptions', 'invoice_logs');
```

#### C. Webhook Signature Verification
Stripe requires proper signature verification. Common issues:
- Wrong webhook secret
- Request body modified before verification
- Missing `stripe-signature` header

### 2. Testing Your Webhook

#### Option 1: Stripe CLI (Recommended)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to your Stripe account
stripe login

# Forward events to your webhook
stripe listen --forward-to https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook

# Trigger a test event
stripe trigger payment_intent.succeeded
```

#### Option 2: Manual Test
```bash
# Test the endpoint directly
curl -X POST https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### 3. Monitoring and Logs

#### Check Supabase Function Logs
```bash
supabase functions logs stripe-webhook --follow
```

#### Check Database for Webhook Data
```sql
-- Check payment logs
SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT 10;

-- Check subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;

-- Check invoice logs  
SELECT * FROM invoice_logs ORDER BY created_at DESC LIMIT 10;
```

### 4. Stripe Dashboard Configuration

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL: `https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret and add it to your Supabase secrets as `STRIPE_WEBHOOK_SECRET`

### 5. Common Error Messages

#### "Missing Stripe secret key"
- Add `STRIPE_SECRET_KEY` to your Supabase project secrets

#### "Missing webhook secret"  
- Add `STRIPE_WEBHOOK_SECRET` to your Supabase project secrets

#### "Missing Supabase credentials"
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` should be automatically available

#### "Webhook signature verification failed"
- Check that your `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard
- Ensure the request body hasn't been modified

### 6. Environment Variables Setup

Add these to your Supabase project secrets:

```bash
# In Supabase Dashboard → Settings → Edge Functions → Environment Variables
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 7. Verification Steps

1. **Function is deployed**: Check Supabase Dashboard → Edge Functions
2. **Environment variables set**: Check Supabase Dashboard → Settings → Edge Functions
3. **Database tables exist**: Run the SQL query above
4. **Webhook configured in Stripe**: Check Stripe Dashboard → Webhooks
5. **Test with Stripe CLI**: Use `stripe listen` and `stripe trigger`

### 8. Success Indicators

When working correctly, you should see:
- Webhook events logged in Supabase function logs
- New entries in your database tables
- "200 OK" responses in Stripe Dashboard webhook logs
- Console logs showing "Payment logged successfully" etc.