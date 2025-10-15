# Resumo Técnico: Sistema de Cadastro Consciente e Perfil Vibracional

## Visão Geral

O Sistema de Cadastro Consciente substitui o conceito tradicional de "cadastro de usuário" por uma jornada estruturada em etapas técnicas, garantindo identidade validada com segurança jurídica (LGPD) e perfil vibracional técnico-matemático.

## Missão Técnica & Estratégica

- Criar base técnica de dados vibracionais antes de liberar qualquer interação
- Garantir proteções invisíveis para adolescentes (<18 anos) e pessoas em vulnerabilidade
- Evitar vícios de redes sociais tradicionais
- Privilegiar fluxos éticos, seguros e auditáveis

## Elementos Obrigatórios no Fluxo

1. **Portal Sensorial** não pulável (mín. 20s, recomend. 60–90s)
2. **Coleta de dados básicos** + intenção vibracional
3. **Verificação documental** (DUC/DCO)
4. **Teste de Personalidade Energética** → geração de vetores de essência, intenção e proteção
5. **Mapa de Frequência Inicial**
6. **Onboarding pela IA Aurah Kosmos**
7. **Ativação sincronizada** dos subsistemas

## Princípios Técnicos Fundamentais

- **Registro com Validação Dupla**: Idade + verificação vibracional/documental
- **Proteção para Menores**: Fluxos diferenciados, bloqueios invisíveis e filtros de segurança
- **Adaptabilidade da IA**: Onboarding e sugestões ajustados conforme vetor vibracional
- **Arquitetura Assíncrona**: Uso de filas (RabbitMQ/SQS) para processar IA sem travar UX
- **Logs e Observabilidade**: Todas as etapas registradas no ELK + Grafana com KPIs definidos

## Fluxo Completo

```
flowchart TD
A[Primeira abertura do app] --> B[Portal Sensorial (vídeo 60–90s)]
B --> C[Formulário de Identidade + Intenção Vibracional]
C --> D{Idade < 18?}
D -->|Sim| E[Fluxo Protegido para Adolescentes + IA restrita]
D -->|Não| F[Verificação DUC/DCO + Ética Vibracional]
E --> G[Teste de Personalidade Energética]
F --> G
G --> H[Geração do Mapa de Frequência + Vetores]
H --> I[Onboarding Aurah Kosmos]
I --> J[Ativação de Subsistemas (Feed, Conexões, Locais, IA)]
```

## Portal Sensorial — Entrada Não Pulável

### Objetivo Técnico
- Interromper automatismos cognitivos
- Criar "checkpoint vibracional" antes do cadastro
- Capturar dados de comportamento inicial para análise de risco

### Regras Técnicas

| Componente | Regra Técnica |
|------------|--------------|
| Tipo de tela | Fullscreen, sem botões visíveis até o término |
| Duração mínima | 60s (recomendado 90s), adaptativo por device |
| Botão "Continuar" | Liberado apenas após tempo mínimo ou ≥80% do vídeo |
| Acessibilidade | Legendas automáticas + narração em áudio |
| Repetição | Apenas na primeira abertura real (`onFirstLaunch == true`) |
| Gatilho de transição | `onVideoEnd -> iniciarCadastro()` |
| Coleta de dados | Tempo de permanência, tentativas de pular, abandono precoce, microexpressões (se câmera ativa com consentimento) |

### Segurança e Anti-abandono

- Usuários que abandonam antes de 20s → `risk_score += 15`
- Tentativas repetidas de pular → registradas em `skip_attempts_log`
- Voz opcional → análise de sentimento em tempo real

### Dados Coletados

```json
{
  "user_id": "temp_9237",
  "portal_status": "completo",
  "tempo_visualizacao": 92,
  "skip_tentativas": 0,
  "frequencia_portal": "alta_coerencia",
  "timestamp": "2025-09-08T18:12:53Z"
}
```

## Formulário de Identidade Base + Intenção Vibracional

### Estrutura do Formulário

