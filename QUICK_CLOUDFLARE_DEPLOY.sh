#!/bin/bash

# Quick Cloudflare Pages Deployment Script
# This script automates the deployment to Cloudflare Pages

echo "🚀 Starting Cloudflare Pages Deployment..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null
then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Login to Cloudflare
echo "🔐 Logging into Cloudflare..."
wrangler login

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=secure-card-generator

echo ""
echo "✅ Deployment complete!"
echo "🎉 Your blue gradient secure card generator is now live!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Cloudflare dashboard"
echo "2. Test your deployment URL"
echo "3. Configure custom domain (optional)"
echo ""
echo "Environment variables needed:"
echo "  - VITE_SUPABASE_URL"
echo "  - VITE_SUPABASE_ANON_KEY"
echo "  - VITE_STRIPE_PUBLIC_KEY"
