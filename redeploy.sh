#!/bin/bash
# =============================================================================
# Usage:
#   ./redeploy.sh         - Full rebuild (production HTTPS)
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

# Determine which compose file to use for production
COMPOSE_FILE="docker-compose.yml"
if [ -f "docker-compose.prod.yml" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "🔒 Using Production HTTPS configuration ($COMPOSE_FILE)"
fi

case "$MODE" in
    --dev)
        echo "🔧 Starting in DEVELOPMENT mode..."
        docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
        ;;
    --quick)
        echo "🔄 Quick restart (no rebuild)..."
        if [ "$COMPOSE_FILE" == "docker-compose.prod.yml" ]; then
             docker compose -f $COMPOSE_FILE stop frontend backend
             docker compose -f $COMPOSE_FILE up -d frontend backend
        else
             docker compose stop frontend backend
             docker compose up -d frontend backend
        fi
        echo "✅ Services restarted."
        ;;
    *)
        echo "🛑 Stopping containers..."
        if [ "$COMPOSE_FILE" == "docker-compose.prod.yml" ]; then
            docker compose -f $COMPOSE_FILE down --remove-orphans
        else
            docker compose down --remove-orphans
        fi

        echo "🧹 Cleaning up old build cache..."
        docker builder prune -f --filter until=24h 2>/dev/null || true

        echo "🏗️  Building services (no cache)..."
        if [ "$COMPOSE_FILE" == "docker-compose.prod.yml" ]; then
            docker compose -f $COMPOSE_FILE build --no-cache
            
            echo "🚀 Starting HTTPS services..."
            docker compose -f $COMPOSE_FILE up -d
        else
            docker compose build --no-cache frontend backend
            echo "🚀 Starting HTTP services..."
            docker compose up -d frontend backend
        fi

        echo ""
        echo "✅ Deployment complete!"
        echo ""
        echo "📊 Container status:"
        docker compose -f $COMPOSE_FILE ps
        echo ""
        echo "📝 Logs: docker compose -f $COMPOSE_FILE logs -f"
        echo "🔄 Restart: ./redeploy.sh --quick"
        ;;
esac
