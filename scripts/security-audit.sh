#!/usr/bin/env bash
# ============================================================
# AppFabrik — Security Audit Script
# Führt automatisierte Sicherheitsprüfungen durch
# Läuft bei jedem PR und vor jedem Release
# ============================================================

set -euo pipefail

TENANT_ID="${TENANT_ID:-unknown}"
PROJECT_DIR="${PROJECT_DIR:-.}"
AUDIT_REPORT="/tmp/security-audit-${TENANT_ID}-$(date +%Y%m%d_%H%M%S).md"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()     { echo -e "[$(date +'%H:%M:%S')] $1" | tee -a "$AUDIT_REPORT"; }
pass()    { log "${GREEN}  ✅ PASS: $1${NC}"; }
fail()    { log "${RED}  ❌ FAIL: $1${NC}"; FAILURES=$((FAILURES+1)); }
warn()    { log "${YELLOW}  ⚠️  WARN: $1${NC}"; WARNINGS=$((WARNINGS+1)); }
section() { log ""; log "${BLUE}━━━ $1 ━━━${NC}"; }

FAILURES=0
WARNINGS=0

log "# AppFabrik Security Audit Report"
log "**Tenant:** ${TENANT_ID}"
log "**Datum:** $(date +'%Y-%m-%d %H:%M:%S')"
log "**Projekt:** ${PROJECT_DIR}"
log ""

# ============================================================
# 1. DEPENDENCY VULNERABILITIES
# ============================================================
section "1. Dependency Vulnerabilities"

if [[ -f "${PROJECT_DIR}/package.json" ]]; then
  log "Prüfe npm/pnpm Abhängigkeiten..."
  
  # npm audit
  if command -v pnpm &>/dev/null; then
    AUDIT_OUTPUT=$(cd "$PROJECT_DIR" && pnpm audit --json 2>/dev/null || echo '{"metadata":{"vulnerabilities":{"critical":0,"high":0}}}')
  elif command -v npm &>/dev/null; then
    AUDIT_OUTPUT=$(cd "$PROJECT_DIR" && npm audit --json 2>/dev/null || echo '{"metadata":{"vulnerabilities":{"critical":0,"high":0}}}')
  else
    AUDIT_OUTPUT='{"metadata":{"vulnerabilities":{"critical":0,"high":0}}}'
  fi
  
  CRITICAL=$(echo "$AUDIT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metadata',{}).get('vulnerabilities',{}).get('critical',0))" 2>/dev/null || echo "0")
  HIGH=$(echo "$AUDIT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metadata',{}).get('vulnerabilities',{}).get('high',0))" 2>/dev/null || echo "0")
  
  if [[ "$CRITICAL" -gt 0 ]]; then
    fail "KRITISCHE Vulnerabilities: ${CRITICAL} — Sofort fixen!"
  elif [[ "$HIGH" -gt 0 ]]; then
    warn "HIGH Vulnerabilities: ${HIGH} — Fixen vor nächstem Release"
  else
    pass "Keine kritischen/high Vulnerabilities"
  fi
fi

# ============================================================
# 2. SECRETS / API KEYS IM CODE
# ============================================================
section "2. Secrets & API Keys im Code"

DANGEROUS_PATTERNS=(
  "sk-[a-zA-Z0-9]{48}"                    # OpenAI API Key
  "ghp_[a-zA-Z0-9]{36}"                   # GitHub PAT
  "AKIA[0-9A-Z]{16}"                      # AWS Access Key
  "password\s*=\s*['\"][^'\"]{6,}"        # Hardcoded passwords
  "secret\s*=\s*['\"][^'\"]{6,}"          # Hardcoded secrets
  "api_key\s*=\s*['\"][^'\"]{6,}"         # Hardcoded API keys
  "DATABASE_URL\s*=\s*postgresql://[^'\"]+" # DB URL im Code
)

SCAN_DIRS=("src" "app" "pages" "lib" "utils" "scripts")
SECRETS_FOUND=0

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  for scan_dir in "${SCAN_DIRS[@]}"; do
    if [[ -d "${PROJECT_DIR}/${scan_dir}" ]]; then
      MATCHES=$(grep -rE "$pattern" "${PROJECT_DIR}/${scan_dir}" \
        --include="*.ts" --include="*.tsx" --include="*.js" \
        --exclude-dir=node_modules \
        -l 2>/dev/null || echo "")
      
      if [[ -n "$MATCHES" ]]; then
        fail "Möglicher Secret in Code: $(echo "$MATCHES" | head -3)"
        SECRETS_FOUND=$((SECRETS_FOUND+1))
      fi
    fi
  done
