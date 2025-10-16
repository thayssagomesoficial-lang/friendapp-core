# 🪟 Guia de Setup - FriendApp no Windows

Este guia fornece instruções passo a passo para rodar o FriendApp no Windows.

## 📋 Pré-requisitos

Antes de começar, você precisa instalar as seguintes ferramentas:

### 1. Docker Desktop para Windows

Docker é necessário para rodar os serviços backend (Node.js, Python, Go, PostgreSQL, Redis).

**Download e Instalação:**
1. Acesse: https://www.docker.com/products/docker-desktop/
2. Baixe o instalador para Windows
3. Execute o instalador e siga as instruções
4. Reinicie o computador se solicitado
5. Abra o Docker Desktop e aguarde ele iniciar
6. **Importante:** Certifique-se de que o Docker está rodando (ícone na bandeja do sistema)

**Verificar instalação:**
```powershell
docker --version
docker-compose --version
```

**Esperado:**
```
Docker version 24.0.x
Docker Compose version v2.x.x
```

### 2. Git para Windows

Git é necessário para clonar o repositório.

**Download e Instalação:**
1. Acesse: https://git-scm.com/download/win
2. Baixe o instalador
3. Execute e aceite as configurações padrão
4. Marque a opção "Git Bash Here" durante instalação

**Verificar instalação:**
```powershell
git --version
```

### 3. Flutter SDK (Opcional - para desenvolvimento mobile)

Flutter é necessário apenas se você quiser rodar o app mobile ou fazer alterações no frontend.

**Download e Instalação:**
1. Acesse: https://docs.flutter.dev/get-started/install/windows
2. Baixe o Flutter SDK ZIP
3. Extraia para `C:\src\flutter` (ou local de sua preferência)
4. Adicione `C:\src\flutter\bin` ao PATH do sistema:
   - Pesquise "Variáveis de Ambiente" no menu Iniciar
   - Clique em "Variáveis de Ambiente..."
   - Em "Variáveis do Sistema", encontre "Path" e clique em "Editar"
   - Clique em "Novo" e adicione `C:\src\flutter\bin`
   - Clique OK em todas as janelas

**Verificar instalação:**
```powershell
flutter --version
flutter doctor
```

**Configurar Flutter para web:**
```powershell
flutter config --enable-web
```

## 🚀 Rodando o Projeto

### Passo 1: Clonar o Repositório

Abra o PowerShell ou Git Bash e execute:

```powershell
cd C:\Users\SeuUsuario\Documents
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core
```

### Passo 2: Iniciar os Serviços Backend

No mesmo terminal, execute:

```powershell
docker-compose up -d
```

**O que acontece:**
- PostgreSQL iniciará na porta 5432
- Redis iniciará na porta 6379
- Node API iniciará na porta 3000
- Python AI iniciará na porta 8000
- Go Services iniciará na porta 9000

**Aguardar serviços:**
Aguarde cerca de 30 segundos para que todos os serviços iniciem.

**Verificar status:**
```powershell
docker-compose ps
```

**Esperado:**
```
NAME                    STATUS
friendapp-postgres      Up (healthy)
friendapp-redis         Up (healthy)
friendapp-node-api      Up
friendapp-python-ai     Up
friendapp-go-services   Up
```

### Passo 3: Testar os Serviços

Abra o navegador e acesse os health endpoints:

- Node API: http://localhost:3000/health
- Python AI: http://localhost:8000/health
- Go Services: http://localhost:9000/health

**Todos devem retornar JSON com `"status": "healthy"`**

### Passo 4: Rodar o Flutter App (Opcional)

Se você instalou o Flutter, pode rodar o app web:

```powershell
cd frontend\flutter-app
flutter pub get
flutter run -d chrome
```

Ou servir o build pronto:

```powershell
cd frontend\flutter-app\build\web
python -m http.server 8080
```

Depois acesse: http://localhost:8080

## 🧪 Testando o Backend via API

Você pode testar o backend usando PowerShell ou ferramentas como Postman.

### Usando PowerShell (curl)

**1. Registrar usuário:**
```powershell
$body = @{
    email = "teste@teste.com"
    password = "senha123456"
    name = "Usuário Teste"
    birthDate = "1995-05-15"
    consciousIntention = "Busco conexões autênticas"
    seekingConnections = @("spiritual", "friendship")
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/v1/cadastro/register `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

**2. Salvar o token retornado e testar personalidade:**
```powershell
$token = "SEU_TOKEN_AQUI"

$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri http://localhost:3000/api/v1/personalidade/questions `
  -Method Get `
  -Headers $headers
```

### Usando Postman

1. Baixe Postman: https://www.postman.com/downloads/
2. Importe a collection (se disponível) ou crie requests manualmente
3. Teste os endpoints documentados em `DEVELOPMENT.md`

## 🛑 Parando os Serviços

Quando terminar de trabalhar, pare os containers:

```powershell
cd C:\Users\SeuUsuario\Documents\friendapp-core
docker-compose down
```

## 🔧 Comandos Úteis

### Ver logs dos serviços:
```powershell
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f node-api
docker-compose logs -f python-ai
docker-compose logs -f go-services
```

### Reiniciar serviços:
```powershell
docker-compose restart
```

### Rebuild após mudanças no código:
```powershell
docker-compose down
docker-compose build
docker-compose up -d
```

### Limpar tudo (incluindo dados):
```powershell
docker-compose down -v
```

## ❌ Problemas Comuns

### Problema: Docker não inicia
**Solução:** 
- Certifique-se de que o Docker Desktop está rodando
- Verifique se a virtualização está habilitada no BIOS
- No Docker Desktop, vá em Settings > General e marque "Use the WSL 2 based engine"

### Problema: Porta já está em uso
**Solução:**
```powershell
# Ver o que está usando a porta (exemplo: 3000)
netstat -ano | findstr :3000

# Matar o processo (substitua PID pelo número retornado)
taskkill /PID <PID> /F
```

### Problema: Flutter não reconhecido
**Solução:**
- Reinicie o terminal após adicionar ao PATH
- Verifique se o caminho está correto: `echo $env:Path` (PowerShell)

### Problema: docker-compose: comando não encontrado
**Solução:**
- Versões recentes do Docker usam `docker compose` (sem hífen) ao invés de `docker-compose`
- Tente substituir todos os comandos `docker-compose` por `docker compose`

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs`
2. Consulte DEVELOPMENT.md para mais detalhes técnicos
3. Consulte TESTING_RESULTS.md para ver os testes já realizados

## 🎯 Próximos Passos

Após o setup, você pode:

1. ✅ Testar o registro de usuário
2. ✅ Fazer o teste de personalidade
3. ✅ Criar posts no feed
4. ✅ Ver o feed com ranking inteligente
5. 🔜 Implementar novas features (mapa de frequência, conexões, etc.)

---

**Boa sorte e divirta-se explorando o FriendApp! 🚀✨**
