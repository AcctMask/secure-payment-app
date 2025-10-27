# GitHub Actions Setup Guide

## Quick Setup (5 Minutes)

Your GitHub Actions workflow files already exist in `.github/workflows/`. You just need to configure secrets.

### Step 1: Get Your Vercel Credentials

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token (save it - you can't see it again!)

### Step 2: Get Vercel Project IDs

In your terminal or Vercel dashboard:
```bash
# Find these in Vercel Dashboard → Project Settings → General
VERCEL_ORG_ID: Your Team/Org ID
VERCEL_PROJECT_ID: Your Project ID
```

Or visit: `https://vercel.com/[your-username]/[project-name]/settings`

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repo
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

**Required Secrets:**
```
VERCEL_TOKEN = [token from Step 1]
VERCEL_ORG_ID = [from Vercel project settings]
VERCEL_PROJECT_ID = [from Vercel project settings]
VITE_SUPABASE_URL = [your Supabase project URL]
VITE_SUPABASE_ANON_KEY = [your Supabase anon key]
VITE_STRIPE_PUBLIC_KEY = [your Stripe publishable key]
```

### Step 4: Test the Workflow

1. Make a small change to any file
2. Commit and push to `main` branch
3. Go to GitHub → **Actions** tab
4. Watch the workflow run!

## What the Workflow Does

✅ **Validate** - Checks environment variables exist  
✅ **Build** - Runs TypeScript, ESLint, builds app  
✅ **Deploy** - Deploys to Vercel production  

## Troubleshooting

### "Workflow not running"
- Check `.github/workflows/` folder exists in your repo
- Ensure you pushed to `main` branch
- Check Actions tab isn't disabled (Settings → Actions → Allow all actions)

### "Secrets not found"
- Double-check secret names match exactly (case-sensitive)
- Verify you added them to the correct repo
- Secrets should be under Settings → Secrets and variables → Actions

### "Build failed"
- Check the Actions tab for error details
- Verify all environment variables are correct
- Test build locally: `npm run build`

## Manual Deployment (Backup)

If Actions fail, deploy directly:
```bash
npm install -g vercel
vercel --prod
```

## Status Badge (Optional)

Add to your README.md:
```markdown
![Deploy](https://github.com/[username]/[repo]/workflows/Deploy%20to%20Vercel/badge.svg)
```
