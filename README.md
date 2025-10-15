# FriendApp Core

## Visão Geral

FriendApp é uma plataforma social revolucionária que utiliza IA vibracional, testes de personalidade energética e feed sensorial para criar conexões autênticas e conscientes entre pessoas. O ecossistema combina tecnologias de ponta com princípios de frequência vibracional para uma experiência social transformadora.

## Módulos Principais

### 🧘 Sistema de Cadastro Consciente
Sistema de registro que vai além dos dados básicos, capturando a intenção consciente do usuário e seus objetivos de conexão (romântico, amizade, profissional, espiritual, criativo, aprendizado).

### 🌈 Teste de Personalidade Energética
Avaliação de 10 perguntas que mapeia o perfil energético do usuário em 7 dimensões vibracionais (Solar, Lunar, Terrestre, Aéreo, Aquático, Ígneo, Etéreo) e determina arquétipos e frequência vibracional.

### 🤖 IA Aurah Kosmos
Sistema de IA com 10 camadas de processamento que analisa compatibilidade holística, ressonância vibracional, sincronicidade temporal e matching consciente baseado em intenção e energia.

### 📱 Feed Sensorial
Feed inteligente que combina análise de frequência emocional, tags sensoriais e ranking multi-estágio para entregar conteúdo alinhado com a vibração do usuário.

### 🔗 Sistema de Conexões Autênticas
Matching avançado baseado em compatibilidade energética, alinhamento de intenções e ressonância vibracional (implementação futura).

### 🎮 Jogo da Transmutação
Gamificação para elevação de frequência através de desafios e rituais de transmutação (implementação futura).

### 🗺️ Mapa de Frequência
Visualização geoespacial de energias coletivas e zonas de alta vibração (implementação futura).

## Arquitetura

### Backend (Monolito Modular)

```
backend/
├── node-api/              # API principal (Express + TypeScript)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── cadastro/        # Sistema de Cadastro Consciente
│   │   │   ├── personalidade/   # Teste de Personalidade Energética
│   │   │   └── feed/            # Feed Sensorial
│   │   ├── config/              # Database, Redis, Logger
│   │   ├── middleware/          # Auth, Error Handling
│   │   └── database/            # Schema & Migrations
│   └── Dockerfile
│
├── python-ai/             # IA Aurah Kosmos (FastAPI + NumPy)
│   ├── app/
│   │   ├── services/
│   │   │   └── aurah_service.py # 10 camadas de IA vibracional
│   │   └── api/
│   │       ├── aurah_routes.py  # Endpoints da IA
│   │       └── nlp_routes.py    # Processamento NLP
│   └── Dockerfile
│
└── go-services/           # Serviços de alta performance (Go)
    └── cmd/server/
        └── main.go        # Métricas e operações pesadas
```

### Frontend

```
frontend/
└── flutter-app/           # App mobile (iOS/Android) + Web (PWA)
    └── (a implementar)
```

### Infraestrutura

```
infrastructure/
├── docker/                # Docker Compose para dev local
├── aws/                   # Templates AWS (CloudFormation/Terraform)
└── k8s/                   # Kubernetes manifests (futuro)
```

## Stack Tecnológica

### Backend
- **Node.js API**: Express, TypeScript, PostgreSQL, Redis, JWT
- **Python AI**: FastAPI, NumPy, Scikit-learn, Transformers (HuggingFace)
- **Go Services**: Gin, PostgreSQL, Redis

### Frontend
- **Flutter**: Mobile (iOS/Android) + Web (PWA)

### Infraestrutura
- **Database**: PostgreSQL (dados relacionais)
- **Cache**: Redis (sessões, cache de feed)
- **Containers**: Docker + Docker Compose
- **Cloud**: AWS (preparado para deploy)

## Estrutura do Projeto

```
friendapp-core/
├── backend/
│   ├── node-api/          # API REST principal
│   ├── python-ai/         # IA Aurah Kosmos
│   └── go-services/       # Serviços de performance
├── frontend/
│   └── flutter-app/       # App Flutter
├── infrastructure/        # Docker, AWS, K8s
├── database/              # Migrations e seeds
├── docs/                  # Documentação técnica
├── manuals/               # Manuais dos módulos (PDFs)
└── docker-compose.yml     # Orquestração local
```

