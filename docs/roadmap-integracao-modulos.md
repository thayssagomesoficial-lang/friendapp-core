# Roadmap de Integração dos Novos Módulos - FriendApp

**Versão:** 1.0  
**Data:** 17/10/2025  
**Objetivo:** Plano executável para integração dos 4 novos módulos técnicos

---

## 🎯 Visão Geral

Este documento define a ordem de implementação e integração dos novos módulos técnicos:

1. **Sistema de Chat e Mensagens Vibracionais**
2. **Sistema de Eventos, Encontros e Experiências Sociais**
3. **Sistema de Locais Parceiros e Experiências Comerciais**
4. **Sistema de Conexões Reais (Modo Viagem + Bora)**

---

## 📅 Cronograma Macro

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIMELINE DE IMPLEMENTAÇÃO                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Mês 1-2:  Chat Vibracional MVP                                 │
│  Mês 3-4:  Eventos MVP + Integração Chat ↔ Eventos             │
│  Mês 5-7:  Locais Parceiros + Integração com Mapa              │
│  Mês 8-10: Modo Viagem + Modo Bora                             │
│  Mês 11-12: Otimizações e Features Avançadas                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 FASE 1: Chat Vibracional MVP (Meses 1-2)

### Objetivo
Implementar sistema de chat com criptografia E2EE e estados vibracionais básicos.

### Entregáveis

#### Sprint 1 (Semanas 1-2): Infraestrutura
- [ ] **Banco de dados**
  - [ ] Schema Firestore para mensagens em tempo real
  - [ ] Schema PostgreSQL para logs e histórico
  - [ ] Setup Redis para cache de estados vibracionais
- [ ] **Backend**
  - [ ] API REST: `/api/chat/create`, `/api/chat/listar`
  - [ ] WebSocket server (Socket.IO / Go WebSocket)
  - [ ] Implementar E2EE (AES-256)
- [ ] **Testes**
  - [ ] Unit tests para criptografia
  - [ ] Integration tests para WebSocket

#### Sprint 2 (Semanas 3-4): Funcionalidades Core
- [ ] **Envio e recebimento de mensagens**
  - [ ] POST `/api/chat/:chat_id/mensagem`
  - [ ] WebSocket: `message.send`, `message.receive`
  - [ ] Entrega garantida + confirmação de leitura
- [ ] **Estados vibracionais básicos**
  - [ ] Pipeline assíncrono (Kafka/PubSub) para metadados
  - [ ] Cálculo de score vibracional (Pico/Transição/Colapso)
  - [ ] GET `/api/chat/:chat_id/estado`
- [ ] **Frontend Flutter**
  - [ ] Tela de lista de chats
  - [ ] Tela de conversa com input
  - [ ] Indicador de estado vibracional

#### Sprint 3 (Semanas 5-6): Integrações Iniciais
- [ ] **Integração com Aurah IA**
  - [ ] Envio de metadados para IA (reciprocidade, intensidade)
  - [ ] Feedback loop: IA aprende com padrões
- [ ] **Modo Pulsar (mensagens efêmeras)**
  - [ ] Timer automático para exclusão
  - [ ] UI diferenciada
- [ ] **Testes E2E**
  - [ ] Jornada completa: criar chat → enviar mensagem → receber

### Critérios de Sucesso
✅ Latência < 100ms para envio de mensagens  
✅ Estado vibracional atualizado em 2-3s (assíncrono)  
✅ E2EE funcionando sem perda de mensagens  
✅ 100% dos chats têm estados calculados corretamente  

---

## 🎉 FASE 2: Eventos MVP + Integração Chat (Meses 3-4)

### Objetivo
Sistema de eventos com categorização vibracional e integração com chat.

### Entregáveis

#### Sprint 4 (Semanas 7-8): CRUD de Eventos
- [ ] **Banco de dados**
  - [ ] Schema PostgreSQL para eventos
  - [ ] Schema Firestore para check-ins em tempo real
  - [ ] PostGIS para queries geográficas
- [ ] **Backend**
  - [ ] POST `/api/eventos/criar`
  - [ ] GET `/api/eventos/recomendados`
  - [ ] POST `/api/eventos/:id/confirmar`
- [ ] **Categorização vibracional**
  - [ ] 7 categorias (Resenhas, Cura, Expansão, etc.)
  - [ ] Tags automáticas por IA

#### Sprint 5 (Semanas 9-10): Check-in e Curadoria
- [ ] **Check-in presencial**
  - [ ] POST `/api/eventos/:id/checkin`
  - [ ] Validação GPS (raio 500m)
  - [ ] QR Code generator e scanner (Flutter)
- [ ] **Curadoria automática**
  - [ ] IA valida descrição e energia do organizador
  - [ ] Moderação automática + humana
  - [ ] Sistema de denúncias

