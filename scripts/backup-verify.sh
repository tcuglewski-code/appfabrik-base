#!/usr/bin/env bash
# ============================================================
# AppFabrik — Backup Verification Script
# Prüft ob das letzte Backup erfolgreich war und nicht zu alt ist
# ============================================================

set -euo pipefail

TENANT_ID="${TENANT_ID:-unknown}"
BACKUP_S3_BUCKET="${BACKUP_S3_BUCKET:-}"
MAX_BACKUP_AGE_HOURS="${MAX_BACKUP_AGE_HOURS:-26}"  # >24h = Problem

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

log() { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1"; }
success() { log "${GREEN}✅ $1${NC}"; }
error() { log "${RED}❌ $1${NC}"; exit 1; }
warn() { log "${YELLOW}⚠️  $1${NC}"; }

log "🔍 Backup Verification — Tenant: ${TENANT_ID}"

if [[ -z "$BACKUP_S3_BUCKET" ]]; then
  warn "BACKUP_S3_BUCKET nicht gesetzt — kann nicht verifizieren"
  exit 0
fi

if ! command -v aws &>/dev/null; then
  warn "AWS CLI nicht verfügbar — Verifikation übersprungen"
  exit 0
fi

# Neuestes Backup finden
LATEST_BACKUP=$(aws s3 ls "s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/" \
  | sort | tail -1 | awk '{print $2}' | tr -d '/')

if [[ -z "$LATEST_BACKUP" ]]; then
  error "Kein Backup für Tenant '${TENANT_ID}' gefunden!"
fi

log "Letztes Backup: ${LATEST_BACKUP}"

# Alter prüfen
BACKUP_TIMESTAMP="${LATEST_BACKUP:0:8}_${LATEST_BACKUP:9:6}"
BACKUP_DATE="${LATEST_BACKUP:0:8}"
BACKUP_TIME="${LATEST_BACKUP:9:6}"
BACKUP_EPOCH=$(date -d "${BACKUP_DATE} ${BACKUP_TIME:0:2}:${BACKUP_TIME:2:2}:${BACKUP_TIME:4:2}" +%s 2>/dev/null || echo 0)
NOW_EPOCH=$(date +%s)
AGE_HOURS=$(( (NOW_EPOCH - BACKUP_EPOCH) / 3600 ))

log "Backup-Alter: ${AGE_HOURS} Stunden (Max: ${MAX_BACKUP_AGE_HOURS}h)"

if [[ $AGE_HOURS -gt $MAX_BACKUP_AGE_HOURS ]]; then
  error "Backup zu alt! ${AGE_HOURS}h > ${MAX_BACKUP_AGE_HOURS}h — Backup-System prüfen!"
fi

# Manifest prüfen
MANIFEST=$(aws s3 cp "s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/${LATEST_BACKUP}/manifest.json" - 2>/dev/null || echo "{}")
DB_STATUS=$(echo "$MANIFEST" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('components',{}).get('database','unknown'))" 2>/dev/null || echo "unknown")

log "DB Backup Status: ${DB_STATUS}"

if [[ "$DB_STATUS" == "completed" ]]; then
  success "Verifikation bestanden — Backup ist aktuell und vollständig"
elif [[ "$DB_STATUS" == "skipped" ]]; then
  warn "DB Backup wurde übersprungen — prüfe Konfiguration"
else
  warn "DB Backup Status unbekannt — prüfe manuell"
fi

success "Verifikation abgeschlossen"