| Campo | Tipo de Entrada | Regras Técnicas |
|-------|----------------|-----------------|
| nome | Texto aberto | Pode ser real, artístico ou espiritual. Normalizado em UTF-8. |
| data_nascimento | DatePicker | Validada via `age >= 13`. Para menores, aciona fluxo protegido. |
| genero (opcional) | Lista aberta | Opções: ["Masculino", "Feminino", "Outro", "Prefiro não informar"]. IA adapta tom de comunicação. |
| cidade_atual | GPS ou manual | GPS via `navigator.geolocation` com consentimento. Se falhar, input manual obrigatório. |
| intencao_vibracional | Botões sensoriais | Ex.: "Amizades reais", "Conversas profundas", "Afeto leve", "Explorar experiências reais". |
| palavra_energia | Texto livre | Input opcional. Analisado via NLP para sentimento. |

### Regras de Validação

- **Idade < 18 anos** → bloqueio de funcionalidades e ativação de proteção invisível
- **Campos incoerentes** (ex.: linguagem sexual no campo de intenção) → `risk_score += 25`
- **Cidade não localizada** → fallback manual sem bloquear fluxo

### Pré-Vetor Vibracional Inicial

```json
{
  "user_id": "u123",
  "idade": 27,
  "intencao": "Conversas profundas",
  "sentimento": 0.72,
  "vetor_inicial": [0.12, 0.34, 0.56, ...],
  "timestamp": "2025-09-08T18:45:00Z"
}
```

Componentes:
- Análise de sentimento (`sent_score` de -1 a 1)
- Intenção escolhida (categorias pré-mapeadas)
- Palavra-chave → embedding NLP

## Verificação Inteligente (DUC/DCO)

### Tipos de Verificação

| Tipo | Nome Completo | Aplicação | Obrigatoriedade |
|------|--------------|-----------|-----------------|
| DUC | Documento Único de Cidadania | RG, CNH ou documento oficial + selfie | Obrigatório para menores de 18 e criadores de grupo |
| DCO | Documento de Conexão Original | Frase + arquétipo + microteste vibracional | Opcional para maiores de 18 |

### Fluxo Técnico de Verificação

```
flowchart TD
A[Formulário Base Preenchido] --> B{Idade < 18?}
B -->|Sim| C[DUC Obrigatório]
B -->|Não| D[Exibir Benefícios da Verificação]
D --> E{Usuário aceita verificar?}
E -->|Sim| F[Iniciar DCO ou DUC com OCR + FaceMatch]
E -->|Não| G[Seguir com restrições + alertas sutis]
```

### Regras de Segurança e Armazenamento

- **Retenção de documentos**: Máx. 24h
- **Criptografia**: AES-256 em bucket privado (S3/GCP)
- **Exclusão segura**: Método Secure Erase após processamento
- **Resultado armazenado**: Apenas status booleano (`verified = true/false`) e dados extraídos (nome, idade)
- **API terceirizada recomendada**: Unico, idwall ou similar

### Pipeline Técnico DUC

```python
def verificar_duc(user_id, doc, selfie):
    ocr_data = run_ocr(doc)
    face_score = compare_faces(selfie, ocr_data["photo"])
    
    if face_score > 0.85 and validate_doc_integrity(ocr_data):
        approve_verification(user_id, type="DUC")
        enable_verified_features(user_id)
    else:
        log_event(user_id, "duc_failed")
        if attempts(user_id) >= 3:
            trigger_manual_review(user_id)
```

### Alertas Éticos de Segurança

- **Verificado x não verificado**: Mensagem no topo → "Esse perfil ainda não possui verificação. Fique atenta a sinais incoerentes."
- **Dois não verificados**: Chat segue, mas sem suporte da IA nem acesso a áreas críticas
- **Perfil denunciado**: IA ativa monitoramento intensivo invisível

## Teste de Personalidade Energética

### Estrutura Técnica

