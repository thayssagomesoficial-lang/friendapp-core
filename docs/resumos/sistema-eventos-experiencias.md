# Sistema de Eventos, Encontros e Experiências Sociais - Resumo Técnico

**Módulo:** Sistema de Eventos e Experiências Sociais  
**Versão:** Definitivo  
**Data de Análise:** 17/10/2025  
**Fonte:** Manual Técnico Definitivo — Sistema de Eventos

---

## 🎯 Visão Geral

O Sistema de Eventos do FriendApp não é apenas uma "agenda de eventos", mas um **orquestrador de portais vibracionais** que unem intenção, energia e presença física para transformar conexões digitais em encontros significativos no mundo real.

### Propósito Estratégico

- **Núcleo da proposta**: Levar conexões digitais para encontros significativos no mundo real
- **Oportunidades transformadoras**: Cada evento é uma chance de cura, expansão ou pertencimento
- **Ecossistema vibracional vivo**: Mais que rede social, é um organismo energético ativo
- **Integração cíclica**: Eventos ativam e são ativados pela IA Aurah Kosmos, Mapa de Frequência, Feed Sensorial, Jogo da Transmutação e Sistema Premium

---

## 🌟 Categorização Vibracional de Eventos

Diferente de plataformas tradicionais, eventos no FriendApp são categorizados **por intenção vibracional**, não apenas por formato.

| Categoria | Emoji | Descrição | Exemplos |
|-----------|-------|-----------|----------|
| **Resenhas Conscientes** | 💬 | Encontros leves, sociais, descontraídos, mas com ressonância vibracional | Happy hour consciente, café filosófico |
| **Experiências de Cura** | 🧘 | Vivências voltadas a relaxamento, terapias, autocuidado e equilíbrio | Yoga, terapias holísticas, banho de floresta |
| **Expansão Pessoal** | 🧠 | Palestras, rodas de estudo, workshops e imersões para crescimento | Cursos, mentorias, retiros |
| **Espiritualidade** | 🔮 | Meditações coletivas, rituais, práticas espirituais guiadas | Círculos de meditação, rituais de lua |
| **Networking Autêntico** | 🤝 | Conexões profissionais e colaborativas baseadas em afinidade vibracional | Meetups colaborativos, coworking |
| **Afinidade Emocional** | 💓 | Encontros românticos ou de afinidade afetiva com curadoria vibracional | Speed dating consciente, jantares |
| **Expressão Criativa** | 🎨 | Arte, música, dança, performances e experiências de cocriação | Shows, exposições, jam sessions |

### Inteligência da IA
- **Aurah Kosmos** usa essa classificação para sugerir eventos conforme o estado vibracional do usuário
- Categorias funcionam como **portais energéticos** que podem influenciar positivamente a frequência do participante
- Bloco especial **"✨ Para Você"** com recomendações personalizadas

---

## 🏗️ Estrutura de Criação de Eventos

### Quem Pode Criar
- **Usuário Premium**
- **Local Parceiro**
- **Organizador Oficial**

### Fluxo de Criação

```
1. Acesso à aba "Criar Evento"
   ↓
2. Preenchimento de campos obrigatórios
   ↓
3. Validações automáticas (disponibilidade, organizador, DUC)
   ↓
4. Curadoria IA + sistema (ajustes vibracionais)
   ↓
5. Publicação e visibilidade (painel geral + Mapa de Frequência)
```

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **evento_id** | UUID | Identificador único do evento |
| **nome** | String | Nome do evento |
| **descricao** | Texto | Mini descrição vibracional |
| **categoria** | Enum | Tipo vibracional (cura, social, etc.) |
| **local_id/geohash** | String | Local validado ou parceiro vinculado |
| **data_hora** | DateTime | Data e hora do evento |
| **freq_desejada** | Float | Frequência vibracional esperada dos presentes |
| **imagem** | URL (opcional) | Imagem simbólica ou foto |
| **status** | Enum | rascunho, publicado, suspenso |

### Validações Automáticas
✅ Check de disponibilidade do local  
✅ Avaliação vibracional do organizador (via IA Aurah Kosmos)  
✅ Verificação documental (DUC obrigatória)  
✅ Detecção de duplicidade (local, horário e tema)  

### Curadoria IA
- Analisa coerência entre intenção do evento e energia do organizador
- Sugere ajustes de descrição para maior clareza vibracional
- Sugere tags energéticas complementares
- Ajusta categorização se descrição não estiver clara

