# APIs dos Microserviços v3.1 - FriendApp Core

## Visão Geral

Documentação técnica completa das APIs dos 6 novos microserviços implementados na versão 3.1 do FriendApp Core.

## Microserviços

### 1. Selos Service (Node.js)
**Porta**: 3004  
**Responsabilidade**: Gerenciamento e atribuição de selos vibracionais

#### Endpoints

##### POST /api/selos/atribuir
Atribui um selo a um usuário.

**Request:**
```json
{
  "user_id": "uuid",
  "seal_type": "raiz_profunda",
  "vibration_score": 85.5,
  "metadata": {
    "dias_consecutivos": 21
  }
}
```

**Response:**
```json
{
  "success": true,
  "seal": {
    "id": 1,
    "user_id": "uuid",
    "seal_type": "raiz_profunda",
    "earned_at": "2025-10-15T14:30:00Z",
    "vibration_score": 85.5
  }
}
```

##### GET /api/selos/usuario/:userId
Lista todos os selos de um usuário.

**Response:**
```json
{
  "user_id": "uuid",
  "seals": [
    {
      "id": 1,
      "seal_type": "raiz_profunda",
      "earned_at": "2025-10-15T14:30:00Z",
      "vibration_score": 85.5
    }
  ],
  "total": 1
}
```

##### GET /api/selos/catalogo
Lista todos os selos disponíveis no sistema.

**Response:**
```json
{
  "catalogo": [
    {
      "type": "raiz_profunda",
      "name": "Raiz Profunda",
      "category": "jornada_interior",
      "icon": "🌱",
      "description": "21 dias consecutivos de presença consciente",
      "conditions": {
        "dias_consecutivos": 21,
        "tipo_acao": "check_in_diario"
      }
    }
  ],
  "total": 12
}
```

---

### 2. Verificação Service (Node.js)
**Porta**: 3005  
**Responsabilidade**: Verificação de identidade DUC/DCO via APIs externas

#### Endpoints

##### POST /api/verificacao/iniciar
Inicia processo de verificação de identidade.

**Request:**
```json
{
  "user_id": "uuid",
  "tipo_verificacao": "DUC",
  "provider": "unico"
}
```

**Response:**
```json
{
  "success": true,
  "verification_id": 123,
  "external_url": "https://unico.mock/verify/uuid",
  "status": "pendente"
}
```

##### POST /api/verificacao/validar
Valida resultado de verificação.

**Request:**
```json
{
  "user_id": "uuid",
  "verification_result": {
    "success": true,
    "confidence": 0.95
  }
}
```

**Response:**
```json
{
  "success": true,
  "verification": {
    "user_id": "uuid",
    "status": "aprovado",
    "verified_at": "2025-10-15T14:30:00Z"
  }
}
```

##### GET /api/verificacao/status/:userId
Consulta status de verificação de um usuário.

**Response:**
```json
{
  "user_id": "uuid",
  "verified": true,
  "status": "aprovado",
  "provider": "unico",
  "verified_at": "2025-10-15T14:30:00Z",
  "type": "DUC"
}
```

---

### 3. Reputação Service (Python/FastAPI)
**Porta**: 3006  
**Responsabilidade**: Cálculo de score de reputação vibracional

#### Endpoints

##### POST /api/reputacao/calcular
Calcula score de reputação de um usuário.

**Request:**
```json
{
  "user_id": "uuid",
  "coerencia": 0.85,
  "reciprocidade": 0.75,
  "feedbacks_positivos": 45,
  "denuncias_validadas": 0,
  "maturity_days": 90
}
```

**Response:**
```json
{
  "user_id": "uuid",
  "score": 78,
  "estado": {
    "emoji": "✨",
    "nome": "Coerência Elevada",
    "descricao": "Alta harmonia vibracional"
  },
  "details": {
    "coerencia": 0.85,
    "reciprocidade": 0.75,
    "feedbacks_positivos": 45,
    "denuncias": 0
  }
}
```

##### GET /api/reputacao/usuario/:userId
Obtém reputação atual de um usuário.

**Response:**
```json
{
  "user_id": "uuid",
  "score": 78,
  "estado": {
    "emoji": "✨",
    "nome": "Coerência Elevada",
    "descricao": "Alta harmonia vibracional"
  },
  "coherence": 0.85,
  "reciprocity": 0.75,
  "feedbacks_positive": 45,
  "warnings": 0,
  "maturity_days": 90,
  "updated_at": "2025-10-15T14:30:00Z"
}
```

