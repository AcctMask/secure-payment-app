# Stripe Integration Setup Instructions

## 🚨 IMPORTANT: Environment File Missing

The `.env.local` file has been created for you with the correct format. You MUST add your actual Stripe key to make the integration work.

## Quick Setup (Required)

1. **Get your Stripe Test Keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Sign up for a free account if you don't have one
   - Copy your **Publishable key** (starts with `pk_test_`)

2. **Configure Environment Variables**
   - Open the `.env.local` file in your project root
   - Replace `pk_test_your_actual_stripe_key_here` with your actual key:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghijklmnopqrstuvwxyz12345678901234567890
     ```

3. **Restart Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` or `yarn dev` again
   - The Stripe integration will now work

4. **Test the Integration**
   - Use the test card number: `4242424242424242`
   - Use any future expiry date (e.g., 12/25)
   - Use any 3-digit CVC (e.g., 123)
   - The card will be added to your Stripe account for testing

## ❌ Current Error Explanation

The error "Invalid API Key provided" occurs because:
- The `.env.local` file was missing
- The placeholder key `pk_test_your_actual_stripe_key_here` is not a real Stripe key
- You need to replace it with your actual key from Stripe Dashboard

## Test Card Numbers

- **Visa**: 4242424242424242
- **Visa Debit**: 4000056655665556  
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

All test cards work with any future expiry date and any 3-digit CVC.