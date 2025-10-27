# SSH Connection Fix Guide

## Your Issue: Permission Denied

Your key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFcY5yWeFwpuUO+K+w1y9EvilU8crBHbKxzX/cb/ga+U steve@spashproperties.com`

## Fix Steps:

### 1. Verify Key in GitHub
- Go to: https://github.com/settings/keys
- Look for a key ending in: `...ga+U steve@spashproperties.com`
- **If NOT there:** Add it again (copy ENTIRE line from cat command)

### 2. Start SSH Agent
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 3. Test Again
```bash
ssh -T git@github.com
```

### 4. If Still Failing - Use HTTPS Instead
```bash
git remote remove origin
git remote add origin https://github.com/AcctMask/acctmask.git
git push -u origin main
```
(GitHub will ask for username/password - use Personal Access Token as password)

### 5. Create Personal Access Token (if using HTTPS)
- Go to: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select: `repo` (all checkboxes)
- Copy token and use as password when pushing

## Quick Push (HTTPS Method)
```bash
git remote set-url origin https://github.com/AcctMask/acctmask.git
git push -u origin main
```
