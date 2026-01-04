# Resumo Tecnico: Sistema Mostre Seu Talento (MST)

## Visao Geral

O **Mostre Seu Talento (MST)** e uma funcionalidade completa do FriendApp que permite aos usuarios criar, publicar e compartilhar conteudos de talento (video, audio, texto ou misto). O sistema utiliza **25 camadas tecnicas** integradas com a IA Aurah Kosmos para processar, analisar, moderar e distribuir conteudos de forma inteligente, garantindo qualidade, seguranca e experiencia personalizada.

## Proposito Tecnico

- **Escopo**: Plataforma de criacao e descoberta de talentos com IA avancada
- **Finalidade**: Permitir que usuarios expressem seus talentos e sejam descobertos por audiencias compativeis
- **Diferencial**: Analise multimodal (video + audio + texto) com vetorizacao de 128 dimensoes, ranking por ImpactScore e moderacao automatica

## Arquitetura em 25 Camadas

### Camadas Core (1-7)

| Camada | Nome | Funcao Tecnica |
|--------|------|----------------|
| **1** | Gateway & Auth | Autenticacao JWT, validacao de schema, rate-limit, orquestracao |
| **2** | Ingestion Pipeline | Upload multipart, transcodificacao, normalizacao de midia |
| **3** | Inference Engine | IA Aurah Kosmos - vetorizacao multimodal, ImpactScore, RiskScore |
| **4** | Publication Orchestrator | Regras de negocio, decisao de publicacao, status pipeline |
| **5** | Feed & Ranking | Indexacao ES, ranking personalizado, busca semantica |
| **6** | Engagement System | Views, Waves (reacoes), metricas de interacao |
| **7** | Donation System | FriendCoins, Pix, ledger contabil, escrow |

### Camadas de Experiencia (8-14)

| Camada | Nome | Funcao Tecnica |
|--------|------|----------------|
| **8** | Creator Insights | Dashboard do criador, metricas avancadas, recomendacoes IA |
| **9** | Discovery Engine | Matching de talentos, similaridade vetorial, colaboracao social |
| **10** | Moderation Core | Moderacao automatica + humana, filas, decisoes |
| **11** | Moderation Rules | Regras deterministicas, thresholds, acoes automaticas |
| **12** | Quality Analysis | Analise tecnica de video (iluminacao, foco, estabilidade) |
| **13** | Data Layer | PostgreSQL, ElasticSearch, S3, estruturas de dados |
| **14** | UI/UX Flow | Telas, componentes, animacoes, eventos de interface |

### Camadas de Infraestrutura (15-22)

| Camada | Nome | Funcao Tecnica |
|--------|------|----------------|
| **15** | Notifications | WebSockets, push notifications, eventos em tempo real |
| **16** | Community Rules | Regras comunitarias, reputacao, penalidades |
| **17** | Events & Lives | Convites, palcos virtuais, eventos ao vivo |
| **18** | Logging & Audit | Logs estruturados, auditoria, rastreabilidade |
| **19** | Analytics | Metricas de negocio, dashboards, insights |
| **20** | Performance | Cache, sharding, CDN, otimizacoes |
| **21** | Security Core | Autenticacao, criptografia, anti-bot, protecao a menores |
| **22** | QA & Testing | Testes unitarios, integracao, carga, regressao |

### Camadas Avancadas (23-25)

| Camada | Nome | Funcao Tecnica |
|--------|------|----------------|
| **23** | Versioning | Controle de versao, rollback, feature flags |
| **24** | Explainability | Transparencia da IA, explicacoes de decisoes |
| **25** | Behavioral Engine | Padroes comportamentais, tendencias, adaptacao em tempo real |

## Fluxo Principal de Criacao de Conteudo

### Pipeline de Ingestao

```
USUARIO CRIA TALENTO
        |
        v
   CAMADA 1 (Gateway)
   - Autenticacao JWT
   - Validacao de schema
   - Rate-limit
        |
        v
   CAMADA 2 (Ingestion)
   - Upload multipart para S3
   - Transcodificacao (720p, H.265)
   - Extracao de audio
   - Transcricao automatica
        |
        v
   CAMADA 3 (Inference)
   - Vetorizacao multimodal
   - Calculo ImpactScore
   - Calculo RiskScore
   - Classificacao de arquetipos
        |
        v
   CAMADA 4 (Publication)
   - Aplicacao de regras
   - Decisao: approved/rejected/review
   - Emissao de eventos Kafka
        |
        v
   CAMADA 5 (Feed)
   - Indexacao no ElasticSearch
   - Ranking personalizado
   - Distribuicao no feed
```

