# Resumo Técnico: Suporte ao Usuário (FriendApp)

**Documento Base:** Manual Técnico Definitivo — Suporte ao Usuário  
**Categoria:** Experiência do Usuário & Comunidade  
**Data:** 17/10/2025

---

## 📋 Visão Geral

O manual define o sistema de **Suporte ao Usuário** como o "órgão vital do ecossistema", integrando três pilares fundamentais:
1. **Suporte Inteligente** - Resposta proativa, híbrida (IA + humano)
2. **Comunidade Vibracional** - Malha viva de grupos por frequência
3. **Jornada Sensorial** - Linha do tempo pessoal de expansão energética

### Conceito Central
**Acolhimento como Sistema** - O suporte não é um setor técnico isolado, mas uma arquitetura viva que se recalibra a cada batida energética do usuário.

---

## 🌀 Estrutura Técnica e Vibracional

### Pilares do Sistema

| Pilar | Função Técnica | Impacto Vibracional |
|-------|----------------|---------------------|
| **IA Aurah Kosmos** | Detecta intenções, emoções e vulnerabilidade | Atua como enfermeira vibracional do sistema |
| **Guardiões da Comunidade** | Usuários certificados para moderação acolhedora | Criam sensação de segurança e pertencimento |
| **Mentores Vibracionais** | Profissionais Premium de apoio (coaches, terapeutas) | Fornecem suporte especializado e monetizável |
| **Usuário em Jornada** | Registra check-ins, participa de grupos | Cocria a energia coletiva do FriendApp |

### Fluxo Operacional (Visão Macro)

```
Usuário entra no FriendApp
  ↓
Onboarding Sensorial
  ↓
Jornada Sensorial Iniciada
  ↓
Comunidade Vibracional
  ↓
Suporte Inteligente
  ├── IA Aurah Kosmos
  ├── Guardiões
  └── Mentores Premium
  ↓
Feedback para Jornada Sensorial
```

### Dados Estruturais

| Dado Monitorado | Origem | Finalidade |
|----------------|--------|------------|
| **Frequência inicial** | Onboarding | Criar mapa vibracional |
| **Check-ins emocionais** | Jornada Sensorial | Ajustar feed e recomendações |
| **Participação em grupos** | Comunidade | Definir pertencimento e afinidades |
| **Solicitações de suporte** | Canal de ajuda | Ativar Guardiões ou Mentores |

---

## 🏗️ Arquitetura do Acolhimento

### Arquitetura Modular

| Módulo | Papel Sensorial | Camada Técnica |
|--------|----------------|----------------|
| **Onboarding Sensorial** | Ritual de entrada, define a aura inicial | API /onboarding/start + IA Aurah |
| **Suporte Inteligente** | Canal empático e regenerativo | Microserviço suporte-service + escalonamento |
| **Comunidade Vibracional** | Espaços seguros de trocas | comunidade-service + curadoria IA |
| **Jornada Sensorial** | Linha viva da evolução | expansao-service + check-ins |

### Fluxo Operacional Detalhado

**Entrada:**
- Usuário cria conta
- Aura inicial definida

**Processamento:**
- IA Aurah lê intenção e energia
- Sugere primeiros grupos

**Saída:**
- Painel de Jornada ativo
- Feed sensorial adaptado
- Suporte disponível

### Padrões de Sincronização

| Evento | Trigger | Ação Automática |
|--------|---------|-----------------|
| **Queda vibracional em check-ins** | Score < limiar | Ativar Modo Alívio |
| **Entrada em comunidade tóxica** | Linguagem negativa detectada | Ocultar postagens + redirecionar |
| **Solicitação explícita de ajuda** | Botão de suporte | IA responde ou aciona Guardião |
| **Evolução registrada** | Frequência sobe +3 pontos | Ativar selo vibracional |

---

## 🛤️ Jornada Sensorial

### Propósito
Transformar a linha do tempo do usuário em uma **ferramenta de autodescoberta**, evolução vibracional e retenção orgânica.

### Estrutura Técnica da Jornada

| Elemento | Função | Camada Técnica |
|----------|--------|----------------|
| **Check-ins Vibracionais** | Registros emocionais (diários, semanais) | API /checkin/vibracional |
| **Linha do Tempo** | Visualização dos marcos vibracionais | Microserviço timeline-service |
| **Insights da IA** | Sugestões da Aurah baseadas nos padrões | aurah/insights |
| **Selos de Expansão** | Recompensas simbólicas por evolução | Integração com sistema de Selos |
| **Painel Pessoal** | Exibição do estado atual e evolução acumulada | Frontend + Banco de Frequência |

### Fluxo Operacional de Check-in

1. Usuário realiza check-in (texto, emoji, escala vibracional)
2. IA Aurah interpreta estado emocional
3. Dados são gravados no banco `jornada_vibracional`
4. Linha do tempo é atualizada com insights + gráficos
5. Se evolução > 10% em 30 dias → Selo é desbloqueado
6. Se queda vibracional persistente → Sugestão de conteúdo regenerativo

### Tipos de Dados Monitorados

| Dado | Origem | Finalidade |
|------|--------|------------|
| **Escala vibracional (0-10)** | Autoavaliação do usuário | Base para métricas |
| **Emojis/símbolos** | Entrada sensorial rápida | Enriquecimento semântico |
| **Texto opcional** | Expressão emocional | Análise de NLP vibracional |
| **Tempo de resposta** | Check-ins recorrentes | Detectar hesitação ou bloqueios |
| **Frequência de uso** | Interações semanais | Medir consistência da jornada |

### Algoritmo de Evolução

```python
def calcular_evolucao(checkins):
    media_30dias = sum(checkins[-30:]) / len(checkins[-30:])
    media_7dias = sum(checkins[-7:]) / len(checkins[-7:])
    return (media_7dias - media_30dias) / media_30dias

# Resultado:
# +0.10 → Usuário em Expansão
# 0.05 a +0.09 → Usuário Estável
# < -0.05 → Usuário em Risco Vibracional
```

### Painel Visual da Jornada

**Elementos:**
- Gráfico de evolução com cores vibracionais (azul = estabilidade, verde = crescimento, vermelho = risco)
- Selos posicionados como marcos (ex: "Selo Aurora" ao atingir 30 dias de expansão)
- Recomendações ao lado do gráfico (ex: "Prática Flutua pode elevar sua frequência em 7%")

---

## 👥 Comunidade Vibracional Consciente

### Propósito
Estruturar comunidades como uma **teia viva de pertencimento**, filtrada por frequência energética e protegida por curadoria inteligente + moderação humana.

### Estrutura Vibracional das Comunidades

| Elemento | Função | IA/Humano Envolvido |
|----------|--------|---------------------|
| **Grupos por Frequência** | Comunidades criadas a partir de temas vibracionais (cura, criatividade, solitude) | IA Aurah + usuários |
| **Frequência Mínima de Entrada** | Cada grupo exige um nível vibracional mínimo | IA de Curadoria |
| **Moderação Híbrida** | Curadoria vibracional automática + Guardiões | IA + Humanos certificados |
| **Missões Coletivas** | Desafios, reflexões ou práticas em grupo | Guardiões + IA de Expansão |
| **Feedback Circular** | IA informa como a energia coletiva do grupo está fluindo | Aurah Kosmos IA |

### Lógica Técnica da Curadoria

```python
def validar_entrada(usuario, grupo):
    if usuario.frequencia >= grupo.frequencia_minima:
        permitir_entrada()
    else:
        sugerir_grupo_alternativo()
```

### IA de Curadoria Vibracional

**Funções:**
- Lê palavras, emojis, intensidade de postagens
- Calcula score de compatibilidade com o grupo
- Bloqueia ou sugere alternativas em caso de incompatibilidade

### Filtros Ocultos

**Mecanismo:**
- Postagens com linguagem tóxica ou de baixa vibração não são exibidas
- Em vez de punição direta, o usuário recebe sugestão de ajuste:

```
"Essa vibração não ressoa com o propósito deste espaço. 
Experimente reformular sua expressão."
```

### Dados Monitorados

| Tipo de Dado | Finalidade Técnica |
|--------------|-------------------|
| **Linguagem textual** | Detectar padrões nocivos ou alinhados |
| **Emojis e símbolos** | Captar sutilezas emocionais |
| **Frequência de postagens** | Evitar spam vibracional |
| **Feedbacks recebidos** | Validar reputação vibracional |
| **Engajamento em grupos** | Recomendar conexões compatíveis |

### Dinâmica dos Grupos

1. Entrada com acolhimento automático (som 432Hz + mensagem sensorial)
2. Regra de vibração mínima para postagem
3. Sistema de **elogios vibracionais** (não são likes, são pulsos energéticos)
4. Gamificação simbólica: interações conscientes liberam recompensas (Selos)

---

## 🆘 Canal de Suporte Inteligente & Vibracional

### Propósito
Estabelecer o canal de suporte como um **oráculo vibracional de orientação**, indo além de resolver dúvidas técnicas, para sustentar, regenerar e expandir a energia do usuário.

### Estrutura do Canal de Suporte

| Camada | Função | Quem Atua |
|--------|--------|-----------|
| **Nível 1** | Atendimento automático imediato | IA Aurah Kosmos (modo suporte) |
| **Nível 2** | Acolhimento comunitário voluntário | Guardiões Vibracionais |
| **Nível 3 (Premium)** | Suporte especializado em sessões pagas | Mentores Vibracionais (terapeutas, coaches) |

### Fluxo de Atendimento

1. Usuário abre painel de ajuda
2. IA Aurah Kosmos identifica intenção e estado emocional
3. **Se questão simples** → IA responde com clareza e prática sensorial
4. **Se padrão vibracional em queda** → IA ativa Modo Alívio + sugere grupo de apoio
5. **Se vulnerabilidade severa** → IA encaminha para Guardião
6. **Se usuário Premium desejar** → acesso direto a Mentores Vibracionais

### Experiência Sensorial

**Interface:**
- Tons suaves (lilás, verde-esmeralda)
- Transições etéreas

**Áudio:**
- Sons em 432Hz para relaxamento

**Linguagem:**
- Frases empáticas, nunca mecânicas
- Exemplo: Em vez de "Ticket resolvido", o usuário vê:
  > "Energia restaurada com sucesso. Estamos com você."

### Respostas da IA Aurah

| Situação Detectada | Ação Sensorial da IA |
|--------------------|---------------------|
| **Dúvida técnica** | Resposta objetiva com visual simples |
| **Tristeza ou insegurança** | Som 432Hz + frase acolhedora |
| **Raiva ou tensão** | Silêncio breve + sugestão de respiração |
| **Dúvida existencial** | "Mini-oráculo" → insight + prática vibracional |
| **Colapso vibracional** | Encaminhamento direto a Guardião/Mentor |

### Logs Vibracionais

Cada atendimento gera registro criptografado:
- Emoção detectada
- Frequência vibracional
- Tipo de resposta

**Uso:** Alimentam o Painel de Evolução e ajustam a IA Aurah Kosmos

---

## 🌟 Onboarding como Ritual de Iniciação Vibracional

### Propósito
Transformar o momento de entrada no FriendApp em uma **iniciação energética**. O cadastro deixa de ser burocrático e se torna um ritual sensorial.

### Experiência de Entrada

Ao abrir o app pela primeira vez, o usuário não vê campos frios de formulário. Ele é recebido por uma experiência imersiva:

> "Você não está entrando em um aplicativo, mas em um campo vivo."

### Etapas do Onboarding

| Etapa | Experiência | Dados Coletados |
|-------|-------------|-----------------|
| **1. Portal Sensorial** | Vídeo/áudio imersivo (60-90s) | Tempo de permanência, abandono |
| **2. Intenção Vibracional** | "Por que você está aqui?" (NLP) | Texto de intenção, sentimento |
| **3. Verificação de Idade** | DUC/DCO para +18 | Documento, selfie |
| **4. Teste de Personalidade** | 7 dimensões vibracionais | Respostas, hesitações |
| **5. Geração do Mapa** | Visualização da aura inicial | Frequência Hz, vetor energético |
| **6. Apresentação Aurah** | IA se apresenta | Primeiras impressões |
| **7. Ativação de Subsistemas** | Feed, Conexões, Jogo, Mapa | Preferências iniciais |

