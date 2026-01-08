#!/bin/bash
# =============================================================================
# HTTPS SETUP SCRIPT FOR PRODUCTION
# Run this on your VPS at 80.65.208.64
# =============================================================================

set -e

DOMAIN="sriangalammanmatrimony.com"
EMAIL="sriangalammanspsk2020@gmail.com"  # Change to your email

echo "🔐 Setting up HTTPS for $DOMAIN"

# Stop any running containers first
echo "🛑 Stopping any running containers..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose down 2>/dev/null || true
docker stop temp-nginx 2>/dev/null || true
docker rm temp-nginx 2>/dev/null || true

# Also stop any standalone nginx
docker stop $(docker ps -q --filter "ancestor=nginx:stable-alpine") 2>/dev/null || true

# Kill any process using port 80
echo "🔧 Freeing up port 80..."
sudo fuser -k 80/tcp 2>/dev/null || true
sleep 2

# Create directories for Certbot
echo "📁 Creating certificate directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Check if certificates already exist
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "✅ Certificates already exist!"
    echo "🚀 Starting production services with HTTPS..."
    docker compose -f docker-compose.prod.yml up -d --build
    
    echo ""
    echo "✅ HTTPS Setup Complete!"
    echo ""
    echo "🌐 Your site is now available at:"
    echo "   https://$DOMAIN"
    echo "   https://www.$DOMAIN"
    exit 0
fi

echo "📜 Requesting initial SSL certificate..."

# Create a minimal nginx config for certificate validation
echo "🔧 Creating temporary nginx config..."
mkdir -p ./certbot-temp

cat > ./certbot-temp/nginx.conf << 'TEMPCONF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name sriangalammanmatrimony.com www.sriangalammanmatrimony.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 200 'Certificate validation server';
            add_header Content-Type text/plain;
        }
    }
}
TEMPCONF

# Start temporary nginx for certificate validation
echo "🚀 Starting temporary nginx for certificate validation..."
docker run -d --name temp-nginx \
    -p 80:80 \
    -v $(pwd)/certbot/www:/var/www/certbot:ro \
    -v $(pwd)/certbot-temp/nginx.conf:/etc/nginx/nginx.conf:ro \
    nginx:stable-alpine

# Wait for nginx to start
sleep 5

# Test if nginx is responding
echo "🔍 Testing nginx..."
curl -s http://localhost/ > /dev/null && echo "✅ Nginx is running" || echo "⚠️ Nginx may not be responding"

# Request certificate
echo "📜 Requesting SSL certificate from Let's Encrypt..."
docker run --rm \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Stop temporary nginx
echo "🛑 Stopping temporary nginx..."
docker stop temp-nginx && docker rm temp-nginx

# Clean up temp files
rm -rf ./certbot-temp

echo "✅ SSL certificate obtained successfully!"
echo ""
echo "🚀 Starting production services with HTTPS..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "✅ HTTPS Setup Complete!"
echo ""
echo "🌐 Your site is now available at:"
echo "   https://$DOMAIN"
echo "   https://www.$DOMAIN"
echo ""
echo "📊 Check status: docker compose -f docker-compose.prod.yml ps"
echo "📝 View logs: docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔄 SSL certificates will auto-renew every 12 hours (if needed)"
