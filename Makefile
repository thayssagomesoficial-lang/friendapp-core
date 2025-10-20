.PHONY: help up down down-v build logs logs-follow seed test smoke-test clean backup-postgres backup-neo4j restore-postgres restore-neo4j check-secrets

help:
	@echo "FriendApp Core - Makefile Commands"
	@echo ""
	@echo "Services:"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make down-v         - Stop all services and remove volumes"
	@echo "  make build          - Build all Docker images"
	@echo "  make logs           - Show recent logs from all services"
	@echo "  make logs-follow    - Follow logs from all services"
	@echo ""
	@echo "Database:"
	@echo "  make seed           - Seed database with initial data"
	@echo "  make backup-postgres - Backup PostgreSQL database"
	@echo "  make backup-neo4j    - Backup Neo4j database"
	@echo "  make restore-postgres FILE=<path> - Restore PostgreSQL from backup"
	@echo "  make restore-neo4j FILE=<path>    - Restore Neo4j from backup"
	@echo ""
	@echo "Testing & Security:"
	@echo "  make test           - Run Newman tests"
	@echo "  make smoke-test     - Run smoke tests"
	@echo "  make check-secrets  - Verify secrets are not exposed"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean          - Remove all containers and volumes"

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

down-v:
	@echo "🛑 Stopping all services and removing volumes..."
	docker-compose down -v
	@echo "⚠️  All data has been removed!"

logs:
	@docker-compose logs --tail=100

logs-follow:
	@docker-compose logs -f

seed:
	@echo "🌱 Seeding database..."
	@docker-compose exec -T postgres psql -U postgres -d friendapp < backend/microservices/init-db.sql
	@echo "✅ Database seeded successfully"

backup-postgres:
	@echo "💾 Backing up PostgreSQL..."
	@bash scripts/backup-postgres.sh

backup-neo4j:
	@echo "💾 Backing up Neo4j..."
	@bash scripts/backup-neo4j.sh

restore-postgres:
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Usage: make restore-postgres FILE=<backup_file>"; \
		exit 1; \
	fi
	@bash scripts/restore-postgres.sh $(FILE)

restore-neo4j:
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Usage: make restore-neo4j FILE=<backup_file>"; \
		exit 1; \
	fi
	@bash scripts/restore-neo4j.sh $(FILE)

check-secrets:
	@bash scripts/check-secrets.sh

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
