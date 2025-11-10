# Stripe Webhook Setup Guide

## Overview
This guide will help you configure Stripe webhooks to work with your Supabase Edge Functions for handling payment events, subscription updates, and more.

## Your Webhook Endpoint URL
```
https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook
```

## Step 1: Configure Webhook in Stripe Dashboard

1. **Login to Stripe Dashboard**
   - Go to https://dashboard.stripe.com
   - Make sure you're in Test mode for development

2. **Navigate to Webhooks**
   - In the left sidebar, click "Developers" → "Webhooks"
   - Click "Add endpoint"

3. **Add Your Endpoint**
   - Endpoint URL: `https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook`
   - Description: "Supabase Payment Webhook"

4. **Select Events to Send**
   Select these events (the webhook is configured to handle them):
   ```
   payment_intent.succeeded
   payment_intent.payment_failed
   payment_method.attached
   customer.created
   customer.subscription.created
   customer.subscription.updated
   customer.subscription.deleted
   invoice.payment_succeeded
   invoice.payment_failed
   ```

5. **Save the Endpoint**
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)

## Step 2: Update Environment Variables

Add the webhook signing secret to your Supabase project:

1. **In Supabase Dashboard:**
   - Go to Settings → Edge Functions
   - Add environment variable:
     - Name: `STRIPE_WEBHOOK_SECRET`
     - Value: `whsec_your_signing_secret_here`

2. **In your .env.local file:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
   ```

## Step 3: Required Database Tables

The webhook expects these tables in your Supabase database:

### payment_logs table
```sql
CREATE TABLE payment_logs (
  id SERIAL PRIMARY KEY,
  payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  customer_email TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### memberships table
```sql
CREATE TABLE memberships (
  id SERIAL PRIMARY KEY,
  payment_intent_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### subscriptions table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  plan_id TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### invoice_logs table
```sql
CREATE TABLE invoice_logs (
  id SERIAL PRIMARY KEY,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  subscription_id TEXT,
  amount_paid INTEGER,
  amount_due INTEGER,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  paid_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Step 4: Test Your Webhook

1. **Use Stripe CLI (recommended):**
   ```bash
   stripe listen --forward-to https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook
   ```

2. **Or use Stripe Dashboard:**
   - Go to your webhook endpoint
   - Click "Send test webhook"
   - Select an event type and send

## Step 5: Deploy and Monitor

1. **Deploy your Edge Function:**
   ```bash
   supabase functions deploy stripe-webhook
   ```

2. **Monitor webhook events:**
   - Check Supabase logs: `supabase functions logs stripe-webhook`
   - Check Stripe Dashboard webhook logs
   - Monitor your database tables for new entries

## Webhook Events Handled

| Event Type | Description | Action Taken |
|------------|-------------|--------------|
| `payment_intent.succeeded` | Payment completed successfully | Log payment, activate membership if applicable |
| `payment_intent.payment_failed` | Payment failed | Log failure with error message |
| `customer.subscription.created` | New subscription created | Create subscription record |
| `customer.subscription.updated` | Subscription modified | Update subscription status/dates |
| `customer.subscription.deleted` | Subscription cancelled | Mark subscription as cancelled |
| `invoice.payment_succeeded` | Subscription payment succeeded | Log successful invoice payment |
| `invoice.payment_failed` | Subscription payment failed | Log failed invoice with reason |

## Security Notes

- Webhook signatures are verified using your webhook signing secret
- All webhook events are logged for debugging
- Failed database operations are logged but don't fail the webhook
- CORS headers are properly configured

## Troubleshooting

1. **Webhook failing?**
   - Check Supabase function logs
   - Verify webhook signing secret is correct
   - Ensure database tables exist

2. **Events not being processed?**
   - Verify the event types are selected in Stripe Dashboard
   - Check that the webhook URL is correct
   - Test with Stripe CLI

3. **Database errors?**
   - Run the SQL commands above to create required tables
   - Check table permissions for the service role