#### Sprint 6 (Semanas 11-12): Integrações
- [ ] **Integração Chat ↔ Eventos**
  - [ ] Check-ins simultâneos ativam sugestão de chat
  - [ ] Chat de grupo para eventos grandes
- [ ] **Integração Feed Sensorial**
  - [ ] Posts de eventos no feed
  - [ ] Compartilhamento de memórias pós-evento
- [ ] **Integração Mapa de Frequência**
  - [ ] Eventos aparecem como pontos quentes
  - [ ] Intensidade visual ~ confirmações

### Critérios de Sucesso
✅ 70% de taxa de check-in (confirmados que comparecem)  
✅ 8.0+ de avaliação média pós-evento  
✅ Recomendações personalizadas com precisão > 80%  
✅ Zero eventos inapropriados publicados (curadoria efetiva)  

---

## 🏢 FASE 3: Locais Parceiros B2B (Meses 5-7)

### Objetivo
Sistema B2B completo com score vibracional, antifraude e painéis.

### Entregáveis

#### Sprint 7 (Semanas 13-14): Cadastro e Tiers
- [ ] **Banco de dados**
  - [ ] Schema PostgreSQL completo (locais, tiers, assinaturas)
  - [ ] Redis para cache de scores
  - [ ] Neo4j para grafos de relações
- [ ] **Sistema de tiers**
  - [ ] 4 planos (Explorador, Navegador, Expansor, Visionário)
  - [ ] POST `/api/locations/register`
  - [ ] Integração com Stripe/Asaas

#### Sprint 8 (Semanas 15-16): Score Vibracional
- [ ] **Pipeline de cálculo**
  - [ ] Job assíncrono (15 min window)
  - [ ] Fórmula: 70% feedbacks + 20% eventos + 10% mídia
  - [ ] Persistência em PostgreSQL + Redis
- [ ] **Antifraude v1**
  - [ ] VTS (Vibrational Trust Score)
  - [ ] Detecção de anomalias (DBSCAN, Z-score)
  - [ ] Quarentena de feedbacks suspeitos

#### Sprint 9 (Semanas 17-18): Painel B2B
- [ ] **Dashboard parceiro**
  - [ ] Visualização de score + breakdown
  - [ ] Analytics de check-ins e feedbacks
  - [ ] Histórico vibracional (30/90 dias)
- [ ] **Missões de Harmonização**
  - [ ] Gatilho: score < 30 por 7 dias
  - [ ] Tarefas gamificadas
  - [ ] Recompensas (XP + créditos de boost)

#### Sprint 10 (Semanas 19-20): Integrações
- [ ] **Integração Mapa de Frequência**
  - [ ] Locais aparecem com cor por estado vibracional
  - [ ] Filtros por categoria e score
- [ ] **Integração Eventos**
  - [ ] Locais parceiros podem criar eventos
  - [ ] Benefícios exclusivos para participantes
- [ ] **Sistema de impulsionamento (Boost)**
  - [ ] POST `/api/locations/:id/boost`
  - [ ] Maior visibilidade por 24h

### Critérios de Sucesso
✅ Score atualizado em < 15 min  
✅ Antifraude detecta > 90% de padrões anômalos  
✅ Dashboard B2B com latência < 300ms  
✅ 5+ locais parceiros no MVP (pilotos)  

---

## 🌍 FASE 4: Conexões Reais - Viagem + Bora (Meses 8-10)

### Objetivo
Modo Viagem com colisões preditivas + Modo Bora com moderação.

### Entregáveis

#### Sprint 11 (Semanas 21-22): Modo Viagem - Projeção
- [ ] **Banco de dados**
  - [ ] PostgreSQL: `travel_intentions`
  - [ ] ElasticSearch: índice preditivo
  - [ ] Redis: cache de colisões
- [ ] **Projeção energética**
  - [ ] POST `/api/travel/activate`
  - [ ] Normalização geográfica (Geohash)
  - [ ] Integração com Aurah IA para vetores

#### Sprint 12 (Semanas 23-24): Colisões Preditivas
- [ ] **Engine de colisões**
  - [ ] Job assíncrono (1h) para detectar overlaps
  - [ ] Fórmula: 50% similaridade + 30% intenção + 20% temporal
  - [ ] Thresholds: ≥0.85 notifica, 0.70-0.84 fila
- [ ] **Notificações inteligentes**
  - [ ] Máx. 3 notificações/semana
  - [ ] Contexto obrigatório
  - [ ] Push + in-app

#### Sprint 13 (Semanas 25-26): Modo Bora - Grupos
- [ ] **CRUD de grupos Bora**
  - [ ] POST `/api/bora/create`
  - [ ] POST `/api/bora/:id/join`
  - [ ] GET `/api/bora/recomendados`
- [ ] **Chat de grupo integrado**
  - [ ] Criação automática ao criar Bora
  - [ ] Tag "social/espontânea"
