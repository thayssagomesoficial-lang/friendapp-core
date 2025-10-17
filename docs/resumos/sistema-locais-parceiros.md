# Sistema de Locais Parceiros e Experiências Comerciais - Resumo Técnico

**Módulo:** Sistema de Locais Parceiros B2B  
**Versão:** Definitivo  
**Data de Análise:** 17/10/2025  
**Fonte:** Manual Técnico — Sistema de Locais Parceiros

---

## 🎯 Visão Geral

O Sistema de Locais Parceiros é o **núcleo B2B do FriendApp**, conectando espaços físicos (restaurantes, cafés, coworkings, retiros, bares, hotéis, centros culturais, estúdios) à malha vibracional e social digital. Cada local torna-se um **Hotspot Vibracional Certificado**.

### Propósito Estratégico

- **Ponte físico-digital**: Conectar experiências reais com a comunidade vibracional
- **Monetização B2B**: Modelo de receita através de assinaturas e benefícios premium
- **Curadoria energética**: Garantir que locais tenham energia alinhada com valores do FriendApp
- **Ecossistema simbiótico**: Locais alimentam a rede com eventos e experiências autênticas

---

## 📋 Filosofia de Execução (Camada 0)

### Princípios Inegociáveis (North Star)

1. **Ordem de execução invariável**: Dados → APIs → Lógicas (regras/IA/antifraude) → UI/UX → Integrações
2. **Contrato dirige código**: Endpoints, payloads e erros aprovados antes de implementar
3. **Score vibracional = ativo regulado**: Tratá-lo como "saldo financeiro" (imutabilidade, trilha de auditoria, transparência)
4. **Privacidade e ética**: Feedback é anônimo por design; nenhuma inferência identifica indivíduos
5. **Observabilidade de produto**: Cada evento crítico gera log semântico e métrica
6. **Resiliência por default**: Escrita assíncrona + idempotente; leitura em cache; degradação graciosa
7. **Cálculo assíncrono**: Recomputar scores e estados vibracionais em jobs; UI consome snapshots consistentes
8. **Transparência para parceiros**: Painel mostra composição do score e razões de variação
9. **Segurança vibracional**: Estados "Colapso" não são punidos; acionam Missões de Harmonização
10. **Portabilidade**: Schemas versionados; dumps reprodutíveis

---

## 🏗️ Arquitetura de Dados

### Multi-Database Strategy

| Banco | Função Principal | Dados Armazenados |
|-------|------------------|-------------------|
| **PostgreSQL** | Dados estruturados master | Cadastro, contratos, tiers, assinaturas, eventos, auditoria |
| **Firestore** | Real-time e painéis | Check-ins/feedbacks em tempo real, painéis mobile |
| **Neo4j** | Grafos de relações | Malha usuários ↔ locais ↔ eventos |
| **Redis** | Cache de alta performance | Snapshots de score/estado, proximidade geográfica, rate-limits |

### Ordem de Execução
1. **Modelagem de Dados** (PostgreSQL, Firestore, Neo4j, Redis)
2. **Contratos de API** (OpenAPI: rotas, payloads, erros, Idempotency-Key)
3. **Lógica de Negócio e IA** (Pipelines de cálculo, antifraude, missões)
4. **UI/UX** (Painel B2B + App usuário)
5. **Integrações** (Pagamentos, CDN, mapas, push, e-mail)

---

## 📊 Sistema de Score Vibracional

### Composição do Score (0-100)

| Componente | Peso | Descrição |
|------------|------|-----------|
| **Feedbacks & Check-ins** | 70% | Ponderados por VTS (confiabilidade), geofencing, entropia |
| **Eventos recentes** | 20% | Impacto pós-evento com meia-vida (decaimento exponencial) |
| **Qualidade de mídia/descrição** | 10% | Análise semântica e estética |

### Estados Vibracionais

| Estado | Score Range | Ação do Sistema |
|--------|-------------|-----------------|
| **❄️ Colapso** | 0-30 | Missões de Harmonização ativadas |
| **💫 Transição** | 31-60 | Sugestões de melhoria |
| **🌟 Expansão** | 61-80 | Visibilidade padrão |
| **🔥 Pico** | 81-100 | Destaque no mapa + recomendações prioritárias |

### Pipeline de Cálculo Assíncrono

```
Eventos (check-in, feedback, evento, denúncia)
    ↓
Filas (Kafka/PubSub)
    ↓
Normalização + Antifraude
    ↓
Ponderação por VTS (Vibrational Trust Score)
    ↓
Agregação por janela (15 min)
    ↓
Recomputar score/estado
    ↓
Snapshot → PostgreSQL (histórico) + Redis (cache) + Firestore (painel)
```

### Pseudocódigo Simplificado

