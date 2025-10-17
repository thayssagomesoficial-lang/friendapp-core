# Microserviços FriendApp v3.1

## Visão Geral

Implementação dos 6 novos microserviços da versão 3.1 do FriendApp Core, conforme especificação técnica dos módulos:
- Sistema de Selos e Verificações
- Sistema de Segurança Vibracional
- Sistema Econômico, Monetização e FriendCoins

## Arquitetura

### Stack Tecnológico

| Microserviço | Tecnologia | Porta | Banco de Dados |
|-------------|-----------|-------|----------------|
| selos-service | Node.js + Express | 3004 | PostgreSQL + Firestore |
| verificacao-service | Node.js + Express | 3005 | PostgreSQL + Firestore |
| reputacao-service | Python + FastAPI | 3006 | PostgreSQL |
| seguranca-vibracional-service | Go + Gin | 3007 | PostgreSQL + Firestore |
| economia-service | Node.js + Express | 3008 | PostgreSQL + Firestore |
| antifraude-service | Python + FastAPI | 3009 | PostgreSQL + Neo4j |

### Infraestrutura

- **PostgreSQL 15**: Banco relacional principal
- **Redis 7**: Cache e pub/sub
- **Neo4j 5**: Análise de grafos sociais (detecção de fraudes)
- **Firestore**: Dados em tempo real

## Inicio Rápido

### Pré-requisitos

- Docker 24+
- Docker Compose 2.20+

### Executar Todos os Serviços

```bash
# Clonar repositório
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core

# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Testar health checks
curl http://localhost:3004/health  # Selos
curl http://localhost:3005/health  # Verificação
curl http://localhost:3006/health  # Reputação
curl http://localhost:3007/health  # Segurança
curl http://localhost:3008/health  # Economia
curl http://localhost:3009/health  # Antifraude
```

## Microserviços Detalhados

### 1. Selos Service

Gerenciamento e atribuição de selos vibracionais baseados em conquistas e evolução do usuário.

**Principais Endpoints:**
- `POST /api/selos/atribuir` - Atribui um selo
- `GET /api/selos/usuario/:userId` - Lista selos do usuário
- `GET /api/selos/catalogo` - Catálogo completo de selos

**Catálogo de Selos:**
- 🌱 Raiz Profunda (21 dias consecutivos)
- 🧘 Quietude Vibracional (5 pausas meditativas)
- 🔥 Transmutador (3 colapsos superados)
- 💫 Espelho da Alma (3 conexões >90%)
- 🌟 Farol da Vibração (100+ feedbacks positivos)

### 2. Verificação Service

Verificação de identidade (DUC/DCO) via APIs externas (Unico, IdWall).

**Principais Endpoints:**
- `POST /api/verificacao/iniciar` - Inicia verificação
- `POST /api/verificacao/validar` - Valida resultado
- `GET /api/verificacao/status/:userId` - Status de verificação

**Providers Suportados:**
- Unico (padrão)
- IdWall

### 3. Reputação Service

Cálculo matemático de score de reputação vibracional.

**Fórmula:**
```
Score = (w1 * Coerência) + (w2 * Reciprocidade) + (w3 * Feedbacks+) + 
        (w4 * Maturidade) - (w5 * Denúncias-)
```

**Estados Vibracionais:**
- 🌱 Fluxo em Construção (0-30)
- 🌿 Energia Estável (31-60)
- ✨ Coerência Elevada (61-85)
- 🌟 Guardião da Vibração (86-100)

### 4. Segurança Vibracional Service

Cálculo de risco e ativação de blindagens dinâmicas.

**Níveis de Blindagem:**
- **Leve** (score < 0.4): UI suavizada, tons azuis, 528Hz
- **Moderada** (0.4-0.75): Feed silencioso, delay conexões, 432Hz
- **Grave** (> 0.75): Chat bloqueado, feed recolhido, 396Hz

**Variáveis Monitoradas:**
- Tempo de resposta
- Linguagem negativa
- Inconsistência de escolhas
- Denúncias validadas

### 5. Economia Service

Gestão de FriendCoins, carteiras e planos Premium.

**Fórmula de Recompensas:**
```
FriendCoins = (Peso_Ação * Índice_Impacto * Fator_Surpresa) * Redução_Repetição
```

**Principais Funcionalidades:**
- Cálculo de recompensas
- Crédito/débito de FriendCoins
- Gestão de carteiras
- Ativação de Premium
- Histórico de transações

### 6. Antifraude Service

Detecção de fraudes usando análise de grafos sociais (Neo4j).

**Detecção:**
- Clusters fechados suspeitos
- Interações repetitivas (farming)
- Padrões anômalos de comportamento

**Score de Fraude:**
```
Score = (0.6 * Clusters_Norm) + (0.4 * Repetição_Norm)
Suspeito se Score > 0.7
```

## Banco de Dados

### Schema Consolidado

