# EXACT STEPS TO DEPLOY RIGHT NOW

## Step 1: Push to GitHub (Run these commands in your terminal)

```bash
git add .
git commit -m "Add environment configuration"
git push origin main
```

If git push fails, run:
```bash
git pull origin main --rebase
git push origin main
```

## Step 2: Configure Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Click "Settings" → "Environment Variables"
4. Add these 5 variables (one at a time):

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://ygongssudngqrseklkah.supabase.co`

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnb25nc3N1ZG5ncXJzZWtsa2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjMzOTUsImV4cCI6MjA3Mzc5OTM5NX0.ExOp2hOJ1lsrF6qaAQhIAOx0WnvrPibmVsecWqy-uWw`

**Variable 3:**
- Key: `VITE_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru`

**Variable 4:**
- Key: `VITE_STRIPE_PREMIUM_PRICE_ID`
- Value: `price_1SEEYgCYgC6lPmKTgZSTYJMq`

**Variable 5:**
- Key: `VITE_STRIPE_PRO_PRICE_ID`
- Value: `price_1SEEazCYgC6lPmKTc2wZ6yYM`

## Step 3: Redeploy

After adding all variables, click "Redeploy" in Vercel

## Step 4: Test

Visit your Vercel URL and try purchasing a membership

---

**That's it. No more circles.**
