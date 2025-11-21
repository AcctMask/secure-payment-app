# Live Issuing Card Flow Setup Guide

## Step 1: Apply Database Migration

Go to your Supabase dashboard → SQL Editor and run the migration file:
`supabase/migrations/003_issuing_flow_tables.sql`

This will create:
- `members` table (with proper schema)
- `virtual_cards` table (linked to members)
- `transactions` table (for logging card usage)

## Step 2: Update Edge Functions

### A. Update `create-issuing-card` function

In Supabase dashboard → Edge Functions → create-issuing-card → Edit

Replace the entire content with the code in:
`CREATE_ISSUING_CARD_FUNCTION.md`

### B. Update `stripe-webhook` function

In Supabase dashboard → Edge Functions → stripe-webhook → Edit

Replace the entire content with the code in:
`STRIPE_WEBHOOK_FUNCTION.md`

## Step 3: Test the Flow

1. Go to your app and purchase a membership with a REAL card
2. Check Supabase `members` table - you should see a new row
3. Check `virtual_cards` table - you should see an active virtual card
4. Use the virtual card for a purchase
5. Check that a new card is automatically created and the old one marked as 'used'

## Environment Variables (Already Configured)

These should already be set in your Supabase Edge Functions:
- `STRIPE_SECRET_KEY` (live mode: sk_live_...)
- `STRIPE_WEBHOOK_SECRET` (whsec_...)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

Check the Edge Function logs in Supabase dashboard for any errors.
