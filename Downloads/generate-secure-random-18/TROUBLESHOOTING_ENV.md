# Environment Variables Troubleshooting

## Problem: Diagnostics Still Failing After Adding Keys

### Most Common Issue: Dev Server Not Restarted

**Vite only reads .env.local when the server starts!**

### Solution:

1. **Stop your dev server** (Ctrl+C in terminal)
2. **Restart it**: `npm run dev`
3. **Refresh your browser**
4. **Run diagnostics again**

---

## Verify Your .env.local File Format

Your `.env.local` file should look EXACTLY like this:

```env
VITE_SUPABASE_URL=https://ygongssudngqrseklkah.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
VITE_STRIPE_PREMIUM_PRICE_ID=price_1234567890_REPLACE_ME
VITE_STRIPE_PRO_PRICE_ID=price_0987654321_REPLACE_ME
```

**Important:**
- NO spaces around the `=` sign
- NO quotes around values
- Keys must start with `VITE_` prefix
- Each variable on its own line

---

## Where to Get Your Keys

### Supabase Anon Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy the `anon public` key (starts with `eyJ...`)

### Stripe Publishable Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API Keys
3. Copy `Publishable key` (starts with `pk_test_...`)

### Stripe Price IDs (Optional for now)
1. Products → Create a product
2. Copy the Price ID (starts with `price_...`)

---

## Quick Diagnostic Checklist

✅ File is named `.env.local` (not `.env.local.txt`)
✅ File is in project root (same folder as `package.json`)
✅ No spaces around `=` signs
✅ No quotes around values
✅ Dev server was restarted after editing
✅ Browser was refreshed

---

## Still Not Working?

Check browser console (F12) for errors:
- Look for "Using fallback Supabase configuration" warning
- Check if environment variables are undefined