### Dados Coletados no Onboarding

```sql
CREATE TABLE onboarding_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    etapa VARCHAR(50),
    tempo_etapa INT,  -- segundos
    abandono BOOLEAN DEFAULT FALSE,
    dados_coletados JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 👮 Guardiões da Comunidade

### Perfil
Usuários certificados pelo FriendApp para atuar como **moderadores voluntários** e **acolhedores comunitários**.

### Requisitos para se Tornar Guardião

| Critério | Requisito |
|----------|-----------|
| **Frequência Vibracional** | > 60 por 90 dias consecutivos |
| **Tempo de Conta** | > 6 meses |
| **Participação Ativa** | > 50 interações mensais |
| **Reputação** | Zero denúncias aceitas |
| **Treinamento** | Curso de moderação vibracional (4h) |

### Responsabilidades

1. Monitorar grupos atribuídos
2. Acolher novos membros
3. Responder solicitações de suporte (Nível 2)
4. Mediar conflitos com empatia
5. Reportar padrões tóxicos persistentes

### Recompensas

- Selo exclusivo "Guardião da Comunidade"
- FriendCoins bônus mensais
- Acesso antecipado a features
- Reconhecimento no perfil

---

## 🧘 Mentores Vibracionais (Premium)

### Perfil
Profissionais certificados (terapeutas, coaches, psicólogos, curandeiros) que oferecem **suporte especializado pago** dentro do FriendApp.

### Requisitos para se Tornar Mentor

| Critério | Requisito |
|----------|-----------|
| **Certificação Profissional** | CRP, CRT, certificado de coaching |
| **Verificação de Identidade** | Validação rigorosa de documentos |
| **Onboarding Mentor** | Curso de 8h sobre o ecossistema FriendApp |
| **Aprovação FriendApp** | Análise de currículo + entrevista |

### Serviços Oferecidos

- Sessões individuais (30min, 60min)
- Grupos temáticos (máx. 8 pessoas)
- Workshops vibracionais
- Práticas guiadas

### Modelo de Monetização

```
Sessão Individual (60min):
- Mentor recebe: 70% do valor
- FriendApp retém: 30%

