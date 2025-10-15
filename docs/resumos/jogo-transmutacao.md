# Resumo Técnico: Jogo da Transmutação e Elevação Vibracional

## Visão Geral

O Jogo da Transmutação é o núcleo dinâmico de engajamento do FriendApp, responsável por transformar interações sociais em evolução mensurável através de XP, níveis, jornadas e selos. Opera com equilíbrio entre estímulo, significado e saúde mental, evitando mecanismos de vício.

## Propósito Técnico

### Objetivos
- Converter dados comportamentais, emocionais e contextuais em progresso simbólico
- Garantir baixo acoplamento e alta coerência entre módulos
- Escalar horizontalmente sob alta carga de eventos
- Operar de forma transparente, auditável e anti-vício
- Integrar-se com IA Aurah Kosmos, RA e Mapa de Frequência

## Arquitetura Sistêmica

### Engines Principais

| Engine | Função Técnica | Input | Output |
|--------|---------------|-------|--------|
| Game Engine Core | Processa lógica de XP, missões e jornadas | Eventos do ecossistema (Feed, Chat, RA) | Recompensas e status de progresso |
| Aurah Decision Engine | IA contextual que sugere e personaliza missões | Dados vibracionais, perfil e jornada | Missão recomendada, ajustes de dificuldade |
| Rewards Engine | Calcula recompensas (FriendCoins, selos, níveis) | Output do Game Engine | Atualização no perfil e painel do usuário |
| Security & Validation Engine | Valida integridade das missões (GPS, RA, antifraude) | Logs de execução | Flags, bloqueios e auditoria |
| Observability Engine | Monitora performance, métricas e comportamento | Telemetria e logs | Painéis e alertas |

### Padrões de Comunicação
- **Eventos Assíncronos**: Kafka/PubSub para XP e missões
- **REST APIs**: Operações diretas (painel, IA Aurah, administração)
- **WebSockets**: Atualizações em tempo real (níveis, feedbacks)
- **gRPC interno**: Entre microserviços de alta frequência

### Infraestrutura
- **Hospedagem**: Kubernetes (GKE/EKS) com autoescalonamento horizontal
- **Banco principal**: PostgreSQL (XP, logs, missões, status)
- **Cache**: Redis (progressos e sessões)
- **Fila**: Kafka (eventos e notificações)
- **Observabilidade**: Prometheus + Grafana
- **Integração IA**: API `/aurah/game-context`

## Modelo Matemático

### Fórmula de XP Total

```
XP_total = Σ XP_i = Σ B_i · W_journey · M_aurah · M_social · D_rep
```

Onde:
- **B_i**: XP base da ação (ex: 10 pontos por check-in)
- **W_journey**: Multiplicador da jornada ativa (1.0–1.3)
- **M_aurah**: Fator ajustado pela IA Aurah (σ(αc - βs))
- **M_social**: Fator de conexões autênticas simultâneas (até 1.5x)
- **D_rep**: Decaimento por repetição (mínimo 0.4)

### Ciclo de Transmutação

Cada interação passa por quatro fases: **Ação → Reflexão → Integração → Expansão**

```
E_trans(t) = ∫[t0→t] (α·A(t) - β·R(t)) dt
```

Onde:
- **A(t)**: Taxa de ações significativas (check-ins, missões, conexões)
- **R(t)**: Taxa de repetições não evolutivas (loops sem aprendizado)
- **α**: Coeficiente de absorção (0.7 a 1.2)
- **β**: Coeficiente de desgaste (0.3 a 0.8)

**Interpretação**:
- `E_trans(t) > 0`: Jogador está evoluindo (fase ascendente)
- `E_trans(t) < 0`: Estado de saturação (IA recomenda pausa ou jornada alternativa)

## Jornadas Vibracionais

### Estrutura de Jornada

```json
{
  "journey_id": "JV_EXPRESSAO_CR",
  "title": "Jornada da Expressão Criativa",
  "description": "Explorar o poder da autenticidade e da autoexpressão.",
  "type": "expressiva",
  "level_range": [1, 10],
  "mission_pool": ["M_POSTAR_MOMENTO", "M_EVENTO_ARTISTICO", "M_COLAB_VISUAL"],
  "duration_days": 14,
  "aurah_alignment": "alta",
  "status": "active",
  "progress": 0.45
}
```

### Classes de Missões

