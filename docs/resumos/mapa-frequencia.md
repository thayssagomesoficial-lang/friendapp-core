# Resumo Técnico: Mapa de Frequência (FriendApp)

## Visão Geral

O Mapa de Frequências é a interface coletiva de energia do FriendApp, transformando atividade individual, vibração de locais parceiros e eventos ativos em visualização única, imersiva e dinâmica em tempo real.

## Propósito

Permitir que cada pessoa visualize:
1. **Frequência individual**: Check-ins, intenções, oscilações
2. **Estado vibracional coletivo**: Energia de regiões (bairro, cidade, hotspots)
3. **Energia de locais e eventos parceiros**: Com camadas de contexto e relevância

## Diferenciais Técnicos

- **Não é mapa comum**: Mostra COMO as pessoas estão, não apenas ONDE
- **Escalabilidade Global**: Pré-agregações geográficas (geohashing)
- **Tempo Real Inteligente**: Pontos individuais em tempo real (Firestore) + zonas recalculadas em background
- **Privacidade por Design**: Geofuzzing dinâmico + zonas de silêncio configuráveis

## Arquitetura de Banco de Dados

### Bancos Utilizados

| Banco | Função | Justificativa |
|-------|--------|--------------|
| PostgreSQL + PostGIS | Dados geográficos relacionais (cidades, regiões, polígonos, locais parceiros) | Queries espaciais rápidas, suporte nativo a geohashing |
| Firestore (NoSQL) | Presença de usuários em tempo real (check-ins ativos, estados instantâneos) | Latência baixa, sincronização real-time |
| Redis (Cache) | Pré-agregação de células vibracionais (H3/S2) | Armazena cálculos recentes para consultas ultrarrápidas |
| ElasticSearch (opcional) | Logs de busca, filtros avançados, histórico energético | Queries textuais e analíticas em paralelo |

### Estratégia de Dados

#### 1. Usuário Individual
- Persistido no **Firestore**
- Dados: `id_user`, `timestamp`, `freq_atual`, `geohash`, `intencao`
- TTL de 60 minutos (expira após inatividade)

#### 2. Zonas Agregadas
- Pré-calculadas em background jobs a cada 5 minutos
- Estrutura H3 (hexágonos globais)
- Cada célula armazena: `media_vibracional`, `densidade_usuarios`, `estado`
- Armazenadas em **Redis** + **PostgreSQL** (persistência)

#### 3. Locais/Eventos
- Relacionados via IDs únicos no **PostgreSQL**
- Estados dinâmicos sincronizados com **Firestore** (check-ins ativos)

## Estruturas de Dados

### Tabela `users_presence` (Firestore)

```json
{
  "id_user": "uuid",
  "timestamp": 1737412345,
  "freq_atual": 780,
  "geohash": "6gkz7p",
  "intencao": "social_evento"
}
```

### Tabela `zones_state` (Redis + PostgreSQL)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| zone_id | H3 string | Identificador único da célula vibracional |
| freq_media | float | Média ponderada da célula |
| densidade | int | Número de usuários ativos |
| estado | enum | {Expansão, Pico, Transição, Colapso} |
| last_update | timestamp | Última atualização |

### Tabela `places_state` (PostgreSQL)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id_place | uuid | Identificador do local parceiro |
| nome | varchar | Nome do local |
| freq_atual | float | Estado vibracional atual |
| checkins_ativos | int | Quantidade de usuários no momento |
| tier | enum | {Essencial, Premium, Visionário} |

## Fluxo de Dados

### Topologia Lógica

```
[App móvel]
  → API Gateway (JWT, rate limit)
  → Privacy Filter (Zonas de Silêncio + Geofuzzing Dinâmico)
  → Firestore (user_presence_rt)
  → Event Bus (Kafka/PubSub): presence.v1, feedback.v1
  → Stream Processor (dedupe/idempotency + windowing)
  → Redis (zones_state_cache) ← Background Aggregator (cada 5 min)
  → PostgreSQL (zones_state, places_state, transitions_log)
  → Outbound Topics: zone_state.v1, alerts.v1
```

