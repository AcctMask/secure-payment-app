# EXACT COMMANDS - Copy & Paste Ready

## ⚠️ CRITICAL: Read Before Starting
- Backup your repository first
- These commands will rewrite Git history
- All team members must re-clone after completion
- This process takes 30-60 minutes

---

## STEP 1: Install git-filter-repo

### macOS:
```bash
brew install git-filter-repo
```

### Ubuntu/Debian:
```bash
sudo apt-get install git-filter-repo
```

### Windows (with Python):
```bash
pip install git-filter-repo
```

### Manual Installation (any OS):
```bash
curl -o git-filter-repo https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo
chmod +x git-filter-repo
sudo mv git-filter-repo /usr/local/bin/
```

---

## STEP 2: Backup Your Repository

```bash
cd /path/to/your/project
cd ..
cp -r your-project-name your-project-name-backup
cd your-project-name
```

---

## STEP 3: Create Fresh Clone

```bash
cd ..
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git temp-cleanup
cd temp-cleanup
```

---

## STEP 4: Remove Secret from History

Replace `sk_live_YOUR_SECRET_KEY` with your actual exposed key:

```bash
git filter-repo --replace-text <(echo 'sk_live_YOUR_SECRET_KEY==>REMOVED_SECRET_KEY')
```

**Alternative - Remove entire file:**
```bash
git filter-repo --path .env --invert-paths
```

---

## STEP 5: Force Push to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push origin --force --all
git push origin --force --tags
```

---

## STEP 6: Rotate Stripe Secret Key

### A. Get New Key from Stripe Dashboard:
1. Go to: https://dashboard.stripe.com/apikeys
2. Click "Create secret key"
3. Name it: "Production Key - Rotated [Today's Date]"
4. Copy the new key (starts with `sk_live_`)
5. **SAVE IT IMMEDIATELY** - you can't see it again

### B. Delete Old Compromised Key:
1. Find the old key in the list
2. Click "..." → "Delete"
3. Confirm deletion

---

## STEP 7: Update Local Environment

```bash
# Navigate to your project
cd /path/to/your/project

# Open .env file
nano .env
# OR
code .env

# Replace old key with new key:
# STRIPE_SECRET_KEY=sk_live_NEW_KEY_HERE

# Save and close
```

**Verify it's NOT tracked:**
```bash
git status
# .env should NOT appear in the list
```

---

## STEP 8: Update Supabase Edge Functions

```bash
# Set the new Stripe key in Supabase
supabase secrets set STRIPE_SECRET_KEY=sk_live_NEW_KEY_HERE

# Verify it was set
supabase secrets list

# Redeploy all edge functions
supabase functions deploy create-checkout-session
supabase functions deploy create-payment-intent
supabase functions deploy create-subscription
supabase functions deploy create-virtual-card
supabase functions deploy process-virtual-payment
supabase functions deploy stripe-webhook
```

**If you don't have Supabase CLI:**
1. Go to: https://supabase.com/dashboard/project/YOUR-PROJECT/settings/functions
2. Click "Edge Functions"
3. Click "Secrets"
4. Update `STRIPE_SECRET_KEY` with new value
5. Redeploy each function manually

---

## STEP 9: Update Vercel Environment Variables

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Set new Stripe key for production
vercel env rm STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY production
# Paste your new key when prompted: sk_live_NEW_KEY_HERE

# Set for preview
vercel env rm STRIPE_SECRET_KEY preview
vercel env add STRIPE_SECRET_KEY preview
# Paste your new key when prompted

# Trigger new deployment
vercel --prod
```

**Alternative - Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Find `STRIPE_SECRET_KEY`
5. Click "..." → "Edit"
6. Paste new key
7. Save
8. Go to Deployments → Click "..." → "Redeploy"

---

## STEP 10: Verification Commands

### Verify Secret Removed from Git:
```bash
cd /path/to/your/project
git log --all --full-history --source --find-object=<(echo "sk_live_OLD_KEY")
# Should return nothing

git grep "sk_live_OLD_KEY" $(git rev-list --all)
# Should return nothing
```

### Verify New Key Works Locally:
```bash
# Start your dev server
npm run dev

# Test a Stripe operation in your app
```

### Verify Supabase Has New Key:
```bash
supabase secrets list
# Should show STRIPE_SECRET_KEY (value hidden)
```

### Verify Vercel Has New Key:
```bash
vercel env ls
# Should show STRIPE_SECRET_KEY in production and preview
```

---

## STEP 11: Re-clone Repository (All Team Members)

**Everyone on your team must do this:**

```bash
# Delete old local copy
cd ..
rm -rf your-project-name

# Clone fresh copy
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd your-project-name

# Install dependencies
npm install

# Create .env file with NEW key
cp .env.example .env
nano .env
# Add: STRIPE_SECRET_KEY=sk_live_NEW_KEY_HERE
```

---

## TROUBLESHOOTING

### Error: "git-filter-repo: command not found"
```bash
# Try manual installation
curl -o git-filter-repo https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo
chmod +x git-filter-repo
sudo mv git-filter-repo /usr/local/bin/
```

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

### Error: "failed to push some refs"
```bash
# This is expected - force push is required
git push origin --force --all
```

### Supabase CLI not installed:
```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

---

## HOW TO START CONVERSATION NEXT TIME

Copy and paste this when you return:

```
I'm back! I followed the secret removal guide. Here's my status:

✅ Completed steps: [list which steps you finished]
❌ Stuck on: [describe where you're stuck]
🔍 Current error: [paste any error messages]

My setup:
- Operating System: [macOS/Windows/Linux]
- Git version: [run: git --version]
- Current directory: [run: pwd]

What should I do next?
```

---

## QUICK REFERENCE

**Check if secret still exists:**
```bash
git grep "sk_live_" $(git rev-list --all)
```

**Get new Stripe key:**
https://dashboard.stripe.com/apikeys

**Update Supabase:**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_NEW_KEY
```

**Update Vercel:**
```bash
vercel env add STRIPE_SECRET_KEY production
```

**Verify everything:**
```bash
git log --all --oneline | head -20
supabase secrets list
vercel env ls
```

---

## ✅ COMPLETION CHECKLIST

- [ ] git-filter-repo installed
- [ ] Repository backed up
- [ ] Secret removed from Git history
- [ ] Force pushed to GitHub
- [ ] New Stripe key created
- [ ] Old Stripe key deleted
- [ ] Local .env updated
- [ ] Supabase secrets updated
- [ ] Vercel env vars updated
- [ ] All deployments redeployed
- [ ] Verification commands passed
- [ ] Team members notified to re-clone

---

**Time estimate:** 30-60 minutes
**Difficulty:** Intermediate
**Risk level:** Medium (with backup: Low)
