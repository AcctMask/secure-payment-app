#!/bin/bash

# Quick Netlify Deployment Script
# This script automates the deployment to Netlify

echo "🚀 Starting Netlify Deployment..."
echo ""

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null
then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify
echo "🔐 Logging into Netlify..."
netlify login

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo ""
echo "✅ Deployment complete!"
echo "🎉 Your blue gradient secure card generator is now live!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Netlify dashboard"
echo "2. Test your deployment URL"
echo "3. Configure custom domain (optional)"
echo ""
echo "Environment variables needed:"
echo "  - VITE_SUPABASE_URL"
echo "  - VITE_SUPABASE_ANON_KEY"
echo "  - VITE_STRIPE_PUBLIC_KEY"
