# System Readiness Page - Access Instructions

## How to Access

The System Readiness validation page is now available at:

**URL**: `http://localhost:5173/system-check`

Or click the **"System Check"** button in the navigation bar (orange button).

## What It Does

✅ **Validates Environment Variables**
- Checks all required `.env.local` variables
- Validates format (pk_test_, price_, https://)
- Shows which variables are missing or invalid

✅ **Tests Live Connections**
- Supabase database connectivity
- Stripe API configuration
- Real-time connection status

✅ **Clear Visual Indicators**
- ✓ Green checkmark = Valid & working
- ⚠ Yellow warning = Present but invalid format
- ✗ Red X = Missing required variable

✅ **Setup Instructions**
- Step-by-step guide to fix issues
- Links to where to find credentials
- Restart instructions

## Quick Fix Guide

### If variables are missing:

1. **Create `.env.local`** in project root
2. **Copy from template**: `.env.example`

3. **Fill in values** from Supabase and Stripe dashboards
4. **Restart server**: `npm run dev`
5. **Refresh page**: Click "Recheck" button

### Required Variables:

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_STRIPE_PRICE_ID_PREMIUM=price_xxx
VITE_STRIPE_PRICE_ID_PRO=price_xxx
```

## Features

- **Real-time validation** - Click "Recheck" to test again
- **Detailed error messages** - Know exactly what's wrong
- **Format validation** - Ensures keys have correct prefixes
- **Connection testing** - Verifies services are accessible
- **Setup guidance** - Step-by-step instructions included

## Next Steps

Once all checks pass (all green ✓):
1. Your app is ready for development
2. Premium memberships will work
3. Database sync will function
4. Ready to deploy to production

## Troubleshooting

**"Connection failed"** → Check your internet connection
**"Invalid format"** → Verify you copied the full key
**"Missing variable"** → Add to `.env.local` and restart
**Changes not showing** → Restart dev server with `npm run dev`