- [ ] **Check-in presencial**
  - [ ] Validação GPS + QR Code

#### Sprint 14 (Semanas 27-28): Moderação Aurah Guardian
- [ ] **Sistema de moderação**
  - [ ] POST `/api/bora/:id/mute/:user`
  - [ ] POST `/api/bora/:id/ban/:user`
  - [ ] POST `/api/bora/reports`
- [ ] **IA Aurah Guardian**
  - [ ] NLP para linguagem agressiva
  - [ ] Detecção de spam
  - [ ] Triagem automática de denúncias

#### Sprint 15 (Semanas 29-30): Integrações Finais
- [ ] **Bora ↔ Locais Parceiros**
  - [ ] Escolha de local para encontro
  - [ ] Benefícios exclusivos
- [ ] **Bora ↔ Eventos**
  - [ ] Conversão de eventos em grupos Bora
- [ ] **Viagem ↔ Eventos/Locais**
  - [ ] "30 viajantes energéticos chegam na semana que vem"

### Critérios de Sucesso
✅ Colisões preditivas com precisão > 75%  
✅ 80% taxa de presença em grupos Bora  
✅ < 2% taxa de denúncias  
✅ Moderação automática resolve 90% dos casos  

---

## 🔧 FASE 5: Otimizações & Features Avançadas (Meses 11-12)

### Objetivo
Polimento, performance e features premium.

### Entregáveis

#### Sprint 16 (Semanas 31-32): Performance
- [ ] **Otimizações de latência**
  - [ ] Cache Redis agressivo
  - [ ] CDN para assets
  - [ ] Database query optimization
- [ ] **Escalabilidade**
  - [ ] Load balancing horizontal
  - [ ] Auto-scaling (K8s HPA)
  - [ ] Stress testing (10k msgs/s)

#### Sprint 17 (Semanas 33-34): Analytics Premium
- [ ] **Dashboard avançado**
  - [ ] Métricas de produto
  - [ ] Análise de coorte
  - [ ] Funnel de conversão
- [ ] **A/B Testing**
  - [ ] Feature flags
  - [ ] Algoritmos de recomendação
  - [ ] UI/UX variants

#### Sprint 18 (Semanas 35-36): Features Avançadas
- [ ] **Learning-to-rank**
  - [ ] ML para recomendações
  - [ ] Personalização deep learning
- [ ] **Media understanding v2**
  - [ ] Análise estética de fotos
  - [ ] Detecção de cores/luz
- [ ] **Boost inteligente**
  - [ ] Budget-aware boosting
  - [ ] ROI prediction

### Critérios de Sucesso
✅ p95 latência < 300ms em todas as rotas  
✅ Suporte a 100k usuários ativos simultâneos  
✅ Analytics em tempo real (< 1min lag)  
✅ A/B tests rodando em 100% das features  

---

## 📊 Matriz de Dependências

```
Chat MVP
  └─> Eventos MVP
      └─> Locais Parceiros
          └─> Modo Viagem
              └─> Modo Bora

Aurah IA (Core)
  ├─> Chat (metadados)
  ├─> Eventos (curadoria)
  ├─> Locais (score)
  └─> Viagem/Bora (colisões)

Mapa de Frequência
  ├─> Eventos (hotspots)
  ├─> Locais (markers)
  └─> Viagem (projeções)
```

**Princípio:** Não avançar para próxima fase sem 80% dos critérios de sucesso atingidos.

---

## 🧪 Estratégia de Testes por Fase

### Fase 1: Chat
- Unit: Criptografia, states, metadados
- Integration: WebSocket, APIs REST
- E2E: Jornada completa de conversa
- Load: 1k msgs/s

### Fase 2: Eventos
- Unit: Categorização, recomendações
- Integration: Check-in, curadoria
- E2E: Criar evento → participar → check-in
- Load: 100 eventos/s

### Fase 3: Locais
- Unit: Score vibracional, antifraude
- Integration: Feedbacks, boosts
- E2E: Cadastro → feedback → score atualizado
- Load: 500 check-ins/min

### Fase 4: Viagem/Bora
- Unit: Colisões, vetores, moderação
- Integration: Notificações, grupos
- E2E: Ativar viagem → receber colisão → criar Bora
- Load: 1k projeções/hora

---

## 🎯 Métricas de Sucesso Global

### Adoção
- **Semana 1:** 100 usuários testando Chat MVP
- **Mês 2:** 1k usuários ativos no Chat
- **Mês 4:** 500 eventos criados
- **Mês 7:** 50 locais parceiros cadastrados
- **Mês 10:** 1k viagens projetadas, 500 grupos Bora

### Qualidade
- **Uptime:** > 99.9%
- **Latência p95:** < 300ms
- **Taxa de erro:** < 0.5%
- **Satisfação:** NPS > 70

