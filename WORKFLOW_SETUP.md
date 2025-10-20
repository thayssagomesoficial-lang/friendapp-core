# 🚀 Como Adicionar o Workflow CI/CD ao GitHub

O arquivo de workflow do GitHub Actions (`.github/workflows/ci.yml`) foi criado mas não pode ser commitado automaticamente devido a limitações de escopo do token OAuth.

## ⚡ Método Rápido (Recomendado)

### Via GitHub Web Interface

1. **Acesse o repositório no GitHub:**
   ```
   https://github.com/thayssagomesoficial-lang/friendapp-core
   ```

2. **Mude para a branch `fase3/mvp-readiness`:**
   - Clique no dropdown de branches (normalmente mostra "main")
   - Selecione `fase3/mvp-readiness`

3. **Crie o arquivo do workflow:**
   - Clique em "Add file" → "Create new file"
   - Nome do arquivo: `.github/workflows/ci.yml`
   - Cole o conteúdo do arquivo (veja seção "Conteúdo do Workflow" abaixo)

4. **Commit:**
   - Título: `ci: Add CI/CD workflow pipeline`
   - Descrição (opcional): `Add GitHub Actions workflow for lint, test, build, and deploy`
   - Selecione "Commit directly to the fase3/mvp-readiness branch"
   - Clique em "Commit new file"

5. **Pronto!** O workflow será executado automaticamente na PR #10.

---

## 🔧 Método Alternativo (Git Local)

Se preferir usar Git local:

```bash
# 1. Clone o repositório (se ainda não tem)
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core

# 2. Checkout da branch
git checkout fase3/mvp-readiness

# 3. Crie o diretório
mkdir -p .github/workflows

# 4. Copie o conteúdo abaixo para .github/workflows/ci.yml
# (Você pode usar seu editor favorito: vim, nano, VSCode, etc.)

# 5. Commit e push
git add .github/workflows/ci.yml
git commit -m "ci: Add CI/CD workflow pipeline"
git push origin fase3/mvp-readiness
```

---

## 📄 Conteúdo do Workflow

O arquivo completo já está disponível na branch em:
```
.github/workflows/ci.yml
```

Você pode visualizá-lo diretamente no repositório ou copiá-lo da máquina local onde o Devin trabalhou.

**Localização local (se tiver acesso):**
```
/home/ubuntu/friendapp-core/.github/workflows/ci.yml
```

---

## ✅ Após Adicionar o Workflow

Quando o arquivo for commitado, o seguinte acontecerá automaticamente:

1. **Pipeline será executado:**
   - Lint e testes de todos os 7 microserviços
   - Audit de dependências (npm, pip, go)
   - E2E tests com Newman e Postman

2. **Checks aparecerão na PR #10:**
   - Você verá status de cada job (lint-and-test, build-and-push, e2e-tests)
   - Badge do CI ficará verde no README

3. **Em caso de merge para main/develop:**
   - Imagens Docker serão buildadas
   - Publicadas no GitHub Container Registry (GHCR)

---

## 🔍 Verificar se Funcionou

Após adicionar o workflow:

1. **Vá para a PR #10:**
   ```
   https://github.com/thayssagomesoficial-lang/friendapp-core/pull/10
   ```

2. **Verifique os Checks:**
   - Role para baixo até a seção "Checks"
   - Você deve ver: "CI/CD Pipeline" com status ⏳ (em execução) ou ✅ (sucesso)

3. **Veja os logs (se necessário):**
   - Clique em "Details" ao lado de qualquer check
   - Expanda os jobs para ver logs detalhados

---

## 🛠️ Troubleshooting

### ❌ Pipeline falha no lint/test

Se algum serviço falhar no lint ou teste:
- Clique em "Details" para ver qual serviço falhou
- Veja os logs do job específico
- Corrija localmente e faça push para a branch

### ❌ Pipeline falha no E2E (Newman)

Se os testes E2E falharem:
- Verifique que todos os serviços subiram corretamente
- Veja os logs do docker-compose no job
- Pode ser timeout - tente aumentar o sleep no workflow

### ❌ Não consigo ver o arquivo na branch

O arquivo está em `.github/workflows/ci.yml` na branch `fase3/mvp-readiness`.
Se não aparecer no GitHub, certifique-se de:
1. Estar na branch correta (não em main)
2. O arquivo foi commitado (não apenas staged)

---

## 📞 Ajuda

Se tiver problemas:
- Verifique a [documentação do GitHub Actions](https://docs.github.com/en/actions)
- Veja o PR #10 para instruções adicionais
- Consulte `docs/fase3-implementacao.md` para detalhes técnicos

---

**Versão:** 3.2 (Fase 3 - MVP Ready)  
**Criado por:** Devin AI para Thayssa Gomes
