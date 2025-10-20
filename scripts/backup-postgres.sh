#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
CONTAINER_NAME="${POSTGRES_CONTAINER:-friendapp-core-postgres-1}"
DB_NAME="${POSTGRES_DB:-friendapp}"
DB_USER="${POSTGRES_USER:-postgres}"

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/postgres_backup_${TIMESTAMP}.sql.gz"

echo "🔄 Iniciando backup do PostgreSQL..."
echo "📦 Container: $CONTAINER_NAME"
echo "🗄️  Database: $DB_NAME"
echo "💾 Destino: $BACKUP_FILE"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erro: Container $CONTAINER_NAME não está rodando"
    exit 1
fi

docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup concluído com sucesso!"
    echo "📊 Tamanho: $SIZE"
    echo "📁 Arquivo: $BACKUP_FILE"
    
    echo ""
    echo "🗑️  Limpando backups antigos (mantendo últimos 7)..."
    ls -t "$BACKUP_DIR"/postgres_backup_*.sql.gz | tail -n +8 | xargs -r rm
    echo "✅ Limpeza concluída"
else
    echo "❌ Erro: Backup falhou"
    exit 1
fi
