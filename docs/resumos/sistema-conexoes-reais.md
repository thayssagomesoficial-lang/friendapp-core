# Sistema de Conexões Reais (Modo Viagem + Bora) - Resumo Técnico

**Módulo:** Sistema de Conexões Reais  
**Versão:** Definitivo  
**Data de Análise:** 17/10/2025  
**Fonte:** Manual Técnico Definitivo — Sistema de Conexões Reais

---

## 🎯 Visão Geral

O Sistema de Conexões Reais é composto por dois subsistemas integrados que transformam intenções digitais em encontros físicos autênticos e seguros:

1. **Modo Viagem**: Projeção energética preditiva que antecipa conexões antes da chegada física ao destino
2. **Modo Bora**: Encontros espontâneos e planejados com grupos alinhados vibraticamente

### Propósito Estratégico

- **Antecipação de conexões**: Detectar colisões vibracionais antes da chegada física
- **Encontros espontâneos seguros**: Criar contextos para "Bora" com governança e moderação
- **Integração física-digital**: Transformar matching digital em experiências reais
- **Segurança em primeiro lugar**: Moderação preventiva e proteções em tempo real

---

## 🌍 Modo Viagem: Projeção Energética

### Conceito Central

Quando um usuário anuncia uma viagem, não apenas registra dados passivos: ele **projeta sua energia para o destino**, criando um campo vibracional ativo capaz de gerar recomendações inteligentes e colisões preditivas antes da chegada física.

### Fluxo de Projeção Energética

```
1. Ativação do Modo Viagem
   ↓
2. Normalização Geográfica (Geohash)
   ↓
3. Projeção Energética (IA Aurah Kosmos)
   ↓
4. Armazenamento em Índice Preditivo (ElasticSearch + Redis)
   ↓
5. Gatilhos de Colisão Preditiva (Jobs assíncronos)
   ↓
6. Notificações Inteligentes
```

---

## 📊 Estrutura de Dados - Modo Viagem

### Tabela: travel_intentions

```sql
CREATE TABLE travel_intentions (
  travel_id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  destino VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  intencao JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Vetor de Projeção Vibracional

```json
{
  "user_id": "abc-123",
  "destino_geohash": "6gkzwgjz",
  "periodo": ["2025-08-20", "2025-08-27"],
  "vetor_viagem": [0.71, 0.12, -0.33, ...],
  "intencao": ["cura", "expansao"],
  "algorithm_version": "v1.0"
}
```

---

## 🧠 Integração com IA Aurah Kosmos

### Pipeline de Processamento

#### 1. Entrada de Dados Brutos
- Vetor de frequência do usuário (`user_vector`)
- Metadados da viagem (destino, período, intenção)
- Enviado para `aurah.travel_adapter`

#### 2. Normalização pelo Núcleo Aurah
- **Redução dimensional**: PCA/autoencoders para vetores de alta densidade
- **Escalonamento temporal**: Peso extra para viagens mais próximas
- **Ajuste de intenção**: Intenções convertidas em embeddings e somadas ao vetor

#### 3. Evolução Dinâmica
Cada projeção **não é fixa**, evolui conforme:
- Alterações no estado vibracional do usuário no dia a dia
- Novas interações no FriendApp
- Jobs em lote recalculam a cada 24h ou em mudanças significativas

#### 4. Afinidade Preditiva

**Fórmula:**
```
Score = (cos(user_vector, outro_vector) * 0.6) + 
        (compatibilidade_intencao(user, outro) * 0.4)
```

**Thresholds:**
- **≥ 0.85** → Alta colisão prevista (notificação imediata)
- **0.70 – 0.84** → Potencial colisão (fila de recomendações)
- **< 0.70** → Afinidade baixa (descartada)

---

## ⚡ Colisões Preditivas e Alertas

### Definição de Colisão Energética

Ocorre quando dois vetores energéticos (viajante + residente/destino) atingem afinidade relevante.

**Fórmula Completa:**
```
Colisao = (cos(user_vector, outro_vector) * 0.5) +
          (compatibilidade_intencao * 0.3) +
          (sobreposicao_temporal * 0.2)
```

### Thresholds de Ação

| Score | Classificação | Ação |
|-------|---------------|------|
| **≥ 0.85** | Colisão Forte | Notificação imediata |
| **0.70 – 0.84** | Colisão Moderada | Fila de recomendação contextual |
| **< 0.70** | Afinidade Baixa | Descartada |

### Engine de Notificações Inteligentes

**Regras Anti-Spam:**
- Máx. 3 notificações de colisão por semana por usuário
- Priorização por score mais alto
- Contexto obrigatório em cada notificação

**Fluxo:**
```
Colisão identificada
    ↓
