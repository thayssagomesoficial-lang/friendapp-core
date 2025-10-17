# Sistema Econômico, Monetização e FriendCoins (FriendApp)

## Resumo Executivo

O Sistema Econômico do FriendApp é a infraestrutura que sustenta a circulação energética e financeira do ecossistema, equilibrando propósito vibracional com sustentabilidade real. Baseado no conceito de **Economia da Consciência**, o sistema utiliza a moeda interna FriendCoins (FC) para recompensar impacto autêntico (não apenas ação), prevenir grinding através de algoritmos antifraude, e gerar receita via Premium, eventos pagos, locais parceiros e doações.

## Princípio Filosófico

### Economia da Consciência
- Toda transação representa circulação energética, não apenas valor digital
- **FriendCoins (FC)**: moeda interna não convertível em dinheiro real, mas com valor funcional concreto no ecossistema
- Ganho de moedas ponderado pelo **impacto vibracional**, não apenas pela ação

### Equilíbrio: Impacto > Ação

**Fórmula Base:**
```
FriendCoins_Ganho = (Peso_Ação * Índice_Impacto) * Fator_Aleatório
```

**Onde:**
- **Peso_Ação**: valor inicial de referência (ex: criar Bora = 10)
- **Índice_Impacto**: score medido pela IA Aurah Kosmos (0.0 a 2.0)
- **Fator_Aleatório**: componente surpresa (0.8 a 1.2) que garante imprevisibilidade

### Controle Anti-Grinding
- Recompensas decrescem em interações repetitivas
- Exemplo: 10 interações seguidas com mesmo contato → 100%, 80%, 60%... até mínimo de 10%
- IA Antifraude analisa grafo social (Neo4j) para detectar clusters de farming

### Princípio do Presente
IA Aurah Kosmos pode premiar com bônus surpresa:
> "Sua interação com [Nome] atingiu uma harmonia rara. O universo reconhece e você recebe +50 FCs."

## Arquitetura Geral do Sistema

### Componentes Principais

#### 1. Moeda Interna — FriendCoins (FC)
**Ganho por:**
- Check-ins vibracionais
- Eventos e Bora
- Desafios e missões
- Indicações aceitas
- Posts com alto impacto

**Uso:**
- Benefícios no app (boosts, filtros)
- Ingressos de eventos
- Experiências comerciais
- Skins e efeitos de RA
- Stickers e emojis vibracionais

**Armazenamento**: `users_wallet` (Firestore + PostgreSQL)

#### 2. Plano Premium
**Ativação**: RevenueCat / Chargebee  
**Benefícios:**
- Feed completo sem limitações
- Filtros avançados de frequência
- Eventos exclusivos
- Check-in duplo (2x FriendCoins)
- Jogos ilimitados (Transmutação)
- Prioridade em conexões

**Estados**: Ativo, Pendente, Cancelado, Expirado

#### 3. Sistema de Indicação
- **11 convites aceitos = 1 mês Premium grátis + FriendCoins extras**
- Rastreado em `transactions_log` com hash único de convite
- Recompensas progressivas para indicadores frequentes

#### 4. Monetização de Locais Parceiros
- Locais pagam por destaque em mapa, feed e eventos
- Contratos e pagamentos em `partners_payments` (PostgreSQL)
- Modelos: mensal, por clique, por conversão

#### 5. Eventos Pagos
- Usuário cria eventos pagos em FC ou moeda real
- FriendApp retém % configurável da transação
- Sistema de reembolso para cancelamentos

#### 6. Sistema de Doações
- Dinheiro real ou FC para causas sociais
- 100% rastreável em `donations_log`
- Certificados de impacto vibracional

## Arquitetura de Dados

### Banco Híbrido

#### Firestore (NoSQL) - Tempo Real
```json
{
  "users_wallet": {
    "user_id": "UUID",
    "saldo_FC": 230,
    "status_premium": "ativo",
    "ultima_transacao": "2025-09-13T14:20:00Z",
    "checkins_ativos": 3
  },
  "active_benefits": {
    "user_id": "UUID",
    "beneficio": "checkin_duplo",
    "expira_em": "2025-09-20T23:59:59Z"
  }
}
```

