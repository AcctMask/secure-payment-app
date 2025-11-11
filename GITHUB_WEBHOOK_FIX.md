# Fix GitHub Webhook After Re-Import

## The Problem
When you delete a Vercel project and re-import from GitHub, the webhook often breaks or points to the wrong project.

## Check Webhook Status

### In GitHub:
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Webhooks** in left sidebar
4. Look for Vercel webhooks

**What you might see:**
- ❌ Multiple Vercel webhooks (old + new)
- ❌ Webhook with red X (failed deliveries)
- ❌ Webhook pointing to old project ID
- ✅ One active webhook with green checkmark

## Fix It

### Option 1: Delete Old Webhooks (RECOMMENDED)
1. In GitHub → Settings → Webhooks
2. **Delete ALL Vercel webhooks** (even if they look active)
3. Go to Vercel Dashboard
4. Settings → Git → **Disconnect** repository
5. Settings → Git → **Reconnect** repository
6. This creates a fresh webhook

### Option 2: Verify Webhook URL
1. Click on the Vercel webhook in GitHub
2. Check the Payload URL - should be:
   ```
   https://api.vercel.com/v1/integrations/deploy/...
   ```
3. Scroll down to **Recent Deliveries**
4. Click latest delivery → check Response
5. If you see 404 or error → webhook is broken

### Option 3: Manual Webhook Test
1. In GitHub webhook settings
2. Scroll to bottom
3. Click **Redeliver** on a recent delivery
4. Check if Vercel starts a deployment

## After Fixing Webhook

### Test It:
```bash
# Make a tiny change
echo "# webhook test" >> README.md
git add README.md
git commit -m "test webhook"
git push origin main
```

### Watch Vercel:
- Should see new deployment appear within 30 seconds
- Commit message: "test webhook"
- Commit hash: b58e6a6 or newer

## If Still Not Working

### Nuclear Option:
1. Vercel: Delete project completely
2. GitHub: Delete ALL Vercel webhooks manually
3. Vercel: Import fresh from GitHub
4. During import, ensure "Auto-deploy" is checked

### Alternative: Use Vercel CLI
```bash
npm i -g vercel
vercel --prod
```
This bypasses webhooks entirely.

## Check Current Status

Run this to see what commit is deployed:
```bash
curl -s https://your-app.vercel.app | grep -o 'commit-[a-z0-9]*' | head -1
```

Expected: commit-b58e6a6 or newer
