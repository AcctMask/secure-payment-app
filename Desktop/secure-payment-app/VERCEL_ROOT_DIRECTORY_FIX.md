# 🎯 VERCEL ROOT DIRECTORY FIX

## Common Issue: Wrong Root Directory

If Vercel is deploying from the wrong folder, it might be showing old files.

## ✅ Fix Root Directory Setting

### Step 1: Check Current Setting
1. Go to Vercel Dashboard
2. Click your project
3. Click **Settings** → **General**
4. Scroll to **"Root Directory"**

### Step 2: Set Correct Root
Your Root Directory should be:
- **EMPTY** (blank field) 
- OR set to **`.`** (single dot)
- OR set to **`/`** (forward slash)

### Step 3: Save & Redeploy
1. Click **Save**
2. Go to **Deployments**
3. Click **Redeploy** on latest
4. ✅ **UNCHECK** "Use existing Build Cache"
5. Click **Redeploy**

---

## 🔍 Verify Build Settings

While in Settings → General, also check:

### Build & Development Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build` or `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables
Make sure these are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

---

## 🚨 If Still Showing Diagnostics

The issue is likely that GitHub doesn't have your latest code.

**Run these commands:**
```bash
git add .
git commit -m "fix: remove diagnostics, deploy v3.0"
git push origin main
```

Then wait 2-3 minutes for Vercel auto-deploy.
