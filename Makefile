.PHONY: help up down build logs seed test smoke-test clean

help:
	@echo "FriendApp Core - Makefile Commands"
	@echo ""
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make build       - Build all Docker images"
	@echo "  make logs        - Show logs from all services"
	@echo "  make seed        - Seed database with initial data"
	@echo "  make test        - Run Newman tests"
	@echo "  make smoke-test  - Run smoke tests"
	@echo "  make clean       - Remove all containers and volumes"

up:
	@echo "🚀 Starting all FriendApp services..."
	docker-compose up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10
	@echo "✅ Services are starting up. Check health with: make smoke-test"

down:
	@echo "🛑 Stopping all services..."
	docker-compose down

build:
	@echo "🔨 Building all Docker images..."
	docker-compose build

logs:
	docker-compose logs -f

seed:
	@echo "🌱 Seeding database..."
	@docker-compose exec -T postgres psql -U postgres -d friendapp < backend/microservices/init-db.sql
	@echo "✅ Database seeded successfully"

test:
	@echo "🧪 Running Newman tests..."
	@npm run test:newman

smoke-test:
	@echo "🔍 Running smoke tests..."
	@bash scripts/smoke-test.sh

clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	@echo "✅ Cleanup complete"
