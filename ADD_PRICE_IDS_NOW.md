# Add Stripe Price IDs Now

## Run this command in your terminal:

```bash
nano .env.local
```

## Add these two lines at the end of the file:

```
VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM
```

## Your complete .env.local should have 6 lines total:
1. VITE_SUPABASE_URL=...
2. VITE_SUPABASE_ANON_KEY=...
3. VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
4. (blank line - optional)
5. VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
6. VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM

## Save and exit nano:
- Press `Ctrl + O` (save)
- Press `Enter` (confirm)
- Press `Ctrl + X` (exit)

## Verify:
```bash
node scripts/check-env.js
```

You should now see ✅ for Premium and Pro price IDs!