Execute o script de inicialização:

```bash
psql -U postgres -d friendapp -f backend/microservices/init-db.sql
```

**Tabelas Principais:**
- `user_seals` - Selos conquistados
- `verifications` - Verificações DUC/DCO
- `reputation_scores` - Scores de reputação
- `security_events` - Eventos de segurança
- `user_trust_level` - Nível de confiança
- `transactions_log` - Log de transações
- `user_wallets` - Carteiras de usuários
- `fraud_alerts` - Alertas de fraude

### Neo4j (Grafo Social)

```cypher
// Criar usuários e interações
MERGE (u1:User {id: "uuid1"})
MERGE (u2:User {id: "uuid2"})
CREATE (u1)-[:INTERAGE_COM {tipo: "mensagem", timestamp: datetime()}]->(u2)

// Detectar clusters suspeitos
MATCH (u:User)-[r:INTERAGE_COM]->(v:User)
WITH u, collect(v) as grupo
WHERE size(grupo) >= 2 AND size(grupo) <= 5
RETURN grupo
```

## Desenvolvimento Local

### Executar Serviço Individual

#### Node.js Services (selos, verificacao, economia)

```bash
cd backend/microservices/selos-service
cp .env.example .env
npm install
npm run dev
```

#### Python Services (reputacao, antifraude)

```bash
cd backend/microservices/reputacao-service
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --port 3006
```

#### Go Service (seguranca-vibracional)

```bash
cd backend/microservices/seguranca-vibracional-service
cp .env.example .env
go mod download
go run cmd/server/main.go
```

## Testes

### Testes Manuais via cURL

```bash
# Selos Service
curl -X POST http://localhost:3004/api/selos/atribuir \
  -H "Content-Type: application/json" \
  -d '{"user_id":"123e4567-e89b-12d3-a456-426614174000","seal_type":"raiz_profunda","vibration_score":85.5}'

# Reputação Service
curl -X POST http://localhost:3006/api/reputacao/calcular \
  -H "Content-Type: application/json" \
  -d '{"user_id":"123e4567-e89b-12d3-a456-426614174000","coerencia":0.85,"reciprocidade":0.75,"feedbacks_positivos":45,"denuncias_validadas":0,"maturity_days":90}'

# Economia Service
curl -X POST http://localhost:3008/api/economia/creditar \
  -H "Content-Type: application/json" \
  -d '{"user_id":"123e4567-e89b-12d3-a456-426614174000","valor":10,"tipo":"ganho"}'
```

## Observabilidade

### Logs

Todos os serviços utilizam logs estruturados em JSON:

```json
{
  "level": "info",
  "timestamp": "2025-10-15T14:30:00Z",
  "service": "economia-service",
  "message": "10 FriendCoins creditados",
  "user_id": "uuid"
}
```

### Métricas

- **Latência**: < 200ms (cálculos), < 100ms (leituras)
- **Uptime**: > 99.9%
- **Taxa de Erro**: < 0.1%

## Integração com IA Aurah Kosmos

Todos os microserviços se integram com a IA Aurah Kosmos para:
- Validação de padrões vibracionais
- Atribuição inteligente de selos
- Cálculo de índice de impacto
- Detecção de anomalias
- Feedback personalizado

## Segurança

### Boas Práticas Implementadas

- ✅ Criptografia TLS 1.3 em trânsito
- ✅ Dados sensíveis em AES-256
- ✅ Logs criptografados
- ✅ Rate limiting por usuário
- ✅ Validação de entrada
- ✅ Helmets e CORS configurados
- ✅ Nunca armazenar documentos (apenas resultados)

## Escalabilidade

### Preparado para Produção

- Kubernetes + Istio ready
- Horizontal Pod Autoscaling (HPA)
- Health checks em todos os serviços
- Graceful shutdown
- Circuit breakers
- Retry policies

## Próximos Passos

### Fase 2 - MVP Enhancement
- [ ] Chat Vibracional MVP
- [ ] IA Operacional avançada
- [ ] Painel de Segurança completo
- [ ] Missões regenerativas
- [ ] Integração completa com Firestore

### Fase 3 - Escalabilidade
- [ ] Monitoramento com Prometheus + Grafana
- [ ] Tracing distribuído (Jaeger)
- [ ] Deploy em Kubernetes
- [ ] CI/CD completo
- [ ] Testes de carga

## Contribuição

Veja [CONTRIBUTING.md](../../CONTRIBUTING.md) para guidelines.

## Documentação Adicional

- [API Documentation](../../docs/apis/microservices-v3.1.md)
- [Architecture Overview](../../docs/arquitetura-modulos-integrados.md)
- [Integration Report](../../docs/relatorio-integracao-v3.1.md)

## Licença

Proprietary - FriendApp © 2025

---

**Versão**: 3.1  
**Data**: 2025-10-15  
**Última Atualização**: Implementação dos 6 microserviços core