Armazenada em collision-queue (Redis)
    ↓
Avaliada por engine de relevância (score + contexto)
    ↓
Convertida em:
    → Notificação push (alta afinidade)
    → Sugestão no feed (afinidade média)
    → Insight privado (match não mútuo)
```

### Tipos de Alertas

| Tipo | Momento | Exemplo |
|------|---------|---------|
| **Preditivos** | Pré-viagem | "5 pessoas da sua vibração também estarão em Madrid" |
| **Tempo Real** | Durante viagem/Bora | "3 conexões autênticas entraram no mesmo grupo Bora" |
| **Contextuais** | Locais Parceiros | "Evento de cura coincide com sua projeção vibracional" |

---

## 🎉 Modo Bora: Encontros Espontâneos

### Conceito

Sistema de **encontros em grupo** onde usuários com afinidade vibracional se organizam para experiências reais, desde um café até uma viagem coletiva.

### Estrutura de Grupo Bora

#### Papéis e Permissões

| Papel | Permissões | Limites |
|-------|-----------|---------|
| **Criador (Owner)** | Criar, editar, convidar, moderar, banir | Não pode remover denúncias contra si |
| **Moderadores (Max 3)** | Silenciar, banir membros | Não podem excluir criador ou alterar local/agenda |
| **Membros** | Participar do chat, confirmar presença, denunciar | - |

---

## 🛡️ Moderação Preventiva e Segurança

### Ferramentas de Moderação

#### 1. Silenciar Temporário
```http
POST /api/bora/group/:id/mute/:userId

Request:
{
  "duration": "10m|1h|24h",
  "reason": "spam"
}
```

#### 2. Banimento
```http
POST /api/bora/group/:id/ban/:userId

Request:
{
  "reason": "comportamento inapropriado",
  "permanent": true
}
```

#### 3. Sistema de Denúncias
```http
POST /api/bora/reports

Request:
{
  "reporter_id": "abc123",
  "target_id": "xyz789",
  "group_id": "bora-uuid",
  "reason": "harassment",
  "evidence": "screenshot_url"
}
```

**Fluxo de Denúncia:**
```
1. Denúncia registrada (Firestore + log criptografado)
    ↓
2. Triagem automática (IA Aurah Guardian)
    ↓
3. Classificação de gravidade
    ↓
4. Escalonamento para suporte humano (se grave)
```

### IA Aurah Guardian (Moderação)

**Sinais Analisados:**
- Linguagem agressiva/ofensiva (NLP)
- Padrões de spam
- Histórico de denúncias do usuário
- Mudanças bruscas de comportamento

**Ações Automáticas:**
- Silenciamento temporário (casos leves)
- Quarentena de mensagens (revisão humana)
- Banimento automático (casos graves + reincidência)
- Bloqueio de criação de grupos (penalidade severa)

---

## 📦 Endpoints de API

### Modo Viagem

#### Ativar Projeção de Viagem
```http
POST /api/travel/activate

Request:
{
  "user_id": "abc123",
  "destino": "Lisboa, Portugal",
  "data_inicio": "2025-08-20",
  "data_fim": "2025-08-27",
  "intencao": ["cura", "expansao"]
}

Response:
{
  "travel_id": "uuid",
  "status": "projetado",
  "vetor_viagem": [...],
  "colisoes_previstas": 5
}
```

#### Consultar Colisões Preditivas
```http
GET /api/travel/:travel_id/colisoes

Response:
{
  "colisoes": [
    {
      "outro_user_id": "xyz789",
      "score_afinidade": 0.87,
      "tipo": "viajante",
      "overlap_temporal": 0.95,
      "contexto": "Ambos com intenção de cura"
    }
  ]
}
```

### Modo Bora

#### Criar Grupo Bora
```http
POST /api/bora/create

Request:
{
  "creator_id": "abc123",
  "nome": "Café Consciente no Ibirapuera",
  "descricao": "Encontro leve para trocar ideias",
  "local": {
    "nome": "Café Vibracional",
    "geolocation": { "lat": -23.587, "lng": -46.657 }
  },
  "data_hora": "2025-10-25T15:00:00Z",
  "capacidade_max": 8,
  "intencao": ["social", "reflexiva"]
}

