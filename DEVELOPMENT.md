# FriendApp - Guia de Desenvolvimento

## Configuração do Ambiente de Desenvolvimento

### 1. Clonar o Repositório

```bash
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core
```

### 2. Configurar Variáveis de Ambiente

Copie os arquivos `.env.example` e renomeie para `.env`:

```bash
cp backend/node-api/.env.example backend/node-api/.env
cp backend/python-ai/.env.example backend/python-ai/.env
cp backend/go-services/.env.example backend/go-services/.env
```

### 3. Iniciar Serviços com Docker

```bash
docker-compose up -d
```

Isso iniciará:
- PostgreSQL na porta 5432
- Redis na porta 6379
- Node API na porta 3000
- Python AI na porta 8000
- Go Services na porta 9000

### 4. Verificar Status dos Serviços

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f node-api
docker-compose logs -f python-ai
docker-compose logs -f go-services

# Verificar health checks
curl http://localhost:3000/health
curl http://localhost:8000/health
curl http://localhost:9000/health
```

## Desenvolvimento Local sem Docker

### Node API

```bash
cd backend/node-api
npm install
cp .env.example .env
npm run dev
```

### Python AI

```bash
cd backend/python-ai
poetry install
cp .env.example .env
poetry run uvicorn main:app --reload
```

### Go Services

```bash
cd backend/go-services
go mod download
cp .env.example .env
go run cmd/server/main.go
```

## Estrutura de Desenvolvimento

### Adicionando um Novo Módulo no Node API

1. Criar pasta em `backend/node-api/src/modules/nome-modulo/`
2. Criar arquivos:
   - `nome-modulo.types.ts` - Schemas Zod e interfaces TypeScript
   - `nome-modulo.service.ts` - Lógica de negócio
   - `nome-modulo.controller.ts` - Handlers de rotas
   - `nome-modulo.routes.ts` - Definição de rotas

3. Registrar rotas em `backend/node-api/src/index.ts`:
```typescript
import nomeModuloRoutes from './modules/nome-modulo/nome-modulo.routes';
app.use('/api/v1/nome-modulo', nomeModuloRoutes);
```

### Adicionando um Novo Serviço de IA

1. Criar serviço em `backend/python-ai/app/services/novo_service.py`
2. Criar rotas em `backend/python-ai/app/api/novo_routes.py`
3. Registrar no `main.py`:
```python
from app.api import novo_routes
app.include_router(novo_routes.router, prefix="/api/v1/novo", tags=["Novo"])
```

### Migrations de Banco de Dados

As tabelas são criadas automaticamente na inicialização do Node API.

Para adicionar novas tabelas, edite `backend/node-api/src/database/init.ts`.

## Fluxo de Trabalho

### 1. Cadastro de Usuário

```bash
curl -X POST http://localhost:3000/api/v1/cadastro/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456",
    "name": "Teste User",
    "birthDate": "1990-01-01",
    "consciousIntention": "Busco conexões autênticas para crescimento espiritual",
    "seekingConnections": ["spiritual", "friendship"]
  }'
```

Resposta:
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/api/v1/cadastro/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456"
  }'
```

### 3. Obter Perguntas do Teste de Personalidade

```bash
curl http://localhost:3000/api/v1/personalidade/questions
```

### 4. Submeter Teste de Personalidade

```bash
curl -X POST http://localhost:3000/api/v1/personalidade/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "testVersion": "v1.0",
    "answers": [
      {"questionId": "q1", "answer": "alone"},
      {"questionId": "q2", "answer": "process_alone"},
      {"questionId": "q3", "answer": "intuition"},
      {"questionId": "q4", "answer": ["growth", "connection"]},
      {"questionId": "q5", "answer": "mediate"},
      {"questionId": "q6", "answer": "nonverbal"},
      {"questionId": "q7", "answer": "timeless"},
      {"questionId": "q8", "answer": "feeling"},
      {"questionId": "q9", "answer": ["artistic", "healing"]},
      {"questionId": "q10", "answer": ["depth", "spiritual"]}
    ]
  }'
```

### 5. Criar um Post no Feed

```bash
curl -X POST http://localhost:3000/api/v1/feed/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "content": "Hoje senti uma conexão profunda com a natureza durante minha meditação matinal",
    "sensorialTags": ["energetico", "emocional"],
    "emotionTone": "paz",
    "visibility": "public"
  }'
```

### 6. Obter Feed Personalizado

```bash
curl -X GET "http://localhost:3000/api/v1/feed/posts?limit=20&offset=0" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 7. Interagir com Post

```bash
curl -X POST http://localhost:3000/api/v1/feed/posts/POST_ID/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "interactionType": "like",
    "durationSeconds": 45,
    "emotionReaction": "gratidao"
  }'
```

## Testando a IA Aurah Kosmos

### Verificar Camadas da IA

```bash
curl http://localhost:8000/api/v1/ai/layers
```

### Processar Personalidade

```bash
curl -X POST http://localhost:8000/api/v1/ai/process-personality \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "energyVector": {
      "dimensions": {
        "solar": 0.2,
        "lunar": 0.8,
        "terrestre": 0.3,
        "aereo": 0.5,
        "aquatico": 0.7,
        "igneo": 0.1,
        "etereo": 0.9
      },
      "magnitude": 1.5,
      "dominantElement": "etereo"
    },
    "personalityType": "Transcendente"
  }'
```

### Calcular Compatibilidade

```bash
curl -X POST http://localhost:8000/api/v1/ai/calculate-compatibility \
  -H "Content-Type: application/json" \
  -d '{
    "user1Id": "user1-uuid",
    "user2Id": "user2-uuid",
    "user1Data": {
      "energy_vector": { ... },
      "conscious_intention": "...",
      "location": {"city": "São Paulo", "state": "SP"}
    },
    "user2Data": {
      "energy_vector": { ... },
      "conscious_intention": "...",
      "location": {"city": "São Paulo", "state": "SP"}
    }
  }'
```

## Comandos Úteis

### Docker

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpar banco de dados)
docker-compose down -v

# Reconstruir imagens
docker-compose build

# Ver logs em tempo real
docker-compose logs -f

# Entrar em um container
docker-compose exec node-api sh
docker-compose exec python-ai sh
docker-compose exec postgres psql -U friendapp
```

### Banco de Dados

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U friendapp

# Dentro do psql:
\dt              # Listar tabelas
\d users         # Descrever tabela users
SELECT * FROM users;
```

### Redis

```bash
# Conectar ao Redis
docker-compose exec redis redis-cli

# Dentro do redis-cli:
KEYS *           # Listar todas as chaves
GET feed:user-id:20:0
```

## Troubleshooting

### Porta já em uso

Se alguma porta já estiver em uso, edite o `docker-compose.yml` e mude a porta externa:

```yaml
ports:
  - "3001:3000"  # Usar 3001 no host, 3000 no container
```

### Banco de dados não conecta

Verifique se o PostgreSQL está rodando:
```bash
docker-compose ps postgres
docker-compose logs postgres
```

### Node API não inicia

Verifique os logs:
```bash
docker-compose logs node-api
```

Comum: falta do arquivo `.env` ou dependências não instaladas.

### Python AI falha ao iniciar

Pode ser falta de dependências. Reconstrua a imagem:
```bash
docker-compose build python-ai
docker-compose up -d python-ai
```

## Contribuindo

1. Crie uma branch: `git checkout -b feature/nome-da-feature`
2. Faça commit das mudanças: `git commit -m 'feat: adiciona nova feature'`
3. Push para a branch: `git push origin feature/nome-da-feature`
4. Abra um Pull Request

### Convenção de Commits

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção
