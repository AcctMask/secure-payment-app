#!/bin/bash

# Complete Deployment Pipeline
# Syncs code to GitHub → Monitors Vercel deployment → Health checks → Opens browser

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║     Complete Deployment Pipeline v1.0             ║${NC}"
echo -e "${PURPLE}║     Git Sync → Vercel Deploy → Health Check       ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Sync to GitHub
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 1: Syncing to GitHub${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "./auto-sync.sh" ]; then
    ./auto-sync.sh
else
    echo "Error: auto-sync.sh not found"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ GitHub sync complete!${NC}"
echo ""

# Wait for Vercel webhook to trigger
echo -e "${BLUE}Waiting 5 seconds for Vercel to detect changes...${NC}"
sleep 5

# Step 2: Monitor deployment
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}STEP 2: Monitoring Vercel Deployment${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "./deploy-monitor.sh" ]; then
    ./deploy-monitor.sh
else
    echo "Error: deploy-monitor.sh not found"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🎉 DEPLOYMENT COMPLETE! 🎉                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