| Classe | Descrição | Tipo de Interação | Peso (w) | Multiplicador (M) |
|--------|-----------|-------------------|----------|-------------------|
| Individual | Introspectivas, autoanálise, desafios pessoais | Self | 0.25 | 1.0 |
| Social | Conexões e interações autênticas com outros | Interpessoal | 0.30 | 1.2 |
| Coletiva | Participações em grupos, eventos ou causas | Comunitária | 0.30 | 1.3 |
| Imersiva (RA) | Experiências híbridas (realidade aumentada e sensorial) | Físico-digital | 0.15 | 1.4 |

### Cálculo de Progresso de Jornada

```
P_j = (Σ XP_i · w_i · M_i) / (Σ w_i)
```

A jornada é considerada completa quando `P_j ≥ 0.95`

## Balanceamento de Recompensas

### Curva Logística Suavizada

```
XP_gain(n) = XP_max · [1 / (1 + e^(-k(n - n_0)))]
```

Onde:
- **XP_max**: Limite máximo de XP em um período
- **n**: Número de missões executadas
- **k**: Taxa de crescimento (0.2–0.4)
- **n_0**: Ponto médio (reduz ganho excessivo)

**Efeito**: Progressão rápida no início, estável no meio, leve desaceleração nas fases finais (evita saturação psicológica)

## Controle de Saturação Dinâmica

### Índice de Densidade de Estímulos

```
S_load = (M_ativas + 0.5 · M_pendentes) / C_pessoal

σ_s = 1 / (1 + e^(-λ(S_load - S_0)))
```

Onde:
- **M_ativas**: Número de missões ativas
- **M_pendentes**: Missões em espera
- **C_pessoal**: Capacidade estimada do jogador (IA define de 3–7)
- **σ_s**: Índice de saturação (0–1)

### Política de Saturação

| Condição | Ação |
|----------|------|
| σ_s < 0.6 | Comportamento normal |
| 0.6 ≤ σ_s < 0.8 | Reduzir novas missões |
| σ_s ≥ 0.8 | IA Aurah pausa geração automática |

## Regeneração de Energia

### Função de Reposição

```
E_rec(t) = E_max(1 - e^(-μt))
```

Onde **μ** é a taxa de recuperação individual, calibrada por IA (0.05–0.15)

A IA aprende o padrão pessoal de regeneração do usuário para calibrar futuras jornadas.

## Princípios Fundamentais

1. **Transparência Operacional**: Tudo auditável, sem processos ocultos
2. **Controle de Saturação**: IA monitora carga emocional e pausa estímulos
3. **Evolução Personalizada**: Cada jogador segue sua própria Jornada Vibracional
4. **Neutralidade Ética**: Sem algoritmos de vício ou looping infinito

## Segurança e Validação

### Validação de Missões
- **GPS**: Verificação de localização para check-ins
- **RA**: Validação de experiências em realidade aumentada
- **Antifraude**: Detecção de padrões suspeitos
- **Auditoria**: Logs completos de execução

### Observabilidade

**Métricas (Prometheus/Grafana)**:
- Taxa de conclusão de missões
- Tempo médio por jornada
- Índice de saturação médio
- Taxa de abandono de missões
- Distribuição de XP por usuário

**Logs e Tracing**:
- OpenTelemetry com trace_id propagado
- Eventos de missões completadas
- Alertas de saturação
- Flags de segurança

## Integração com Ecossistema

O Jogo da Transmutação recebe eventos de:
- **Feed Sensorial**: Posts, interações
- **Chat**: Conversas autênticas
- **RA**: Experiências imersivas
- **Mapa de Frequência**: Check-ins, estados vibracionais
- **Sistema de Conexões**: Interações sociais

E alimenta:
- **Perfil do Usuário**: XP, níveis, selos
- **IA Aurah Kosmos**: Dados de evolução
- **Recompensas**: FriendCoins, badges
- **Mapa de Frequência**: Estado evolutivo

## Considerações de Implementação

- **Event-driven architecture** para escalabilidade
- **Microserviços isolados** para cada engine
- **Cache Redis** para performance
- **Kafka** para mensageria assíncrona
- **PostgreSQL** para persistência confiável
- **WebSockets** para atualizações em tempo real
- **Kubernetes** para orquestração e escala
- **Prometheus + Grafana** para monitoramento completo
