#!/bin/bash
set -e

SERVER="ubuntu@161.153.48.193"
SSH_KEY="$HOME/Downloads/ssh-key-2026-06-07.key"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"
DOMAIN="shelfless.duckdns.org"

echo ">>> Building..."
npm run build

echo ">>> Uploading files..."
rsync -avz $SSH_OPTS --delete dist/ $SERVER:/var/www/shelfless/

echo ">>> Uploading nginx config..."
scp $SSH_OPTS nginx.conf $SERVER:/tmp/shelfless.nginx.conf

echo ">>> Applying nginx config..."
ssh $SSH_OPTS $SERVER "
  sudo mv /tmp/shelfless.nginx.conf /etc/nginx/sites-available/shelfless &&
  sudo ln -sf /etc/nginx/sites-available/shelfless /etc/nginx/sites-enabled/shelfless &&
  sudo rm -f /etc/nginx/sites-enabled/default &&
  sudo nginx -t &&
  sudo systemctl reload nginx
"

echo ""
echo "✓ Live at http://$DOMAIN"
