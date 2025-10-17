# Resumo Técnico: Inteligência Artificial Operacional (FriendApp)

**Documento Base:** Manual Técnico Definitivo — Inteligência Artificial Operacional  
**Categoria:** IA & Machine Learning  
**Data:** 17/10/2025

---

## 📋 Visão Geral

O manual define a **IA Operacional** como núcleo funcional distribuído do FriendApp, responsável por **performance**, **segurança**, **personalização** e **resiliência técnica**. Diferente da IA Aurah Kosmos (que processa dados vibracionais), a IA Operacional é **100% técnica** e blindada contra contaminação vibracional.

### Conceito Central
**IA Operacional Multinúcleo** - Sistema distribuído com 4 núcleos independentes:
1. **IA Recomendação** - Sugestões de recursos e conexões
2. **IA Performance** - Redução de latência e escalonamento
3. **IA Segurança** - Bloqueio de padrões anômalos
4. **IA Jornada** - Ajuste dinâmico de UX

---

## 🧠 Estrutura Multinúcleo

### Fórmula de Eficiência Operacional

```
score_eficiencia_operacional = (w1 * latencia_media) + (w2 * uptime) - (w3 * erros_criticos)

Onde:
- latencia_media = tempo médio de resposta de APIs (ms)
- uptime = disponibilidade (%)
- erros_criticos = falhas fatais detectadas por módulo
- Pesos sugeridos: w1 = 0.4 , w2 = 0.5 , w3 = 0.1
```

### Núcleos e Métricas

| Núcleo | Função | Métrica Principal |
|--------|--------|-------------------|
| **IA Recomendação** | Sugerir recursos e conexões | precision@k das sugestões |
| **IA Performance** | Reduzir latência e escalar clusters | latencia_media < 250ms |
| **IA Segurança** | Bloquear padrões anômalos | taxa_falsos_positivos < 5% |
| **IA Jornada** | Ajustar UX dinamicamente | taxa_abandono_tela ↓ |

---

## 🏗️ Arquitetura Distribuída

### Topologia Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ia-recomendacao
spec:
  containers:
  - name: ia-recomendacao
    image: friendapp/ia-recomendacao:v1
    resources:
      limits:
        cpu: "2"
        memory: "4Gi"
---
apiVersion: v1
kind: Service
metadata:
  name: ia-recomendacao-svc
spec:
  selector:
    app: ia-recomendacao
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
```

### Características da Arquitetura

- **Pods Isolados** - Cada núcleo em pods independentes
- **Escalonamento Automático** - Horizontal Pod Autoscaler (HPA)
- **Node Pools Separados** - Recomendação, Segurança, Jornada, Performance

### Event Bus (Kafka + RabbitMQ)

**Tópicos Kafka:**
```
feed.new_post
chat.message_sent
user.session_update
ia.anomaly_detected
```

**Características:**
- Eventos assíncronos para evitar bloqueio de UX
- Cada módulo consome apenas eventos relevantes
- Schema Registry para contratos versionados

### Camada Anti-Vibração (Isolamento)

```python
IF request.origin == aurah_kosmos:
    REJECT()
ELSE:
    ACCEPT()
```

**Princípio:** Nenhum módulo da IA Operacional acessa diretamente dados vibracionais crus. O isolamento é feito por camada de proxy que descarta qualquer chamada vinda da Aurah Kosmos.

### Fluxo de Comunicação

```
Usuário interage no app
  ↓
Evento gerado → Kafka
  ↓
  ├── IA Recomendação Pod → Resposta assíncrona
  ├── IA Performance Pod → Logs de performance
  ├── IA Segurança Pod → Trigger de bloqueio
  └── IA Jornada Pod → Alteração UX
```

### Banco e Cache

| Tecnologia | Função | Uso |
|------------|--------|-----|
| **Redis** | Cache de sessões | Respostas em tempo real |
| **PostgreSQL** | Histórico de comportamento | Processamento assíncrono |
| **ElasticSearch** | Logs de eventos IA | Análise em tempo real |
| **Firestore** | Dados temporários | Feedback imediato |

### Métricas Técnicas

| Métrica | Target |
|---------|--------|
| **latência_evento** | < 200ms |
| **uptime_cluster** | > 99.95% |
| **throughput_mensagens** | > 50k eventos/s |
| **failover** | < 2s |

---

## 🎯 IA de Recomendação Funcional

### 1. Modelo Matemático (Livro de Fórmulas)

#### 1.1 Vetorização e Semelhança

```
Vetor do usuário: u ∈ ℝ^d
Vetor do item/ação: f ∈ ℝ^d

