# Stripe Setup Guide for Payment Cards

## Quick Fix (To Remove Error Message)

The `.env.local` file has been created with a placeholder key. Restart your development server:

```bash
npm run dev
```

## Proper Stripe Setup (For Real Payments)

### Step 1: Create a Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. Verify your email

### Step 2: Get Your Test API Keys
1. Go to [Test API Keys](https://dashboard.stripe.com/test/apikeys)
2. You'll see two keys:
   - **Publishable key**: Starts with `pk_test_`
   - **Secret key**: Starts with `sk_test_` (click "Reveal test key")

### Step 3: Update Your .env.local File
1. Open `.env.local` in your project root
2. Replace the placeholder with your actual keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
```

### Step 4: Restart Your Development Server
```bash
npm run dev
```

## Testing Payments

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Important Notes

- **Test Mode**: The keys starting with `pk_test_` and `sk_test_` are for testing only
- **No Real Charges**: Test mode doesn't process real payments
- **Keep Keys Secret**: Never commit your actual keys to version control
- The `.env.local` file is already in `.gitignore` for security

## Troubleshooting

If you still see the error after adding keys:
1. Make sure `.env.local` is in your project root (same level as package.json)
2. Restart your development server completely (Ctrl+C then npm run dev)
3. Clear your browser cache
4. Check that your key starts with `pk_test_` (not `sk_test_`)