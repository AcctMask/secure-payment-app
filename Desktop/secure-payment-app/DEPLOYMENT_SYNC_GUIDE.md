# Deployment Sync Guide

## Issue: Local vs Production Differences

If what you see locally differs from securepurchase.co and deploypad.app, follow these steps:

## 1. Clear Vercel Cache (CRITICAL)

```bash
# In Vercel Dashboard:
1. Go to your project
2. Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Clear Build Cache"
5. Go to Deployments tab
6. Click "..." on latest deployment → "Redeploy"
7. Check "Use existing Build Cache" is UNCHECKED
```

## 2. Verify Environment Variables in Vercel

**Required Variables:**
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
- `VITE_STRIPE_PREMIUM_PRICE_ID` = `price_...` (from Products page)
- `VITE_STRIPE_PRO_PRICE_ID` = `price_...` (from Products page)
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

**How to Check:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure all variables are set for "Production"
3. Click "Redeploy" after any changes

## 3. Force Fresh Deployment

```bash
# Option A: Via Git
git commit --allow-empty -m "Force rebuild"
git push

# Option B: Via Vercel Dashboard
1. Deployments tab
2. Click "..." → Redeploy
3. UNCHECK "Use existing Build Cache"
```

## 4. Check Browser Cache

```
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or open in Incognito/Private mode
3. Or clear browser cache completely
```

## 5. Verify Build Logs

```
1. Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check "Building" logs for errors
4. Look for missing environment variables warnings
```

## 6. Common Issues & Fixes

### Issue: "Test Mode" Warning Shows
**Fix:** Price IDs contain test values
- Go to Stripe Dashboard → Products (LIVE mode)
- Copy actual Price IDs (start with `price_`)
- Update in Vercel Environment Variables

### Issue: Buttons Don't Work
**Fix:** JavaScript not loading
- Check browser console for errors
- Verify all imports in AppLayout.tsx
- Clear cache and redeploy

### Issue: Styling Looks Different
**Fix:** CSS not building correctly
- Ensure Tailwind config is correct
- Clear build cache
- Redeploy with fresh build

## 7. Verify Deployment URL

**Check these URLs match your latest code:**
- https://securepurchase.co
- https://generate-secure-random.deploypad.app

**If using custom domain:**
1. Vercel Dashboard → Domains
2. Ensure domain is properly connected
3. Check DNS propagation (can take 24-48 hours)

## 8. Test Functionality Checklist

After deployment, verify:
- [ ] Navigation buttons work
- [ ] "Join Premium" modal opens
- [ ] Stripe checkout redirects properly
- [ ] Code generation works
- [ ] Member profile displays correctly
- [ ] All modals open/close properly

## 9. Emergency Reset

If nothing works:
```bash
1. Delete .vercel folder locally
2. In Vercel Dashboard:
   - Settings → General → Delete Project
3. Re-import from GitHub
4. Set all environment variables
5. Deploy fresh
```

## 10. Contact Support

If issues persist:
- Check Vercel deployment logs
- Check browser console errors
- Verify Stripe webhook status
- Test with different browsers
