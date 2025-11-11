# Deploy to Cloudflare Pages - Complete Guide

## Quick Deploy Steps

### Option 1: Deploy via Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Build your app**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   wrangler pages deploy dist --project-name=secure-card-generator
   ```

### Option 2: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Cloudflare Pages"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to https://dash.cloudflare.com
   - Navigate to "Workers & Pages"
   - Click "Create application" → "Pages" → "Connect to Git"
   - Authorize GitHub and select your repository
   - Configure build settings:
     - Framework preset: **Vite**
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Click "Save and Deploy"

### Option 3: Direct Upload

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy via Dashboard**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Click "Upload assets"
   - Drag the `dist` folder
   - Click "Deploy site"

## Environment Variables Setup

Add in Cloudflare Dashboard → Pages → Settings → Environment variables:

**Production Variables:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

**Via CLI:**
```bash
wrangler pages secret put VITE_SUPABASE_URL
wrangler pages secret put VITE_SUPABASE_ANON_KEY
wrangler pages secret put VITE_STRIPE_PUBLIC_KEY
```

## Custom Domain Setup

1. Go to Pages project → Custom domains
2. Click "Set up a custom domain"
3. Add your domain (automatic DNS if using Cloudflare DNS)

## SPA Routing Configuration

Create `public/_redirects` file (already created):
```
/*    /index.html   200
```

Or use `_headers` file for advanced configuration.

## Verify Deployment

Your blue gradient secure card generator should be live at:
`https://secure-card-generator.pages.dev`

## Performance Benefits

- **Global CDN**: 275+ cities worldwide
- **Instant cache purge**: No stale cache issues like Vercel
- **DDoS protection**: Built-in security
- **Unlimited bandwidth**: No bandwidth limits

## Troubleshooting

- **Build fails**: Check build logs in Cloudflare dashboard
- **404 on routes**: Ensure `_redirects` file exists in `public/`
- **Env vars not working**: Redeploy after adding variables

## Cloudflare Support

- Documentation: https://developers.cloudflare.com/pages
- Community: https://community.cloudflare.com
- Support: https://dash.cloudflare.com/?to=/:account/support
- Status: https://www.cloudflarestatus.com
