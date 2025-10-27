# CI/CD Pipeline Setup Guide

## Overview
Automated deployment pipeline using GitHub Actions that deploys to Vercel on every push to main branch.

## Features
- ✅ Environment variable validation
- ✅ TypeScript type checking
- ✅ ESLint code quality checks
- ✅ Automated build verification
- ✅ Production deployment to Vercel
- ✅ Deployment status notifications

## Prerequisites
1. GitHub repository with code pushed
2. Vercel account with project created
3. Vercel CLI installed locally (for initial setup)

## Setup Steps

### 1. Install Vercel CLI Locally
```bash
npm install -g vercel@latest
```

### 2. Link Your Project to Vercel
```bash
cd /path/to/your/project
vercel login
vercel link
```

This creates a `.vercel` folder with project configuration.

### 3. Get Vercel Credentials

#### Get Vercel Token:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token

#### Get Project IDs:
```bash
cat .vercel/project.json
```

You'll see:
```json
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

### 4. Add GitHub Secrets

Go to your GitHub repo: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add these secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | From `.vercel/project.json` | `orgId` field |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` | `projectId` field |
| `VITE_SUPABASE_URL` | Your Supabase URL | Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase dashboard |
| `VITE_STRIPE_PUBLIC_KEY` | Your Stripe public key | Stripe dashboard |

### 5. Configure Vercel Environment Variables

In Vercel dashboard (https://vercel.com/dashboard):
1. Select your project
2. Go to `Settings` → `Environment Variables`
3. Add the same environment variables for Production:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`

### 6. Push to Main Branch

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

## Workflow Stages

### Stage 1: Validate Environment
- Checks out code
- Installs dependencies
- Validates required environment variables exist
- Fails fast if configuration is missing

### Stage 2: Build Application
- Runs TypeScript type checking
- Runs ESLint for code quality
- Builds the application
- Uploads build artifacts

### Stage 3: Deploy to Vercel
- Only runs on push to main (not PRs)
- Pulls Vercel environment configuration
- Builds production artifacts
- Deploys to Vercel
- Posts deployment URL as commit comment

## Monitoring Deployments

### View Workflow Status
- Go to your GitHub repo
- Click "Actions" tab
- See all workflow runs and their status

### Deployment Notifications
- Successful deployments post a comment on the commit with the deployment URL
- Failed deployments show error details in the Actions log

### Vercel Dashboard
- View all deployments: https://vercel.com/dashboard
- See deployment logs and analytics

## Troubleshooting

### Build Fails on GitHub but Works Locally
- Check that all dependencies are in `package.json`
- Ensure environment variables are set in GitHub Secrets
- Review the Actions log for specific errors

### Deployment Fails
- Verify `VERCEL_TOKEN` is valid and not expired
- Check `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` match your project
- Ensure Vercel project environment variables are configured

### Environment Variable Validation Fails
- Verify all required secrets are added to GitHub
- Check secret names match exactly (case-sensitive)
- Ensure values are not empty

## Testing the Pipeline

### Test on Pull Request
```bash
git checkout -b test-ci
# Make a change
git add .
git commit -m "Test CI pipeline"
git push origin test-ci
# Create PR on GitHub
```

This runs validation and build, but NOT deployment.

### Test Full Deployment
```bash
git checkout main
git merge test-ci
git push origin main
```

This runs all stages including deployment to production.

## Advanced Configuration

### Add Slack Notifications
Add to the deploy job:
```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployment to Vercel completed: ${{ steps.deploy.outputs.url }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Add Test Stage
Before build job, add:
```yaml
test:
  name: Run Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm test
```

### Deploy to Preview on PRs
Add to deploy job conditions:
```yaml
if: github.event_name == 'pull_request'
run: vercel deploy --token=${{ secrets.VERCEL_TOKEN }}
```

## Security Best Practices

1. ✅ Never commit tokens or secrets to code
2. ✅ Use GitHub Secrets for all sensitive data
3. ✅ Rotate Vercel tokens periodically
4. ✅ Use separate tokens for CI/CD vs local development
5. ✅ Review deployment logs for exposed secrets

## Next Steps

- [ ] Set up branch protection rules
- [ ] Add automated testing
- [ ] Configure deployment previews for PRs
- [ ] Set up monitoring and alerts
- [ ] Add performance budgets to CI

## Support

- GitHub Actions Docs: https://docs.github.com/en/actions
- Vercel CLI Docs: https://vercel.com/docs/cli
- Vercel GitHub Integration: https://vercel.com/docs/deployments/git
