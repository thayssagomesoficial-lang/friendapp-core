# Arquitetura de Módulos Integrados - FriendApp

**Versão:** 1.0  
**Data:** 17/10/2025  
**Status:** Integração dos Novos Módulos Técnicos

---

## 📋 Índice de Módulos Documentados

### Módulos Existentes (Já Implementados)
1. [Sistema de Cadastro Consciente](./resumos/sistema-cadastro.md)
2. [Teste de Personalidade Energética](./resumos/teste-personalidade-energetica.md)
3. [IA Aurah Kosmos (76 Camadas)](./resumos/ia-aurah-kosmos.md)
4. [Feed Sensorial](./resumos/feed-sensorial.md)
5. [Mapa de Frequência](./resumos/mapa-frequencia.md)
6. [Sistema de Conexões Autênticas](./resumos/sistema-conexoes-autenticas.md)
7. [Jogo da Transmutação](./resumos/jogo-transmutacao.md)

### Novos Módulos (Recém Adicionados)
8. **[Sistema de Chat e Mensagens Vibracionais](./resumos/sistema-chat-vibracional.md)** ⭐
9. **[Sistema de Eventos, Encontros e Experiências Sociais](./resumos/sistema-eventos-experiencias.md)** ⭐
10. **[Sistema de Locais Parceiros e Experiências Comerciais](./resumos/sistema-locais-parceiros.md)** ⭐
11. **[Sistema de Conexões Reais (Modo Viagem + Bora)](./resumos/sistema-conexoes-reais.md)** ⭐

---

## 🏗️ Arquitetura Global do Ecossistema

### Visão Macro

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRIENDAPP ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │   Frontend       │      │    Backend       │                │
│  │   (Flutter)      │◄────►│    Services      │                │
│  └──────────────────┘      └──────────────────┘                │
│                                     │                            │
│  ┌──────────────────────────────────┴─────────────────────┐    │
│  │            Core Services Layer                          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  • Cadastro Consciente   • Teste Personalidade         │    │
│  │  • IA Aurah Kosmos       • Feed Sensorial              │    │
│  │  • Mapa de Frequência    • Jogo Transmutação           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Social & Connection Layer (NOVO)                │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  • Chat Vibracional      • Eventos e Experiências       │    │
│  │  • Locais Parceiros      • Conexões Reais (Viagem+Bora) │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Data & Intelligence Layer                   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  PostgreSQL  │  Firestore  │  Neo4j  │  Redis  │  ES   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Matriz de Integrações Entre Módulos

### Legenda
- 🔴 **Crítica** - Integração essencial para funcionamento
- 🟡 **Importante** - Melhora significativa de experiência
- 🟢 **Complementar** - Adiciona valor, não obrigatório

| De \ Para | Chat | Eventos | Locais | Viagem/Bora | Feed | Mapa | Aurah IA |
|-----------|------|---------|--------|-------------|------|------|----------|
| **Chat** | - | 🟡 | 🟢 | 🔴 | 🟡 | 🟢 | 🔴 |
| **Eventos** | 🟡 | - | 🔴 | 🟡 | 🔴 | 🔴 | 🔴 |
| **Locais** | 🟢 | 🔴 | - | 🟡 | 🟡 | 🔴 | 🔴 |
| **Viagem/Bora** | 🔴 | 🟡 | 🟡 | - | 🟡 | 🔴 | 🔴 |
| **Feed** | 🟡 | 🔴 | 🟡 | 🟡 | - | 🟡 | 🔴 |
| **Mapa** | 🟢 | 🔴 | 🔴 | 🔴 | 🟡 | - | 🔴 |
| **Aurah IA** | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | - |

---

## 🎯 Pontos de Integração Detalhados

### 1. Chat Vibracional ↔ Outros Módulos

#### Chat → Eventos
- **Trigger**: Check-ins simultâneos em evento ativam sugestão de chat
- **Fluxo**: `evento.check_in()` → `chat.suggest_group_chat()`
- **Dados**: `evento_id`, `participantes[]`, `tag_evento`

