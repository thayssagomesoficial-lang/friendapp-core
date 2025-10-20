#!/bin/bash
set -e

echo "🔒 Verificando segurança de secrets..."

if git ls-files | grep -q "^\.env$"; then
    echo "❌ ERRO: Arquivo .env está sendo versionado!"
    echo "   Execute: git rm --cached .env"
    exit 1
fi

if git ls-files | grep -qE "\.(key|pem|p12|pfx)$"; then
    echo "❌ ERRO: Arquivos de chave privada detectados no repositório!"
    exit 1
fi

if git grep -qE "(password|secret|key|token)\s*=\s*['\"][^'\"]{8,}['\"]" -- '*.js' '*.py' '*.go' 2>/dev/null; then
    echo "⚠️  AVISO: Possíveis secrets hardcoded detectados no código"
    echo "   Revise os arquivos abaixo:"
    git grep -nE "(password|secret|key|token)\s*=\s*['\"][^'\"]{8,}['\"]" -- '*.js' '*.py' '*.go' || true
fi

if [ ! -f ".env.example" ]; then
    echo "❌ ERRO: Arquivo .env.example não encontrado!"
    exit 1
fi

if [ ! -f ".gitignore" ] || ! grep -q "^\.env$" .gitignore; then
    echo "❌ ERRO: .env não está no .gitignore!"
    exit 1
fi

echo "✅ Verificação de segurança concluída"
echo ""
echo "📋 Checklist:"
echo "   ✓ .env não está versionado"
echo "   ✓ .env.example existe"
echo "   ✓ .gitignore contém .env"
echo "   ✓ Nenhuma chave privada versionada"
