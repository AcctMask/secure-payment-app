#!/bin/bash

# Auto-Sync Script for Git Repository
# Safely syncs local changes with GitHub

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BRANCH="main"
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}=== Git Auto-Sync Started ===${NC}"
echo "Timestamp: $(date)"
echo ""

# Function to print colored messages
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Function to create backup
create_backup() {
    print_info "Creating backup branch: $BACKUP_BRANCH"
    git branch "$BACKUP_BRANCH" 2>/dev/null || true
    print_success "Backup created"
}

# Function to rollback
rollback() {
    print_error "Sync failed. Rolling back..."
    git merge --abort 2>/dev/null || true
    git rebase --abort 2>/dev/null || true
    print_warning "Rollback complete. Your changes are safe."
    print_info "Backup branch available: $BACKUP_BRANCH"
    exit 1
}

# Trap errors and rollback
trap rollback ERR

# Step 1: Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository!"
    exit 1
fi
print_success "Git repository detected"

# Step 2: Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_info "Uncommitted changes detected"
    
    # Create backup before proceeding
    create_backup
    
    # Show changes
    echo ""
    print_info "Changes to be committed:"
    git status -s
    echo ""
    
    # Commit with timestamp
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    print_info "Committing changes: $COMMIT_MSG"
    git add .
    git commit -m "$COMMIT_MSG"
    print_success "Changes committed"
else
    print_info "No uncommitted changes"
fi

# Step 3: Fetch remote changes
print_info "Fetching remote changes..."
git fetch origin "$BRANCH"
print_success "Fetch complete"

# Step 4: Check if remote has new commits
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
BASE=$(git merge-base @ @{u} 2>/dev/null || echo "")

if [ -z "$REMOTE" ]; then
    print_warning "No remote tracking branch found"
    print_info "Pushing to origin/$BRANCH..."
    git push -u origin "$BRANCH"
    print_success "Push complete!"
    exit 0
fi

if [ "$LOCAL" = "$REMOTE" ]; then
    print_info "Already up to date with remote"
    print_success "Sync complete!"
    exit 0
elif [ "$LOCAL" = "$BASE" ]; then
    print_info "Remote has new changes, pulling..."
    git pull origin "$BRANCH" --ff-only
    print_success "Pull complete!"
elif [ "$REMOTE" = "$BASE" ]; then
    print_info "Local has new changes, pushing..."
    git push origin "$BRANCH"
    print_success "Push complete!"
else
    # Diverged - need to rebase
    print_warning "Local and remote have diverged"
    print_info "Attempting automatic rebase..."
    
    # Create backup before rebase
    create_backup
    
    if git pull origin "$BRANCH" --rebase; then
        print_success "Rebase successful!"
        print_info "Pushing changes..."
        git push origin "$BRANCH"
        print_success "Push complete!"
    else
        print_error "Automatic rebase failed - conflicts detected"
        print_warning "Manual intervention required"
        echo ""
        print_info "To resolve conflicts:"
        echo "  1. Fix conflicts in the listed files"
        echo "  2. Run: git add <resolved-files>"
        echo "  3. Run: git rebase --continue"
        echo "  4. Run: git push origin $BRANCH"
        echo ""
        print_info "To abort and restore backup:"
        echo "  1. Run: git rebase --abort"
        echo "  2. Run: git reset --hard $BACKUP_BRANCH"
        exit 1
    fi
fi

# Step 5: Verify sync
print_info "Verifying sync..."
git fetch origin "$BRANCH"
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
    print_success "Sync verified - local and remote are identical"
else
    print_error "Sync verification failed"
    exit 1
fi

# Cleanup backup branch on success
print_info "Cleaning up backup branch..."
git branch -D "$BACKUP_BRANCH" 2>/dev/null || true

echo ""
print_success "=== Git Auto-Sync Complete ==="
echo ""
print_info "Latest commit:"
git log -1 --oneline
echo ""
print_info "Remote status:"
git remote -v | grep origin | head -1