### Engajamento
- **Retenção D7:** > 40%
- **Retenção D30:** > 25%
- **DAU/MAU:** > 0.3
- **Sessão média:** > 15 min

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Atraso em E2EE** | Média | Alto | Protótipo cedo, consultoria segurança |
| **Performance WebSocket** | Alta | Médio | Load testing contínuo, CDN |
| **Baixa adoção Locais B2B** | Média | Alto | Pilotos pagos, onboarding dedicado |
| **Colisões preditivas imprecisas** | Alta | Médio | A/B testing, calibração contínua |
| **Spam/abuso em Bora** | Alta | Alto | Aurah Guardian desde MVP, moderação humana |

---

## 👥 Time e Recursos Necessários

### Recomendação de Squad

**Backend (3 devs)**
- 1x Node.js (APIs REST)
- 1x Python (IA, ML)
- 1x Go (WebSocket, performance)

**Frontend (2 devs)**
- 2x Flutter (iOS, Android, Web)

**Data/ML (1 dev)**
- 1x Data Engineer + ML Engineer

**DevOps (1 dev)**
- 1x SRE (K8s, observabilidade, CI/CD)

**Design (1 designer)**
- 1x Product Designer (UI/UX)

**PM/PO (1)**
- 1x Product Owner

**Total: 9 pessoas full-time**

---

## 📚 Documentação a Produzir em Cada Fase

### Fase 1: Chat
- [ ] API Spec (OpenAPI)
- [ ] Fluxogramas de estados vibracionais
- [ ] Guia de E2EE para desenvolvedores

### Fase 2: Eventos
- [ ] Matriz de categorização vibracional
- [ ] Fluxo de curadoria (diagrama)
- [ ] Guia de check-in (QR Code + GPS)

### Fase 3: Locais
- [ ] Documentação do algoritmo de score
- [ ] Manual de antifraude
- [ ] Guia de integração para parceiros

### Fase 4: Viagem/Bora
- [ ] Explicação de colisões preditivas
- [ ] Manual de moderação Aurah Guardian
- [ ] Políticas de comunidade (Bora)

---

## ✅ Checklist de Go-Live por Fase

### Chat MVP
- [ ] E2EE validado por auditoria de segurança
- [ ] Latência < 100ms em 95% dos casos
- [ ] 100 usuários beta testaram sem bugs críticos
- [ ] Documentação API publicada

### Eventos MVP
- [ ] 10 eventos criados e realizados com sucesso
- [ ] Check-in funcionando com precisão > 95%
- [ ] Curadoria automática aprovando/reprovando corretamente
- [ ] Integração com Chat funcionando

### Locais Parceiros
- [ ] 5 pilotos onboardados e satisfeitos (NPS > 70)
- [ ] Score vibracional atualizado em < 15 min
- [ ] Antifraude detectando anomalias
- [ ] Pagamentos Stripe/Asaas funcionando

### Viagem/Bora
- [ ] 50 viagens projetadas, colisões detectadas
- [ ] 10 grupos Bora realizados com presença > 80%
- [ ] Aurah Guardian moderando sem falsos positivos
- [ ] Zero incidentes de segurança

---

## 📞 Pontos de Decisão (Gates)

### Gate 1 (Fim do Mês 2): Chat MVP Pronto?
**Critério:** 80% dos critérios de sucesso atingidos  
**Sim:** Avançar para Eventos  
**Não:** Sprint extra de correções

### Gate 2 (Fim do Mês 4): Eventos + Chat Integrados?
**Critério:** Integração funcionando, eventos sendo realizados  
**Sim:** Avançar para Locais  
**Não:** Corrigir integrações

### Gate 3 (Fim do Mês 7): Locais B2B Viável?
**Critério:** 5+ parceiros pagantes, score preciso  
**Sim:** Avançar para Viagem/Bora  
**Não:** Ajustar modelo de negócio

### Gate 4 (Fim do Mês 10): Conexões Reais Funcionando?
**Critério:** Colisões + Boras com alta taxa de sucesso  
**Sim:** Otimizações finais  
**Não:** Recalibrar algoritmos

---

## 🎉 Conclusão

Este roadmap é **vivo e adaptável**. A cada sprint, revisaremos métricas e ajustaremos prioridades. O sucesso depende de:

1. **Foco:** Um módulo de cada vez, sem diluir esforços
2. **Qualidade:** 80% dos critérios antes de avançar
3. **Feedback:** Usuários beta desde a semana 1
4. **Agilidade:** Sprints de 2 semanas, pivots rápidos

**Próxima Ação:** Kickoff do Sprint 1 (Chat MVP - Infraestrutura)

---

**Documento Vivo** - Atualizado conforme progresso real  
**Última Atualização:** 17/10/2025  
**Responsável:** Devin AI (Planejamento de Integração)