Grupos (8 pessoas, 90min):
- Mentor recebe: 75% do valor
- FriendApp retém: 25%
```

### Painel do Mentor

**Funcionalidades:**
- Agenda de sessões
- Histórico de atendimentos
- Feedback de usuários (NPS)
- Dashboard de earnings
- Ferramentas de videoconferência integradas

---

## 📊 Modelo de Dados

```sql
CREATE TABLE jornada_vibracional (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    escala_vibracional SMALLINT CHECK (escala_vibracional BETWEEN 0 AND 10),
    emoji VARCHAR(10),
    texto_opcional TEXT,
    tempo_resposta INT,  -- ms
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comunidade_grupos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tema VARCHAR(50),
    frequencia_minima SMALLINT DEFAULT 50,
    max_membros INT DEFAULT 100,
    criado_por VARCHAR,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comunidade_membros (
    id SERIAL PRIMARY KEY,
    grupo_id INT REFERENCES comunidade_grupos(id),
    user_id VARCHAR NOT NULL,
    status VARCHAR(20) DEFAULT 'active',  -- active|suspended|left
    frequencia_entrada SMALLINT,
    ingressou_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE suporte_tickets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    tipo VARCHAR(50),  -- tecnico|emocional|duvida|colapso
    nivel INT,  -- 1=IA, 2=Guardião, 3=Mentor
    atendente_id VARCHAR,  -- null se IA
    status VARCHAR(20) DEFAULT 'open',
    emocao_detectada VARCHAR(50),
    frequencia_vibracional SMALLINT,
    criado_em TIMESTAMP DEFAULT NOW(),
    resolvido_em TIMESTAMP
);

CREATE TABLE guardioes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL,
    certificado_em TIMESTAMP NOT NULL,
    grupos_atribuidos TEXT[],
    atendimentos_realizados INT DEFAULT 0,
    avaliacao_media NUMERIC(3,2),
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE mentores (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL,
    nome_completo VARCHAR(200) NOT NULL,
    certificacoes TEXT[],
    especialidades TEXT[],
    valor_sessao_60min NUMERIC(10,2),
    aprovado_em TIMESTAMP NOT NULL,
    sessoes_realizadas INT DEFAULT 0,
    avaliacao_media NUMERIC(3,2),
    earnings_total NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE sessoes_mentores (
    id SERIAL PRIMARY KEY,
    mentor_id INT REFERENCES mentores(id),
    user_id VARCHAR NOT NULL,
    tipo VARCHAR(50),  -- individual|grupo|workshop
    duracao INT,  -- minutos
    valor NUMERIC(10,2),
    agendada_para TIMESTAMP,
    realizada BOOLEAN DEFAULT FALSE,
    avaliacao_usuario SMALLINT CHECK (avaliacao_usuario BETWEEN 1 AND 5),
    feedback_usuario TEXT,
    criada_em TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 APIs

### Jornada Sensorial

**POST /api/checkin/vibracional**
```json
{
  "user_id": "u_123",
  "escala_vibracional": 7,
  "emoji": "😊",
  "texto_opcional": "Hoje me sinto em paz."
}
```

**GET /api/jornada/timeline/{user_id}**
```json
{
  "user_id": "u_123",
  "evolucao_30d": 0.12,
  "status": "em_expansao",
  "checkins_recentes": [...],
  "selos_desbloqueados": ["Selo Aurora", "Selo Fluxo"],
  "insights_ia": "Você está 15% mais estável que há 30 dias. Continue!"
}
```

### Comunidade

**GET /api/comunidade/grupos/sugestoes/{user_id}**
```json
{
  "sugestoes": [
    {
      "grupo_id": 42,
      "nome": "Cura Emocional",
      "tema": "cura",
      "frequencia_minima": 55,
      "compatibilidade": 0.87,
      "membros_ativos": 42
    }
  ]
}
```

**POST /api/comunidade/grupos/{grupo_id}/entrar**
```json
{
  "user_id": "u_123",
  "frequencia_atual": 62
}
```

### Suporte

**POST /api/suporte/ticket**
```json
{
  "user_id": "u_123",
  "tipo": "emocional",
  "mensagem": "Estou me sentindo muito sozinho..."
}
```

**Response:**
```json
{
  "ticket_id": 9821,
  "nivel_atendimento": 2,
  "atendente": "Guardião Maria",
  "mensagem_acolhida": "Sentimos sua dor. Vamos cuidar de você.",
  "som_432hz": true
}
```

### Mentores

**GET /api/mentores/disponiveis?especialidade=ansiedade**
```json
{
  "mentores": [
    {
      "mentor_id": 15,
      "nome": "Dra. Ana Silva",
      "certificacoes": ["CRP 12345", "Coach ICC"],
      "especialidades": ["ansiedade", "autoconhecimento"],
      "valor_60min": 150.00,
      "avaliacao": 4.8,
      "proxima_disponibilidade": "2025-10-20T14:00:00Z"
    }
  ]
}
```

**POST /api/mentores/agendar-sessao**
```json
{
  "user_id": "u_123",
  "mentor_id": 15,
  "tipo": "individual",
  "duracao": 60,
  "data_hora": "2025-10-20T14:00:00Z"
}
```

---

## 🎯 Integrações com Outros Módulos

### Com IA Aurah Kosmos
- **Entrada:** Estado emocional detectado em check-ins e suporte
- **Saída:** Sugestões de grupos, práticas, conteúdos regenerativos
- **Frequência:** Tempo real (< 3s)

### Com Feed Sensorial
- **Entrada:** Evolução da jornada, frequência vibracional
- **Saída:** Ajuste de conteúdos (feeds suaves se queda vibracional)
- **Frequência:** A cada check-in

### Com Sistema de Conexões
- **Entrada:** Participação em grupos, interações comunitárias
- **Saída:** Sugestões de conexões autênticas
- **Frequência:** Diária

### Com Jogo da Transmutação
- **Entrada:** Progresso de check-ins, participação comunitária
- **Saída:** Desbloqueio de selos, recompensas
- **Frequência:** A cada marco alcançado

---

## 🚀 Roadmap de Implementação

### Fase 1: Jornada Sensorial MVP (Mês 1-2)
- [ ] API de check-ins vibracionais
- [ ] Timeline básica com gráfico de evolução
- [ ] Sistema de selos (5 selos iniciais)
- [ ] Insights básicos da IA Aurah

### Fase 2: Comunidade Vibracional (Mês 3-4)
- [ ] Criação e gestão de grupos
- [ ] Curadoria IA para entrada em grupos
- [ ] Filtros ocultos de linguagem tóxica
- [ ] Sistema de elogios vibracionais

### Fase 3: Suporte Inteligente (Mês 5-6)
- [ ] Canal de suporte com IA Aurah (Nível 1)
- [ ] Sistema de Guardiões (Nível 2)
- [ ] Certificação e treinamento de Guardiões
- [ ] Dashboard de atendimentos

### Fase 4: Mentores Vibracionais (Mês 7-9)
- [ ] Onboarding e verificação de Mentores
- [ ] Agendamento e videoconferência integrada
- [ ] Sistema de pagamentos
- [ ] Dashboard de earnings

### Fase 5: Onboarding Sensorial (Mês 10-12)
- [ ] Portal sensorial imersivo
- [ ] Ritual de entrada completo
- [ ] Integração com Teste de Personalidade
- [ ] Métricas de conversão

---

## 📈 Métricas de Sucesso

### Jornada Sensorial
- **Taxa de check-ins semanais:** > 70%
- **Evolução média dos usuários:** > +0.08 em 30 dias
- **Taxa de desbloqueio de selos:** > 60%
- **NPS da jornada:** > 75

### Comunidade Vibracional
- **Taxa de participação em grupos:** > 50%
- **Engajamento médio por grupo:** > 15 interações/semana
- **Taxa de toxicidade detectada:** < 2%
- **Retenção por participação em grupo:** +25%

### Suporte Inteligente
- **Tempo médio de resposta (Nível 1):** < 30s
- **Resolução de 1ª linha (IA):** > 70%
- **Satisfação com Guardiões:** > 85%
- **Taxa de escalonamento para Mentor:** < 5%

### Mentores Vibracionais
- **Número de Mentores ativos:** > 50 (após 12 meses)
- **Taxa de conversão (consulta → sessão):** > 30%
- **NPS de sessões:** > 90
- **Receita por Mentor/mês:** > R$ 3.000

---

## 🔐 Segurança e Compliance

### Proteção de Dados Sensíveis

- **Check-ins emocionais:** Criptografados AES-256
- **Sessões de Mentores:** Gravações opcionais, consentimento explícito
- **Denúncias:** Anonimizadas para moderação

### Moderação de Comunidades

- **Automática (IA):** Detecção de linguagem tóxica, spam
- **Humana (Guardiões):** Mediação de conflitos, acolhimento
- **Escalonamento:** Casos graves vão para equipe FriendApp

### Certificação de Mentores

- **Verificação de identidade:** CPF, documento com foto
- **Validação de certificados:** Check com conselhos profissionais
- **Background check:** Análise de antecedentes
- **Reavaliação:** Anual, baseada em NPS e feedback

---

## 📝 Notas Finais

O Sistema de Suporte ao Usuário representa a **dimensão humana e acolhedora** do FriendApp, onde:

1. **Suporte não é ticket** - é cuidado energético
2. **Comunidade não é grupo** - é campo vibracional seguro
3. **Jornada não é histórico** - é mapa da alma
4. **Onboarding não é cadastro** - é iniciação

A implementação completa exigirá:
- Squad de Product + UX (4-5 pessoas)
- Psicólogos/terapeutas consultores
- Treinamento de Guardiões (programa piloto com 20 pessoas)
- Onboarding de Mentores (processo seletivo rigoroso)
- Ferramentas de videoconferência (integração com Zoom/Google Meet ou desenvolvimento próprio)

---

**Documentado por:** Devin AI  
**Data:** 17/10/2025  
**Versão:** 1.0  
**Status:** ✅ Integrado ao núcleo FriendApp-Core
