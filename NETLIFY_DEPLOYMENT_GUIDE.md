# Deploy to Netlify - Complete Guide

## Quick Deploy Steps

### Option 1: Deploy via Netlify CLI (Fastest)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   # Follow prompts:
   # - Create & configure a new site
   # - Choose your team
   # - Site name: secure-card-generator (or your choice)
   # - Build command: npm run build
   # - Publish directory: dist
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via GitHub (Recommended)

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Migrate to Netlify"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

### Option 3: Drag & Drop Deploy

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to https://app.netlify.com/drop
   - Drag the `dist` folder onto the page
   - Your site will be live in seconds!

## Environment Variables Setup

Add these in Netlify Dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

**Via CLI:**
```bash
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_SUPABASE_ANON_KEY "your_value"
netlify env:set VITE_STRIPE_PUBLIC_KEY "your_value"
```

## Custom Domain Setup

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Verify Deployment

Your blue gradient secure card generator should be live at:
`https://your-site-name.netlify.app`

## Troubleshooting

- **Build fails**: Check build logs in Netlify dashboard
- **404 errors**: Verify `netlify.toml` and `public/_redirects` exist
- **Env vars not working**: Redeploy after adding environment variables

## Netlify Support

- Documentation: https://docs.netlify.com
- Support: https://answers.netlify.com
- Status: https://www.netlifystatus.com
