# Resumo Técnico: Teste de Personalidade Energética (FriendApp)

## Visão Geral

O Teste de Personalidade Energética é o módulo central de leitura energética do FriendApp, responsável por coletar estímulos sensoriais e emocionais, processá-los via IA híbrida e gerar vetores energéticos que alimentam todo o ecossistema da aplicação.

## Arquitetura do Sistema

### Componentes Principais

| Camada | Função | Tecnologias |
|--------|--------|-------------|
| Frontend Sensorial | Coleta de respostas visuais, auditivas e intuitivas | Flutter + WebGL + FriendFX |
| Backend Core | Orquestração de lógica, APIs e microserviços | Node.js + Go + Python |
| IA Híbrida | Interpretação de padrões energéticos | TensorFlow, PyTorch, NLP (BERT/Spacy) |
| Banco de Dados | Persistência, histórico e vetores energéticos | PostgreSQL + Firestore + Redis |
| Fila Assíncrona | Processamento não bloqueante | Kafka ou Redis Streams |
| Infraestrutura | Escalabilidade e resiliência | Kubernetes + Istio + Multi-cloud (AWS, GCP, Azure) |

### Fluxo de Processamento

1. **Entrada Sensorial**: Usuário interage com imagens, sons e frases
2. **Backend API**: Recebe e valida as respostas
3. **Armazenamento Temporário**: Redis cacheia dados da sessão
4. **Fila de Mensagens**: Kafka distribui eventos para processamento
5. **Microserviço IA**: Processa respostas e gera vetores energéticos
6. **Persistência**: PostgreSQL/Firestore armazena resultados
7. **IA Aurah Kosmos**: Interpreta e distribui para Feed/Jogo/Conexões/Mapa

## Fluxo do Usuário (UX + Backend)

### Estados da Interface

| Estado | Descrição | Ações |
|--------|-----------|-------|
| `consent_gate` | Termos de leitura + privacidade | Exibir 3 checkboxes; habilitar "Começar" |
| `session_start` | Criação/validação de sessão | Chamar `POST /teste/sessao` |
| `questioning` | Perguntas sensoriais (1..N) | Render modular; registrar tempo |
| `cooldown_breath` | Microtransição/respiração | Animação leve 3-5s |
| `submit_end` | Envio de finalização | `POST /teste/finalizar` → 202 |
| `processing_info` | Espera elegante | Tela "sua frequência está sendo sintonizada..." |
| `result_ready` | Resultado pronto | `GET /teste/resultado/:test_id` |
| `activation` | Ativa jornada | Disparar triggers (mapa, feed, jogo) |

### Contratos de API

#### POST /teste/sessao
```json
// Request
{
  "consent_leitura": true,
  "consent_privacidade": true,
  "consent_emocional": true,
  "device_id": "XYZ",
  "app_version": "1.0.0"
}

// Response 201
{
  "test_id": "T-9841",
  "token_teste": "jwt.session",
  "expires_in": 1800
}
```

#### POST /teste/resposta
```json
// Request
{
  "test_id": "T-9841",
  "pergunta_id": "Q-07",
  "choice_id": "IMG-014-AZURE",
  "tempo_ms": 3200
}

// Response 200
{
  "ok": true,
  "proxima_pergunta": "Q-08"
}
```

#### POST /teste/finalizar
```json
// Request
{
  "test_id": "T-9841"
}

// Response 202
{
  "status": "processing",
  "message": "Sua frequência está sendo sintonizada."
}
```

#### GET /teste/resultado/:test_id
```json
// Response 200
{
  "perfil_dominante": "Guardião Solar",
  "perfil_secundario": "Analítico Introspectivo",
  "frequencia_hz": 9.28,
  "tendencia": "expansão_emocional",
  "score_vector": {
    "foco": 0.74,
    "visao": 0.68,
    "presenca": 0.82,
    "forca": 0.61,
    "fluxo": 0.47,
    "sensibilidade": 0.59,
    "sombra": 0.37
  },
  "flags": {
    "sombra_ativa": false,
    "transicao": false
  },
  "ativacoes": {
    "feed": true,
    "jogo": true,
    "mapa": true,
    "conexoes": true
  }
}
```

