# Vercel 404 Error Fix Guide

## Current Configuration

Your `vercel.json` has been updated with the correct configuration for a Vite React SPA:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## Steps to Fix the 404 Error

### 1. Commit and Push Changes
```bash
git add vercel.json
git commit -m "Fix: Add Vercel rewrites for SPA routing"
git push
```

### 2. Trigger a New Deployment
- Go to your Vercel dashboard
- Click on your project
- Go to the "Deployments" tab
- Click "Redeploy" on the latest deployment
- OR: Push a new commit to trigger automatic deployment

### 3. Verify Build Settings in Vercel Dashboard
- Go to Project Settings → General
- **Framework Preset**: Should be "Vite" (auto-detected)
- **Build Command**: `npm run build` or leave empty for auto-detect
- **Output Directory**: `dist` (default for Vite)
- **Install Command**: `npm install` or leave empty

### 4. Clear Vercel Cache (if needed)
If the issue persists:
- In Vercel dashboard, go to Settings → General
- Scroll to "Build & Development Settings"
- Click "Clear Cache" button
- Redeploy

## Why This Happens

Vite builds a Single Page Application (SPA) where routing is handled client-side by React Router. When you access a route directly (e.g., `/about`), Vercel's server doesn't know about this route and returns a 404.

The `rewrites` configuration tells Vercel to serve `index.html` for ALL routes, allowing React Router to handle the routing on the client side.

## Troubleshooting

If you still get 404 errors after following the steps above:

1. **Check if vercel.json is in the root directory** (same level as package.json)
2. **Verify the build succeeded** in Vercel deployment logs
3. **Check the output directory** contains index.html and assets
4. **Try accessing the root URL first** (`https://yourdomain.vercel.app/`) then navigate
5. **Check browser console** for any JavaScript errors

## Alternative Configuration

If the above doesn't work, try this alternative in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

The difference is using `/index.html` instead of `/` as the destination.