## Endpoints Principais da API

### Criacao de Conteudo

```
POST /mst/create
{
  "creator_id": "uuid",
  "title": "string",
  "type": "video|audio|text|mixed",
  "intent": "string",
  "language": "pt-BR"
}

Response:
{
  "temp_id": "uuid",
  "upload_urls": [
    {"part": 1, "url": "https://..."}
  ]
}
```

### Finalizacao de Upload

```
POST /mst/commit
{
  "temp_id": "uuid",
  "media_refs": [...],
  "transcription": "string"
}

Response:
{
  "talent_id": "uuid",
  "status": "pending"
}
```

### Consulta de Conteudo

```
GET /mst/{id}
GET /mst/feed
POST /mst/{id}/view
POST /mst/{id}/wave
```

## Sistema de Inferencia (Camada 3)

### Arquitetura Multimodal

O sistema utiliza 4 torres de processamento:

| Torre | Entrada | Saida |
|-------|---------|-------|
| **Audio Tower** | Espectrograma normalizado | Vetor 32D |
| **Video Tower** | Frames normalizados | Vetor 64D |
| **Text Tower** | Transcricao tokenizada | Vetor 16D |
| **Cross Tower** | Audio + Video combinados | Vetor 16D |

### Feature Vector Final

```
feature_vector = concat(audio_vec, video_vec, text_vec, cross_vec)
// Resultado: Vetor 128D
```

### Calculo do ImpactScore

```
ImpactScore = sigmoid(W_i * feature_vector + b_i) * 1000

Onde:
- W_i: Pesos treinados
- b_i: Bias
- Resultado: 0-1000 (normalizado)
```

### Calculo do RiskScore

```
RiskScore = sigmoid(W_r * feature_vector + b_r)

Thresholds:
- >= 0.70: Auto-rejeicao
- 0.30-0.69: Revisao humana obrigatoria
- < 0.30: Conteudo seguro
```

### Classificacao de Arquetipos (7 Dimensoes)

```
archetype_scores = softmax(W_a * feature_vector + b_a)

Arquetipos:
1. Expressivo
2. Tecnico
3. Emocional
4. Energetico
5. Narrativo
6. Visual
7. Sonoro
```

## Sistema de Ranking (Camada 5)

### Formula de Ranking Personalizado

```
feed_score = (
    0.35 * impact_score_normalized +
    0.25 * cosine_similarity(user_vector, talent_vector) +
    0.20 * social_signal_score +
    0.10 * freshness_score +
    0.10 * quality_score
)
```

### Busca Vetorial (ANN)

```json
{
  "dense_vector": {
    "type": "dense_vector",
    "dims": 128,
    "similarity": "cosine",
    "index": true
  }
}
```

### Estrategia de Cache

- Feed cacheado por 5 minutos (TTL)
- Invalidacao seletiva em novos conteudos
- Pre-carregamento de thumbnails

## Sistema de Engajamento (Camada 6)

### Tipos de Waves (Reacoes)

| Wave | Significado | Peso |
|------|-------------|------|
| **Energia** | Conteudo energizante | 1.0 |
| **Emocao** | Conteudo emocionante | 1.2 |
| **Inspiracao** | Conteudo inspirador | 1.5 |
| **Talento** | Reconhecimento de talento | 2.0 |

### Metricas de Engajamento

```json
{
  "talent_id": "uuid",
  "views": 20431,
  "waves": 541,
  "completion_rate": 0.37,
  "avg_watch_time": 24.5
}
```

## Sistema de Doacoes (Camada 7)

### Fluxo de Doacao

```
USUARIO ENVIA DOACAO
        |
        v
   VALIDACAO ANTIFRAUDE
        |
        v
   ESCROW (retencao 24h)
        |
        v
   LEDGER CONTABIL
        |
        v
   LIBERACAO PARA CRIADOR
```

### Taxas

- FriendCoins: 5% de taxa
- Pix: Taxa do PSP + 5%
- Minimo para saque: R$ 20,00

## Sistema de Moderacao (Camadas 10-11)

### Regras Automaticas

