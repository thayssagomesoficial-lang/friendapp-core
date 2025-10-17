#!/bin/bash

set -e

GATEWAY_URL="${API_GATEWAY_URL:-http://localhost:3000}"
SELOS_URL="${SELOS_URL:-http://localhost:3004}"
VERIFICACAO_URL="${VERIFICACAO_URL:-http://localhost:3005}"
REPUTACAO_URL="${REPUTACAO_URL:-http://localhost:3006}"
SEGURANCA_URL="${SEGURANCA_URL:-http://localhost:3007}"
ECONOMIA_URL="${ECONOMIA_URL:-http://localhost:3008}"
ANTIFRAUDE_URL="${ANTIFRAUDE_URL:-http://localhost:3009}"

echo "🔍 FriendApp Core - Smoke Tests"
echo "================================"
echo ""

check_health() {
  local service_name=$1
  local url=$2
  
  echo -n "Checking $service_name... "
  
  if curl -f -s "$url/health" > /dev/null 2>&1; then
    echo "✅ OK"
    return 0
  else
    echo "❌ FAILED"
    return 1
  fi
}

check_ready() {
  local service_name=$1
  local url=$2
  
  echo -n "Checking $service_name readiness... "
  
  if curl -f -s "$url/ready" > /dev/null 2>&1; then
    echo "✅ READY"
    return 0
  else
    echo "⚠️  NOT READY"
    return 1
  fi
}

FAILED=0

echo "Health Checks:"
echo "--------------"
check_health "API Gateway" "$GATEWAY_URL" || FAILED=$((FAILED + 1))
check_health "Selos Service" "$SELOS_URL" || FAILED=$((FAILED + 1))
check_health "Verificacao Service" "$VERIFICACAO_URL" || FAILED=$((FAILED + 1))
check_health "Reputacao Service" "$REPUTACAO_URL" || FAILED=$((FAILED + 1))
check_health "Seguranca Service" "$SEGURANCA_URL" || FAILED=$((FAILED + 1))
check_health "Economia Service" "$ECONOMIA_URL" || FAILED=$((FAILED + 1))
check_health "Antifraude Service" "$ANTIFRAUDE_URL" || FAILED=$((FAILED + 1))

echo ""
echo "Readiness Checks:"
echo "-----------------"
check_ready "API Gateway" "$GATEWAY_URL" || FAILED=$((FAILED + 1))
check_ready "Selos Service" "$SELOS_URL" || FAILED=$((FAILED + 1))
check_ready "Verificacao Service" "$VERIFICACAO_URL" || FAILED=$((FAILED + 1))
check_ready "Reputacao Service" "$REPUTACAO_URL" || FAILED=$((FAILED + 1))
check_ready "Seguranca Service" "$SEGURANCA_URL" || FAILED=$((FAILED + 1))
check_ready "Economia Service" "$ECONOMIA_URL" || FAILED=$((FAILED + 1))
check_ready "Antifraude Service" "$ANTIFRAUDE_URL" || FAILED=$((FAILED + 1))

echo ""
echo "================================"

if [ $FAILED -eq 0 ]; then
  echo "✅ All smoke tests passed!"
  echo ""
  echo "Service URLs:"
  echo "  API Gateway:    $GATEWAY_URL"
  echo "  Selos:          $SELOS_URL"
  echo "  Verificacao:    $VERIFICACAO_URL"
  echo "  Reputacao:      $REPUTACAO_URL"
  echo "  Seguranca:      $SEGURANCA_URL"
  echo "  Economia:       $ECONOMIA_URL"
  echo "  Antifraude:     $ANTIFRAUDE_URL"
  echo "  Prometheus:     http://localhost:9090"
  exit 0
else
  echo "❌ $FAILED test(s) failed"
  exit 1
fi
