#!/bin/bash

# Vercel Deployment Monitor & Health Check Script
# Monitors deployment, checks health, and handles rollback

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
MAX_WAIT_TIME=600  # 10 minutes max wait
CHECK_INTERVAL=10  # Check every 10 seconds
HEALTH_CHECK_RETRIES=3
HEALTH_CHECK_DELAY=5

# Notification function
notify() {
    local title="$1"
    local message="$2"
    local type="${3:-info}"
    
    # macOS notification
    if command -v osascript &> /dev/null; then
        osascript -e "display notification \"$message\" with title \"$title\""
    fi
    
    # Linux notification
    if command -v notify-send &> /dev/null; then
        notify-send "$title" "$message"
    fi
    
    # Terminal bell
    echo -e "\a"
}

# Print with timestamp
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ERROR:${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] SUCCESS:${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING:${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI not found. Install: npm i -g vercel"
        exit 1
    fi
    log "Vercel CLI found ✓"
}

# Get current deployment URL
get_latest_deployment() {
    log "Fetching latest deployment..."
    DEPLOYMENT_URL=$(vercel ls --yes 2>/dev/null | grep -m 1 "https://" | awk '{print $2}')
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        error "No deployment URL found"
        return 1
    fi
    
    echo "$DEPLOYMENT_URL"
}

# Monitor deployment status
monitor_deployment() {
    local start_time=$(date +%s)
    local deployment_url="$1"
    
    log "Monitoring deployment: ${CYAN}$deployment_url${NC}"
    
    while true; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [ $elapsed -gt $MAX_WAIT_TIME ]; then
            error "Deployment timeout after ${MAX_WAIT_TIME}s"
            return 1
        fi
        
        # Check deployment status
        local status=$(vercel inspect "$deployment_url" 2>/dev/null | grep -i "state" | awk '{print $2}')
        
        case "$status" in
            "READY")
                success "Deployment is READY!"
                return 0
                ;;
            "ERROR"|"FAILED")
                error "Deployment FAILED"
                return 1
                ;;
            "BUILDING"|"QUEUED"|"INITIALIZING")
                log "Status: ${YELLOW}$status${NC} (${elapsed}s elapsed)"
                ;;
        esac
        
        sleep $CHECK_INTERVAL
    done
}

# Health check function
health_check() {
    local url="$1"
    local attempt=1
    
    log "Running health checks on ${CYAN}$url${NC}"
    
    while [ $attempt -le $HEALTH_CHECK_RETRIES ]; do
        log "Health check attempt $attempt/$HEALTH_CHECK_RETRIES"
        
        # HTTP status check
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
            success "Health check passed (HTTP $http_code)"
            
            # Check if page loads properly
            local content=$(curl -s "$url" --max-time 10)
            if [ -n "$content" ]; then
                success "Content loaded successfully"
                return 0
            fi
        fi
        
        warning "Health check failed (HTTP $http_code), retrying..."
        attempt=$((attempt + 1))
        sleep $HEALTH_CHECK_DELAY
    done
    
    error "Health check failed after $HEALTH_CHECK_RETRIES attempts"
    return 1
}

# Rollback to previous deployment
rollback() {
    warning "Initiating rollback..."
    
    # Get previous deployment
    local prev_deployment=$(vercel ls --yes 2>/dev/null | grep -m 2 "https://" | tail -1 | awk '{print $2}')
    
    if [ -z "$prev_deployment" ]; then
        error "No previous deployment found for rollback"
        return 1
    fi
    
    log "Rolling back to: ${CYAN}$prev_deployment${NC}"
    
    # Promote previous deployment to production
    vercel promote "$prev_deployment" --yes
    
    success "Rollback complete!"
    notify "Rollback Complete" "Reverted to previous deployment"
    return 0
}

# Open URL in browser
open_browser() {
    local url="$1"
    
    log "Opening ${CYAN}$url${NC} in browser..."
    
    if command -v open &> /dev/null; then
        open "$url"  # macOS
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$url"  # Linux
    elif command -v start &> /dev/null; then
        start "$url"  # Windows
    else
        warning "Could not open browser automatically"
        echo "Visit: $url"
    fi
}

# Main execution
main() {
    echo -e "${PURPLE}╔════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║   Vercel Deployment Monitor v1.0      ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    check_vercel_cli
    
    # Get latest deployment
    DEPLOYMENT_URL=$(get_latest_deployment)
    if [ $? -ne 0 ]; then
        exit 1
    fi
    
    # Monitor deployment
    if monitor_deployment "$DEPLOYMENT_URL"; then
        # Run health checks
        if health_check "$DEPLOYMENT_URL"; then
            success "Deployment successful and healthy!"
            notify "Deployment Success" "Your app is live and healthy!"
            
            # Open in browser
            open_browser "$DEPLOYMENT_URL"
            
            echo ""
            echo -e "${GREEN}✓ Deployment URL:${NC} ${CYAN}$DEPLOYMENT_URL${NC}"
            echo -e "${GREEN}✓ Status:${NC} Live and Healthy"
            echo ""
        else
            error "Health check failed!"
            notify "Deployment Warning" "Deployment completed but health check failed"
            
            read -p "Rollback to previous version? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                rollback
            fi
        fi
    else
        error "Deployment failed!"
        notify "Deployment Failed" "Check logs for details"
        
        read -p "Rollback to previous version? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rollback
        fi
        exit 1
    fi
}

# Run main function
main
