#!/bin/bash
# =============================================================================
# HTTPS SETUP SCRIPT FOR PRODUCTION
# Run this on your VPS at 80.65.208.64
# =============================================================================

set -e

DOMAIN="sriangalammanmatrimony.com"
EMAIL="sriangalammanspsk2020@gmail.com"  # Change to your email

echo "🔐 Setting up HTTPS for $DOMAIN"

# Create directories for Certbot
echo "📁 Creating certificate directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Check if certificates already exist
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "✅ Certificates already exist. Skipping initial certificate request."
else
    echo "📜 Requesting initial SSL certificate..."
    
    # First, we need a temporary nginx config without SSL
    echo "🔧 Creating temporary nginx config for certificate validation..."
    
    cat > ./frontend/nginx.temp.conf << 'TEMPCONF'
server {
    listen 80;
    server_name sriangalammanmatrimony.com www.sriangalammanmatrimony.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
TEMPCONF

    # Build and start with temporary config
    echo "🏗️ Building frontend with temporary config..."
    docker compose -f docker-compose.prod.yml build frontend
    
    # Create a temporary Dockerfile that uses temp config
    cp ./frontend/Dockerfile.prod ./frontend/Dockerfile.temp
    sed -i 's/nginx.prod.conf/nginx.temp.conf/g' ./frontend/Dockerfile.temp
    
    # Start services
    echo "🚀 Starting services for certificate validation..."
    docker compose -f docker-compose.prod.yml up -d db backend
    
    # Wait for backend to be ready
    sleep 10
    
    # Run nginx with temp config
    docker run -d --name temp-nginx \
        --network sriangalammanmatrimony_matrimony-network \
        -p 80:80 \
        -v $(pwd)/certbot/www:/var/www/certbot \
        -v $(pwd)/frontend/nginx.temp.conf:/etc/nginx/conf.d/default.conf \
        nginx:stable-alpine
    
    # Wait for nginx
    sleep 5
    
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
    docker stop temp-nginx && docker rm temp-nginx
    
    # Clean up temp files
    rm -f ./frontend/nginx.temp.conf ./frontend/Dockerfile.temp
    
    echo "✅ SSL certificate obtained successfully!"
fi

echo ""
echo "🚀 Starting production services with HTTPS..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
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