| Etapa | Componente | Regra Técnica |
|-------|-----------|--------------|
| Início | Geração de `session_token` | Endpoint: `/api/personality/start` |
| Estímulos sensoriais | Imagens, sons, frases | Exibidos em ordem randômica, coletando tempo de resposta |
| Escolhas guiadas | Botões, imagens, múltipla escolha | Salvos em banco como `choice_id + tempo` |
| Tempo de resposta | Milissegundos | Usado como métrica de impulsividade/reflexão |
| Linguagem | NLP em frases livres | Extração de sentimentos + embeddings |
| Interação por áudio (opcional) | Speech-to-text | Processado com modelo ASR + análise de entonação |
| Processamento final | IA Aurah | Gera vetores multidimensionais (512D) |

### Saídas do Teste

```json
{
  "user_id": "u123",
  "personality_vector": [0.14, -0.21, 0.87, ...],  // 512D
  "perfil_dominante": "Guardião Solar",
  "perfil_secundario": "Analítico Introspectivo",
  "confidence_score": 0.82,
  "dominant_traits": ["empatia", "sociabilidade", "curiosidade"]
}
```

## Onboarding pela IA Aurah Kosmos

### Funções do Onboarding

- Apresentação personalizada da plataforma
- Sugestão de primeiras conexões
- Curadoria inicial do feed
- Configuração de preferências
- Tour adaptativo da interface
- Primeiros passos no Jogo da Transmutação

### Adaptação por Perfil

A IA adapta:
- **Tom de comunicação**: Formal, casual, espiritual
- **Ordem de funcionalidades**: Prioriza o que mais ressoa
- **Velocidade do tour**: Rápido ou detalhado
- **Sugestões iniciais**: Baseadas em vetor vibracional

## Ativação de Subsistemas

### Integrações Ativas

| Subsistema | Dados Recebidos | Função |
|-----------|----------------|--------|
| `perfil-e-frequencia-service` | Dados base + vetor inicial | Grava perfil completo |
| `aurah-kosmos-core` | Intenção + palavra + vetor | Prepara onboarding personalizado |
| `feed-sensorial-core` | Vetor + intenção | Recebe primeira curadoria leve |
| `conexoes-reais-service` | Vetor + traits | Ativa tags energéticas iniciais |
| `jogo-transmutacao-service` | Perfil + tendência | Inicia jornada vibracional |
| `mapa-frequencia-service` | Localização + frequência | Ativa presença no mapa |

## Segurança e Compliance

### LGPD
- Consentimento explícito em cada etapa
- Retenção mínima de dados sensíveis
- Exclusão segura após processamento
- Segregação de PII em repositório dedicado
- Auditoria completa de acesso

### Proteção para Menores (<18 anos)

- **DUC obrigatório**
- **IA com restrições**: Sem acesso a locais noturnos, eventos adultos
- **Filtros invisíveis**: Bloqueio automático de conteúdo sensível
- **Monitoramento aumentado**: Sinais de risco ativam alertas
- **Conexões limitadas**: Apenas com perfis verificados e compatíveis

## Observabilidade

### Métricas de Cadastro

- `drop_off_rate`: Taxa de abandono durante cadastro
- `consent_reject_rate`: Quantos recusaram certos opt-ins
- `avg_completion_time_ms`: Tempo médio de finalização
- `profile_completion_distribution`: Distribuição de perfis completos x incompletos
- `verification_rate`: Taxa de verificação DUC/DCO
- `age_distribution`: Distribuição etária
- `risk_score_distribution`: Distribuição de scores de risco

### Logs (ELK Stack)

- Portal sensorial: visualização completa, tentativas de pulo, abandono
- Formulário: campos preenchidos, tempo por campo
- Verificação: tentativas, sucessos, falhas
- Teste energético: tempo total, respostas, hesitações
- Onboarding: interações, engajamento

## Considerações de Implementação

- **Pipeline assíncrono** com filas (RabbitMQ/SQS)
- **OCR terceirizado** para verificação documental
- **NLP embeddings** para análise de intenção
- **Vetorização multidimensional** (512D) para personalidade
- **Redis cache** para sessões ativas
- **PostgreSQL** para dados relacionais
- **Firestore** para dados em tempo real
- **Criptografia end-to-end** para dados sensíveis
- **Logs estruturados** para auditoria completa