## Matriz de Ponderação Energética

### Vetores Considerados

| Vetor | Significado |
|-------|------------|
| `foco` | Clareza mental, direção |
| `fluxo` | Capacidade de soltar e seguir o curso |
| `sensibilidade` | Receptividade emocional |
| `forca` | Determinação, ação |
| `presenca` | Estabilidade, ancoragem |
| `visao` | Capacidade de perceber além |
| `sombra` | Resistência ou bloqueio inconsciente |

### Estrutura da Matriz

A matriz é um arquivo JSON versionado que contém todos os `choice_id` do teste, cada um com seu impacto vetorial:

```json
{
  "choice_id": "IMG-014-AZURE",
  "vector_impact": {
    "foco": -0.1,
    "fluxo": 0.2,
    "sensibilidade": 0.15,
    "sombra": 0.0
  },
  "weight": 1.0,
  "metadata": {
    "categoria": "visual",
    "descricao": "Mar azul profundo"
  }
}
```

### Cálculo do Vetor Final

```
para cada resposta do usuário:
  vetor_total += resposta.vector_impact * resposta.weight

vetor_final = normalizar(vetor_total)
```

## Segurança e Privacidade

- **Sessão única**: `token_teste` expira em 30min
- **Criptografia**: TLS 1.3 em trânsito, AES-256 em repouso
- **Proteção anti-fraude**: IA valida padrões de tempo e respostas incoerentes
- **Campos sensíveis**: Masking nos logs, JSONB com GIN index
- **Consentimentos**: Registrados com timestamp, IP e hash_vibe

## Tratamento de Erros

| Situação | Resposta/Comportamento |
|----------|------------------------|
| Perda de conexão ao enviar resposta | Retry exponencial (3 tentativas) + cache local |
| POST /teste/finalizar falha | Retorna 500; frontend sugere reenviar; worker é idempotente |
| Worker caiu durante processamento | Mensagem permanece na fila (ack only on success) |
| Resultado não pronto em 60s | Frontend mantém tela elegante + "notificar quando pronto" |
| Dados inconsistentes (antifraude) | Marcar sessão como suspeita; exigir reexecução guiada |

## Performance e Escalabilidade

- **POST /finalizar**: Sempre retorna 202 (não bloqueia o usuário)
- **Tela de sintonização**: Com microanimação e CTAs alternativos
- **Pré-carregamento**: Assets das telas de resultado (Lottie/SVG)
- **Rate limiting**: Proteção contra abuso
- **Idempotência**: Garante processamento consistente

## Observabilidade

### Eventos Frontend
- `view_consent`
- `start_test`
- `answer_submitted`
- `finalize_clicked`
- `result_viewed`

### Métricas Backend
- Latência por endpoint
- Tempo de processamento do worker
- Taxas de erro
- Tracing distribuído (OpenTelemetry)

### Alertas
- Filas acima de N msgs
- Retries > limiar
- Tempo médio de processamento > SLO

## Modo Transição

Quando não há perfil dominante claro:

- **Feed**: Curadoria exploratória, não-arquetípica
- **Jogo**: Trilha Autodescoberta e Clareza
- **Conexões**: Perfis de alta plasticidade
- **Reavaliação**: Micro-calibração (2-3 perguntas) após 24-72h

## Integração com Ecossistema

O teste gera dados que alimentam:

1. **IA Aurah Kosmos**: Perfil + score + flags
2. **Feed Sensorial**: Curadoria personalizada
3. **Jogo da Transmutação**: Tendência energética
4. **Mapa de Frequência**: Frequência atual (Hz)
5. **Sistema de Conexões**: UUID de ressonância

## Considerações de Implementação

- Backend event-driven para escalabilidade
- Frontend sem "voltar" durante perguntas
- Indicação de progresso sempre visível
- Telemetria completa para insights de UX
- Validação de matriz versionada (Git)
- Cache estratégico para performance
- Retry logic robusto para resiliência