**Fórmula de Cálculo:**
```
Score = (w1 * Coerência) + (w2 * Reciprocidade) + (w3 * Feedbacks_Norm) + 
        (w4 * Maturidade_Norm) - (w5 * Denúncias_Norm)

Onde:
- w1 = 0.30
- w2 = 0.25
- w3 = 0.20
- w4 = 0.15
- w5 = 0.10
```

---

### 4. Segurança Vibracional Service (Go)
**Porta**: 3007  
**Responsabilidade**: Cálculo de risco e ativação de blindagens

#### Endpoints

##### POST /api/seguranca/calcular-risco
Calcula score de risco de um usuário.

**Request:**
```json
{
  "user_id": "uuid",
  "tempo_resposta": 2.5,
  "linguagem_negativa": false,
  "inconsistencia_escolhas": false,
  "verificado_duc": true,
  "denuncias_validadas": 0
}
```

**Response:**
```json
{
  "user_id": "uuid",
  "score_risco": 0.12,
  "nivel_risco": "baixo",
  "blindagem": "leve",
  "cor": "azul_claro",
  "frequencia": "528Hz",
  "feedback_ia": "Seu campo está oscilando, vamos suavizar sua experiência."
}
```

##### GET /api/seguranca/usuario/:userId
Obtém status de segurança de um usuário.

**Response:**
```json
{
  "user_id": "uuid",
  "trust_score": 85,
  "last_incident": "2025-10-10T10:00:00Z"
}
```

**Fórmula de Cálculo:**
```
Score_Risco = (w1 * TempoResposta_Norm) + 
              (w2 * LinguagemNegativa_Norm) + 
              (w3 * Inconsistência_Norm) - 
              (w4 * VerificadoDUC) + 
              (w5 * Denúncias_Norm)

Onde:
- w1 = 0.15
- w2 = 0.30
- w3 = 0.25
- w4 = 0.20
- w5 = 0.40
```

---

### 5. Economia Service (Node.js)
**Porta**: 3008  
**Responsabilidade**: Gestão de FriendCoins e monetização

#### Endpoints

##### POST /api/economia/calcular-recompensa
Calcula recompensa em FriendCoins para uma ação.

**Request:**
```json
{
  "user_id": "uuid",
  "acao": "checkin_local",
  "peso_acao": 5,
  "indice_impacto": 1.4,
  "fator_surpresa": 1.1,
  "reducao_repeticao": 1.0
}
```

**Response:**
```json
{
  "user_id": "uuid",
  "acao": "checkin_local",
  "friendcoins_calculados": 8,
  "detalhes": {
    "peso_acao": 5,
    "indice_impacto": 1.4,
    "fator_surpresa": 1.1,
    "reducao_repeticao": 1.0
  }
}
```

##### POST /api/economia/creditar
Credita FriendCoins na carteira do usuário.

**Request:**
```json
{
  "user_id": "uuid",
  "valor": 8,
  "tipo": "ganho",
  "indice_impacto": 1.4,
  "fator_surpresa": 1.1,
  "reducao_repeticao": 1.0,
  "metadata": {
    "acao": "checkin_local"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "uuid",
  "valor_creditado": 8,
  "tipo": "ganho"
}
```

##### POST /api/economia/debitar
Debita FriendCoins da carteira do usuário.

**Request:**
```json
{
  "user_id": "uuid",
  "valor": 10,
  "tipo": "gasto",
  "metadata": {
    "item": "boost_visibilidade"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "uuid",
  "valor_debitado": 10,
  "tipo": "gasto"
}
```

##### GET /api/economia/carteira/:userId
Consulta saldo e status da carteira.

**Response:**
```json
{
  "user_id": "uuid",
  "saldo_fc": 230,
  "status_premium": "ativo",
  "premium_expira_em": "2025-12-31T23:59:59Z"
}
```

##### POST /api/economia/premium/ativar
Ativa plano Premium para um usuário.

**Request:**
```json
{
  "user_id": "uuid",
  "duracao_dias": 30
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "uuid",
  "status_premium": "ativo",
  "expira_em": "2025-11-14T14:30:00Z"
}
```

##### GET /api/economia/historico/:userId
Consulta histórico de transações.

**Response:**
```json
{
  "user_id": "uuid",
  "transacoes": [
    {
      "id": 1,
      "tipo": "ganho",
      "valor": 8,
      "indice_impacto": 1.4,
      "timestamp": "2025-10-15T14:30:00Z"
    }
  ],
  "total": 1
}
```

