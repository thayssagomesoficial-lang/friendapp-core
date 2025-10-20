#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "❌ Uso: $0 <arquivo_backup.sql.gz>"
    echo ""
    echo "📂 Backups disponíveis:"
    ls -lh ./backups/postgres/postgres_backup_*.sql.gz 2>/dev/null || echo "   Nenhum backup encontrado"
    exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="${POSTGRES_CONTAINER:-friendapp-core-postgres-1}"
DB_NAME="${POSTGRES_DB:-friendapp}"
DB_USER="${POSTGRES_USER:-postgres}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erro: Arquivo $BACKUP_FILE não encontrado"
    exit 1
fi

echo "⚠️  ATENÇÃO: Esta operação irá SOBRESCREVER todos os dados do banco!"
echo "📦 Container: $CONTAINER_NAME"
echo "🗄️  Database: $DB_NAME"
echo "📁 Backup: $BACKUP_FILE"
echo ""
read -p "Continuar? (sim/não): " CONFIRM

if [ "$CONFIRM" != "sim" ]; then
    echo "❌ Operação cancelada"
    exit 0
fi

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erro: Container $CONTAINER_NAME não está rodando"
    exit 1
fi

echo "🔄 Iniciando restore do PostgreSQL..."

gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"

echo "✅ Restore concluído com sucesso!"
echo "🔍 Verificando conexão..."

docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"

echo "✅ Banco de dados restaurado e operacional!"