Response:
{
  "bora_id": "uuid",
  "status": "ativo",
  "invite_link": "friendapp://bora/uuid"
}
```

#### Participar de Grupo
```http
POST /api/bora/:bora_id/join

Request:
{
  "user_id": "xyz789"
}

Response:
{
  "status": "confirmado",
  "participantes_atuais": 4,
  "chat_id": "chat-uuid"
}
```

#### Listar Grupos Bora Recomendados
```http
GET /api/bora/recomendados?user_id=abc123

Response:
{
  "para_voce": [
    {
      "bora_id": "uuid",
      "nome": "Trilha Energética - Pico do Jaraguá",
      "score_compatibilidade": 0.92,
      "participantes": 6,
      "data_hora": "2025-10-26T08:00:00Z"
    }
  ]
}
```

---

## 🔄 Integrações com Outros Módulos

### IA Aurah Kosmos
- Cálculo de vetores vibracionais de viagem
- Detecção de colisões preditivas
- Recomendações de grupos Bora
- Moderação Aurah Guardian

### Sistema de Chat
- Chat de grupo integrado em cada Bora
- Estados vibracionais durante conversas
- Tags automáticas baseadas em intenção do grupo

### Mapa de Frequência
- Grupos Bora aparecem como eventos temporários
- Viajantes projetados aparecem com ícone especial
- Visualização de "clusters de energia" por região

### Eventos
- Bora pode ser vinculado a eventos formais
- Conversão de eventos em grupos Bora espontâneos
- Check-in conjunto em eventos

### Locais Parceiros
- Grupos Bora podem escolher locais parceiros
- Benefícios exclusivos para grupos
- Analytics para locais (quantos grupos os escolheram)

### Feed Sensorial
- Posts de experiências pós-Bora
- Compartilhamento de memórias vibracionais
- Recomendações baseadas em participações anteriores

---

## 🔐 Segurança e Proteções

### Proteções Implementadas

| Camada | Medida |
|--------|--------|
| **Verificação de Identidade** | DUC obrigatória para criar grupos |
| **Geofencing** | Validação de presença real no local (GPS) |
| **Rate Limiting** | Máx. 5 grupos criados por semana (anti-spam) |
| **Moderação Automática** | IA Aurah Guardian em tempo real |
| **Denúncias** | Sistema de reports com triagem automática + humana |
| **Histórico** | Logs auditáveis de todas as ações de moderação |
| **Blacklist** | Usuários com comportamento problemático |

### Indicadores de Confiança

**Vibrational Trust Score (VTS)** aplicado:
- Novos usuários têm limite de participação (3 grupos/semana)
- Usuários com alto VTS podem criar grupos maiores
- Reincidentes em denúncias são banidos globalmente

---

## 📊 Estrutura de Dados - Modo Bora

### Tabela: bora_groups

```sql
CREATE TABLE bora_groups (
  bora_id UUID PRIMARY KEY,
  creator_id UUID NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  local JSONB,
  data_hora TIMESTAMP NOT NULL,
  capacidade_max INT DEFAULT 10,
  intencao JSONB,
  status VARCHAR(20), -- ativo, cancelado, finalizado
  chat_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: bora_participants

```sql
CREATE TABLE bora_participants (
  participation_id UUID PRIMARY KEY,
  bora_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status VARCHAR(20), -- confirmado, talvez, saiu
  role VARCHAR(20), -- owner, moderator, member
  joined_at TIMESTAMP DEFAULT NOW(),
  checkin_realizado BOOLEAN DEFAULT FALSE
);
```

### Tabela: bora_moderation_logs

```sql
CREATE TABLE bora_moderation_logs (
  log_id UUID PRIMARY KEY,
  bora_id UUID NOT NULL,
  moderator_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action VARCHAR(50), -- mute, ban, warn
  reason TEXT,
  duration VARCHAR(20), -- 10m, 1h, 24h, permanent
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎮 Gamificação e Incentivos

### XP e Recompensas

**Por participar de Bora:**
- Check-in presencial: +50 XP
- Primeiro Bora: Badge "Primeiro Passo Real"
- 10 Boras participados: Badge "Conector Ativo"
- Criar Bora com 100% de presença: +100 XP bônus

**Por criar Bora:**
- Grupo completo (capacidade máxima): +75 XP
- Avaliação positiva dos participantes: +50 XP
- Criar Bora em cidade onde está viajando: +100 XP

---

## 📈 Métricas de Sucesso

### KPIs do Sistema

**Modo Viagem:**
- Quantidade de projeções ativas
- Taxa de colisões preditivas convertidas em conexões reais
- Satisfação pós-viagem (avaliação das conexões)

**Modo Bora:**
- Taxa de conversão: grupos criados → grupos realizados
- Taxa de presença: confirmados → check-ins reais
- Avaliação média pós-Bora
- Reincidência (usuários que participam de múltiplos Boras)

### Metas Iniciais
- 80% de taxa de presença em grupos Bora
- 60% de colisões preditivas resultam em alguma interação
- < 2% de taxa de denúncias
- 8.5+ de avaliação média pós-Bora

---

## 🚀 Roadmap de Implementação

### Fase 1: MVP Modo Viagem (Meses 1-2)
- [ ] CRUD de projeções de viagem
- [ ] Integração com Aurah Kosmos para vetores
- [ ] Geohash e indexação geográfica
- [ ] Colisões preditivas básicas

### Fase 2: MVP Modo Bora (Meses 2-3)
- [ ] CRUD de grupos Bora
- [ ] Sistema de participação
- [ ] Chat de grupo integrado
- [ ] Geofencing para check-in

### Fase 3: Inteligência e Moderação (Meses 4-5)
- [ ] Notificações inteligentes anti-spam
- [ ] Aurah Guardian (moderação automática)
- [ ] Sistema de denúncias completo
- [ ] VTS (Vibrational Trust Score)

### Fase 4: Integrações Avançadas (Meses 6-7)
- [ ] Integração com Locais Parceiros
- [ ] Bora vinculado a Eventos formais
- [ ] Analytics premium para criadores
- [ ] Gamificação completa

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js (Fastify)** - API REST principal
- **Python (FastAPI)** - IA Aurah Kosmos + Aurah Guardian
- **ElasticSearch** - Índice preditivo de viagens
- **Redis** - Cache de colisões e rate limiting

### Banco de Dados
- **PostgreSQL** - Grupos, participações, moderação
- **Firestore** - Chat em tempo real
- **Neo4j** - Grafos de conexões (viajantes ↔ residentes)

### Geolocalização
- **Geohash** - Indexação espacial
- **PostGIS** - Queries geográficas
- **Google Maps API** - Visualização

### Processamento Assíncrono
- **Kafka / Pub/Sub** - Jobs de colisões preditivas
- **Temporal / Airflow** - Orchestration

### IA e ML
- **TensorFlow / PyTorch** - Vetores vibracionais
- **Scikit-learn** - Similaridade de cossenos, clustering
- **Hugging Face Transformers** - NLP para moderação

---

## 📝 Considerações de Implementação

### Prioridades
1. **Segurança em primeiro lugar** - Moderação não é opcional
2. **Notificações relevantes** - Anti-spam rigoroso
3. **Performance** - Colisões calculadas em < 1s
4. **Privacidade** - Dados de viagem temporários

### Desafios Técnicos
- Balanceamento entre privacidade e descoberta
- Escalabilidade de cálculos de similaridade (milhões de vetores)
- Moderação em tempo real sem latência
- Falsos positivos em colisões preditivas

### Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| **Spam de grupos Bora** | Rate limiting + VTS |
| **No-shows** | Sistema de reputação + penalidades leves |
| **Assédio em grupos** | Aurah Guardian + denúncias rápidas |
| **Vazamento de localização** | Geohash com precisão variável + opt-out |

---

## 📚 Dependências de Serviços

### Serviços Internos
- `perfil-e-frequencia-service` → fornece vetor energético do usuário
- `aurah-kosmos-core` → calcula afinidade e gera projeção vibracional
- `notifications-service` → envia alertas de colisões previstas
- `intencao-service` → transforma intenção declarada em embedding
- `partners-api` → cruzamento com locais/eventos parceiros
- `feed-service` → exibição como sugestão

### Serviços Externos
- Google Maps API (geocoding, visualização)
- Firebase Cloud Messaging (notificações push)
- SendGrid/AWS SES (emails)

---

## 📚 Referências

- Manual Técnico Definitivo — Sistema de Conexões Reais (completo)
- docs/resumos/ia-aurah-kosmos.md
- docs/resumos/sistema-chat-vibracional.md
- docs/resumos/sistema-eventos-experiencias.md
- docs/sumario-executivo.md

---

**Próximos Passos:**
1. Calibrar thresholds de colisões preditivas
2. Implementar pipeline de vetores vibracionais
3. Criar protótipos de interface Modo Viagem
4. Desenvolver sistema de moderação Aurah Guardian
5. Validar geofencing e check-in presencial
