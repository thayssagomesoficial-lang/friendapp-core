# Sistema de Chat e Mensagens Vibracionais - Resumo Técnico

**Módulo:** Sistema de Chat Vibracional  
**Versão:** Definitivo  
**Data de Análise:** 17/10/2025  
**Fonte:** Manual Técnico Definitivo — Sistema de Chat

---

## 🎯 Visão Geral

O Sistema de Chat do FriendApp não é apenas troca de mensagens, mas um **sistema vibracional** que registra, processa e reflete a energia dos usuários em tempo real através de metadados, mantendo privacidade total do conteúdo.

### Propósitos Estratégicos

- **Primeiro chat vibracional do mundo**: Traduz intenções humanas em dados energéticos
- **Segurança e fluidez**: Garantir interações seguras, fluidas e transparentes
- **Hub de integração**: Ponto central com Feed Sensorial, Eventos, Locais Parceiros, Modo Bora e Mapa de Frequência
- **Laboratório vibracional**: Cada conversa gera dados para evolução contínua do matching da IA Aurah Kosmos

---

## 🏗️ Arquitetura Macro

### Componentes Principais

| Componente | Função | Tecnologia |
|------------|--------|------------|
| **Interface do Usuário** | Área de mensagens com painel vibracional em tempo real | Flutter Web/Mobile |
| **Aurah Kosmos (IA)** | Guia vibracional, opera sobre metadados e feedbacks pós-chat | Python (FastAPI) |
| **Banco de Dados** | Armazenamento multi-camada | Firestore (tempo real), PostgreSQL (histórico/logs), Neo4j (relações) |
| **Modo Pulsar** | Mensagens efêmeras que desaparecem após visualização/tempo definido | Firestore + Timer |
| **Painel Vibracional** | Mostra estados Pico, Transição, Colapso com atraso assíncrono | WebSocket |
| **Logs Vibracionais** | Registro criptografado de metadados e curvas energéticas | PostgreSQL + Encryption |

---

## 🧠 Dados Processados (Somente Metadados)

**⚠️ PRIVACIDADE GARANTIDA:** A IA **NÃO lê conteúdo criptografado**. Apenas metadados são analisados.

### Métricas Vibracionais

1. **Reciprocidade**: Tempo de resposta entre usuários
2. **Intensidade**: Volume de mensagens em determinado intervalo
3. **Pausas**: Duração de intervalos sem interação
4. **Expressividade**: Uso de emojis (positivos/negativos)
5. **Feedback Pós-Chat**: Avaliação direta do usuário

### Fórmula do Score Vibracional

```
FrequênciaChat = (w1 * Reciprocidade) + 
                 (w2 * Intensidade) + 
                 (w3 * Emojis) - 
                 (w4 * Pausas)

Output: float 0.0 – 10.0
```

**Classificação de Estados:**
- 🔥 **7.0 – 10.0** → **Pico** (alta energia, engajamento intenso)
- 💫 **4.0 – 6.9** → **Transição** (energia moderada, fluxo normal)
- ❄️ **0.0 – 3.9** → **Colapso** (baixa energia, conversa esfriando)

*Pesos (w1, w2, w3, w4) ajustados dinamicamente pela IA com base no histórico do usuário.*

---

## 🔐 Segurança e Privacidade

| Item | Medida Aplicada |
|------|----------------|
| **Criptografia** | AES-256 em trânsito e armazenamento seguro |
| **End-to-End (E2EE)** | Mantido, com IA atuando apenas em metadados fora da camada de conteúdo |
| **Firewall Vibracional** | Bloqueia spam, abusos ou padrões ofensivos de linguagem |
| **LGPD/GDPR** | Consentimento explícito, exclusão de dados sob demanda e logs auditáveis |
| **Tokens JWT** | Sessões com expiração e refresh para cada chat |

---

## 🚪 Formas de Abertura de Chat

### 1. Abertura Direta (Manual)
**Fluxo:** Usuário acessa perfil → clica em "Conectar" → "Iniciar Chat"

**Validações:**
- Status de conexão ativo
- Verificação documental (DUC/DCO) obrigatória
- IA valida metadados mínimos: tempo de interação, histórico de bloqueios

### 2. Abertura via Feed Sensorial
**Fluxo:** Postagem com intenção ativa exibe botão "Iniciar Chat sobre isso"