#### Chat → Modo Bora
- **Trigger**: Aceitar "Bora" cria chat de grupo instantâneo
- **Fluxo**: `bora.aceitar()` → `chat.create_group(bora_id)`
- **Dados**: `bora_id`, `participantes[]`, `intenção`

#### Chat → Aurah IA
- **Trigger**: Metadados de chat alimentam IA para melhorar matching
- **Fluxo**: `chat.send_message()` → `analytics.process_metadata()` → `aurah.learn()`
- **Dados**: Reciprocidade, intensidade, emojis, pausas (NUNCA conteúdo)

---

### 2. Eventos ↔ Outros Módulos

#### Eventos → Locais Parceiros
- **Trigger**: Evento pode ser criado em Local Parceiro
- **Fluxo**: `evento.criar()` → valida `local_id` → `local.add_event()`
- **Dados**: `local_id`, `evento_tipo`, `frequencia_desejada`

#### Eventos → Mapa de Frequência
- **Trigger**: Eventos aparecem como pontos quentes no mapa
- **Fluxo**: `evento.publicar()` → `mapa.add_hotspot(geolocation)`
- **Dados**: `geolocation`, `intensidade` (baseada em confirmações)

#### Eventos → Feed Sensorial
- **Trigger**: Postagens sobre eventos aparecem no feed
- **Fluxo**: `evento.finalizar()` → usuários podem criar `post.create(evento_id)`
- **Dados**: `evento_id`, `experiencia`, `fotos`, `frequencia_sentida`

---

### 3. Locais Parceiros ↔ Outros Módulos

#### Locais → Score Vibracional
- **Trigger**: Check-ins e feedbacks atualizam score do local
- **Fluxo**: `local.checkin()` → `analytics.process()` → `local.update_score()`
- **Dados**: `frequencia_percebida`, `comentario`, `tags[]`

#### Locais → Mapa de Frequência
- **Trigger**: Locais aparecem no mapa com cor baseada em estado vibracional
- **Fluxo**: `local.update_score()` → `mapa.update_marker(local_id, estado)`
- **Dados**: `geolocation`, `score`, `estado` (Colapso/Transição/Expansão/Pico)

#### Locais → Eventos
- **Trigger**: Locais podem criar eventos exclusivos
- **Fluxo**: `local_parceiro.criar_evento()` → badge especial no evento
- **Dados**: `local_id`, `tier`, `beneficios_exclusivos`

---

### 4. Modo Viagem/Bora ↔ Outros Módulos

#### Viagem → Aurah IA (Colisões Preditivas)
- **Trigger**: Projeção de viagem é processada pela IA
- **Fluxo**: `viagem.ativar()` → `aurah.project_energy()` → `colisoes.detectar()`
- **Dados**: `user_vector`, `destino_geohash`, `periodo`, `intencao`

#### Bora → Chat
- **Trigger**: Grupo Bora tem chat dedicado
- **Fluxo**: `bora.criar()` → `chat.create_group()` automaticamente
- **Dados**: `bora_id`, `participantes[]`, `tag: "social/espontanea"`

#### Bora → Locais Parceiros
- **Trigger**: Bora pode escolher local parceiro para encontro
- **Fluxo**: `bora.definir_local()` → `local.notify_upcoming_bora()`
- **Dados**: `local_id`, `quantidade_participantes`, `data_hora`

---

## 📊 Fluxo de Dados Entre Módulos

### Exemplo: Jornada Completa do Usuário

```
1. CADASTRO
   └─> Teste Personalidade → gera user_vector

2. EXPLORAÇÃO
   └─> Feed Sensorial → descobre posts/eventos
   └─> Mapa Frequência → visualiza locais e eventos próximos

3. DESCOBERTA
   └─> Aurah IA → sugere conexões compatíveis
   └─> Eventos → recomendação personalizada "✨ Para Você"

4. PLANEJAMENTO
   └─> Modo Viagem → ativa projeção energética
   └─> Aurah IA → detecta colisões preditivas
   └─> Notificação → "5 pessoas da sua vibração estarão em Lisboa"

5. CONEXÃO DIGITAL
   └─> Chat → inicia conversa com match
   └─> Metadados → alimentam IA (reciprocidade, intensidade)
   └─> Estado Vibracional → Pico 🔥 / Transição 💫 / Colapso ❄️

6. ORGANIZAÇÃO
   └─> Modo Bora → cria grupo para encontro
   └─> Local Parceiro → escolhe café recomendado
   └─> Chat Grupo → coordena detalhes

7. ENCONTRO REAL
   └─> Check-in → valida presença física (GPS)
   └─> Evento → se for evento formal
   └─> XP → ganha pontos por conexão real

8. FEEDBACK LOOP
   └─> Feedback → avalia local e experiência
   └─> Score Local → atualiza estado vibracional
   └─> Post → compartilha memória no Feed
   └─> Aurah IA → aprende e melhora recomendações futuras
```

---

## 🗄️ Estratégia de Banco de Dados

### Multi-Database Architecture

```
PostgreSQL (Master Data)
├── users (cadastro, perfis)
├── locations (locais parceiros)
├── events (eventos)
├── bora_groups (grupos Bora)
├── subscriptions (assinaturas B2B)
├── audit_logs (auditoria completa)
└── score_snapshots (histórico de scores)

Firestore (Real-Time)
├── messages (chat em tempo real)
├── chat_states (estados vibracionais)
├── checkins (check-ins ativos)
├── live_events (eventos ao vivo)
└── notifications (notificações pendentes)

Neo4j (Grafos de Relações)
├── users → users (conexões)
├── users → locations (frequentou)
├── users → events (participou)
├── locations → events (hospedou)
└── travel_projections → residents (colisões)

Redis (Cache & Performance)
├── user_vectors (vetores vibracionais)
├── location_scores (scores recentes < 15min)
├── nearby_locations (geo-queries)
├── rate_limits (controle de spam)
└── session_tokens (autenticação)

ElasticSearch (Busca & Índice Preditivo)
├── travel_intentions (projeções de viagem)
├── event_search (busca de eventos)
├── location_search (busca de locais)
└── collision_queue (colisões preditivas)
```

---

## 🔐 Segurança Unificada

### Padrões Aplicados em Todos os Módulos

| Camada | Implementação |
|--------|---------------|
| **Autenticação** | JWT (≤ 15min) + Refresh Token |
| **Autorização** | RBAC (roles: user, partner, admin, system/ia) |
| **Transporte** | TLS 1.3 obrigatório |
| **Criptografia** | AES-256 (mensagens), HMAC (webhooks) |
| **Privacidade** | E2EE no chat, pseudonimização em feedbacks |
| **Geolocalização** | Geohash com precisão variável, opt-out |
| **Rate Limiting** | Redis Leaky-Bucket por IP+user |
| **LGPD/GDPR** | Consentimentos, export/delete, auditoria |

---

## 📈 Observabilidade Unificada

### Stack de Monitoramento

```
Métricas (Prometheus + Grafana)
├── Latência p50/p95/p99 por endpoint
├── Taxa de erro (2xx, 4xx, 5xx)
├── Throughput (req/s)
└── Saturação (CPU, memória, I/O)

Tracing (Jaeger / Tempo)
├── W3C Traceparent
├── Correlation ID end-to-end
└── Spans por serviço

Logs (ELK / Loki)
├── Logs estruturados JSON
├── event_type, actor, entity, correlation_id
└── Retention: 90 dias

Alertas (PagerDuty / Opsgenie)
├── p95 > 1s (10 min)
├── Erro 5xx > 2% (5 min)
├── Webhook failures consecutivos
└── Colisões preditivas não processadas
```

---

## 🚀 Roadmap de Integração Global

### Fase 1: Fundação (Meses 1-3) ✅ Parcialmente Concluído
- [x] Sistema de Cadastro Consciente
- [x] Teste de Personalidade Energética
- [x] IA Aurah Kosmos (core)
- [x] Feed Sensorial MVP
- [ ] Mapa de Frequência MVP
- [ ] Banco de dados multi-layer (PostgreSQL + Firestore)

### Fase 2: Social Layer (Meses 4-6) 🔄 Em Planejamento
- [ ] **Chat Vibracional MVP**
  - [ ] Mensagens E2EE
  - [ ] Estados vibracionais (Pico/Transição/Colapso)
  - [ ] Metadados para IA
- [ ] **Eventos MVP**
  - [ ] CRUD de eventos
  - [ ] Categorização vibracional
  - [ ] Check-in com QR Code
- [ ] **Integração Chat ↔ Eventos**

### Fase 3: B2B & Monetização (Meses 7-9)
- [ ] **Locais Parceiros MVP**
  - [ ] Sistema de tiers (4 planos)
  - [ ] Score vibracional com antifraude
  - [ ] Painel B2B
- [ ] **Integração Locais ↔ Eventos**
- [ ] **Integração Locais ↔ Mapa**
- [ ] **Pagamentos (Stripe/Asaas)**

### Fase 4: Conexões Reais (Meses 10-12)
- [ ] **Modo Viagem**
  - [ ] Projeção energética
  - [ ] Colisões preditivas
  - [ ] Notificações inteligentes
- [ ] **Modo Bora**
  - [ ] Grupos espontâneos
  - [ ] Moderação Aurah Guardian
  - [ ] Check-in presencial
- [ ] **Integração Bora ↔ Chat**
- [ ] **Integração Viagem ↔ Locais/Eventos**

### Fase 5: Otimização & Escala (Meses 13-15)
- [ ] A/B testing de algoritmos
- [ ] Machine Learning avançado
- [ ] Analytics premium
- [ ] Expansão internacional

---

## 🛠️ Stack Tecnológico Consolidado

### Frontend
- **Flutter** (iOS, Android, Web)
- **Provider/Riverpod** (state management)
- **Socket.IO Client** (real-time)

### Backend
- **Node.js (Fastify)** - APIs REST principais
- **Python (FastAPI)** - IA, ML, processamento de dados
- **Go** - Microserviços de alta performance (geolocalização)

### Banco de Dados
- **PostgreSQL** - Master data
- **Firestore** - Real-time
- **Neo4j** - Grafos
- **Redis** - Cache & geospatial
- **ElasticSearch** - Busca & índice preditivo

### Processamento
- **Kafka / Google Pub/Sub** - Event streaming
- **Temporal / Airflow** - Job orchestration
- **Docker + Kubernetes** - Containerização

### Observabilidade
- **Prometheus + Grafana** - Métricas
- **Jaeger / Tempo** - Tracing
- **ELK / Loki** - Logs

### Infraestrutura
- **AWS / GCP** - Cloud provider
- **CloudFlare** - CDN + DDoS protection
- **GitHub Actions** - CI/CD

---

## 📝 Próximos Passos Imediatos

### Prioridade Alta (Próximas 2 Semanas)
1. **Validar estruturas de dados** de todos os novos módulos com equipe de backend
2. **Criar protótipos de UI** para Chat, Eventos, e Modo Bora
3. **Definir contratos de API** (OpenAPI spec) para integrações críticas
4. **Implementar Chat MVP** como primeiro módulo social

### Prioridade Média (Próximo Mês)
1. Implementar Eventos MVP
2. Integrar Chat ↔ Eventos
3. Criar pipeline de colisões preditivas (Modo Viagem)
4. Setup de observabilidade unificada

### Prioridade Baixa (Próximos 3 Meses)
1. Locais Parceiros completo
2. Modo Bora com moderação
3. Analytics premium
4. Expansão de features avançadas

---

## 📚 Referências

### Documentação Técnica
- [Sumário Executivo](./sumario-executivo.md)
- [Sistema de Chat Vibracional](./resumos/sistema-chat-vibracional.md)
- [Sistema de Eventos](./resumos/sistema-eventos-experiencias.md)
- [Sistema de Locais Parceiros](./resumos/sistema-locais-parceiros.md)
- [Sistema de Conexões Reais](./resumos/sistema-conexoes-reais.md)
- [IA Aurah Kosmos](./resumos/ia-aurah-kosmos.md)

### Manuais Originais
- Todos os PDFs em `/manuais/manuais/`

---

**Documento Vivo** - Este arquivo será atualizado conforme novos módulos forem implementados e integrações forem realizadas.

**Última Atualização:** 17/10/2025  
**Responsável:** Devin AI (Análise e Integração de Módulos)
