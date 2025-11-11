# 🚀 Vercel Environment Variables - Simple Setup

## Why Can't I Save Code Changes?

This could be due to:
1. **Git permissions** - Check if you have write access to the repository
2. **File locks** - Close and reopen your editor
3. **Git conflicts** - Run `git status` to check for conflicts
4. **Vercel deployment blocking** - Vercel doesn't prevent code changes

**Quick Fix:**
```bash
git add .
git commit -m "update"
git push
```

---

## 🎯 What Variables to Enter in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Required Variables (5 total):

#### 1. VITE_SUPABASE_URL
- Get from: https://supabase.com/dashboard
- Click your project → Settings → API
- Copy "Project URL" (looks like: `https://xxxxx.supabase.co`)

#### 2. VITE_SUPABASE_ANON_KEY
- Same location as above
- Copy "anon public" key (starts with `eyJ...`)

#### 3. VITE_STRIPE_PUBLISHABLE_KEY
- Get from: https://dashboard.stripe.com/apikeys
- Copy "Publishable key" 
- Use `pk_test_...` for testing OR `pk_live_...` for production

#### 4. VITE_STRIPE_PREMIUM_PRICE_ID
- Get from: https://dashboard.stripe.com/products
- Click your Premium product → Copy the Price ID (starts with `price_...`)

#### 5. VITE_STRIPE_PRO_PRICE_ID
- Same as above, but for your Pro product

---

## ✅ How to Add in Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter Name: `VITE_SUPABASE_URL`
5. Enter Value: (paste from Supabase)
6. Check all environments: ✅ Production ✅ Preview ✅ Development
7. Click **Save**
8. Repeat for all 5 variables

---

## 🔄 After Adding Variables

1. Go to **Deployments** tab
2. Click **•••** on latest deployment → **Redeploy**
3. Check "Use existing Build Cache" is OFF
4. Click **Redeploy**

---

## 🆘 Still Having Issues?

**Check your local .env.local file:**
```bash
cat .env.local
```

If empty, create it with the same 5 variables above.