## Começando

### Pré-requisitos

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Go 1.21+
- Flutter 3.x (para desenvolvimento mobile/web)

### Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core
```

2. Inicie todos os serviços com Docker:
```bash
docker-compose up -d
```

3. Acesse os serviços:
- **Node API**: http://localhost:3000
- **Python AI**: http://localhost:8000
- **Go Services**: http://localhost:9000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Endpoints Principais

#### Node API (http://localhost:3000)

**Cadastro:**
- `POST /api/v1/cadastro/register` - Registro de usuário
- `POST /api/v1/cadastro/login` - Login
- `GET /api/v1/cadastro/profile` - Perfil do usuário (autenticado)
- `PATCH /api/v1/cadastro/profile` - Atualizar perfil

**Personalidade:**
- `GET /api/v1/personalidade/questions` - Obter perguntas do teste
- `POST /api/v1/personalidade/submit` - Submeter respostas
- `GET /api/v1/personalidade/results` - Ver resultados

**Feed:**
- `POST /api/v1/feed/posts` - Criar post
- `GET /api/v1/feed/posts` - Obter feed personalizado
- `GET /api/v1/feed/posts/:postId` - Ver post específico
- `POST /api/v1/feed/posts/:postId/interact` - Interagir com post

#### Python AI (http://localhost:8000)

- `POST /api/v1/ai/process-personality` - Processar personalidade
- `POST /api/v1/ai/analyze-post` - Analisar post
- `POST /api/v1/ai/calculate-compatibility` - Calcular compatibilidade
- `POST /api/v1/ai/learn-interaction` - Aprender com interação
- `GET /api/v1/ai/layers` - Info sobre as 10 camadas

## Modelo de Dados

### Usuário (User)
- Dados pessoais (email, nome, localização)
- Intenção consciente
- Tipos de conexão desejados
- Vetor energético (7 dimensões)
- Tipo de personalidade
- Score de confiança

### Resultado do Teste (PersonalityTestResult)
- Respostas do usuário
- Vetor energético calculado
- Tipo de personalidade
- Arquétipos (primário/secundário)
- Frequência vibracional

### Post
- Conteúdo e mídias
- Tags sensoriais
- Tom emocional
- Nível de frequência
- Visibilidade (público/conexões/privado)

### Conexão (Connection)
- Par de usuários
- Tipo de conexão
- Scores de compatibilidade
- Alinhamento energético
- Match de intenção

## IA Aurah Kosmos - 10 Camadas

1. **Análise de Intenção Consciente** - Processa intenção declarada
2. **Processamento de Vetor Energético** - Normaliza 7 dimensões
3. **Compatibilidade de Personalidade** - Extrai traços BigFive vibracionais
4. **Análise de Frequência Vibracional** - Mapeia tom emocional para Hz
5. **Matching Contextual** - Combina múltiplos fatores
6. **Predição de Ressonância** - Calcula potencial de conexão
7. **Análise de Padrões Emocionais** - Extrai assinatura emocional
8. **Sincronicidade Temporal** - Analisa timing de interações
9. **Geolocalização Vibracional** - Ressonância geográfica
10. **Score de Confiança Holístico** - Pontuação final integrada

## Roadmap

### Fase 1 - MVP (Atual)
- ✅ Sistema de Cadastro Consciente
- ✅ Teste de Personalidade Energética
- ✅ IA Aurah Kosmos (10 camadas)
- ✅ Feed Sensorial básico
- 🚧 Flutter App (mobile + web)

### Fase 2 - Conexões
- Sistema de Matching Avançado
- Chat com análise de ressonância
- Notificações de sincronicidade

### Fase 3 - Gamificação
- Jogo da Transmutação
- Sistema de rituais e desafios
- Níveis de consciência

### Fase 4 - Visualização
- Mapa de Frequência geoespacial
- Visualização de redes energéticas
- Dashboard de insights vibracionais

## Contribuindo

Este é um projeto proprietário. Contribuições são bem-vindas mediante acordo prévio.

## Licença

PROPRIETARY - Todos os direitos reservados.

## Autora

**Thayssa Gomes**
- Email: thayssa.gomes.oficial@gmail.com
- GitHub: [@thayssagomesoficial-lang](https://github.com/thayssagomesoficial-lang)
