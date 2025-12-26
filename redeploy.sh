#!/bin/bash
# =============================================================================
# Usage:
#   ./redeploy.sh         - Full rebuild (production)
#   ./redeploy.sh --dev   - Development mode with hot reload
#   ./redeploy.sh --quick - Quick restart without rebuild
# =============================================================================

set -e

MODE="${1:-prod}"

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Copy .env.sample to .env and configure it."
    echo "   For production, use .env.production.sample as reference."
    exit 1
fi

case "$MODE" in
    --dev)
        echo "🔧 Starting in DEVELOPMENT mode..."
        docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
        ;;
    --quick)
        echo "🔄 Quick restart (no rebuild)..."
        docker compose down
        docker compose up -d
        echo "✅ Services restarted."
        ;;
    *)
        echo "🛑 Stopping existing containers..."
        docker compose down

        echo "🧹 Cleaning up old build cache..."
        docker builder prune -f --filter until=24h 2>/dev/null || true

        echo "🏗️  Building containers (no cache)..."
        docker compose build --no-cache

        echo "🚀 Starting services..."
        docker compose up -d --force-recreate

        echo ""
        echo "✅ Deployment complete!"
        echo ""
        echo "📊 Container status:"
        docker compose ps
        echo ""
        echo "📝 Logs: docker compose logs -f"
        echo "🔄 Restart: ./redeploy.sh --quick"
        ;;
esac