**Validações:**
- Post precisa estar público e ativo
- IA sugere tag inicial com base no tipo de postagem (ex.: reflexiva, social)

### 3. Abertura via Modo Bora
**Fluxo:** Dois usuários clicam em "Bora" no mesmo plano

**Validações:**
- Aceitação deve ser recíproca
- IA atribui tag inicial "social/espontânea"

### 4. Abertura em Eventos ou Locais Parceiros
**Fluxo:** Check-ins simultâneos em um evento/local

**Validações:**
- IA valida proximidade geográfica (GPS + rede Wi-Fi)
- Local pode fornecer tag vibracional base (ex.: "dança", "gastronomia")

### 5. Abertura Sugerida pela IA Aurah Kosmos
**Fluxo:** IA detecta sinais em metadados (reciprocidade, histórico de matches)

**Mensagem:** "Energia compatível detectada. Deseja abrir um chat com [usuário X]?"

**Validações:**
- Feedbacks prévios positivos
- Não há bloqueios ou denúncias entre os envolvidos

---

## 🌀 Pipeline Operacional Assíncrono

```
Usuário envia mensagem
    ↓
Entrega imediata (tempo real via WebSocket)
    ↓
Pipeline de eventos (Kafka/PubSub) → coleta metadados
    ↓
IA processa e atualiza estado vibracional (2-3s de atraso)
    ↓
Painel do chat é atualizado para ambos os usuários
    ↓
Logs são salvos (Firestore + PostgreSQL + Neo4j)
```

---

## 📦 Endpoints de API

### Criar Chat
```http
POST /api/chat/create

Request:
{
  "user_id": "abc123",
  "target_id": "xyz789",
  "origem": "feed_sensorial",
  "tag_intencao": "casual"
}

Response (Sucesso):
{
  "status": "sucesso",
  "chat_id": "uuid",
  "estado_inicial": "transicao"
}
```

### Listar Chats Ativos
```http
GET /api/chat/listar

Response (Sucesso):
{
  "status": "sucesso",
  "chats": [
    {
      "chat_id": "uuid",
      "intencao": "💬 Casual",
      "estado_vibracional": "pico",
      "ultimo_update": "2025-09-06T14:23:00Z"
    }
  ]
}
```

### Enviar Mensagem
```http
POST /api/chat/:chat_id/mensagem

Request:
{
  "user_id": "abc123",
  "conteudo_criptografado": "base64_encrypted_content",
  "tipo": "texto"
}
```

### Atualizar Estado Vibracional
```http
GET /api/chat/:chat_id/estado

Response:
{
  "chat_id": "uuid",
  "estado": "pico",
  "frequencia": 8.5,
  "metricas": {
    "reciprocidade": 0.95,
    "intensidade": 0.87,
    "emojis": 0.92,
    "pausas": 0.15
  }
}
```

---

## 📊 Bancos de Dados

| Banco | Função Principal | Dados Armazenados |
|-------|------------------|-------------------|
| **Firestore** | Mensagens em tempo real | Conteúdo criptografado, estados de chat, timestamps |
| **PostgreSQL** | Histórico de logs | Feedbacks, auditoria vibracional, metadados |
| **Neo4j** | Relacionamentos | Clusters de afinidade energética, grafos de conexões |
| **Redis** | Cache de sessões | Últimos estados vibracionais para performance <300ms |

---

## 🎨 Features Especiais

### Modo Pulsar (Mensagens Efêmeras)
- Mensagens desaparecem após visualização ou tempo definido
- Usado para conversas espontâneas e intensas
- Mantém vibração alta sem criar histórico permanente

### Painel Vibracional em Tempo Real
- Atualização assíncrona (2-3s de atraso)
- Visualização gráfica do estado: Pico 🔥, Transição 💫, Colapso ❄️
- Histórico de flutuações energéticas durante a conversa

### Tags de Intenção
Sistema categoriza automaticamente conversas:
- 💬 **Casual**: Bate-papo leve
- 🌀 **Reflexiva**: Discussões profundas
- 🎉 **Social**: Planos e eventos
- 💝 **Romântica**: Interesse afetivo
- 🧠 **Aprendizado**: Troca de conhecimento

---

## 🔄 Integrações com Outros Módulos

### Feed Sensorial
- Posts podem iniciar chats diretamente
- Estado vibracional do chat influencia ranking de posts relacionados

