# Platform Migration Checklist

## Pre-Migration

- [x] Local code verified (blue gradient interface present)
- [x] Git repository up to date
- [ ] Environment variables documented
- [ ] Custom domain DNS records noted (if applicable)

## Choose Your Platform

### Netlify (Recommended for Simplicity)
✅ Easiest setup
✅ Excellent documentation
✅ Automatic HTTPS
✅ Form handling built-in
✅ Split testing features

**Best for**: Quick deployment, simple setup

### Cloudflare Pages (Recommended for Performance)
✅ Fastest global CDN
✅ No bandwidth limits
✅ Instant cache purge
✅ Superior DDoS protection
✅ Better for high-traffic sites

**Best for**: Performance, reliability, scale

## Migration Steps

### 1. Prepare Environment Variables

Copy from Vercel or `.env` file:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLIC_KEY=
```

### 2. Deploy to New Platform

**Netlify**: Follow `NETLIFY_DEPLOYMENT_GUIDE.md`
**Cloudflare**: Follow `CLOUDFLARE_DEPLOYMENT_GUIDE.md`

### 3. Configure Environment Variables

Add all environment variables in new platform dashboard

### 4. Test Deployment

- [ ] Site loads correctly
- [ ] Blue gradient interface visible
- [ ] All three account cards present
- [ ] Generate buttons work
- [ ] Purchase modals open
- [ ] Navigation functions
- [ ] No console errors

### 5. Update Domain (Optional)

If using custom domain:
- [ ] Update DNS records to point to new platform
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify SSL certificate

### 6. Cleanup Vercel (Optional)

- [ ] Keep Vercel project for backup
- Or delete Vercel project after confirming new deployment

## Quick Deploy Commands

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Cloudflare
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=secure-card-generator
```

## Verification URLs

After deployment, your app will be available at:
- **Netlify**: `https://[site-name].netlify.app`
- **Cloudflare**: `https://[project-name].pages.dev`

## Rollback Plan

If issues occur:
1. Keep Vercel deployment active during testing
2. Test new platform thoroughly before DNS changes
3. Can switch back by reverting DNS records

## Support Resources

**Netlify**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com

**Cloudflare**
- Docs: https://developers.cloudflare.com/pages
- Community: https://community.cloudflare.com

## Estimated Migration Time

- **Setup**: 5-10 minutes
- **First deploy**: 2-5 minutes
- **DNS propagation** (if custom domain): 0-48 hours