```python
def recompute_location(location_id, window=15min):
    events = read_events(location_id, window)
    clean_events = anti_fraud(events)  # remove/quarentena
    weighted = weight_by_vts(clean_events)  # pesos por reputação
    feedback_score = aggregate_feedback(weighted)  # média ponderada
    event_impact = event_impact(location_id)  # decaimento exponencial
    media_quality = media_quality_signal(location_id)
    
    score = 0.7 * feedback_score + 0.2 * event_impact + 0.1 * media_quality
    state = classify(score)  # limiares calibrados
    
    persist_snapshot(location_id, score, state, algorithm_version)
    cache_redis(location_id, score, state, ttl=15min)
```

---

## 🛡️ Sistema de Antifraude

### Vibrational Trust Score (VTS)

Sistema de **reputação do usuário** que determina o peso de seus feedbacks.

**Sinais Coletados:**
- Reputação do usuário (antiguidade, histórico)
- Entropia de feedbacks (diversidade de avaliações)
- Coesão geográfica (DBSCAN clustering de check-ins)
- Similaridade textual/horária (detecção de ataques coordenados)
- Telemetria (device-id hash, IP ASN, latência anômala)

### Ações Antifraude

| Situação | Ação |
|----------|------|
| **Novo usuário** | Peso 0.3 nos feedbacks iniciais |
| **Padrão suspeito** | Quarentena de feedbacks (não contam até revisão) |
| **Ataques coordenados** | Shadow-ban para reincidentes |
| **GPS inválido** | Rejeição de check-in (403 GEO_CONSTRAINT_FAILED) |

### K-Anonymity
- Agregados exibidos apenas com ≥ 10 contribuições
- Sem profiling sensível
- Clusters anônimos

---

## 🎖️ Sistema de Tiers (Planos B2B)

### Planos para Locais Parceiros

| Tier | Preço/mês | Benefícios Principais |
|------|-----------|----------------------|
| **🌱 Explorador** | Gratuito | Cadastro básico, aparição no mapa, 1 evento/mês |
| **🌟 Navegador** | R$ 199 | Até 5 eventos/mês, insights básicos, destaque moderado |
| **🔥 Expansor** | R$ 499 | Eventos ilimitados, analytics avançados, 1 boost/mês |
| **💎 Visionário** | R$ 999 | Tudo de Expansor + suporte prioritário, 3 boosts/mês, badge exclusivo |

### Benefícios por Tier

| Benefício | Explorador | Navegador | Expansor | Visionário |
|-----------|------------|-----------|----------|------------|
| **Eventos/mês** | 1 | 5 | Ilimitado | Ilimitado |
| **Boosts/mês** | 0 | 0 | 1 | 3 |
| **Analytics** | Básico | Intermediário | Avançado | Premium |
| **Suporte** | Email | Email | Chat | Prioritário |
| **Badge** | - | ⭐ | 🔥 | 💎 |

---

## 📱 Funcionalidades para Locais

### Painel B2B

**Recursos disponíveis:**
- Dashboard vibracional (score atual, histórico, breakdown)
- Gestão de eventos
- Analytics de check-ins e feedbacks
- Missões de Harmonização
- Impulsionamento de visibilidade
- Configuração de benefícios exclusivos

### Check-ins e Feedbacks

**Check-in:**
- Geolocalização validada (raio ≤ 100m)
- QR Code ou NFC
- Timestamp e device fingerprint

**Feedback:**
- Escala 0-10 (energia percebida)
- Comentário opcional (anônimo)
- Tags vibracionais (acolhedor, inspirador, energético, etc.)

### Missões de Harmonização

**Gatilho:** Score < 30 por 7 dias

**Tarefas Recomendadas:**
- Adicionar 2 fotos novas (validação estética)
- Responder 3 feedbacks com cordialidade (NLP positivo)
- Criar evento "reconexão" em 7 dias

**Recompensa:**
- Pontos de gamificação
- 1 crédito de boost (ao sair de colapso → transição)

---

## 🗺️ Integração com Mapa de Frequência

### Visualização em Tempo Real

**Representação no mapa:**
- **Tamanho do ponto** ~ quantidade de check-ins recentes
- **Cor do ponto** ~ estado vibracional (colapso ❄️, transição 💫, expansão 🌟, pico 🔥)
- **Opacidade** ~ nível de atividade atual

### Filtros para Usuários
- Por categoria (café, restaurante, coworking, etc.)
- Por frequência desejada (0-10)
- Por benefícios disponíveis
- Por distância (raio configurável)

### Recomendações Personalizadas
- Locais compatíveis com frequência do usuário
- Histórico positivo de check-ins
- Proximidade geográfica
- Eventos ativos no local

---

## 🔐 Segurança e Privacidade

### Padrões Implementados

