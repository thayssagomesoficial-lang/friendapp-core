# FriendApp Core - Setup Guide

Este guia contém instruções completas para configurar o FriendApp Core localmente em Windows, macOS e Linux.

## 📋 Pré-requisitos

### Windows

1. **Docker Desktop para Windows**
   - Baixe em: https://www.docker.com/products/docker-desktop
   - Instale e certifique-se de que o WSL 2 está habilitado
   - Execute Docker Desktop e aguarde iniciar completamente

2. **Git para Windows**
   - Baixe em: https://git-scm.com/download/win
   - Durante a instalação, selecione "Git from the command line and also from 3rd-party software"

3. **Node.js (Opcional - apenas para testes locais)**
   - Baixe em: https://nodejs.org/ (versão LTS)
   - Instale incluindo npm

4. **Flutter (Opcional - para Admin Debug UI)**
   - Baixe em: https://flutter.dev/docs/get-started/install/windows
   - Adicione Flutter ao PATH do sistema

### macOS

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Docker Desktop
brew install --cask docker

# Instalar ferramentas
brew install git node
```

### Linux (Ubuntu/Debian)

```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Node.js (opcional)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🚀 Início Rápido (Windows)

### Passo 1: Clonar o Repositório

Abra o **PowerShell** ou **Git Bash** e execute:

```bash
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core
```

### Passo 2: Configurar Variáveis de Ambiente (Opcional)

O projeto vem com configurações padrão que funcionam imediatamente. Se quiser customizar:

```bash
# Copie o arquivo de exemplo (Windows PowerShell)
copy .env.example .env

# OU no Git Bash / Linux / macOS
cp .env.example .env
```

Edite `.env` com suas preferências (opcional).

### Passo 3: Iniciar Todos os Serviços

#### Windows (PowerShell ou CMD):

```bash
docker-compose up -d
```

#### Usando Make (Git Bash no Windows / macOS / Linux):

```bash
make up
```

Aguarde alguns minutos para que todos os serviços iniciem. Você verá mensagens de log indicando o progresso.

### Passo 4: Verificar Saúde dos Serviços

#### Opção 1: Smoke Test Automatizado

```bash
# Windows Git Bash / Linux / macOS
bash scripts/smoke-test.sh

# Ou usando Make
make smoke-test
```

#### Opção 2: Verificação Manual

Abra seu navegador e acesse:

- **API Gateway**: http://localhost:3000/health
- **Selos Service**: http://localhost:3004/health
- **Verificação Service**: http://localhost:3005/health
- **Reputação Service**: http://localhost:3006/health
- **Segurança Service**: http://localhost:3007/health
- **Economia Service**: http://localhost:3008/health
- **Antifraude Service**: http://localhost:3009/health
- **Prometheus**: http://localhost:9090

Todos devem retornar `{"status":"healthy"}`.

### Passo 5: Acessar Admin Debug UI (Opcional)

```bash
cd frontend/admin-debug
flutter pub get
flutter run -d chrome
```

A UI será aberta no navegador em http://localhost:xxxxx (porta variável).

## 📊 Mapa de Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| API Gateway | 3000 | http://localhost:3000 |
| Selos Service | 3004 | http://localhost:3004 |
| Verificação Service | 3005 | http://localhost:3005 |
| Reputação Service | 3006 | http://localhost:3006 |
| Segurança Vibracional | 3007 | http://localhost:3007 |
| Economia Service | 3008 | http://localhost:3008 |
| Antifraude Service | 3009 | http://localhost:3009 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| Neo4j Browser | 7474 | http://localhost:7474 |
| Neo4j Bolt | 7687 | bolt://localhost:7687 |
| Prometheus | 9090 | http://localhost:9090 |

## 🧪 Executar Testes E2E

### Pré-requisito: Instalar Newman

```bash
# Windows / macOS / Linux
npm install -g newman
```

### Executar Testes

```bash
# Opção 1: Usando Newman diretamente
newman run tests/postman/friendapp-core.postman_collection.json

# Opção 2: Usando npm script
npm run test:newman

# Opção 3: Usando Make (Git Bash / Linux / macOS)
make test
```