### Canais de Entrada

| Fonte | Tópico/Event | Payload | Observações |
|-------|-------------|---------|-------------|
| Presença do usuário | `presence.v1` | {user_id, ts, lat, lon, h3_res7, freq_raw, intent} | Produzido após Privacy Filter |
| Feedback emocional | `feedback.v1` | {user_id, place_id?, h3, emotion, intensity, ts} | Opcionalmente vinculado a place_id |
| Eventos/Locais | `place_event.v1` | {place_id, type, start/end, expected_density} | Bônus de estado (PICO/EXPANSÃO) |
| Antifraude | `presence.flag.v1` | {user_id, reason, ts, impact_ids} | Gera rollback (compensation) |

**Idempotência**: Chave de dedupe = `user_id + floor(ts/60s)` (1 update por minuto por usuário)

## Tempo Real (Individual)

### Firestore collection: `user_presence_rt`

```json
{
  "user_id": "uuid",
  "ts": 1737412345,
  "freq_current": 780,  // 0..1000 (normalizado)
  "h3_res7": "871fb4ac...",
  "intent": "social_evento",
  "expires_at": 1737415945  // TTL ~ 60min
}
```

- **Atualização**: WebSocket/SDK
- **Rate limit**: 1 update/60s por usuário
- **Expiração automática**: Presença inativa some do mapa

## Pré-Agregação por Geohash (H3)

### Background Aggregator (cron: a cada 5 min)

1. Carrega todas as presenças/feedbacks recentes por célula H3 (res. 7/8)
2. Aplica geofuzzing dinâmico
3. Calcula métricas por célula:
   - `densidade_usuarios`
   - `freq_media_robusta` (média aparada + time-decay)
   - `estado_coletivo` (PICO/EXPANSÃO/TRANSIÇÃO/COLAPSO)
4. Persiste em **Redis** + **PostgreSQL**
5. Publica em `zone_state.v1`

### Resolução H3 por Zoom

- **res=7**: Cidade/large bairros
- **res=8**: Bairros/áreas urbanas densas
- **res=9**: Micro-zonas (zoom aproximado)

## Fórmulas de Agregação

### Time-decay (peso temporal)

```
Δt_i = now - ts_i  // em minutos
weight_time_i = exp(-Δt_i / τ)
```

τ (tau) default = 20 min (mais recente pesa MUITO mais)

### Trimmed mean (média aparada)

1. Ordenar `freq_raw` dos pontos na célula
2. Remover 10% menores e 10% maiores (outliers)
3. Aplicar média ponderada pelos `weight_time_i` restantes

### VIB_SCORE (célula)

```
VIB_SCORE_zone = clamp(
  trimmed_mean_weighted(freq_raw)
  + density_boost(densidade_usuarios)
  + event_boost(atividade_evento)
  - toxicity_penalty(flags_negativos),
  0, 1000
)
```

- **density_boost**: Função logarítmica suave (evita explosões artificiais)
- **event_boost**: +[5..25] conforme `place_event.v1`
- **toxicity_penalty**: −[10..100] com base em denúncias/flags

### Mapeamento de Estado Coletivo

| Estado | Regra Base |
|--------|-----------|
| PICO | VIB_SCORE_zone ≥ 720 e densidade ≥ limiar_res ou evento ativo |
| EXPANSÃO | VIB_SCORE_zone ∈ [520..719] e tendência ↑ (últimas 2 janelas) |
| TRANSIÇÃO | VIB_SCORE_zone ∈ [320..519] ou tendência ~ estável |
| COLAPSO | VIB_SCORE_zone < 320 ou toxicity_penalty elevado |

## Rollback Antifraude

Quando um ponto é marcado como fraude (GPS spoofing):

1. Emite `presence.flag.v1` com `impact_ids` (células afetadas)
2. **Compensation Worker** recalcula as células imediatamente:
   - Remove contribuições do `user_id/ts` suspeito
   - Reaplica time-decay + trimmed mean
   - Atualiza Redis/PostgreSQL e `transitions_log`