| Camada | Medida |
|--------|--------|
| **Autenticação** | JWT curto (≤ 15min) + refresh token |
| **Autorização** | RBAC (roles: user, partner, admin, system/ia) |
| **Transporte** | TLS obrigatório |
| **Idempotência** | Idempotency-Key em POST críticos |
| **Webhooks** | Assinaturas HMAC + replay protection (5 min window) |
| **Geofencing** | Check-ins exigem GPS válido (distância ≤ 100m) |
| **Rate Limiting** | Redis Leaky-Bucket por IP+user+partner |
| **PII** | Schema dedicado + hash salgado para pseudônimos |
| **LGPD/GDPR** | Consentimentos, export/delete por subject request |

---

## 📦 Endpoints de API (Exemplos)

### Cadastro de Local Parceiro
```http
POST /api/v1/locations/register

Request:
{
  "nome": "Café Vibracional",
  "categoria": "cafe",
  "endereco": {...},
  "geolocation": { "lat": -23.550520, "lng": -46.633308 },
  "descricao": "Espaço acolhedor para conexões autênticas",
  "tier": "explorador"
}

Response:
{
  "location_id": "uuid",
  "status": "em_curacao",
  "score_inicial": 50.0,
  "estado": "transicao"
}
```

### Check-in de Usuário
```http
POST /api/v1/locations/:location_id/checkin
Headers: Idempotency-Key: <uuid>

Request:
{
  "user_id": "abc123",
  "geolocation": { "lat": -23.550520, "lng": -46.633308 },
  "device_fingerprint": "hash"
}

Response:
{
  "checkin_id": "uuid",
  "xp_ganho": 10,
  "conexoes_sugeridas": [...]
}
```

### Feedback Anônimo
```http
POST /api/v1/locations/:location_id/feedback
Headers: Idempotency-Key: <uuid>

Request:
{
  "user_hash": "pseudonym",
  "frequencia_percebida": 8.5,
  "comentario": "Ambiente incrível!",
  "tags": ["acolhedor", "inspirador"]
}
```

### Consultar Score e Estado
```http
GET /api/v1/locations/:location_id/score

Response:
{
  "location_id": "uuid",
  "score": 78.5,
  "estado": "expansao",
  "breakdown": {
    "feedbacks_checkins": 55.0,
    "eventos_recentes": 15.5,
    "qualidade_midia": 8.0
  },
  "algorithm_version": "v1.0",
  "computed_at": "2025-10-17T14:45:00Z"
}
```

### Impulsionamento (Boost)
```http
POST /api/v1/locations/:location_id/boost

Request:
{
  "duracao_horas": 24,
  "raio_km": 10
}

Response:
{
  "boost_id": "uuid",
  "status": "ativo",
  "expira_em": "2025-10-18T14:00:00Z",
  "custo_creditos": 1
}
```

---

## 📈 Non-Functional Requirements (NFRs)

| Domínio | Requisito | Meta |
|---------|-----------|------|
| **Disponibilidade** | Uptime | ≥ 99.9% mensal |
| **Latência** | GET painéis/mapa | p95 ≤ 300ms (cache) |
| **Latência** | POST check-in/feedback | p95 ≤ 600ms (fila assíncrona) |
| **Consistência** | Score exibido | Snapshot ≤ 15 min |
| **Segurança** | TLS, JWT, RBAC, HMAC | Obrigatório |
| **Privacidade** | Pseudonimização, K-anonymity | Obrigatório |
| **Observabilidade** | Tracing, métricas, logs | 100% rotas core |
| **Escalabilidade** | Autoscaling (HPA) | CPU/latência |
| **Backups** | PostgreSQL/Firestore/Neo4j/Redis | Diários + testes de restore |

---

## 📊 Observabilidade

### Tracing Distribuído
- W3C Traceparent
- Correlation ID em todos os logs

### Logs Estruturados (JSON)
```json
{
  "event_type": "checkin_created",
  "actor": "user:abc123",
  "entity": "location:xyz789",
  "correlation_id": "uuid",
  "timestamp": "2025-10-17T14:30:00Z",
  "metadata": {...}
}
```

### Métricas Técnicas
- Latência p50/p95/p99
- Taxa de erro (2xx, 4xx, 5xx)
- Saturação (CPU, memória, I/O)
- Retries e circuit breakers

### Métricas de Produto
- \# check-ins / hora
- \# feedbacks / dia
- Variação média de frequency_score
- % colapso → transição (taxa de recuperação)
- Adesão a missões (%)

### Alertas Críticos
- p95 POST /checkins > 1s (10 min)
- Erro 5xx > 2% (5 min)
- Explosão de feedbacks negativos (Z-score > 3 em 30 min)
- Webhook pagamentos falhando consecutivamente

---

## 🎮 Gamificação e Missões

### Para Locais Parceiros

