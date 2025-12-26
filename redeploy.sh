#!/bin/bash
# Force Rebuild Script
# This script ensures Docker cache is cleared and the frontend uses the correct API URL.

echo "🛑 Stopping containers..."
docker-compose down

echo "🧹 Pruning build cache for frontend..."
docker builder prune -f --filter until=24h

echo "🏗️  Rebuilding frontend with no cache..."
docker-compose build --no-cache frontend

echo "🚀 Starting services..."
docker-compose up -d --force-recreate

echo "✅ Deployment complete. Please refresh your browser (Ctrl+Shift+R)."
