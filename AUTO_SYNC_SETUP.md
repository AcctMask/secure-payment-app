# Auto-Sync Setup Guide

## Quick Start

### 1. Make Script Executable
```bash
chmod +x auto-sync.sh
```

### 2. Run Auto-Sync
```bash
./auto-sync.sh
```

That's it! The script will:
- ✓ Detect uncommitted changes
- ✓ Commit with timestamp
- ✓ Pull remote changes
- ✓ Handle conflicts automatically
- ✓ Push to GitHub
- ✓ Create backups before risky operations
- ✓ Rollback on failure

---

## Features

### Automatic Conflict Resolution
- Detects diverged branches
- Attempts automatic rebase
- Creates backup before risky operations
- Rolls back on failure

### Safety Features
- Creates timestamped backup branches
- Never loses your work
- Clear error messages
- Step-by-step conflict resolution instructions

### Smart Detection
- Only commits if there are changes
- Only pulls if remote has updates
- Only pushes if local has new commits
- Verifies sync after completion

---

## Usage Examples

### Basic Sync
```bash
./auto-sync.sh
```

### Schedule Automatic Syncs (Optional)

#### Every Hour (macOS/Linux)
```bash
# Add to crontab
crontab -e

# Add this line:
0 * * * * cd /path/to/your/project && ./auto-sync.sh >> sync.log 2>&1
```

#### On File Change (requires fswatch)
```bash
# Install fswatch
brew install fswatch  # macOS
# or apt-get install fswatch  # Linux

# Watch for changes
fswatch -o . | xargs -n1 -I{} ./auto-sync.sh
```

---

## Conflict Resolution

### If Auto-Rebase Fails

The script will show:
```
✗ Automatic rebase failed - conflicts detected
⚠ Manual intervention required
```

**Option 1: Resolve Conflicts**
```bash
# 1. Open conflicted files and fix them
# 2. Mark as resolved
git add <resolved-files>

# 3. Continue rebase
git rebase --continue

# 4. Push changes
git push origin main
```

**Option 2: Abort and Use Backup**
```bash
# Abort the rebase
git rebase --abort

# Restore from backup
git reset --hard backup-YYYYMMDD-HHMMSS
```

---

## Troubleshooting

### "Permission Denied"
```bash
chmod +x auto-sync.sh
```

### "Not a git repository"
```bash
# Initialize git if needed
git init
git remote add origin YOUR_REPO_URL
```

### Force Push (Use with Caution)
If you want to override remote completely:
```bash
git push origin main --force
```

⚠️ **Warning**: Force push will overwrite remote history

---

## Advanced Configuration

### Change Default Branch
Edit `auto-sync.sh` line 13:
```bash
BRANCH="your-branch-name"
```

### Customize Commit Messages
Edit `auto-sync.sh` line 52:
```bash
COMMIT_MSG="Your custom message: $(date '+%Y-%m-%d %H:%M:%S')"
```

### Disable Backup Creation
Comment out lines 28-32 in `auto-sync.sh`

---

## What Happens During Sync

1. **Check Repository** - Verifies you're in a git repo
2. **Detect Changes** - Checks for uncommitted files
3. **Create Backup** - Makes safety backup branch
4. **Commit Changes** - Commits with timestamp
5. **Fetch Remote** - Gets latest from GitHub
6. **Compare Versions** - Checks local vs remote
7. **Sync Strategy**:
   - If identical: Done ✓
   - If remote ahead: Pull
   - If local ahead: Push
   - If diverged: Rebase + Push
8. **Verify** - Confirms sync success
9. **Cleanup** - Removes backup on success

---

## Backup Management

### List Backups
```bash
git branch | grep backup-
```

### Restore from Backup
```bash
git reset --hard backup-YYYYMMDD-HHMMSS
```

### Delete Old Backups
```bash
git branch -D backup-YYYYMMDD-HHMMSS
```

### Delete All Backups
```bash
git branch | grep backup- | xargs git branch -D
```

---

## Integration with Vercel

After successful sync, Vercel will automatically deploy in 2-3 minutes.

**Check deployment:**
1. Go to vercel.com/dashboard
2. View your project
3. See latest deployment from your commit

---

## Tips

- Run before starting work: `./auto-sync.sh`
- Run after finishing work: `./auto-sync.sh`
- Check sync status: `git status`
- View sync history: `git log --oneline`
- Test in incognito after deploy to see changes

---

## Support

If sync fails repeatedly:
1. Check your internet connection
2. Verify GitHub credentials: `git remote -v`
3. Check for large files (>100MB)
4. Review conflicts manually
5. Contact support with error message