---

## 🔐 Lógica de Validação e Curadoria

### Fases da Curadoria

#### 1. Pré-validação Técnica
- Conferência de campos obrigatórios
- Verificação documental do organizador (DUC)
- Check de duplicidade (local, horário e tema)

#### 2. Análise Vibracional pela IA Aurah Kosmos
- Avalia descrição e intenção do evento
- Lê energia do organizador
- Sugere ajustes na descrição para maior ressonância

#### 3. Curadoria Visual e Textual
- Avaliação da imagem enviada
- Correção automática de termos inapropriados

#### 4. Aprovação Final
- ✅ **Coerente** → Publicação imediata
- ⏳ **Incoerente** → Envio para moderação humana
- ❌ **Risco identificado** → Evento suspenso automaticamente

### Critérios de Reprovação Automática
- Linguagem ofensiva, preconceituosa ou de baixo nível energético
- Tentativa de criar eventos com fins puramente comerciais sem selo de Local Parceiro
- Descrição incoerente com a categoria vibracional escolhida
- Falta de verificação documental (DUC) do organizador

### Processo Técnico

| Etapa | Responsável | Ação Técnica |
|-------|-------------|--------------|
| **Pré-validação** | Backend | Conferência de campos, DUC, local |
| **Análise vibracional** | IA Aurah Kosmos | Leitura da intenção e energia |
| **Curadoria visual** | Módulo Sensorial | Validação de imagem e linguagem |
| **Aprovação** | Backend + Moderador | Publicação ou bloqueio |

### Feedback ao Criador
- ✅ **Aprovado** → Publicado em segundos
- ⏳ **Em revisão** → Notificação sobre curadoria em andamento
- ❌ **Reprovado** → Mensagem clara com motivo e sugestão de ajuste

---

## 🎯 Lógica de Exibição e Recomendação

### Critérios de Recomendação (Sistema de Peso)

| Critério | Peso | Descrição |
|----------|------|-----------|
| **Frequência do usuário** | 30% | Compatibilidade entre energia atual do usuário e frequência do evento |
| **Intenção declarada** | 25% | Se intenção do usuário coincide com intenção vibracional do evento |
| **Histórico positivo** | 20% | Se usuário já avaliou bem eventos da mesma categoria/organizador |
| **Distância geográfica** | 15% | Quanto mais próximo do usuário, maior a relevância |
| **Popularidade/momento** | 10% | Quantidade de confirmações e energia coletiva |

### Algoritmo de Recomendação

```python
score_evento = (
    0.30 * compatibilidade_frequencia +
    0.25 * alinhamento_intencao +
    0.20 * historico_positivo +
    0.15 * proximidade_geografica +
    0.10 * popularidade
)

# Eventos com score >= 0.70 aparecem em "✨ Para Você"
# Eventos com score >= 0.85 recebem notificação push
```

### Seções de Exibição

#### 1. ✨ Para Você (Personalizado)
- Algoritmo baseado nos 5 critérios acima
- Máximo 10 eventos por vez
- Atualização diária com base em estado vibracional atual

#### 2. 🔥 Próximos e Populares
- Eventos com alta taxa de confirmação
- Próximos 7 dias
- Ordenados por quantidade de participantes + energia coletiva

#### 3. 🗺️ Perto de Você
- Raio de 20km por padrão (ajustável)
- Ordenados por distância
- Integração com Mapa de Frequência

#### 4. 📂 Por Categoria
- Filtros por intenção vibracional
- Usuário pode explorar categorias específicas
- Ordenação por data ou relevância

---

## 📱 Participação e Check-in

### Confirmação de Presença

**Estados de Participação:**
- 🎯 **Confirmado** - Usuário confirmou presença
- 💭 **Talvez** - Usuário demonstrou interesse
- 🔔 **Notificado** - IA sugeriu, usuário ainda não respondeu

### Check-in Presencial

**Tecnologias:**
- **QR Code** único por evento
- **Geolocalização** validada (raio de 500m)
- **NFC** para locais parceiros equipados

**Fluxo:**
```
Usuário chega ao local
   ↓
Abre app e clica em "Check-in"
   ↓
Sistema valida GPS + QR Code/NFC
   ↓
Check-in confirmado
   ↓
Usuário aparece no Mapa de Frequência local
   ↓
Sugestões de conexões com outros participantes
```

