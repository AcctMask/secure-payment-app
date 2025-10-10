# 🚀 Quick Start Guide

## Environment Setup (Complete in 5 Minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment

The `.env.local` file is already created with the structure you need. Just add your keys:

#### Get Supabase Credentials (2 minutes)
1. Visit [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing
3. Go to **Settings** → **API**
4. Copy to `.env.local`:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`

#### Get Stripe Test Keys (2 minutes)
1. Visit [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Toggle to **Test Mode** (top right)
3. Copy **Publishable key** to `.env.local`:
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`

### Step 3: Verify Configuration
```bash
npm run check-env
```

This will show:
- ✅ Green = Configured correctly
- ⚠️ Yellow = Using fallback (still works)
- ❌ Red = Missing (some features disabled)

### Step 4: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

## What Works Without Configuration

✅ **Fully Functional (No Setup Required)**:
- Free membership signup
- Virtual card generation (mock)
- Payment account management
- All UI components
- Local state management
- Test member data

⚠️ **Requires Configuration**:
- Stripe payments (Premium/Pro plans)
- Database persistence
- Production deployments

## Testing the Application

### Free Tier (No Config Needed)
1. Click "Get Started Free"
2. Fill out membership form
3. Generate virtual cards
4. Add payment accounts
5. Test purchase flow

### Premium/Pro Tiers (Requires Stripe)
1. Add Stripe keys to `.env.local`
2. Restart dev server
3. Click "Upgrade to Premium"
4. Use test card: `4242 4242 4242 4242`
5. Any future date, any CVC

## Configuration Status

Run this anytime to check your setup:
```bash
npm run check-env
```

## Troubleshooting

### "Stripe not configured" in console
- Add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env.local`
- Must start with `pk_test_` or `pk_live_`
- Restart: `npm run dev`

### Premium buttons disabled
- Verify Stripe key is added
- Check key format (pk_test_...)
- Restart dev server

### "Using fallback Supabase"
- App still works with mock data
- Add real credentials for persistence
- Restart dev server

## Next Steps

1. ✅ Test locally with free tier
2. 🔧 Add Stripe keys for paid features
3. 🗄️ Set up Supabase tables (see SUPABASE_SETUP.md)
4. 🚀 Deploy to Vercel (see DEPLOYMENT.md)

## Documentation

- `ENVIRONMENT_SETUP_GUIDE.md` - Detailed configuration
- `DIAGNOSTIC_REPORT.md` - Feature analysis
- `STRIPE_SETUP_GUIDE.md` - Payment setup
- `SUPABASE_SETUP.md` - Database setup

## Support

Check browser console for detailed status messages:
- Configuration warnings
- API connection status
- Feature availability

All features include helpful error messages and fallbacks!
