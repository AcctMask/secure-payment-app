#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Automated GitHub & Deployment Setup ===${NC}\n"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}You need to login to GitHub CLI${NC}"
    gh auth login
fi

# Get repository name
read -p "Enter repository name (default: virtual-card-platform): " REPO_NAME
REPO_NAME=${REPO_NAME:-virtual-card-platform}

echo -e "\n${GREEN}Creating GitHub repository...${NC}"
gh repo create "$REPO_NAME" --private --source=. --remote=origin --push

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create repository${NC}"
    exit 1
fi

echo -e "\n${GREEN}Setting up GitHub Secrets...${NC}"

# Supabase URL
read -p "Enter your Supabase URL: " SUPABASE_URL
gh secret set VITE_SUPABASE_URL --body "$SUPABASE_URL"

# Supabase Anon Key
read -p "Enter your Supabase Anon Key: " SUPABASE_KEY
gh secret set VITE_SUPABASE_ANON_KEY --body "$SUPABASE_KEY"

# Stripe Publishable Key
read -p "Enter your Stripe Publishable Key: " STRIPE_KEY
gh secret set VITE_STRIPE_PUBLISHABLE_KEY --body "$STRIPE_KEY"

echo -e "\n${GREEN}✓ Setup Complete!${NC}"
echo -e "\nNext steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository: $REPO_NAME"
echo "3. Add the same environment variables in Vercel"
echo "4. Deploy!"
