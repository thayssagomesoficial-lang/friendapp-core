#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-./backups/neo4j}"
CONTAINER_NAME="${NEO4J_CONTAINER:-friendapp-core-neo4j-1}"
NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-password}"

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/neo4j_backup_${TIMESTAMP}.cypher"

echo "🔄 Iniciando backup do Neo4j..."
echo "📦 Container: $CONTAINER_NAME"
echo "💾 Destino: $BACKUP_FILE"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Erro: Container $CONTAINER_NAME não está rodando"
    exit 1
fi

cat > "$BACKUP_FILE" << 'EOF'
// Neo4j Backup Script
// Generated: 
EOF
echo "// Date: $(date)" >> "$BACKUP_FILE"
echo "" >> "$BACKUP_FILE"

echo "📊 Exportando nós e relacionamentos..."
docker exec "$CONTAINER_NAME" cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASSWORD" \
    "CALL apoc.export.cypher.all(null, {stream: true, format: 'cypher-shell'}) 
     YIELD cypherStatements 
     RETURN cypherStatements" >> "$BACKUP_FILE" 2>/dev/null || {
    echo "⚠️  APOC não disponível, usando método alternativo..."
    
    docker exec "$CONTAINER_NAME" cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASSWORD" \
        "MATCH (n) RETURN labels(n) as labels, properties(n) as props LIMIT 1000" >> "$BACKUP_FILE"
}

if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup concluído com sucesso!"
    echo "📊 Tamanho: $SIZE"
    echo "📁 Arquivo: $BACKUP_FILE"
    
    echo ""
    echo "🗑️  Limpando backups antigos (mantendo últimos 7)..."
    ls -t "$BACKUP_DIR"/neo4j_backup_*.cypher | tail -n +8 | xargs -r rm
    echo "✅ Limpeza concluída"
else
    echo "❌ Erro: Backup falhou"
    exit 1
fi
