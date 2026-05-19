#!/usr/bin/env bash

# ==============================================================================
# LocalScene automated VPS deployment script
# Use this script to build and deploy your React + Vite frontend to your RackNerd VPS.
# ==============================================================================

# Exit immediately if a command exits with a non-zero status
set -e

# --- CONFIGURATION (Modify these variables to match your VPS settings) ---
VPS_USER="root"                       # Your SSH username for the VPS (usually root or ubuntu)
VPS_HOST="your_vps_ip_here"           # The IP address or domain name of your RackNerd VPS
VPS_DEST_DIR="/var/www/localscene"     # The target folder on your VPS where files will live
# ---------------------------------------------------------

# Color codes for clean output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting LocalScene automated deployment process...${NC}\n"

# 1. Locate the local project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_DIR"
echo -e "📂 Local Project Directory: ${GREEN}$PROJECT_DIR${NC}"

# 2. Check configuration safety
if [ "$VPS_HOST" == "your_vps_ip_here" ]; then
    echo -e "${RED}❌ Error: Please open this script (deployment/deploy.sh) and update the 'VPS_HOST' variable with your actual VPS IP address.${NC}"
    exit 1
fi

# 3. Clean and build local project
echo -e "\n${YELLOW}📦 Phase 1: Building production assets...${NC}"
if [ -d "node_modules" ]; then
    echo "✓ Node modules found. Skipping npm install for speed..."
else
    echo "⚙️ Node modules missing. Installing dependencies..."
    npm install
fi

echo "⚙️ Running vite build..."
npm run build

# 4. Verify local build outputs
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Error: Production build failed or 'dist' directory is missing.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Production build compiled successfully inside 'dist/' directory.${NC}"

# 5. Connect and prepare VPS directories
echo -e "\n${YELLOW}🖥️ Phase 2: Connecting to VPS and preparing directories...${NC}"
echo "Connecting to $VPS_USER@$VPS_HOST..."

# Create target directories on the VPS if they do not exist
ssh "$VPS_USER@$VPS_HOST" "mkdir -p $VPS_DEST_DIR"

# 6. Upload compiled assets using rsync
echo -e "\n${YELLOW}📤 Phase 3: Syncing production files to VPS...${NC}"
# rsync is the fastest, safest, and most standard way to transfer files. It only transfers changed files.
rsync -avz --delete dist/ "$VPS_USER@$VPS_HOST:$VPS_DEST_DIR/dist/"

echo -e "\n${GREEN}✓ Files uploaded successfully to $VPS_USER@$VPS_HOST:$VPS_DEST_DIR/dist/${NC}"

# 7. Check if Nginx configuration update is needed
echo -e "\n${YELLOW}💡 Phase 4: Finalizing and reloading Nginx on VPS...${NC}"
echo -e "To configure Nginx on your VPS to serve this website, you should run the following commands on your server:"
echo -e "  1. Copy the Nginx configuration file to your VPS sites-available directory."
echo -e "  2. Symlink it: ${GREEN}ln -s /etc/nginx/sites-available/localscene /etc/nginx/sites-enabled/${NC}"
echo -e "  3. Test Nginx configuration: ${GREEN}nginx -t${NC}"
echo -e "  4. Reload Nginx to apply changes: ${GREEN}systemctl reload nginx${NC}"

# Proactively reload Nginx if the connection is available
read -p "Would you like this script to try reloading Nginx on the VPS now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Reloading Nginx service on VPS..."
    ssh "$VPS_USER@$VPS_HOST" "sudo systemctl reload nginx"
    echo -e "${GREEN}✓ Nginx service reloaded successfully!${NC}"
fi

echo -e "\n${GREEN}🎉 Deployment complete! Your LocalScene application is now live!${NC}"
