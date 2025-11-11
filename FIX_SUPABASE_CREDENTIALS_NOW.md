# 🔧 FIX SUPABASE CREDENTIALS NOW

## The Problem
Your `.env.local` file has the WRONG Supabase URL. It's pointing to a non-existent project.

## ✅ CORRECT VALUES (from your Supabase dashboard)

```bash
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key from the dashboard>
```

## 🚀 QUICK FIX (3 steps)

### Step 1: Get Your Anon Key
1. Visit: https://supabase.com/dashboard/project/oxkrsmhccberdhvdhgyz/settings/api
2. Copy the **anon/public** key (starts with `eyJ...`)

### Step 2: Update .env.local
Open `.env.local` and replace with:

```bash
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (paste your key here)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (keep your existing Stripe key)
```

### Step 3: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## ✅ Test It
After restarting, try the $1 transaction again. The error should be gone!

---
**Why this happened:** Your URL was `ygongssudngqrseklkah` but your actual project is `oxkrsmhccberdhvdhgyz`.
