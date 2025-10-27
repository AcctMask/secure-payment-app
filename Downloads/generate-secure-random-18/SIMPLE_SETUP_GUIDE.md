# 🚀 Simple 5-Minute Setup Guide

## Option 1: Automated Setup (Recommended)

Run this single command:

```bash
chmod +x AUTOMATED_SETUP.sh && ./AUTOMATED_SETUP.sh
```

The script will:
- ✅ Initialize git
- ✅ Create GitHub repository
- ✅ Push your code
- ✅ Configure GitHub Secrets
- ✅ Set up CI/CD pipeline

## Option 2: Manual Setup

### Step 1: Initialize Git
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository
```bash
# Install GitHub CLI if needed
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create virtual-card-manager --public --source=. --remote=origin

# Push code
git push -u origin main
```

### Step 3: Configure GitHub Secrets
```bash
gh secret set VITE_SUPABASE_URL --body "your-supabase-url"
gh secret set VITE_SUPABASE_ANON_KEY --body "your-anon-key"
gh secret set STRIPE_SECRET_KEY --body "your-stripe-key"
```

### Step 4: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Set Root Directory to `.` (dot)
5. Add environment variables
6. Click Deploy

## 🎉 Done!

Every push to `main` will automatically deploy to Vercel.

## Troubleshooting

**GitHub CLI not found?**
```bash
brew install gh
```

**Authentication issues?**
```bash
gh auth login
```

**Need to update secrets?**
```bash
gh secret set SECRET_NAME --body "new-value"
```
