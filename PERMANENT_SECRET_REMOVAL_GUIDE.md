# PERMANENT SECRET REMOVAL FROM GIT HISTORY

## The Problem
Your `.env.local.save` file with Stripe secrets was committed to Git history. Even though you deleted it, GitHub blocks pushes because the secret exists in previous commits.

## PERMANENT SOLUTION (Complete Steps)

### Step 1: Install git-filter-repo (Recommended Method)

```bash
# Install git-filter-repo
pip3 install git-filter-repo

# OR if you don't have pip3
brew install git-filter-repo
```

### Step 2: Backup Your Repository (Safety First)

```bash
# Create a backup of your entire project
cd ..
cp -r secure-payment-app secure-payment-app-backup
cd secure-payment-app
```

### Step 3: Remove the Secret File from ALL Git History

```bash
# This removes .env.local.save from every commit in history
git filter-repo --path .env.local.save --invert-paths --force
```

### Step 4: Force Push to GitHub

```bash
# Push the cleaned history to GitHub
git push origin main --force
```

### Step 5: CRITICAL - Rotate Your Stripe API Key

**The exposed key is compromised and MUST be replaced:**

1. Go to: https://dashboard.stripe.com/apikeys
2. Find the key that starts with `sk_test_...` (the one in your old file)
3. Click the **three dots** → **Delete**
4. Click **Create secret key** → Name it "Secure Payment App"
5. Copy the new key immediately

### Step 6: Update Your Environment Variables

**Local environment:**
```bash
# Edit your .env.local file
nano .env.local

# Replace the old VITE_STRIPE_SECRET_KEY with the NEW key
# Save: Ctrl+X, then Y, then Enter
```

**Supabase Edge Functions:**
```bash
# Update Supabase secrets with new key
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_NEW_KEY_HERE
```

**Vercel (if deployed):**
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Find `VITE_STRIPE_SECRET_KEY`
3. Edit and replace with new key
4. Redeploy

### Step 7: Verify It Worked

```bash
# Check that the file is gone from history
git log --all --full-history -- .env.local.save

# Should return nothing. If it shows commits, the removal failed.
```

### Step 8: Clean Up Team Members (If Applicable)

If anyone else has cloned your repo:

```bash
# They need to delete their local copy and re-clone
rm -rf secure-payment-app
git clone https://github.com/AcctMask/secure-payment-app.git
```

---

## ALTERNATIVE: BFG Repo Cleaner (Faster but Less Precise)

```bash
# Install BFG
brew install bfg

# Remove the file from history
bfg --delete-files .env.local.save

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin main --force
```

Then follow Steps 5-8 above.

---

## What Went Wrong?

- `.env.local.save` was accidentally committed
- Git stores ALL history forever
- GitHub detected the Stripe secret in old commits
- Deleting the file only removes it from current state, not history

---

## Prevention for Future

Add to `.gitignore`:
```
.env*
!.env.example
*.save
*.backup
```

---

## WHAT TO ASK NEXT TIME YOU RETURN

Copy and paste this when you come back:

**"I followed the permanent secret removal guide. Here's what happened:**
- **[SUCCESS/ERROR]** git-filter-repo installation
- **[SUCCESS/ERROR]** Removing file from history  
- **[SUCCESS/ERROR]** Force push to GitHub
- **[SUCCESS/ERROR]** Rotated Stripe key
- **[SUCCESS/ERROR]** Updated environment variables

**Current status:** [Describe if push worked or any errors]

**What I need help with:** [Your next question]"

---

## Quick Reference Commands

```bash
# Full process in one go (after installing git-filter-repo)
cd secure-payment-app
git filter-repo --path .env.local.save --invert-paths --force
git push origin main --force

# Then rotate Stripe key and update all environments
```

---

## Emergency Contact Points

- **If force push fails:** Check if branch is protected in GitHub Settings
- **If git-filter-repo fails:** Use BFG method instead
- **If still blocked:** The key might be in another file - search with:
  ```bash
  git log -p | grep "sk_test_"
  ```

---

## Timeline Estimate

- Install tools: 2 minutes
- Remove from history: 1 minute
- Force push: 30 seconds
- Rotate Stripe key: 3 minutes
- Update environments: 5 minutes
- **Total: ~12 minutes**

---

**Remember:** The key in Git history is PUBLIC. Anyone who cloned your repo before the fix has access to it. Key rotation is NOT optional - it's mandatory for security.