### Benefícios do Check-in
- **XP energético** adicionado ao perfil
- **Visibilidade** no Mapa de Frequência durante o evento
- **Sugestões de chat** com outros participantes
- **Histórico** de eventos frequentados para melhorar recomendações futuras

---

## 🔄 Integrações com Outros Módulos

### Mapa de Frequência
- Eventos aparecem como **pontos quentes** no mapa
- Intensidade visual proporcional ao número de confirmações
- Check-ins em tempo real atualizam o mapa

### Feed Sensorial
- Postagens de eventos aparecem no feed
- Usuários podem compartilhar experiências pós-evento
- Criação de memórias vibracionais coletivas

### Sistema de Chat
- Check-ins simultâneos ativam sugestões de chat
- Chats coletivos para eventos grandes
- Tags de evento pre-classificam conversas

### Modo Bora
- Eventos podem ser vinculados a planos "Bora"
- "Quem vai?" vira "Bora junto?"
- Formação de grupos de ida ao evento

### IA Aurah Kosmos
- Recomendações personalizadas baseadas em estado vibracional
- Curadoria de eventos compatíveis com jornada do usuário
- Feedback loop: participação melhora recomendações

### Locais Parceiros
- Eventos podem ser criados por locais parceiros
- Benefícios exclusivos para participantes
- Validação de check-in via infraestrutura do local

### Sistema Premium
- Usuários Premium podem criar eventos ilimitados
- Impulsionamento de eventos (maior visibilidade)
- Analytics detalhados de participação

---

## 📊 Estrutura de Dados

### Modelo de Evento (Simplificado)

```json
{
  "evento_id": "uuid-v4",
  "nome": "Meditação ao Pôr do Sol",
  "descricao": "Prática de meditação guiada com vista para o mar",
  "categoria": "espiritualidade",
  "organizador_id": "user-uuid",
  "local": {
    "local_id": "local-uuid",
    "nome": "Praia da Paz",
    "geohash": "7h3btk5g8",
    "latitude": -23.550520,
    "longitude": -46.633308
  },
  "data_hora": "2025-10-20T18:00:00Z",
  "duracao_estimada": "90min",
  "freq_desejada": 8.5,
  "capacidade_max": 30,
  "status": "publicado",
  "imagem_url": "https://...",
  "tags": ["meditacao", "natureza", "cura"],
  "participantes": {
    "confirmados": 15,
    "talvez": 8,
    "check_ins": 12
  },
  "energia_coletiva": 8.2,
  "created_at": "2025-10-15T10:00:00Z",
  "updated_at": "2025-10-17T14:30:00Z"
}
```

### Modelo de Participação

```json
{
  "participacao_id": "uuid-v4",
  "evento_id": "evento-uuid",
  "user_id": "user-uuid",
  "status": "confirmado",
  "confirmado_em": "2025-10-16T09:00:00Z",
  "check_in": {
    "realizado": true,
    "timestamp": "2025-10-20T18:05:00Z",
    "geolocation": { "lat": -23.550520, "lng": -46.633308 },
    "metodo": "qr_code"
  },
  "feedback_pos_evento": {
    "avaliacao": 9.5,
    "comentario": "Experiência transformadora!",
    "frequencia_sentida": 9.0
  }
}
```

---

## 📦 Endpoints de API

### Criar Evento
```http
POST /api/eventos/criar

Request:
{
  "nome": "Meditação ao Pôr do Sol",
  "descricao": "Prática de meditação guiada com vista para o mar",
  "categoria": "espiritualidade",
  "local_id": "local-uuid",
  "data_hora": "2025-10-20T18:00:00Z",
  "capacidade_max": 30,
  "freq_desejada": 8.5
}

Response:
{
  "status": "sucesso",
  "evento_id": "uuid",
  "estado": "em_curacao"
}
```

### Listar Eventos (Recomendações)
```http
GET /api/eventos/recomendados?user_id=abc123

Response:
{
  "para_voce": [...],
  "proximos_populares": [...],
  "perto_de_voce": [...]
}
```

### Confirmar Presença
```http
POST /api/eventos/:evento_id/confirmar

Request:
{
  "user_id": "abc123",
  "status": "confirmado"
}
```