#### PostgreSQL (SQL) - Histórico e Logs
```sql
CREATE TABLE transactions_log (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo VARCHAR(50), -- ganho, gasto, doacao, upgrade
  valor INT NOT NULL,
  indice_impacto FLOAT,
  fator_surpresa FLOAT,
  reducao_repeticao FLOAT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE partners_payments (
  id SERIAL PRIMARY KEY,
  partner_id UUID NOT NULL,
  valor NUMERIC(10,2),
  status VARCHAR(20), -- pendente, pago, falhou
  contrato JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE donations_log (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  destino VARCHAR(100),
  valor INT,
  moeda VARCHAR(10), -- FC ou BRL
  auditoria_hash VARCHAR(64),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

#### Neo4j (Grafo) - Análise Antifraude
**Nós**: Usuários, Locais, Eventos  
**Arestas**: Interações, Doações, Indicações

**Query para detectar farming:**
```cypher
MATCH (u:User)-[:INTERAGE_COM]->(v:User)
WITH u, collect(v) as conexoes
WHERE size(conexoes) < 3
RETURN u
```

### Integração entre Bancos
- **Firestore → PostgreSQL**: replicação assíncrona a cada transação
- **PostgreSQL → Neo4j**: batch diário para análise antifraude
- **Fallback**: se Firestore cai, PostgreSQL assume em modo degradado

## Modelagem Matemática de Recompensas

### Fórmula Completa
```
FC_Ganho = (Peso_Ação * Índice_Impacto * Fator_Surpresa) * Redução_Repetição
```

### Variáveis Detalhadas

#### Peso_Ação (PA)
Valores de referência:
- Post no Feed: **4 FC**
- Check-in: **5 FC**
- Participar de evento: **10 FC**
- Criar Bora: **12 FC**
- Indicar amigo: **15 FC**
- Completar missão: **20 FC**

#### Índice_Impacto (II)
Métrica de qualidade vibracional (0.0 a 2.0):
```
II = (Feedback_Pos + Engajamento_Autêntico + Resposta_Vibracional) / 3
```

**Componentes:**
- **Feedback_Pos**: média de avaliações positivas (0 a 2)
- **Engajamento_Autêntico**: proporção de respostas genuínas ÷ totais
- **Resposta_Vibracional**: score de harmonia calculado pela IA Aurah Kosmos (0 a 2)

#### Fator_Surpresa (FS)
- Randomizado pela IA: **0.8 a 1.2**
- Evita previsibilidade
- Incentiva experiências mágicas

#### Redução_Repetição (RR)
```
RR = 1 / (1 + ln(N_interações_mesmas))
```
- **N_interações_mesmas**: número de vezes que o mesmo par interagiu nas últimas 72h
- Evita farming entre pares fixos

### Exemplos Práticos

#### Exemplo 1: Check-in em local parceiro (primeira vez)
```
PA = 5
II = 1.4
FS = 1.1
RR = 1 (primeira vez)

FC_Ganho = (5 * 1.4 * 1.1) * 1 = 7.7 ≈ 8 FC
```

#### Exemplo 2: Post no Feed com baixo impacto
```
PA = 4
II = 0.5
FS = 1.0
RR = 1

FC_Ganho = (4 * 0.5 * 1.0) * 1 = 2 FC
```

#### Exemplo 3: Evento repetido com mesmo grupo
```
PA = 10
II = 1.6
FS = 0.9
RR = 0.5

FC_Ganho = (10 * 1.6 * 0.9) * 0.5 = 7.2 ≈ 7 FC
```

### Ajustes Dinâmicos

#### Controle de Inflação
- IA ajusta `Peso_Ação` em tempo real se detectar excesso de moedas circulando
- Monitoramento de oferta total vs. demanda
- Queima automática de moedas não utilizadas (após 1 ano)

#### Recompensas Surpresa
- Bônus aleatórios (+50 FC) quando interações alcançam picos de harmonia
- IA Aurah Kosmos identifica momentos de conexão profunda
- Mensagens personalizadas acompanham o presente

#### Missões Semanais
- Incentivos extras para estimular gasto e evitar estagnação
- Rotação automática de desafios
- Recompensas progressivas

## Pipeline Operacional

### Fluxo de Processamento Econômico

```
[Entrada de Dados]
  ↓
[IA Econômica] → Calcula recompensas (fórmula)
  ↓
[IA Antifraude] → Valida autenticidade
  ↓
[Controle de Inflação] → Ajusta pesos dinâmicos
  ↓
[Firestore] → Atualiza saldo em tempo real
  ↓
[PostgreSQL] → Registra log auditável
  ↓
[Observabilidade] → Atualiza dashboards
  ↓
