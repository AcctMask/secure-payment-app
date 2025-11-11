# PERMANENT GIT SECRET REMOVAL - STEP BY STEP

## ⚠️ CRITICAL: This permanently rewrites Git history. Cannot be undone.

---

## STEP 1: INSTALL GIT-FILTER-REPO

```bash
# macOS
brew install git-filter-repo

# Linux (Ubuntu/Debian)
sudo apt-get install git-filter-repo

# Windows (via pip)
pip install git-filter-repo

# Verify installation
git-filter-repo --version
```

---

## STEP 2: BACKUP YOUR REPOSITORY

```bash
# Create a complete backup
cd ~/Desktop
cp -r ~/path/to/your/project ~/Desktop/project-backup-$(date +%Y%m%d)

# Verify backup exists
ls ~/Desktop/project-backup-*
```

---

## STEP 3: REMOVE SECRET FROM GIT HISTORY

```bash
# Navigate to your project
cd ~/path/to/your/project

# Remove the file from ALL Git history
git-filter-repo --path .env.local.save --invert-paths

# This command:
# - Rewrites every commit
# - Removes .env.local.save completely
# - Updates all branches
```

---

## STEP 4: FORCE PUSH TO GITHUB

```bash
# Force push to overwrite remote history
git push origin main --force

# If you have other branches, push them too:
git push origin --all --force
git push origin --tags --force
```

---

## STEP 5: ROTATE STRIPE SECRET KEY (MANDATORY)

### 5A: Delete Compromised Key
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Find your **Secret key** (starts with `sk_test_`)
3. Click the **trash icon** next to it
4. Confirm deletion

### 5B: Create New Secret Key
1. Click **"Create secret key"**
2. Name it: `Main API Key`
3. Copy the new key (starts with `sk_test_...`)
4. **SAVE IT IMMEDIATELY** - you can't see it again

---

## STEP 6: UPDATE LOCAL ENVIRONMENT

```bash
# Edit your local .env.local file
nano .env.local

# Replace the old key with your NEW key:
VITE_STRIPE_SECRET_KEY=sk_test_YOUR_NEW_KEY_HERE

# Save and exit (Ctrl+X, then Y, then Enter)

# Verify it's updated
grep VITE_STRIPE_SECRET_KEY .env.local
```

---

## STEP 7: UPDATE SUPABASE SECRETS

```bash
# Set the new Stripe key in Supabase
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_NEW_KEY_HERE

# Verify it's set
supabase secrets list

# Redeploy edge functions with new secret
supabase functions deploy create-checkout-session
supabase functions deploy create-payment-intent
supabase functions deploy create-subscription
supabase functions deploy stripe-webhook
```

---

## STEP 8: UPDATE VERCEL ENVIRONMENT

### Option A: Via Vercel Dashboard
1. Go to: https://vercel.com/your-username/your-project/settings/environment-variables
2. Find `VITE_STRIPE_SECRET_KEY`
3. Click **Edit**
4. Paste your NEW key: `sk_test_YOUR_NEW_KEY_HERE`
5. Click **Save**
6. Click **Redeploy** at the top

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login
vercel login

# Update the environment variable
vercel env rm VITE_STRIPE_SECRET_KEY production
vercel env add VITE_STRIPE_SECRET_KEY production
# Paste your NEW key when prompted

# Trigger redeploy
vercel --prod
```

---

## STEP 9: VERIFY SECRET IS GONE

```bash
# Search Git history for the old key
git log --all --full-history --source --find-object=$(git hash-object .env.local.save 2>/dev/null || echo "NOTFOUND")

# Should return: "fatal: Not a valid object name NOTFOUND" (GOOD)

# Search for any trace of the file
git log --all --full-history -- .env.local.save

# Should return: nothing (GOOD)

# Check GitHub
# Go to: https://github.com/your-username/your-repo
# Use GitHub search: filename:.env.local.save
# Should return: "We couldn't find any code matching 'filename:.env.local.save'"
```

---

## STEP 10: TEST EVERYTHING WORKS

```bash
# Test locally
npm run dev
# Try making a test payment

# Test Supabase functions
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-payment-intent' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"amount":1000}'

# Check Vercel deployment
# Visit: https://your-app.vercel.app
# Try making a test payment
```

---

## TROUBLESHOOTING

### Error: "git-filter-repo: command not found"
```bash
# Try installing via pip instead
pip3 install git-filter-repo

# Or download directly
curl -o /usr/local/bin/git-filter-repo https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo
chmod +x /usr/local/bin/git-filter-repo
```

### Error: "refusing to overwrite existing backup"
```bash
# Remove old backups
rm -rf .git/filter-repo

# Run git-filter-repo again
git-filter-repo --path .env.local.save --invert-paths
```

### Error: "failed to push some refs"
```bash
# Someone else pushed to the repo
# Pull first (this will fail, but that's expected)
git pull origin main

# Force push anyway (you're rewriting history)
git push origin main --force
```

### Stripe Key Not Working
```bash
# Verify key format
echo $VITE_STRIPE_SECRET_KEY | grep "sk_test_"

# Test key directly
curl https://api.stripe.com/v1/charges \
  -u sk_test_YOUR_NEW_KEY_HERE: \
  -d amount=999 \
  -d currency=usd \
  -d source=tok_visa

# Should return JSON (not an error)
```

### Supabase Functions Still Using Old Key
```bash
# Delete and recreate all functions
supabase functions delete create-checkout-session
supabase functions delete create-payment-intent
supabase functions delete create-subscription
supabase functions delete stripe-webhook

# Redeploy with new secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_NEW_KEY_HERE
supabase functions deploy create-checkout-session
supabase functions deploy create-payment-intent
supabase functions deploy create-subscription
supabase functions deploy stripe-webhook
```

---

## HOW TO START CONVERSATION NEXT TIME

Copy and paste this when you return:

```
I followed the PERMANENT_GIT_SECRET_REMOVAL.md guide to remove secrets from Git history.

Current status:
- [ ] Installed git-filter-repo
- [ ] Created backup
- [ ] Ran git-filter-repo command
- [ ] Force pushed to GitHub
- [ ] Rotated Stripe key
- [ ] Updated local .env.local
- [ ] Updated Supabase secrets
- [ ] Updated Vercel environment
- [ ] Verified secret is gone
- [ ] Tested everything works

I'm stuck at step: [NUMBER]
Error message: [PASTE ERROR HERE]
```

---

## WHAT HAPPENS AFTER THIS

✅ **Secret is permanently removed** from Git history  
✅ **Old Stripe key is deleted** and can't be used  
✅ **New Stripe key is active** everywhere  
✅ **GitHub security alert will close** within 24 hours  
✅ **Your repository is secure**  

---

## IMPORTANT NOTES

1. **All collaborators must re-clone** the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. **Never commit secrets again**:
   - Always use `.env.local` (already in .gitignore)
   - Never commit `.env.local.save` or similar files
   - Use environment variables for all secrets

3. **This is a one-time fix** - you won't need to do this again if you follow best practices

---

**Good luck! See you in a couple days. 🚀**
