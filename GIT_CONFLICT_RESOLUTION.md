# Git Conflict Resolution - Step by Step

## Your Situation
- Local changes exist that aren't committed
- GitHub has changes you don't have locally
- Need to merge both together

## Solution - Run These Commands in Order:

### Step 1: Save Your Local Changes
```bash
git add .
git commit -m "Local changes - syncing with remote"
```

### Step 2: Pull Remote Changes
```bash
git pull origin main --rebase
```

**If you see merge conflicts:**
- Git will tell you which files have conflicts
- Open each file and look for `<<<<<<<`, `=======`, `>>>>>>>`
- Keep the code you want, delete the conflict markers
- Then run:
```bash
git add .
git rebase --continue
```

**If no conflicts, proceed to Step 3**

### Step 3: Push Everything to GitHub
```bash
git push origin main
```

---

## Alternative: Use Merge Instead of Rebase

If rebase is causing issues, try a regular merge:

```bash
git add .
git commit -m "Local changes"
git pull origin main
git push origin main
```

---

## Nuclear Option: Force Push (Use with Caution)

⚠️ **Only if you're SURE your local version is correct:**

```bash
git add .
git commit -m "Latest version"
git push origin main --force
```

This will overwrite GitHub with your local version.

---

## After Successful Push

1. Check GitHub - refresh the page, commits should update
2. Wait 2-3 minutes for Vercel to auto-deploy
3. Visit your site in incognito mode to see changes
4. Clear cache if needed: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Still Having Issues?

Run this to see what's different:
```bash
git status
git log --oneline -5
```

This shows your recent commits and current state.