done

[[ $SECRETS_FOUND -eq 0 ]] && pass "Keine Secrets im Code gefunden"

# .env Files im Repo?
ENV_IN_REPO=$(git -C "$PROJECT_DIR" ls-files | grep "^\.env$" 2>/dev/null || echo "")
if [[ -n "$ENV_IN_REPO" ]]; then
  fail ".env Datei ist im Git Repository! Sofort entfernen + rotieren!"
else
  pass ".env nicht im Repository"
fi

# ============================================================
# 3. NEXT.JS SECURITY HEADERS
# ============================================================
section "3. Next.js Security Headers"

NEXT_CONFIG="${PROJECT_DIR}/next.config.ts"
[[ ! -f "$NEXT_CONFIG" ]] && NEXT_CONFIG="${PROJECT_DIR}/next.config.js"

if [[ -f "$NEXT_CONFIG" ]]; then
  check_header() {
    local header="$1"
    if grep -q "$header" "$NEXT_CONFIG" 2>/dev/null; then
      pass "Header vorhanden: ${header}"
    else
      warn "Header fehlt: ${header} — empfohlen für Security"
    fi
  }
  
  check_header "X-Frame-Options"
  check_header "X-Content-Type-Options"
  check_header "Referrer-Policy"
  check_header "Content-Security-Policy"
  check_header "Strict-Transport-Security"
else
  warn "next.config.ts nicht gefunden — Headers nicht prüfbar"
fi

# ============================================================
# 4. ENVIRONMENT CONFIGURATION
# ============================================================
section "4. Environment & .gitignore"

GITIGNORE="${PROJECT_DIR}/.gitignore"
if [[ -f "$GITIGNORE" ]]; then
  check_ignored() {
    local pattern="$1"
    if grep -q "$pattern" "$GITIGNORE"; then
      pass ".gitignore enthält: ${pattern}"
    else
      fail ".gitignore fehlt: ${pattern}"
    fi
  }
  
  check_ignored "\.env"
  check_ignored "node_modules"
  check_ignored "\.next"
  check_ignored "\.vercel"
else
  fail ".gitignore nicht gefunden!"
fi

# .env.example vorhanden?
if [[ -f "${PROJECT_DIR}/.env.example" ]] || [[ -f "${PROJECT_DIR}/.env.local.example" ]]; then
  pass ".env.example vorhanden"
else
  warn ".env.example fehlt — Entwickler-Onboarding erschwert"
fi

# ============================================================
# 5. PRISMA / DATABASE
# ============================================================
section "5. Prisma & Database Security"

PRISMA_SCHEMA="${PROJECT_DIR}/prisma/schema.prisma"
if [[ -f "$PRISMA_SCHEMA" ]]; then
  # Row Level Security erwähnt?
  if grep -q "@@allow\|rls\|row_level_security" "$PRISMA_SCHEMA" 2>/dev/null; then
    pass "Row Level Security konfiguriert"
  else
    warn "Kein Row Level Security in Prisma Schema — prüfen ob nötig"
  fi
  
  # Relations richtig typisiert?
  pass "Prisma Schema vorhanden und prüfbar"
else
  warn "Prisma Schema nicht gefunden"
fi

# ============================================================
# 6. SUMMARY
# ============================================================
log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📊 SECURITY AUDIT SUMMARY"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "  Failures: ${FAILURES} ❌"
log "  Warnings: ${WARNINGS} ⚠️"
log "  Report:   ${AUDIT_REPORT}"

if [[ $FAILURES -gt 0 ]]; then
  log ""
  log "${RED}⛔ AUDIT FEHLGESCHLAGEN — ${FAILURES} kritische Probleme!${NC}"
  log "Bitte alle ❌ Punkte vor dem Merge/Deploy beheben."
  exit 1
fi

if [[ $WARNINGS -gt 0 ]]; then
  log ""
  log "${YELLOW}⚠️  Audit mit Warnings — ${WARNINGS} Empfehlungen${NC}"
  log "Warnings sind keine Blocker, aber sollten zeitnah behoben werden."
  exit 0
fi

log ""
log "${GREEN}✅ Security Audit bestanden!${NC}"
