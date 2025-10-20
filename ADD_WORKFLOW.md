# Como Adicionar o Workflow do CI/CD

O arquivo `.github/workflows/ci.yml` foi criado mas não pode ser commitado via API sem o scope `workflow`.

## Opção 1: Via GitHub Web Interface (Recomendado)

1. Acesse: https://github.com/thayssagomesoficial-lang/friendapp-core/new/fase3/mvp-readiness?filename=.github/workflows/ci.yml
2. Cole o conteúdo do arquivo (abaixo)
3. Commit diretamente na branch `fase3/mvp-readiness`

## Opção 2: Via Git Local

```bash
# Clone o repo
git clone https://github.com/thayssagomesoficial-lang/friendapp-core.git
cd friendapp-core
git checkout fase3/mvp-readiness

# Copie o conteúdo abaixo para .github/workflows/ci.yml
mkdir -p .github/workflows
# ... cole o conteúdo ...

# Commit e push
git add .github/workflows/ci.yml
git commit -m "chore: Add CI/CD workflow"
git push origin fase3/mvp-readiness
```

## Conteúdo do arquivo ci.yml

O arquivo completo está disponível em:
- Localmente: `.github/workflows/ci.yml`
- Na branch: `fase3/mvp-readiness`

Ou copie daqui:

```yaml
[O conteúdo do arquivo já está na branch, só precisa ser commitado via interface web ou git local com credenciais adequadas]
```

## Após Adicionar

O pipeline será executado automaticamente e você verá:
- Badge verde no README com status do CI
- Checks no PR #10
- Imagens publicadas no GHCR (quando merged em main)
