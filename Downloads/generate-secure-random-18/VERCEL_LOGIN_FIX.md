# Vercel Login Fix Guide

## Problem: Can't Login to Vercel

### Quick Fix (Works 90% of the time)

**Try a Different Browser**
- If you use Chrome, try Firefox or Edge
- Often OAuth gets stuck in one browser but works in another


---

## Detailed Troubleshooting

### Step 1: Clear All Vercel Data
```
1. Go to your browser settings
2. Clear browsing data (Last 24 hours)
3. Check: Cookies, Cached images, Site data
4. Restart browser completely
```

### Step 2: Try Different Login Method
If you normally use GitHub to login:
- Try email/password instead
- Or vice versa

### Step 3: Check GitHub Connection
1. Go to https://github.com/settings/applications
2. Find "Vercel" in Authorized OAuth Apps
3. Click **"Revoke"**
4. Go back to Vercel and reconnect

### Step 4: Disable Browser Extensions
- Ad blockers can break OAuth
- Privacy extensions (Privacy Badger, uBlock Origin)
- Try disabling ALL extensions temporarily

### Step 5: Check Network/VPN
- Disable VPN if you're using one
- Try different network (mobile hotspot)
- Corporate networks sometimes block OAuth

---

## Still Not Working?

### Nuclear Option: Reset Everything
1. **Revoke GitHub access:**
   - https://github.com/settings/applications
   - Revoke Vercel

2. **Clear ALL browser data:**
   - Settings → Clear browsing data → All time
   - Check everything

3. **Use Incognito + Different Browser:**
   - Download Firefox if you use Chrome
   - Open incognito window
   - Go to vercel.com/login

4. **Login with Email (not GitHub):**
   - Use email/password method
   - Reconnect GitHub after you're in

---

## Common Error Messages

**"Something went wrong"**
→ Clear cookies + incognito mode

**"Authorization failed"**
→ Revoke GitHub OAuth, try again

**Infinite redirect loop**
→ Clear cache, disable extensions

**"Session expired"**
→ Clear cookies for vercel.com

---

## Prevention

After you successfully login:
1. Bookmark your Vercel dashboard
2. Stay logged in (don't clear cookies)
3. If you must logout, use email method to login next time

---

## Contact Vercel Support

If nothing works:
- Email: support@vercel.com
- Twitter: @vercel
- Include: Browser, OS, error message screenshot