**Missões de Harmonização** (estado Colapso):
- Adicionar mídia de qualidade
- Responder feedbacks
- Criar eventos de reconexão

**Recompensas:**
- Pontos de experiência
- Créditos de boost
- Badges especiais
- Destaque temporário

### Para Usuários

**Benefícios ao fazer check-in:**
- XP energético
- Descoberta de conexões no local
- Descontos/benefícios exclusivos (se tier premium)
- Contribuição para score vibracional do ecossistema

---

## 🔄 Integrações

### Pagamentos
- Stripe/Asaas para assinaturas
- Webhooks com HMAC signature
- Retry automático em falhas
- Revogação de acesso em caso de inadimplência

### Mapas
- Google Maps API (visualização)
- Geohash para indexação espacial
- PostGIS para queries geográficas

### Notificações
- Push (Firebase Cloud Messaging)
- Email (SendGrid/AWS SES)
- SMS (Twilio) para verificações críticas

### CDN
- Cloudflare/AWS CloudFront
- Armazenamento de imagens otimizadas

---

## 🚀 Roadmap de Implementação

### v1.0: MVP (Meses 1-3)
- [ ] CRUD de locais parceiros
- [ ] Sistema de tiers (4 planos)
- [ ] Check-in com geofencing
- [ ] Feedback anônimo
- [ ] Score vibracional v1
- [ ] Painel B2B básico

### v1.1: Antifraude & Transparência (Meses 4-5)
- [ ] VTS (Vibrational Trust Score)
- [ ] Antifraude v1 (quarentena, pesos dinâmicos)
- [ ] Explicabilidade do score (breakdown)
- [ ] Missões de Harmonização

### v1.2: Analytics & Boosts (Meses 6-7)
- [ ] Dashboard analytics avançado
- [ ] Sistema de impulsionamento
- [ ] A/B testing de algoritmos
- [ ] Learning-to-rank em recomendações

### v1.3: IA Avançada (Meses 8-9)
- [ ] Media understanding v2 (estética/cores/luz)
- [ ] Boost inteligente (budget-aware)
- [ ] Recomendações contextuais
- [ ] Previsão de estados vibracionais

---

## 🧪 Estratégia de Testes

### Matriz de Testes

| Tipo | Escopo | Cobertura |
|------|--------|-----------|
| **Unit** | Cálculo de score, classificadores, antifraude | ≥ 85% |
| **Contract** | Conformidade OpenAPI + erros | 100% endpoints |
| **Property-based** | Invariantes (ex.: score ∈ [0,100]) | Core logic |
| **Load** | 1000 check-ins/min (auto-scale) | p95 < 600ms |
| **Chaos** | Perda temporária de Firestore/Redis | Degradação graciosa |
| **Security** | JWT replay, webhook signature, rate-limit | OWASP Top 10 |
| **UX** | Estados vazios, geofencing off, offline | Jornadas críticas |

### Ambientes
- **dev**: Hot-reload, dados sintéticos
- **staging**: Paridade com produção
- **prod**: Locks, feature flags, rollback automático

---

## 📝 Governança de Algoritmo

### Versionamento
- **algorithm_version** salvo em cada snapshot
- Change logs públicos para parceiros (sumário)
- A/B testing controlado por feature flags

### Explainability
- Fatores dominantes do score
- Changelog vibracional (o que alterou e por quê)
- Right to Explanation (LGPD/GDPR)

### Rollback Automático
- Se p95 latência aumentar
- Se satisfação de parceiros diminuir
- Circuit breaker por versão

---

## 🛠️ Stack Tecnológico Recomendado

### Backend
- **Node.js (Fastify)** - API REST principal
- **Python (FastAPI)** - Pipeline de IA e antifraude
- **Go** - Microserviço de geolocalização (alta performance)

### Banco de Dados
- **PostgreSQL** - Master data + auditoria
- **Firestore** - Real-time + painéis mobile
- **Neo4j** - Grafos de relações
- **Redis** - Cache + geospatial queries

### Processamento
- **Kafka / Google Pub/Sub** - Event streaming
- **Airflow / Temporal** - Orchestration de jobs

### Monitoramento
- **Prometheus + Grafana** - Métricas
- **Jaeger / Tempo** - Tracing distribuído
- **ELK / Loki** - Logs estruturados

---

## 📚 Referências

- Manual Técnico — Sistema de Locais Parceiros (completo)
- docs/resumos/sistema-eventos-experiencias.md
- docs/resumos/sistema-chat-vibracional.md
- docs/resumos/mapa-frequencia.md
- docs/sumario-executivo.md

---

**Próximos Passos:**
1. Definir limiares exatos dos estados vibracionais
2. Calibrar pesos do algoritmo de score
3. Implementar pipeline de antifraude v1
4. Criar protótipos de Painel B2B
5. Validar integrações de pagamento