```python
def moderar_conteudo(payload):
    # Regra 1: RiskScore alto
    if payload.risk_score >= 0.70:
        return "rejected", "high_risk"
    
    # Regra 2: RiskScore medio
    if 0.30 <= payload.risk_score < 0.70:
        return "needs_human_review", "medium_risk"
    
    # Regra 3: Confianca baixa da IA
    if payload.confidence < 0.55:
        return "needs_human_review", "low_confidence"
    
    # Regra 4: Criador novo com baixo impacto
    if is_new_creator(payload.creator_id) and payload.impact_score < 280:
        return "approved", "limited_visibility"
    
    # Regra 5: Conteudo repetitivo
    if is_repetitive_content(payload.talent_id):
        return "approved", "limited_visibility"
    
    return "approved", "public"
```

### Fila de Moderacao Humana

- Prioridade por RiskScore
- SLA: 4 horas para revisao
- Decisoes: approve, reject, limit, escalate

## Dashboard do Criador (Camada 8)

### API de Insights

```
GET /creator/{id}/insights

Response:
{
  "impact": {
    "average": 682.4,
    "best": 831.2,
    "worst": 431.1
  },
  "engagement": {
    "views": 20431,
    "waves": 541,
    "completion_rate": 0.37
  },
  "growth": {
    "last7": 1021,
    "last30": 4120
  },
  "financial": {
    "donations_total": 341.50,
    "net_received": 309.92,
    "withdrawals": 2
  },
  "quality": {
    "expression": 0.82,
    "coherence": 0.77,
    "presence": 0.69
  },
  "recommendations": [...]
}
```

### Recomendacoes da IA

Tipos de recomendacoes geradas:

1. **Tecnicas**: "Sua iluminacao media esta baixa. Sugiro gravar em um ambiente mais claro."
2. **Artisticas**: "Seu video tem excelente presenca facial. Mantenha o enquadramento frontal."
3. **Estrategicas**: "Seu publico mais ativo assiste as 20h. Publique nesse horario."
4. **Conteudo**: "Seus videos musicais geram mais waves do que seus videos de humor."

## Sistema de Discovery (Camada 9)

### Algoritmos de Matching

#### Similaridade Direta

```
similarity = cosine(vecA, vecB)
// Threshold: >= 0.82 = perfis similares
```

#### Matching por Afinidade de Estilo

```
affinity = softmax(dot(archetypeA, archetypeB))
// Threshold: >= 0.70 = recomendado
```

#### Descoberta Diversificada

```
diversity_penalty = e^(-lambda * similarity_with_last_seen)
// lambda = 0.15
```

## Interface do Usuario (Camada 14)

### Telas Principais

1. **Feed de Talentos**: VideoCard, Player inline, Botao de Waves
2. **Criar Talento**: CameraPreview, RecordButton, ProgressBar
3. **Edicao e Publicacao**: ThumbnailSelector, InputTitle, TagGenerator
4. **Detalhes do Talent**: PlayerFull, MetricsBar, DonateButton
5. **Perfil do Criador**: CreatorHeader, StatsOverview, BadgesCarousel
6. **Insights**: ChartLine, ChartBar, RecommendationBanner

### Gestos do Player

| Gesto | Acao |
|-------|------|
| Tap | Pausar/retomar |
| Double tap | Enviar wave rapida |
| Swipe vertical | Navegar |
| Long press | Opcoes avancadas |

## Seguranca (Camada 21)

### Autenticacao

- JWT RS256 com expiracao de 24h
- Refresh Token com validade de 30 dias
- Device Binding para prevenir roubo de sessao

### Anti-Bot

```
bot_score = sigmoid(
    w1 * touch_variation +
    w2 * session_spike +
    w3 * interaction_uniformity
)

// Threshold: >= 0.75 = bloqueio
```

### Protecao a Menores

- Conteudos com risk_score >= 0.30 bloqueados para menores de 18
- Adultos nao verificados ficam invisiveis para menores
- Feed reduzido entre 00h e 06h para menores

### Rate Limits

| Recurso | Limite |
|---------|--------|
| Waves | 10/min |
| Requests | 200/min |
| Uploads simultaneos | 3 |
| Talentos/dia (contas novas) | 3 |

## Performance (Camada 20)

### SLOs

| Metrica | Target |
|---------|--------|
| Latencia p95 GET | < 300ms |
| Latencia p95 POST | < 500ms |
| Taxa de falha | < 0.1% |
| Disponibilidade | 99.95% |