**Garantia**: Eventual consistency em < 2 min para células impactadas

## Exposição para o Frontend

### GET /api/map/zones

```
GET /api/map/zones?bbox=<minLat,minLon,maxLat,maxLon>&res=7

Headers: Cache-Control: max-age=60, ETag

Response:
{
  "resolution": 7,
  "updated_at": "2025-08-25T18:12:00Z",
  "zones": [
    {
      "h3": "871fb4ac...",
      "vib_score": 674,
      "density": 42,
      "state": "EXPANSAO",
      "last_update": "2025-08-25T18:10:00Z"
    }
  ]
}
```

### GET /api/map/user/me

```json
{
  "user_id": "uuid",
  "freq_current": 792,
  "state_hint": "ALTA",
  "last_update": "2025-08-25T18:11:07Z"
}
```

### GET /api/map/places

```json
{
  "places": [
    {
      "place_id": "loc_432",
      "name": "Café Aurora",
      "vib_score": 708,
      "checkins_active": 15,
      "state": "PICO",
      "tier": "Premium",
      "last_update": "2025-08-25T18:10:00Z"
    }
  ]
}
```

## Privacidade por Design

### Zonas de Silêncio (user opt-out)
- App armazena polígonos privados (casa/trabalho)
- Se GPS cair dentro de um polígono, NÃO envia presença
- Aplicado no **Privacy Filter** antes de publicar `presence.v1`

### Geofuzzing Dinâmico
- **Maior distorção**: Áreas residenciais/baixa densidade (150–300m)
- **Menor distorção**: Áreas públicas/alta densidade (30–70m)
- Aleatoriedade coerente por sessão (evita clusterização reversa)

## Segurança e Limites

### Autenticação
- JWT (Firebase/Auth0)
- Escopos de acesso

### Webhooks
- HMAC SHA-256 (assinatura e replay-protection)

### Rate Limits
- **Presença**: 1 req/min por usuário
- **Feedback**: 10 req/h por usuário
- **Zones fetch**: 10 req/10s por IP (burst control)

### Idempotência
- `Idempotency-Key` por operação sensível
- Consumidores "at-least-once" com dedupe por chave

## Observabilidade & SLOs

### Métricas (Prometheus/Grafana)
- `zones_agg_latency_seconds` (p95 < 90s por janela de 5 min)
- `zones_cache_hit_ratio` (alvo > 0.85)
- `presence_ingest_rate`
- `fraud_compensation_latency_seconds`
- `api_zones_p95_latency_ms` (alvo < 180ms)

### Logs e Tracing
- OpenTelemetry com `trace_id` propagado (API → stream → jobs)

### SLOs
- **Staleness máximo das zonas**: 10 min (cache + última janela)
- **Disponibilidade API /zones**: 99.9%
- **Reprocessamento antifraude**: < 2 min (p95) nas células impactadas

## Integração com Ecossistema

O Mapa de Frequência alimenta:
- **IA Aurah Kosmos**: Dinâmica vibracional global
- **Feed Sensorial**: Curadoria contextual
- **Sistema de Conexões**: Proximidade energética
- **Jogo da Transmutação**: Missões baseadas em localização
- **Locais Parceiros**: Visualização de vibração

E recebe dados de:
- **Check-ins**: Presença ativa dos usuários
- **Feedbacks**: Emoções e intensidades
- **Eventos**: Ativações especiais
- **IA Aurah**: Ajustes e calibrações

## Considerações de Implementação

- **Event-driven architecture** para tempo real
- **Background jobs** para agregação pesada
- **H3 geohashing** para células hexagonais uniformes
- **Redis cache** para performance de leitura
- **PostgreSQL + PostGIS** para queries espaciais
- **Firestore** para sincronização real-time
- **Kafka/PubSub** para eventos assíncronos
- **Privacy Filter** como primeira camada
- **Antifraude com rollback** automático
- **Observabilidade completa** com OpenTelemetry