## 🛠️ Comandos Úteis

### Parar Todos os Serviços

```bash
# Docker Compose
docker-compose down

# Make
make down
```

### Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f api-gateway
docker-compose logs -f selos-service

# Make
make logs
```

### Limpar Tudo (Incluindo Volumes)

```bash
# Docker Compose
docker-compose down -v

# Make
make clean
```

### Rebuild dos Serviços

```bash
# Docker Compose
docker-compose build
docker-compose up -d

# Make
make build
make up
```

## 🔍 Troubleshooting

### Problema: "Port already in use"

Uma porta necessária já está sendo usada por outro processo.

**Solução Windows:**
```powershell
# Verificar qual processo está usando a porta 3000 (exemplo)
netstat -ano | findstr :3000

# Matar o processo (substitua PID pelo número retornado)
taskkill /PID <PID> /F
```

**Solução Linux/macOS:**
```bash
# Verificar e matar processo
lsof -ti:3000 | xargs kill -9
```

### Problema: Docker não inicia

**Windows:**
- Certifique-se de que o WSL 2 está instalado e habilitado
- Reinicie o Docker Desktop
- Verifique se a virtualização está habilitada na BIOS

**Linux:**
```bash
# Verificar status do Docker
sudo systemctl status docker

# Iniciar Docker
sudo systemctl start docker
```

### Problema: Serviços não ficam "healthy"

Aguarde mais tempo (até 2 minutos) para que os bancos de dados inicializem completamente.

```bash
# Verificar logs do serviço problemático
docker-compose logs -f <service-name>

# Exemplo: verificar postgres
docker-compose logs -f postgres
```

### Problema: Erro de memória no Docker Desktop (Windows)

Aumente a memória disponível para Docker:
1. Abra Docker Desktop
2. Settings > Resources > Advanced
3. Aumente Memory para pelo menos 4GB
4. Apply & Restart

## 📖 Próximos Passos

Após o setup bem-sucedido:

1. **Explore a API**: Acesse http://localhost:3000/health
2. **Teste o fluxo E2E**: Execute `make test` ou use o Postman
3. **Use Admin Debug UI**: Para testar visualmente os endpoints
4. **Leia a documentação**: Veja [README.md](./README.md) e [docs/INDICE.md](./docs/INDICE.md)

## 🎯 Fluxo E2E de Teste Manual

### 1. Obter Token de Autenticação

```bash
curl -X POST http://localhost:3000/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"userId":"550e8400-e29b-41d4-a716-446655440000","email":"test@friendapp.com"}'
```

Copie o `token` retornado.

### 2. Criar e Atribuir Selo

```bash
# Substituir <TOKEN> pelo token obtido

# Criar selo
curl -X POST http://localhost:3000/api/v1/selos/criar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"tipo":"verificacao_identidade","user_id":"550e8400-e29b-41d4-a716-446655440000"}'

# Atribuir selo (use o selo_id retornado)
curl -X POST http://localhost:3000/api/v1/selos/atribuir \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"user_id":"550e8400-e29b-41d4-a716-446655440000","selo_id":"<SELO_ID>"}'
```

### 3. Simular Verificação

```bash
curl -X POST http://localhost:3000/api/v1/verificacao/iniciar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"user_id":"550e8400-e29b-41d4-a716-446655440000","tipo_verificacao":"DUC","documento":"12345678900","selfie_url":"https://example.com/selfie.jpg"}'
```

### 4. Calcular Reputação

```bash
curl -X POST http://localhost:3000/api/v1/reputacao/calcular \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"user_id":"550e8400-e29b-41d4-a716-446655440000","coerencia":0.8,"reciprocidade":0.7,"feedbacks_positivos":10,"denuncias_validadas":0,"maturity_days":30}'
```

## 📞 Suporte

- **Documentação**: [docs/](./docs/)
- **Issues**: https://github.com/thayssagomesoficial-lang/friendapp-core/issues

---

**Última Atualização:** 15/10/2025  
**Versão:** 3.1