### Estrategias de Cache

| Tipo | TTL | Uso |
|------|-----|-----|
| Feed | 5 min | Redis |
| Thumbnails | 1h | CDN |
| Transcricao | Infinito | S3 |
| Similaridade | 15 min | Redis |

### Sharding

- `talent_items`: Shard por `creator_id % N`
- `talent_engagements`: Shard por `talent_id % N`
- ElasticSearch: 5 shards + 2x replica

## Estrutura de Dados

### Tabela: talent_items

```sql
CREATE TABLE talent_items (
    id UUID PRIMARY KEY,
    creator_id UUID REFERENCES users(id),
    title VARCHAR(200),
    type VARCHAR(20),
    intent TEXT,
    language VARCHAR(10),
    media_refs JSONB,
    transcription TEXT,
    feature_vector FLOAT[128],
    impact_score FLOAT,
    risk_score FLOAT,
    archetype_scores JSONB,
    confidence FLOAT,
    status VARCHAR(20),
    visibility VARCHAR(20),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabela: talent_engagements

```sql
CREATE TABLE talent_engagements (
    id UUID PRIMARY KEY,
    talent_id UUID REFERENCES talent_items(id),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20),
    wave_type VARCHAR(20),
    amount NUMERIC(12,2),
    seconds_watched NUMERIC(6,2),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

## Integracao com Ecossistema

### Entradas (Recebe dados de)

- **IA Aurah Kosmos**: Vetores, scores, classificacoes
- **Sistema de Cadastro**: Perfil do usuario, verificacoes
- **Teste de Personalidade**: Vetor energetico base
- **Sistema de Conexoes**: Rede de relacionamentos
- **Sistema Economico**: FriendCoins, transacoes

### Saidas (Alimenta)

- **Feed Sensorial**: Conteudos categorizados
- **Sistema de Eventos**: Convites para palcos
- **Mapa de Frequencia**: Atividade e engajamento
- **Sistema de Selos**: Badges de autenticidade
- **Analytics**: Metricas de uso

## Observabilidade

### Metricas Principais

- `inference_latency_p95`
- `publish_success_rate`
- `rejection_rate`
- `manual_review_rate`
- `feed_latency_p95`
- `engagement_rate`
- `donation_success_rate`
- `bot_detection_rate`

### Logs Estruturados

```json
{
  "talent_id": "uuid",
  "creator_id": "uuid",
  "decision": "approved",
  "risk_score": 0.12,
  "impact_score": 742.321,
  "confidence": 0.88,
  "visibility": "public",
  "latency_ms": 73,
  "service": "publication-orchestrator"
}
```

### Alertas

- Aumento de rejeicoes > 35%
- Queda no publish rate
- Taxa de fraude > 2%
- Latencia p95 > SLO
- Fila de moderacao > 1000 itens

## Consideracoes de Implementacao

### Stack Tecnologico

- **Backend**: Node.js (APIs), Python (IA/ML), Go (WebSocket)
- **Databases**: PostgreSQL, ElasticSearch, Redis, S3
- **Messaging**: Kafka + Schema Registry
- **Frontend**: React Native (iOS/Android)
- **Observability**: Prometheus, Grafana, ELK Stack, OpenTelemetry

### Dependencias Criticas

1. MST nao funciona sem IA Aurah Kosmos
2. Feed nao funciona sem moderacao
3. Doacoes nao funcionam sem seguranca
4. Discovery nao funciona sem vetores
5. Moderacao nao funciona sem logs

### Failover

| Componente | Fallback |
|------------|----------|
| Aurah-Core | lite-model com scores simplificados |
| ElasticSearch | Feed ordenado por trending |
| CDN | Storage direto |
| WebSocket | Push notifications |
| JWT-service | Token lifetime extended |

## Roadmap de Implementacao

### Fase 1 - Core (Meses 1-2)
- Camadas 1-7: Gateway, Ingestion, Inference, Publication, Feed, Engagement, Donations

### Fase 2 - Experiencia (Meses 3-4)
- Camadas 8-14: Creator Insights, Discovery, Moderation, Quality, Data, UI/UX

### Fase 3 - Infraestrutura (Meses 5-6)
- Camadas 15-22: Notifications, Community, Events, Logging, Analytics, Performance, Security, QA

### Fase 4 - Avancado (Meses 7-8)
- Camadas 23-25: Versioning, Explainability, Behavioral Engine
