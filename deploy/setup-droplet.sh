#!/bin/bash
# =============================================================
# Software For Humans — Initial Droplet Setup
# Run this ONCE on the droplet to add swforhumans.com alongside
# the existing shopledger.app site.
# Usage: ssh root@DROPLET_IP 'bash -s' < deploy/setup-droplet.sh
# =============================================================

set -euo pipefail

DOMAIN="swforhumans.com"
DEPLOY_USER="deploy"
APP_DIR="/var/www/${DOMAIN}"

echo "=============================="
echo "Software For Humans — Droplet Setup"
echo "=============================="

# 1. Create app directory (assumes nginx/certbot/deploy user already exist)
echo "[1/4] Creating app directories..."
mkdir -p $APP_DIR/releases
mkdir -p $APP_DIR/current
chown -R $DEPLOY_USER:$DEPLOY_USER $APP_DIR

# 2. Create a temporary HTTP-only Nginx config for cert issuance
echo "[2/4] Creating temporary HTTP config (for Let's Encrypt)..."
cat > /etc/nginx/sites-available/$DOMAIN <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name swforhumans.com www.swforhumans.com;

    root /var/www/swforhumans.com/current;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
echo "  Nginx configured (HTTP-only)"

# 3. Placeholder index so cert validation works
echo "[3/4] Creating placeholder..."
cat > $APP_DIR/current/index.html <<HTML
<!DOCTYPE html>
<html><head><title>Software For Humans</title></head>
<body><h1>Software For Humans — Deployment in progress</h1></body></html>
HTML
chown $DEPLOY_USER:$DEPLOY_USER $APP_DIR/current/index.html

# 4. Next steps
echo "[4/4] Almost done."
echo ""
echo "=============================="
echo "Setup complete!"
echo "=============================="
echo ""
echo "Next steps (run manually on the droplet):"
echo ""
echo "  1. Point DNS A records to this droplet:"
echo "       swforhumans.com     -> \$(curl -s ifconfig.me)"
echo "       www.swforhumans.com -> \$(curl -s ifconfig.me)"
echo ""
echo "  2. Once DNS resolves, get the cert:"
echo "       certbot --nginx -d swforhumans.com -d www.swforhumans.com"
echo ""
echo "  3. Replace the temporary nginx config with the SSL version:"
echo "       cp deploy/nginx.conf /etc/nginx/sites-available/swforhumans.com"
echo "       nginx -t && systemctl reload nginx"
echo ""
echo "  4. Add GitHub Actions secrets to swforhumans-site repo:"
echo "       DROPLET_IP:      (same as shopledger)"
echo "       DEPLOY_SSH_KEY:  (same key as shopledger)"
echo ""
echo "  5. Push to main to trigger the first real deployment."
echo ""
