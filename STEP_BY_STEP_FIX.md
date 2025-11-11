# STEP-BY-STEP FIX (You're in the right directory!)

## ✅ Step 1: You're already here!
You've successfully navigated to: `/Users/stephenpashoian/Desktop/secure-payment-app`

## 📝 Step 2: Get Your Supabase Anon Key

1. Visit: https://supabase.com/dashboard/project/oxkrsmhccberdhvdhgyz/settings/api
2. Copy the **anon/public** key (it starts with `eyJ...`)

## 🔧 Step 3: Update .env.local File

Run this command to open the file:
```bash
nano .env.local
```

Update these two lines:
```
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Save and exit:**
- Press `Ctrl + O` (save)
- Press `Enter` (confirm)
- Press `Ctrl + X` (exit)

## 🚀 Step 4: Restart Dev Server

```bash
npm run dev
```

## ✅ Done!
Your app should now connect to the correct Supabase project!
