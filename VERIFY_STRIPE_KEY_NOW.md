# ✅ Verify Stripe Key is Working

## The Issue You're Seeing
The browser console still shows:
```
⚠️ No Stripe publishable key found
```

This means the environment variable isn't reaching your deployed site yet.

---

## Step 1: Verify the Key is Actually in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** tab
3. Click **Environment Variables** (left sidebar)
4. Look for: `VITE_STRIPE_PUBLISHABLE_KEY`
5. **Value should be:** `pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru`
6. **Environment should be checked:** Production ✓

If it's not there or wrong, add/fix it now.

---

## Step 2: Force a Fresh Deploy

After adding the environment variable, you MUST redeploy:

1. Go to **Deployments** tab in Vercel
2. Find the **latest deployment** (top of list)
3. Click the **⋮** (three dots) on the right
4. Click **Redeploy**
5. Click **Redeploy** again to confirm
6. **Wait for the green checkmark** (usually 1-2 minutes)

---

## Step 3: Hard Refresh Your Browser

**On Mac:**
- Hold `Command` + `Shift` + press `R` (all at once)
- OR: `Command` + `Option` + `E` (clears cache), then `Command` + `R`

**On Windows:**
- Hold `Ctrl` + `Shift` + press `R`
- OR: Hold `Ctrl` + press `F5`

**What should happen:**
- Page reloads (might look the same, that's OK)
- Behind the scenes, it's fetching fresh code

---

## Step 4: Check Console Again

1. Open Console: `Command` + `Option` + `C` (Mac) or `F12` (Windows)
2. Refresh page one more time: `Command` + `R`
3. **Look for this message:**
   ```
   ✅ Stripe configured with valid key: pk_live_...
   ```

4. **The warning should be GONE:**
   ```
   ⚠️ No Stripe publishable key found  ← Should NOT appear
   ```

---

## Step 5: Test the Buttons

1. Go to your site homepage
2. Scroll to "Join Premium" or "Join Professional" buttons
3. Click one
4. **Should open:** Real Stripe checkout page
5. **Should NOT see:** "Disabled" or error message

---

## Still Not Working?

If you still see the warning after all these steps:

### Check Vercel Build Logs
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Building** section
4. Search for: `VITE_STRIPE_PUBLISHABLE_KEY`
5. Should see: `VITE_STRIPE_PUBLISHABLE_KEY: pk_live_...` in the logs

If it's NOT in the build logs, the environment variable isn't being picked up during build.

### Nuclear Option - Clear Everything
1. Close all browser tabs with your site
2. Clear browser cache completely:
   - Mac: Safari → Preferences → Privacy → Manage Website Data → Remove All
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
3. Restart browser
4. Visit site again

---

## Expected Result

**Console should show:**
```
✅ Stripe configured with valid key: pk_live_51S8o3LCYgC6lPmKT...
```

**Buttons should:**
- Be clickable (not disabled)
- Open Stripe checkout when clicked

Let me know what you see after these steps!