### Eventos e Locais
- Check-ins simultâneos ativam sugestões de chat
- Tags de local/evento pre-classificam a conversa

### Modo Bora
- Aceitar "Bora" abre chat instantâneo
- Estado inicial sempre "social/espontânea"

### Mapa de Frequência
- Conversas ativas aumentam visibilidade no mapa
- Clusters de usuários com chats em "Pico" formam pontos quentes

### IA Aurah Kosmos
- Sugere aberturas de chat baseado em compatibilidade
- Aprende com feedbacks pós-chat para melhorar recomendações

---

## 📈 Métricas de Performance

### Requisitos Técnicos
- **Latência de mensagem**: < 100ms (entrega via WebSocket)
- **Atualização vibracional**: 2-3s (processamento assíncrono)
- **Cache Redis**: < 300ms para estados recentes
- **Throughput**: Suportar 10k mensagens/segundo por servidor

### Escalabilidade
- WebSocket com load balancing horizontal
- Firestore auto-scale para mensagens em tempo real
- Kafka/PubSub para processamento de eventos distribuído
- PostgreSQL com replicação para leitura

---

## 🚀 Roadmap de Implementação

### Fase 1: MVP (Meses 1-2)
- [ ] Chat básico com E2EE (AES-256)
- [ ] Firestore para mensagens em tempo real
- [ ] Estados vibracionais simples (Pico, Transição, Colapso)
- [ ] Abertura direta de chats

### Fase 2: Vibracional Core (Meses 3-4)
- [ ] Pipeline assíncrono completo (Kafka/PubSub)
- [ ] IA Aurah Kosmos processando metadados
- [ ] Painel vibracional em tempo real
- [ ] Modo Pulsar (mensagens efêmeras)

### Fase 3: Integrações (Meses 5-6)
- [ ] Abertura via Feed Sensorial
- [ ] Abertura via Modo Bora
- [ ] Abertura via Eventos/Locais
- [ ] Sugestões da IA

### Fase 4: Avançado (Meses 7-8)
- [ ] Tags de intenção automáticas
- [ ] Firewall vibracional (anti-spam/abuso)
- [ ] Neo4j para grafos de conexões
- [ ] Histórico vibracional completo

---

## 🛠️ Stack Tecnológico Recomendado

### Backend
- **Node.js (Express/Fastify)**: API REST principal
- **Python (FastAPI)**: Processamento de IA e metadados
- **Go**: Microserviço de performance para WebSocket

### Real-Time
- **Socket.IO / WebSocket**: Mensagens em tempo real
- **Kafka / Google Pub/Sub**: Event streaming para metadados

### Banco de Dados
- **Firestore**: Mensagens e estados de chat
- **PostgreSQL**: Logs, histórico e auditoria
- **Neo4j**: Grafos de relações
- **Redis**: Cache de sessões e estados

### Segurança
- **AES-256**: Criptografia de mensagens
- **JWT**: Autenticação de sessões
- **Rate Limiting**: Proteção contra spam

---

## 📝 Considerações de Implementação

### Prioridades
1. **Segurança First**: E2EE não é negociável
2. **Performance**: Latência < 100ms para mensagens
3. **Privacidade**: IA opera APENAS em metadados
4. **Escalabilidade**: Arquitetura distribuída desde o início

### Desafios Técnicos
- **Sincronização em tempo real** com milhares de conexões simultâneas
- **Processamento assíncrono** sem degradar experiência do usuário
- **Balanço entre privacidade e personalização** (E2EE vs IA)
- **Custos de infraestrutura** (Firestore + WebSocket + processamento IA)

### Riscos e Mitigações
| Risco | Mitigação |
|-------|-----------|
| Latência alta | Cache Redis + CDN + load balancing |
| Vazamento de dados | Auditoria contínua + pen testing |
| Escalabilidade | Arquitetura distribuída + auto-scaling |
| Custos | Otimização de queries + monitoramento |

---

## 📚 Referências

- Manual Técnico Definitivo — Sistema de Chat (completo)
- docs/resumos/ia-aurah-kosmos.md
- docs/resumos/feed-sensorial.md
- docs/sumario-executivo.md

---

**Próximos Passos:**
1. Revisar integração com sistema de Eventos
2. Validar requisitos de privacidade com LGPD/GDPR
3. Definir prioridades de features para MVP
4. Criar protótipos de interface vibracional