Similaridade cosseno:
sim_cos(u, f) = (u · f) / (||u|| ||f||)
```

#### 1.2 Fatoração de Matriz (Collaborative Filtering)

```
r̂_u,f = μ + b_u + b_f + q_f^T p_u

Onde:
- μ = viés global
- b_u, b_f = vieses de usuário e item
- p_u, q_f ∈ ℝ^k = embeddings latentes
```

#### 1.3 Contexto Temporal (Decay)

```
w_t = e^(-λ Δt)     (λ ∈ [0.01, 0.2])

Onde:
- Δt = tempo desde a última interação
- λ = taxa de decaimento
```

#### 1.4 Probabilidade de Clique (CTR)

```
P(click | x) = σ(w^T x)
σ(z) = 1 / (1 + e^(-z))

Onde x = features (sim_cos, r̂, tempo, dispositivo, sessão)
```

#### 1.5 Penalização de Risco/Segurança

```
pen_risk = min(1, α · risk_score_u,f)

Onde α controla a intensidade da penalização
```

#### 1.6 Exploração vs. Exploração (UCB)

```
ucb_u,f = r̄_u,f + c * sqrt(ln N_u / (n_u,f + 1))

Onde:
- r̄_u,f = rating médio
- N_u = total de interações do usuário
- n_u,f = interações com o item f
- c = parâmetro de exploração
```

#### 1.7 Re-ranking por Diversidade (MMR)

```
MMR(f) = λ · sim_cos(u, f) - (1 - λ) · max_{f' ∈ S} sim_cos(f, f')

Onde:
- S = conjunto já selecionado
- λ ∈ [0.5, 0.8] = balanço diversidade/relevância
```

#### 1.8 Score Final de Ranking

```
score_u,f = β1 · sim_cos 
          + β2 · r̂_u,f 
          + β3 · P(click) 
          + β4 · ucb_u,f 
          + β5 · w_t 
          - β6 · pen_risk