### Check-in
```http
POST /api/eventos/:evento_id/checkin

Request:
{
  "user_id": "abc123",
  "qr_code": "event-qr-hash",
  "geolocation": { "lat": -23.550520, "lng": -46.633308 }
}

Response:
{
  "status": "sucesso",
  "xp_ganho": 50,
  "conexoes_sugeridas": [...]
}
```

### Avaliar Evento (Pós-Participação)
```http
POST /api/eventos/:evento_id/avaliar

Request:
{
  "user_id": "abc123",
  "avaliacao": 9.5,
  "comentario": "Experiência transformadora!",
  "frequencia_sentida": 9.0
}
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** - API REST para gestão de eventos
- **Python (FastAPI)** - Recomendações da IA
- **PostgreSQL** - Dados estruturados de eventos e participações
- **Redis** - Cache de eventos próximos e populares

### Geolocalização
- **Geohash** - Indexação espacial
- **PostGIS** - Queries geográficas avançadas
- **Google Maps API** - Visualização e navegação

### Real-Time
- **WebSocket** - Atualizações de check-ins em tempo real
- **Pub/Sub** - Notificações de eventos

### Mobile
- **Flutter** - QR Code scanner, GPS, NFC
- **Firebase Cloud Messaging** - Push notifications

---

## 🚀 Roadmap de Implementação

### Fase 1: MVP Eventos (Meses 1-2)
- [ ] CRUD de eventos
- [ ] Categorização vibracional
- [ ] Listagem básica (próximos, populares)
- [ ] Confirmação de presença

### Fase 2: Curadoria e Recomendações (Meses 3-4)
- [ ] Validação automática (DUC, duplicidade)
- [ ] IA Aurah Kosmos para curadoria
- [ ] Algoritmo de recomendação personalizada
- [ ] Seção "✨ Para Você"

### Fase 3: Check-in e Geolocalização (Meses 5-6)
- [ ] QR Code para check-in
- [ ] Validação por GPS
- [ ] Integração com Mapa de Frequência
- [ ] Sugestões de conexões durante eventos

### Fase 4: Integrações Avançadas (Meses 7-8)
- [ ] Integração com Locais Parceiros
- [ ] Modo Bora para eventos
- [ ] Feed Sensorial de memórias de eventos
- [ ] Analytics Premium

---

## 📈 Métricas de Sucesso

### KPIs do Sistema
- **Taxa de conversão**: Eventos visualizados → Confirmações
- **Taxa de check-in**: Confirmações → Check-ins reais
- **Avaliação média**: Feedback pós-evento
- **Frequência média sentida**: Comparação com freq_desejada
- **Taxa de reincidência**: Usuários que participam de múltiplos eventos

### Metas Iniciais
- 70% de taxa de check-in (confirmados que realmente comparecem)
- 8.0+ de avaliação média
- 30% dos usuários participam de pelo menos 1 evento/mês
- 15% dos usuários criam eventos

---

## 🔒 Segurança e Governança

### Proteções Implementadas
- ✅ Verificação DUC obrigatória para criação
- ✅ Moderação automática + humana
- ✅ Sistema de denúncia de eventos inapropriados
- ✅ Bloqueio de spam e duplicidade
- ✅ Validação de geolocalização para check-in

### Privacidade
- Lista de participantes visível apenas para confirmados
- Opção de participação "anônima" (visível apenas para organizador)
- Dados de geolocalização temporários (apagados após evento)

---

## 📝 Considerações de Implementação

### Prioridades
1. **Curadoria de qualidade** - Eventos devem manter alto padrão vibracional
2. **Facilidade de criação** - Fluxo simples para organizadores
3. **Recomendações precisas** - IA deve acertar nas sugestões
4. **Check-in confiável** - Evitar fraudes e garantir presença real

### Desafios Técnicos
- Escalabilidade de queries geográficas (PostGIS + cache)
- Processamento em tempo real de check-ins durante eventos grandes
- Balanceamento entre privacidade e descoberta de conexões
- Moderação eficiente sem burocratizar criação

---

## 📚 Referências

- Manual Técnico Definitivo — Sistema de Eventos (completo)
- docs/resumos/ia-aurah-kosmos.md
- docs/resumos/sistema-chat-vibracional.md
- docs/resumos/mapa-frequencia.md
- docs/sumario-executivo.md

---

**Próximos Passos:**
1. Validar estrutura de dados com equipe de backend
2. Criar protótipos de interface de criação e descoberta
3. Definir fluxo de moderação humana
4. Integrar com módulo de Locais Parceiros
