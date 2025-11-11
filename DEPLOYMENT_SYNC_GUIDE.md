# 🚀 Automated Deployment Monitoring & Sync Guide

Complete automation for Git push → Vercel deployment → health checks → browser opening.

---

## 📋 Quick Start

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Your Project
```bash
vercel link
```

### 4. Make Scripts Executable
```bash
chmod +x auto-sync.sh
chmod +x deploy-monitor.sh
```

---

## 🔄 Complete Workflow

### Option A: Full Automation (Sync + Deploy + Monitor)
```bash
# Create combined script
cat > deploy-all.sh << 'EOF'
#!/bin/bash
./auto-sync.sh && ./deploy-monitor.sh
EOF

chmod +x deploy-all.sh
./deploy-all.sh
```

### Option B: Step by Step
```bash
# Step 1: Sync to GitHub
./auto-sync.sh

# Step 2: Monitor deployment
./deploy-monitor.sh
```

---

## 🎯 What Each Script Does

### `auto-sync.sh`
✓ Commits changes with timestamp
✓ Pulls latest from GitHub
✓ Handles merge conflicts
✓ Pushes to GitHub
✓ Creates backup branches

### `deploy-monitor.sh`
✓ Monitors Vercel deployment status
✓ Runs health checks on deployed URL
✓ Sends desktop notifications
✓ Opens browser when ready
✓ Offers rollback if deployment fails

---

## 🔧 Advanced Configuration

### Custom Health Check Endpoints
Edit `deploy-monitor.sh`:
```bash
# Add custom health check endpoint
health_check_custom() {
    local url="$1/api/health"
    curl -s "$url" | grep -q "ok"
}
```

### Slack Notifications
Add to `notify()` function:
```bash
# Slack webhook
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\":\"$title: $message\"}"
fi
```

### Email Notifications
```bash
# Using sendmail
notify_email() {
    echo "$2" | mail -s "$1" your@email.com
}
```

---

## 📊 Monitoring Features

### Real-time Status Updates
- Deployment state tracking (QUEUED → BUILDING → READY)
- Elapsed time display
- HTTP status code checking
- Content validation

### Health Check Criteria
1. HTTP 200/301/302 response
2. Page content loads successfully
3. Response time < 10 seconds
4. 3 retry attempts with 5s delay

### Automatic Rollback
- Triggered on health check failure
- Promotes previous deployment
- Confirms before executing
- Preserves deployment history

---

## 🎮 Interactive Commands

### Check Deployment Status
```bash
vercel ls
```

### View Deployment Logs
```bash
vercel logs [deployment-url]
```

### Manual Rollback
```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url] --yes
```

### Inspect Deployment
```bash
vercel inspect [deployment-url]
```

---

## 🔔 Notification Setup

### macOS
Built-in support via `osascript`

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install libnotify-bin
```

### Windows (WSL)
```bash
# Install wsl-notify
npm install -g wsl-notify
```

---

## 🚨 Troubleshooting

### "Vercel CLI not found"
```bash
npm install -g vercel
# or
yarn global add vercel
```

### "No deployment URL found"
```bash
# Link project first
vercel link

# Or deploy manually once
vercel --prod
```

### Health Check Fails
```bash
# Check if URL is accessible
curl -I https://your-app.vercel.app

# Check Vercel logs
vercel logs --follow
```

### Deployment Timeout
Increase `MAX_WAIT_TIME` in script:
```bash
MAX_WAIT_TIME=900  # 15 minutes
```

---

## 🎯 One-Command Deploy

Create alias in `~/.bashrc` or `~/.zshrc`:
```bash
alias deploy='./auto-sync.sh && ./deploy-monitor.sh'
```

Then simply run:
```bash
deploy
```

---

## 📈 CI/CD Integration

### GitHub Actions
```yaml
name: Deploy and Monitor
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Monitor Deployment
        run: ./deploy-monitor.sh
```

---

## 🔐 Environment Variables

Create `.env.deploy`:
```bash
VERCEL_TOKEN=your_token_here
SLACK_WEBHOOK_URL=your_webhook_url
MAX_WAIT_TIME=600
HEALTH_CHECK_RETRIES=3
```

Load in script:
```bash
source .env.deploy
```

---

## 📱 Mobile Notifications

### Using Pushover
```bash
notify_pushover() {
    curl -s \
        --form-string "token=YOUR_APP_TOKEN" \
        --form-string "user=YOUR_USER_KEY" \
        --form-string "message=$1" \
        https://api.pushover.net/1/messages.json
}
```

### Using Telegram
```bash
notify_telegram() {
    curl -s -X POST \
        "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d "chat_id=$TELEGRAM_CHAT_ID" \
        -d "text=$1"
}
```

---

## 🎨 Custom Success Page

After successful deployment, display custom info:
```bash
success_page() {
    clear
    echo "╔════════════════════════════════════╗"
    echo "║     🎉 DEPLOYMENT SUCCESS! 🎉      ║"
    echo "╚════════════════════════════════════╝"
    echo ""
    echo "🌐 URL: $DEPLOYMENT_URL"
    echo "⏱️  Time: $(date)"
    echo "✅ Health: Passed"
    echo "📊 Status: Live"
    echo ""
}
```

---

## 💡 Pro Tips

1. **Run in Background**: `./deploy-monitor.sh &`
2. **Log Output**: `./deploy-monitor.sh | tee deploy.log`
3. **Cron Job**: Schedule regular checks
4. **Pre-deployment Tests**: Add test suite before sync
5. **Post-deployment Smoke Tests**: Validate critical paths

---

## 🆘 Emergency Rollback

Quick rollback command:
```bash
vercel rollback
```

Or use the script:
```bash
# Extract rollback function
rollback_only() {
    source deploy-monitor.sh
    rollback
}
```

---

## 📚 Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Deployment API](https://vercel.com/docs/rest-api)
- [Health Check Best Practices](https://vercel.com/docs/concepts/solutions/health-checks)

---

**Ready to deploy?** Run `./deploy-all.sh` and watch the magic happen! 🚀