Sugerido: β = {0.25, 0.20, 0.25, 0.10, 0.10, 0.10}
```

### 2. Pipeline Assíncrono (Tempo Real)

#### Tópicos Kafka
```
ux.view
ux.click
ux.dwell
feed.new_post
graph.edge_event
security.risk_update
model.feedback
```

#### Consumidores

| Serviço | Função | Tecnologia |
|---------|--------|------------|
| **recall-candidate-gen** | Top-N candidatos | ANN/FAISS ou PGVector |
| **real-time-features** | Atualiza features e contagens com decaimento | Redis Streams |
| **ranker-service** | Computa score, aplica MMR, grava Top-K | Redis + PostgreSQL |

#### SLA
- **p95 latency:** < 120 ms (cache + ANN)
- **Throughput:** > 5k req/s por zona

### 3. Contratos de API

#### 3.1 GET /api/ia/recomendacao

**Query Parameters:**
- `user_id` (required)
- `k` (optional, default=10)
- `context` (optional: feed|connect|feature)
- `ab_bucket` (optional)

**200 Response:**
```json
{
  "user_id": "u_123",
  "k": 10,
  "context": "feed",
  "items": [
    {
      "id": "f_882",
      "score": 0.8732,
      "features": {
        "sim_cos": 0.81,
        "r_hat": 0.62,
        "ctr_p": 0.57,
        "ucb": 0.11,
        "time_decay": 0.93,
        "risk_pen": 0.00
      },
      "reason": ["similar_usage", "fresh", "diverse"]
    }
  ],
  "latency_ms": 37
}
```

**Códigos:** 200, 400 (invalid_user), 401, 404 (cold_start), 429, 500

#### 3.2 POST /api/ia/feedback-sugestao

**Request Body:**
```json
{
  "user_id": "u_123",
  "item_id": "f_882",
  "action": "click|dismiss|block",
  "context": "feed",
  "ts": "2025-09-02T14:43:21Z"
}
```

**200 Response:**
```json
{ "ack": true }
```

#### 3.3 GET /api/ia/vetor-comportamento

**200 Response:**
```json
{
  "user_id": "u_123",
  "embedding": [-0.014, 0.233, ...],
  "updated_at": "2025-09-02T14:39:01Z"
}
```

**Headers padrão:**
```
Authorization: Bearer <JWT>
X-Trace-Id: <uuid>
Content-Type: application/json
```

### 4. Modelo de Dados (DDL)

```sql
CREATE TABLE user_embedding (
    user_id VARCHAR PRIMARY KEY,
    dim SMALLINT NOT NULL DEFAULT 128,
    vec VECTOR(128),  -- PGVector
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE feature_embedding (
    feature_id VARCHAR PRIMARY KEY,
    type VARCHAR(24) NOT NULL,  -- user|content|feature
    vec VECTOR(128),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE interaction_log (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    item_id VARCHAR NOT NULL,
    action VARCHAR(16) NOT NULL,  -- view|click|dismiss|block
    context VARCHAR(16) NOT NULL,
    ts TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_interaction_user_ts ON interaction_log(user_id, ts DESC);

CREATE TABLE suggestion_log (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    item_id VARCHAR NOT NULL,
    score NUMERIC(6,4) NOT NULL,
    features JSONB NOT NULL,
    context VARCHAR(16) NOT NULL,
    trace_id UUID NOT NULL,
    served_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_suggestion_user_served ON suggestion_log(user_id, served_at DESC);
```

#### Redis (chaves)

```
rec:topk:{user_id}:{context}  → ZSET (item_id, score), TTL 5-15 min
stat:ctr:{item_id}            → contagens decaídas
feat:recent:{user_id}         → janela deslizante de eventos
```

### 5. Seleção & Re-ranking (Pseudocódigo)

```python
def topk_recommend(user_id, k=10, context="feed"):
    u = load_user_vec(user_id)  # PGVector
    C = ann_candidates(u, context, N=200)  # FAISS / ivfflat
    feats = build_features(user_id, C)
    # sim_cos, r_hat, ctr_p, ucb, time_decay, risk_pen
    
    scores = {f: score(feats[f]) for f in C}  # fórmula 2.8
    S = mmr_rerank(u, scores, C, lambda_=0.7)  # diversidade
    S = policy_filter(S, context)  # bloqueio, cap de repetição
    
    cache_redis(user_id, context, S[:k])
    log_serving(user_id, S[:k])
    return S[:k]
```

#### Cold-Start

Se usuário não tem vetor:
- Usar **popularidade contextual**
- Similaridade por atributos declarados (idade, região, device)
- Exploração maior (λ↓, c↑)

### 6. Treino/Atualização de Modelos

**Batch Offline (Diário):**
- Treino de embeddings em dataset histórico
- Calibração de pesos β
- Validação A/B testing

**Online Incremental:**
- Atualização de CTR por item
- Decaimento temporal de features
- Ajuste de UCB por feedback

---

## 🛡️ IA de Segurança

### Detecção de Anomalias

**Padrões Monitorados:**
- Taxa de requisições anormais (> 3σ do baseline)
- Padrões de acesso suspeitos (tentativas de SQL injection, XSS)
- Comportamento bot-like (velocidade, sequência, user-agent)
- Denúncias recorrentes de usuários

### Algoritmo de Bloqueio

```python
def detect_anomaly(user_id, action):
    baseline = get_baseline(user_id, action)
    current = get_current_rate(user_id, action)
    
    if current > baseline + 3 * std_dev:
        score_risk = calculate_risk_score(user_id)
        
        if score_risk > THRESHOLD_HIGH:
            block_user(user_id, duration="24h")
            notify_admins(user_id, score_risk)
        elif score_risk > THRESHOLD_MEDIUM:
            rate_limit(user_id, factor=0.5)
            log_warning(user_id, score_risk)
```

### Métricas de Segurança

| Métrica | Target |
|---------|--------|
| **Taxa de falsos positivos** | < 5% |
| **Tempo de detecção** | < 30s |
| **Tempo de bloqueio** | < 5s |
| **Recall de ataques** | > 95% |

---

## ⚡ IA de Performance

### Auto-Scaling Inteligente

**Métricas Monitoradas:**
- CPU usage por pod
- Memory usage por pod
- Latência p95 de APIs
- Taxa de erros 5xx
- Throughput de mensagens Kafka

### Algoritmo de Escalonamento

```python
def auto_scale(service_name):
    metrics = get_metrics(service_name)
    
    if metrics.cpu > 70% or metrics.latency_p95 > 250:
        scale_up(service_name, replicas=+2)
    elif metrics.cpu < 30% and metrics.latency_p95 < 100:
        scale_down(service_name, replicas=-1)
    
    if metrics.error_rate > 5%:
        alert_oncall(service_name, metrics)
        investigate_errors(service_name)
```

### Cache Inteligente

**Estratégias:**
- **Write-through** - Escrita simultânea em cache e banco
- **Read-through** - Leitura do cache, fallback para banco
- **Time-based invalidation** - TTL por tipo de dado
- **Event-based invalidation** - Kafka triggers para invalidação

### Métricas de Performance

| Métrica | Target |
|---------|--------|
| **Latência média** | < 150ms |
| **Latência p95** | < 250ms |
| **Latência p99** | < 500ms |
| **Cache hit rate** | > 85% |
| **Throughput** | > 10k req/s |

---

## 🎨 IA de Jornada (UX Dinâmica)

### Ajustes de UX em Tempo Real

**Decisões da IA:**
- Reduzir animações se device com GPU fraca
- Simplificar UI se usuário com baixa literacy digital
- Aumentar tamanho de fonte se usuário 60+
- Desabilitar sons se padrão de uso silencioso

### Algoritmo de Personalização

```python
def personalize_ux(user_id):
    profile = get_user_profile(user_id)
    device = get_device_info(user_id)
    behavior = get_behavior_patterns(user_id)
    
    ux_config = {
        "animations": "full" if device.gpu == "high" else "minimal",
        "font_size": calculate_optimal_font(profile.age),
        "sound": "on" if behavior.sound_usage > 0.5 else "off",
        "complexity": "advanced" if behavior.feature_adoption > 0.7 else "simple"
    }
    
    return ux_config
```

### A/B Testing Automático

**Framework:**
- Definição de experimentos em YAML
- Alocação de usuários via hash consistente
- Coleta automática de métricas
- Decisão estatística via Bayesian testing

**Exemplo de Experimento:**
```yaml
experiment:
  name: "feed_layout_v2"
  variants:
    - name: "control"
      weight: 50
      config: { layout: "vertical" }
    - name: "treatment"
      weight: 50
      config: { layout: "grid" }
  metrics:
    primary: "session_duration"
    secondary: ["scroll_depth", "engagement_rate"]
  duration: "14d"
  min_sample_size: 10000
```

### Métricas de Jornada

| Métrica | Target |
|---------|--------|
| **Taxa de abandono** | < 15% |
| **Tempo de sessão** | > 8 min |
| **Feature adoption rate** | > 60% |
| **NPS** | > 70 |

---

## 📊 Modelo de Dados Consolidado

```sql
CREATE TABLE ia_operacional_core (
    id SERIAL PRIMARY KEY,
    nucleo VARCHAR(50) NOT NULL,  -- recomendacao|performance|seguranca|jornada
    metrica VARCHAR(50),
    valor NUMERIC,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ia_logs (
    id BIGSERIAL PRIMARY KEY,
    nucleo VARCHAR(50) NOT NULL,
    level VARCHAR(10),  -- info|warning|error
    message TEXT,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ia_anomalies (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR,
    anomaly_type VARCHAR(50),
    risk_score NUMERIC(5,2),
    action_taken VARCHAR(50),  -- block|rate_limit|warning|none
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ia_ab_experiments (
    id SERIAL PRIMARY KEY,
    experiment_name VARCHAR(100) NOT NULL,
    user_id VARCHAR NOT NULL,
    variant VARCHAR(50) NOT NULL,
    metrics JSONB,
    assigned_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 APIs Consolidadas

### Estado da IA

**GET /api/ia/core/status**
```json
{
  "uptime": 99.98,
  "latencia_media": 183,
  "nucleos": {
    "recomendacao": { "status": "healthy", "replicas": 5 },
    "performance": { "status": "healthy", "replicas": 3 },
    "seguranca": { "status": "healthy", "replicas": 4 },
    "jornada": { "status": "healthy", "replicas": 2 }
  }
}
```

**GET /api/ia/core/metrics**
```json
{
  "recomendacao": { "precision@10": 0.82, "latency_p95": 115 },
  "performance": { "cpu_avg": 0.45, "memory_avg": 0.62 },
  "seguranca": { "anomalies_detected": 23, "false_positive_rate": 0.04 },
  "jornada": { "avg_session": 512, "abandonment_rate": 0.12 }
}
```

---

## 🎯 Integrações com Outros Módulos

### Com IA Aurah Kosmos
- **Isolamento total** via camada anti-vibração
- **Sem troca de dados** vibracionais crus
- **Comunicação apenas via** eventos Kafka públicos

### Com Feed Sensorial
- **Entrada:** Interações do usuário (views, clicks, dwell time)
- **Saída:** Top-K recomendações de posts
- **Frequência:** Tempo real (< 120ms)

### Com Sistema de Conexões
- **Entrada:** Grafo de conexões, interações entre usuários
- **Saída:** Sugestões de conexões compatíveis
- **Frequência:** Batch diário + incremental em tempo real

### Com Jogo da Transmutação
- **Entrada:** Progresso de missões, XP acumulado
- **Saída:** Sugestões de próximas missões, ajuste de dificuldade
- **Frequência:** A cada conclusão de missão

---

## 🚀 Roadmap de Implementação

### Fase 1: Núcleos Base (Mês 1-3)
- [ ] Implementar IA de Recomendação (ANN + MMR)
- [ ] Implementar IA de Performance (auto-scaling)
- [ ] Setup de Kafka + Schema Registry
- [ ] Testes unitários e de integração

### Fase 2: Segurança e Jornada (Mês 4-6)
- [ ] Implementar IA de Segurança (detecção de anomalias)
- [ ] Implementar IA de Jornada (UX dinâmica)
- [ ] A/B testing framework
- [ ] Dashboards de observabilidade

### Fase 3: Otimização (Mês 7-9)
- [ ] Fine-tuning de embeddings
- [ ] Calibração de pesos β
- [ ] Cache inteligente avançado
- [ ] Redução de latência (target: p95 < 100ms)

### Fase 4: Escala (Mês 10-12)
- [ ] Multi-região deployment
- [ ] Load testing (> 100k req/s)
- [ ] Chaos engineering
- [ ] Documentação completa

---

## 📝 Logs Técnicos

### core_health.log
```json
{
  "nucleo": "performance",
  "latencia_media": 240,
  "uptime": 99.96,
  "alerta": false,
  "timestamp": "2025-09-01T12:30:21Z"
}
```

### core_anomaly.log
```json
{
  "nucleo": "seguranca",
  "user_id": "u_9843",
  "anomaly_type": "high_request_rate",
  "risk_score": 0.87,
  "action": "rate_limit",
  "timestamp": "2025-09-01T14:22:11Z"
}
```

---

## 🔐 Segurança da IA Operacional

### Proteção contra Ataques

| Tipo de Ataque | Mitigação |
|----------------|-----------|
| **Model Poisoning** | Validação de features, detecção de outliers |
| **Adversarial Examples** | Ensemble de modelos, input sanitization |
| **Data Leakage** | Anonimização, differential privacy |
| **Model Extraction** | Rate limiting, obfuscação de outputs |

### Auditoria

- Logs imutáveis de todas as recomendações
- Trace_id para rastreamento end-to-end
- Métricas de fairness (bias por idade, gênero, região)
- Revisão mensal por comitê de ética em IA

---

## 📈 Métricas de Sucesso

### Recomendação
- **Precision@10:** > 75%
- **Recall@10:** > 60%
- **NDCG@10:** > 0.80
- **Diversidade:** > 0.70

### Performance
- **Latência p95:** < 150ms
- **Uptime:** > 99.95%
- **CPU usage:** < 70%
- **Cost per 1M requests:** < $5

### Segurança
- **False positive rate:** < 5%
- **Attack detection rate:** > 95%
- **Response time:** < 30s

### Jornada
- **Abandonment rate:** < 15%
- **Session duration:** > 8 min
- **Feature adoption:** > 60%

---

**Documentado por:** Devin AI  
**Data:** 17/10/2025  
**Versão:** 1.0  
**Status:** ✅ Integrado ao núcleo FriendApp-Core
