# Fix Supabase CLI Installation

The npm install didn't work. Try these methods:

## Method 1: Use Homebrew (Recommended for Mac)
```bash
brew install supabase/tap/supabase
```

Then verify:
```bash
supabase --version
```

## Method 2: Check npm global path
```bash
npm config get prefix
echo $PATH
```

If npm's bin folder isn't in PATH, add it:
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

Then try:
```bash
supabase --version
```

## Method 3: Use npx (temporary)
```bash
npx supabase login
npx supabase link --project-ref oxkrsmhccberdhvdhgyz
```

## After CLI works, deploy functions:
```bash
supabase login
supabase link --project-ref oxkrsmhccberdhvdhgyz
supabase secrets set STRIPE_SECRET_KEY=your_live_key
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```
