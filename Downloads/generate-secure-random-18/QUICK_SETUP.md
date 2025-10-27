# Quick Setup for Payment Processing

## Step 1: Set up Stripe (5 minutes)

1. **Get your Stripe keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

2. **Create a `.env` file in the root directory:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Stripe keys to `.env`:**
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

## Step 2: Test Payment Flow

1. **Restart the development server:**
   ```bash
   npm run dev
   ```

2. **Test membership purchase:**
   - Click "Join Premium" or "Join Professional"
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/25)
   - Any 3-digit CVC (e.g., 123)

3. **Test virtual card payments:**
   - Click "Generate New Code" on any account
   - Copy the generated code
   - Click "Tap for Secure Purchase"
   - Paste the code when prompted

## Test Cards for Different Scenarios

- **Successful payment:** `4242 4242 4242 4242`
- **Card declined:** `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`
- **3D Secure required:** `4000 0025 0000 3155`

## Troubleshooting

### Card input fields not working?
- The app will automatically fall back to manual input fields if Stripe is not configured
- Make sure your `.env` file has the correct Stripe publishable key
- Restart the dev server after adding environment variables

### Payment not processing?
- Check browser console for errors
- Verify Stripe keys are correct
- Ensure you're using test keys (starting with `pk_test_` and `sk_test_`)

### Need Supabase for full functionality?
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Add Supabase credentials to `.env`
- Deploy Edge Functions for complete payment processing

## Support
For detailed setup instructions, see:
- [STRIPE_SETUP_INSTRUCTIONS.md](./STRIPE_SETUP_INSTRUCTIONS.md)
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)