[Saída] → FriendCoins creditadas/debitadas
```

### Fontes de Entrada
1. Check-ins vibracionais
2. Posts no feed sensorial
3. Participação em eventos
4. Doações (FC ou moeda real)
5. Indicações aceitas
6. Compras via gateway de pagamento

### Formato Padrão de Request
```json
{
  "user_id": "UUID",
  "acao": "checkin_local",
  "timestamp": "2025-09-15T16:05:23Z",
  "contexto": {
    "local_id": "UUID",
    "impacto": 1.4,
    "fator_surpresa": 1.1
  }
}
```

### Processamento em Camadas

#### 1. IA Econômica
- Calcula recompensas conforme fórmula da Camada 2
- Ajusta pesos dinâmicos para evitar inflação
- Latência: < 100ms

#### 2. IA Antifraude
- Analisa padrões de grafo social (Neo4j)
- Detecta clusters suspeitos
- Bloqueia transações fraudulentas
- Latência: < 200ms

#### 3. Controle de Inflação
- Monitora oferta total de FriendCoins
- Ajusta pesos automaticamente
- Queima moedas inativas

#### 4. Registro e Auditoria
- Log completo em PostgreSQL
- Replicação para Firestore
- Hash de auditoria (SHA-256)

## Segurança e Antifraude

### Blindagem Contra Abusos

#### IA Antifraude
- Análise de grafo social (Neo4j) para detectar clusters fechados
- Detecção de padrões de farming (interações perfeitas repetidas)
- Bloqueio automático de contas suspeitas
- Logs auditáveis em `transactions_log`

#### Retornos Decrescentes
Aplicados automaticamente após repetição:
- 1ª interação: 100%
- 2ª interação: 90%
- 3ª interação: 80%
- ...
- 10ª+ interação: 10% (mínimo)

#### Validação de Identidade
- Usuários verificados (DUC/DCO) têm peso maior
- Não verificados têm limites de transação diários
- Proteção extra para menores de idade

### Segurança Técnica

#### Criptografia
- **Em trânsito**: TLS 1.3
- **Em repouso**: AES-256
- **Logs financeiros**: criptografados com chaves rotativas

#### Firewall Econômico
- Rate limiting por usuário (ex: máx 100 transações/dia)
- Detecção de padrões anômalos (velocidade, valor, frequência)
- Bloqueio automático de bots

#### Compliance
- **LGPD / GDPR**: dados financeiros anonimizados para análise
- **Auditoria**: retenção de logs por 5 anos
- **Rastreabilidade**: 100% das transações com hash SHA-256

## Monetização e Sustentabilidade

### Fontes de Receita

#### 1. Plano Premium
- **Valor sugerido**: R$ 19,90/mês ou R$ 199/ano
- **Taxa de conversão esperada**: 10-15%
- **Benefícios exclusivos**: feed completo, eventos, check-in duplo

#### 2. Eventos Pagos
- **Comissão**: 15% sobre ingressos vendidos
- **Pagamento**: FC ou moeda real (Pix, cartão)
- **Reembolso**: até 24h antes do evento

#### 3. Locais Parceiros
- **Modelo mensal**: R$ 500-2000/mês (destaque no mapa)
- **Modelo por clique**: R$ 2-5 por clique
- **Modelo por conversão**: 10% do valor de check-in

#### 4. Marketplace de Experiências
- **Comissão**: 20% sobre experiências vendidas
- **Pagamento**: FC ou moeda real
- **Categorias**: workshops, retiros, eventos especiais

#### 5. Doações para Causas
- **FriendApp não retém**: 100% vai para a causa
- **Benefício indireto**: engajamento e impacto social
- **Certificados**: emitidos com hash blockchain

### Projeção de Receita (Ano 1)

**Premissas:**
- 100.000 usuários ativos
- 12% conversão Premium
- 5.000 eventos pagos/mês
- 200 locais parceiros

**Receita Mensal Estimada:**
- Premium: R$ 238.800 (12.000 × R$ 19,90)
- Eventos: R$ 75.000 (comissão 15%)
- Locais Parceiros: R$ 200.000
- **Total: R$ 513.800/mês**

**Receita Anual Estimada: R$ 6,1 milhões**

## Painel Sensorial Econômico

### Visibilidade ao Usuário

```json
{
  "saldo_FC": 230,
  "status_premium": "ativo",
  "expira_em": "2025-12-31",
  "historico_7_dias": [
    { "data": "2025-10-14", "ganho": 45, "gasto": 10 },
    { "data": "2025-10-13", "ganho": 30, "gasto": 5 }
  ],
  "insights": [
    "Você ganhou 15% mais FCs esta semana!",
    "Seu impacto vibracional está acima da média.",
    "3 missões semanais disponíveis."
  ],
  "missoes_disponiveis": [
    {
      "titulo": "Guardião da Vibração",
      "recompensa": 50,
      "progresso": "2/5"
    }
  ],
  "indicacoes": {
    "aceitas": 7,
    "faltam_para_premium": 4
  }
}
```

### Dicas Contextuais
Painel mostra educação prática, sem revelar fórmulas exatas:
- "Check-ins com alto impacto geram mais FCs!"
- "Eventos autênticos são recompensados generosamente."
- "Interações repetitivas geram menos moedas."

## Diretrizes de Execução Econômica

### Medidas Concretas de Variáveis

#### Frequência_Energética
```
score vibracional médio do usuário nas últimas 24h (0 a 100)
```

#### Tempo_Consciente
```
tempo ativo (toques, digitação, interação real) ÷ tempo total app aberto
```

#### Índice_Impacto
```
(Feedback Positivo + Resposta Vibracional + Engajamento Autêntico) ÷ 3
```

### Educação do Usuário
- Painel Sensorial com dicas contextuais
- Sem revelar fórmulas exatas
- Educação prática e gradual
- Transparência sem gamificação

## Microserviços Econômicos

### 1. economia-service
- Cálculo de recompensas
- Controle de inflação
- Ajuste dinâmico de pesos

### 2. antifraude-service
- Análise de grafo social
- Detecção de farming
- Bloqueio de contas suspeitas

### 3. premium-service
- Gerenciamento de assinaturas
- Integração com RevenueCat/Chargebee
- Controle de benefícios ativos

### 4. wallet-service
- Saldo em tempo real (Firestore)
- Transações e histórico (PostgreSQL)
- Sincronização entre bancos

### 5. partners-service
- Contratos e pagamentos
- Destaque em mapa e feed
- Análise de performance

## Observabilidade Econômica

### Dashboards (Grafana)
- Saldo total de FCs em circulação
- Taxa de inflação/deflação
- Transações por segundo
- Distribuição de saldos
- Conversão Premium
- Receita por fonte

### Métricas Críticas
```
- transacoes_processadas/s: ~500
- latencia_calculo_fc: <100ms
- taxa_fraude_detectada: ~0.1%
- usuarios_premium: monitorado
- receita_mensal: monitorado
```

### Alertas Automáticos
- Inflação acima de 5% ao mês
- Spike de transações fraudulentas
- Queda de conversão Premium
- Falha em gateway de pagamento

## Integração com Outros Módulos

### IA Aurah Kosmos
- Calcula Índice_Impacto para cada ação
- Atribui Fator_Surpresa
- Identifica momentos de harmonia (presentes)

### Feed Sensorial
- Posts de alto impacto geram mais FCs
- FCs usados para boosts de visibilidade
- Curadoria influenciada por saldo

### Sistema de Conexões
- Conexões autênticas aumentam Índice_Impacto
- FCs usados para destacar perfil
- Indicações recompensadas com FC + Premium

### Eventos e Bora
- Criação e participação geram FCs
- Eventos pagos com comissão
- Organizadores com selos ganham mais

### Locais Parceiros
- Check-ins geram FCs (com multiplicadores)
- Locais pagam por destaque
- Experiências comerciais vendidas com FC

### Mapa de Frequência
- Check-ins vibracionais recompensados
- FCs usados para desbloquear áreas especiais
- Frequência energética influencia ganhos

## Métricas de Sucesso

### KPIs Técnicos
- Latência de cálculo de FC: < 100ms
- Uptime do sistema: > 99.9%
- Taxa de detecção de fraude: > 95%
- Sincronização Firestore↔PostgreSQL: < 1s

### KPIs de Experiência
- Satisfação com transparência: > 4.5/5
- Compreensão do sistema: > 80%
- Engajamento com missões: > 60%
- Retenção de usuários Premium: > 70%

### KPIs Financeiros
- Conversão Premium: > 12%
- Receita por usuário (ARPU): > R$ 5/mês
- Taxa de cancelamento Premium: < 5%/mês
- ROI de parceiros: > 300%

## Diferenciais Competitivos

1. **Impacto > Ação**: recompensas baseadas em qualidade, não quantidade
2. **Economia da Consciência**: moeda representa circulação energética
3. **Anti-Grinding**: retornos decrescentes e IA antifraude
4. **Presentes da Aurah**: bônus surpresa em momentos de harmonia
5. **Transparência**: painel educativo sem revelar fórmulas exatas
6. **Sustentabilidade**: múltiplas fontes de receita sem comprometer propósito

## Roadmap de Implementação

### Fase 1 - MVP (Meses 1-3)
- Sistema básico de FriendCoins
- Fórmula de recompensas simplificada
- Plano Premium com RevenueCat
- Wallet em Firestore + PostgreSQL

### Fase 2 - Expansão (Meses 4-6)
- IA Antifraude com Neo4j
- Sistema de indicações completo
- Locais parceiros
- Controle de inflação dinâmico

### Fase 3 - Refinamento (Meses 7-12)
- Eventos pagos
- Marketplace de experiências
- Doações para causas
- Painel econômico avançado
- Presentes da Aurah automatizados

---

**Versão**: 1.0  
**Última atualização**: 2025-10-15  
**Módulo**: Sistema Econômico, Monetização e FriendCoins  
**Dependências**: IA Aurah Kosmos, Feed Sensorial, Sistema de Conexões, Eventos e Bora, Locais Parceiros, Mapa de Frequência