**Fórmula de Cálculo:**
```
FriendCoins = (Peso_Ação * Índice_Impacto * Fator_Surpresa) * Redução_Repetição

Onde:
- Peso_Ação: valor base da ação (ex: 5 para check-in)
- Índice_Impacto: 0.0 a 2.0 (qualidade vibracional)
- Fator_Surpresa: 0.8 a 1.2 (randomizado)
- Redução_Repetição: 1 / (1 + ln(N_interações_mesmas))
```

---

### 6. Antifraude Service (Python/FastAPI + Neo4j)
**Porta**: 3009  
**Responsabilidade**: Detecção de fraudes e análise de grafos sociais

#### Endpoints

##### POST /api/antifraude/registrar-interacao
Registra interação entre usuários no grafo.

**Request:**
```json
{
  "user_id_origem": "uuid1",
  "user_id_destino": "uuid2",
  "tipo_interacao": "mensagem",
  "valor": 5
}
```

**Response:**
```json
{
  "success": true,
  "origem": "uuid1",
  "destino": "uuid2",
  "tipo": "mensagem"
}
```

##### POST /api/antifraude/analisar-padrao
Analisa padrão de comportamento de um usuário.

**Request:**
```json
{
  "user_id": "uuid"
}
```

**Response:**
```json
{
  "user_id": "uuid",
  "suspeito": false,
  "score_fraude": 0.15,
  "clusters_detectados": 1,
  "interacoes_repetitivas": 5,
  "clusters": [
    ["uuid2", "uuid3"]
  ]
}
```

##### GET /api/antifraude/estatisticas/:userId
Obtém estatísticas de um usuário.

**Response:**
```json
{
  "user_id": "uuid",
  "total_conexoes": 45,
  "timestamp": "2025-10-15"
}
```

**Fórmula de Detecção de Fraude:**
```
Score_Fraude = (w1 * Clusters_Norm) + (w2 * Repetição_Norm)

Onde:
- w1 = 0.6
- w2 = 0.4
- Clusters_Norm = min(num_clusters / 10, 1.0)
- Repetição_Norm = min(interacoes_repetitivas / 50, 1.0)
- Suspeito se Score_Fraude > 0.7
```

---

## Integrações

### Firestore Collections

```javascript
// Selos em tempo real
user_seals: {
  user_id: {
    raiz_profunda: {
      earned_at: "timestamp",
      vibration_score: 85.5
    }
  }
}

// Carteiras
users_wallet: {
  user_id: {
    saldo_FC: 230,
    status_premium: "ativo",
    ultima_transacao: "timestamp"
  }
}

// Blindagens ativas
active_shields: {
  user_id: {
    nivel: "moderada",
    ativo_desde: "timestamp"
  }
}
```

### Neo4j Queries

```cypher
// Criar interação
MERGE (u1:User {id: $origem})
MERGE (u2:User {id: $destino})
CREATE (u1)-[:INTERAGE_COM {tipo: $tipo, timestamp: datetime()}]->(u2)

// Detectar clusters fechados
MATCH (u:User {id: $user_id})-[r:INTERAGE_COM]->(v:User)
WITH u, collect(v) as grupo
WHERE size(grupo) >= 2 AND size(grupo) <= 5
RETURN grupo

// Contar interações repetitivas
MATCH (u:User {id: $user_id})-[r:INTERAGE_COM]->(v:User)
WITH v, count(r) as freq
WHERE freq > 10
RETURN count(v) as repetitivas
```

---

## Health Checks

Todos os serviços expõem um endpoint `/health`:

```bash
GET http://localhost:3004/health  # Selos
GET http://localhost:3005/health  # Verificação
GET http://localhost:3006/health  # Reputação
GET http://localhost:3007/health  # Segurança
GET http://localhost:3008/health  # Economia
GET http://localhost:3009/health  # Antifraude
```

**Response Padrão:**
```json
{
  "status": "healthy",
  "service": "nome-do-servico",
  "timestamp": "2025-10-15T14:30:00Z"
}
```

---

## Observabilidade

### Logs Estruturados (JSON)

Todos os serviços utilizam logs estruturados:

```json
{
  "level": "info",
  "timestamp": "2025-10-15T14:30:00Z",
  "service": "economia-service",
  "message": "8 FriendCoins creditados para usuário uuid",
  "user_id": "uuid",
  "valor": 8
}
```

### Métricas Esperadas

- **Latência**: < 200ms (cálculos), < 100ms (leituras)
- **Uptime**: > 99.9%
- **Taxa de Erro**: < 0.1%

---

## Deployment

### Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

### Variáveis de Ambiente

Todos os serviços possuem arquivo `.env.example` com configurações necessárias.

---

**Versão**: 3.1  
**Data**: 2025-10-15  
**Autor**: Devin AI  
**Repositório**: friendapp-core
