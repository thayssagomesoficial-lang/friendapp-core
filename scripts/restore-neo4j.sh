#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "❌ Uso: $0 <arquivo_backup.cypher>"
    echo ""
    echo "📂 Backups disponíveis:"
    ls -lh ./backups/neo4j/neo4j_backup_*.cypher 2>/dev/null || echo "   Nenhum backup encontrado"
    exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="${NEO4J_CONTAINER:-friendapp-core-neo4j-1}"
NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-password}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erro: Arquivo $BACKUP_FILE não encontrado"
    exit 1
fi

echo "⚠️  ATENÇÃO: Esta operação irá LIMPAR o banco Neo4j atual!"
echo "📦 Container: $CONTAINER_NAME"
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

echo "🔄 Limpando banco Neo4j..."
docker exec "$CONTAINER_NAME" cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASSWORD" \
    "MATCH (n) DETACH DELETE n"

echo "🔄 Iniciando restore do Neo4j..."

docker exec -i "$CONTAINER_NAME" cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASSWORD" < "$BACKUP_FILE"

echo "✅ Restore concluído com sucesso!"
echo "🔍 Verificando conexão..."

NODE_COUNT=$(docker exec "$CONTAINER_NAME" cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASSWORD" \
    "MATCH (n) RETURN count(n) as count" | grep -oP '\d+' | head -1)

echo "📊 Total de nós: $NODE_COUNT"
echo "✅ Banco de dados Neo4j restaurado e operacional!"
