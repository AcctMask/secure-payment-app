# 🚨 CRITICAL: Force Vercel to Rebuild with Live Keys

## THE PROBLEM

You're still seeing "Test Mode" because **Vite bakes environment variables into the build at compile time**. Even though you set live keys in Vercel, the currently deployed app was built BEFORE you added them.

**Your app needs to be REBUILT to pick up the new environment variables.**

---

## ✅ SOLUTION: Trigger New Deployment

### Option 1: Redeploy from Vercel Dashboard (FASTEST)

1. Go to: https://vercel.com/dashboard
2. Click your project (`sp4all`)
3. Go to **Deployments** tab
4. Find the latest deployment
5. Click **⋮** (three dots) → **Redeploy**
6. Click **Redeploy** again to confirm
7. Wait 1-2 minutes for build to complete

### Option 2: Push Empty Commit from Terminal

```bash
cd /path/to/your/project
git commit --allow-empty -m "Force rebuild with live Stripe keys"
git push origin main
```

This triggers a fresh build automatically.

---

## 🔍 VERIFY IT WORKED

After deployment completes:

1. **Hard refresh your browser:**
   - Safari: `Cmd + Option + R`
   - Chrome: `Cmd + Shift + R`

2. **Open browser console** (Cmd + Option + C)

3. **Look for this log:**
   ```
   🔑 Stripe Key Check: {
     keyExists: true,
     keyPrefix: "pk_live_",
     isLive: true,
     isTest: false
   }
   ```

4. **Click "Join Premium"** - you should see:
   - ✅ Stripe Checkout form (NOT test card instructions)
   - ✅ Real payment form
   - ✅ No "Test Mode" banner

---

## 🎯 WHY THIS HAPPENS

Vite replaces `import.meta.env.VITE_*` at **build time**:

```javascript
// Before build:
const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// After build (baked into JavaScript):
const key = "pk_live_51S8o3..."; // Whatever was set during build
```

**Changing env vars in Vercel dashboard doesn't update already-built code.**

You must rebuild to pick up new values.

---

## ✅ CHECKLIST

- [ ] Redeployed from Vercel (or pushed new commit)
- [ ] Waited for build to complete (green checkmark)
- [ ] Hard refreshed browser
- [ ] Checked console shows `isLive: true`
- [ ] Tested payment flow - no test mode warning

---

**After this, your live Stripe keys will be active! 🎉**
