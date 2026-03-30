#!/usr/bin/env bash
# ============================================================
# AppFabrik — Daily Backup Script
# Tenant: Konfigurierbar via ENV vars
# Läuft täglich via GitHub Actions Cron
# ============================================================

set -euo pipefail

# ---- Konfiguration (aus ENV oder .env) ---------------------
TENANT_ID="${TENANT_ID:-unknown}"
NEON_DATABASE_URL="${NEON_DATABASE_URL:-}"
BACKUP_S3_BUCKET="${BACKUP_S3_BUCKET:-}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/appfabrik_backup_${TENANT_ID}_${TIMESTAMP}"
LOG_FILE="/tmp/backup_${TENANT_ID}_${TIMESTAMP}.log"

# ---- Farben für Terminal Output ---------------------------
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"; }
success() { log "${GREEN}✅ $1${NC}"; }
error() { log "${RED}❌ $1${NC}"; exit 1; }
warn() { log "${YELLOW}⚠️  $1${NC}"; }

# ---- Validierung ------------------------------------------
log "🚀 AppFabrik Backup startet — Tenant: ${TENANT_ID}"
log "Timestamp: ${TIMESTAMP}"
log "Retention: ${BACKUP_RETENTION_DAYS} Tage"

[[ -z "$NEON_DATABASE_URL" ]] && error "NEON_DATABASE_URL nicht gesetzt!"
[[ -z "$TENANT_ID" ]] && error "TENANT_ID nicht gesetzt!"

mkdir -p "$BACKUP_DIR"

# ---- 1. PostgreSQL / Neon DB Backup -----------------------
log ""
log "📦 Schritt 1: Neon DB Backup..."

DB_BACKUP_FILE="${BACKUP_DIR}/db_${TENANT_ID}_${TIMESTAMP}.sql.gz"

if command -v pg_dump &>/dev/null; then
  pg_dump "$NEON_DATABASE_URL" \
    --no-owner \
    --no-privileges \
    --format=custom \
    --compress=9 \
    --file="${BACKUP_DIR}/db_${TENANT_ID}_${TIMESTAMP}.dump" 2>>"$LOG_FILE"
  
  # Zusätzlich plain SQL für Lesbarkeit
  pg_dump "$NEON_DATABASE_URL" \
    --no-owner \
    --no-privileges \
    --format=plain \
    | gzip > "$DB_BACKUP_FILE" 2>>"$LOG_FILE"
  
  DB_SIZE=$(du -sh "$DB_BACKUP_FILE" | cut -f1)
  success "DB Backup erfolgreich — Größe: ${DB_SIZE}"
else
  warn "pg_dump nicht gefunden — überspringe DB Backup (nur in Docker verfügbar)"
fi

# ---- 2. Prisma Schema sichern ----------------------------
log ""
log "📋 Schritt 2: Prisma Schema sichern..."

if [[ -f "prisma/schema.prisma" ]]; then
  cp prisma/schema.prisma "${BACKUP_DIR}/schema_${TIMESTAMP}.prisma"
  success "Prisma Schema gesichert"
fi

# ---- 3. Backup Manifest erstellen ------------------------
log ""
log "📝 Schritt 3: Manifest erstellen..."

cat > "${BACKUP_DIR}/manifest.json" << EOF
{
  "tenantId": "${TENANT_ID}",
  "timestamp": "${TIMESTAMP}",
  "backupDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "retentionDays": ${BACKUP_RETENTION_DAYS},
  "components": {
    "database": $([ -f "$DB_BACKUP_FILE" ] && echo '"completed"' || echo '"skipped"'),
    "prismaSchema": $([ -f "${BACKUP_DIR}/schema_${TIMESTAMP}.prisma" ] && echo '"completed"' || echo '"skipped"')
  },
  "backupVersion": "1.0.0"
}
EOF
success "Manifest erstellt"

# ---- 4. Upload zu S3 (optional) --------------------------
if [[ -n "$BACKUP_S3_BUCKET" ]]; then
  log ""
  log "☁️  Schritt 4: Upload zu S3/R2..."
  
  if command -v aws &>/dev/null; then
    aws s3 sync "$BACKUP_DIR" \
      "s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/${TIMESTAMP}/" \
      --quiet 2>>"$LOG_FILE"
    success "Upload zu S3 erfolgreich: s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/${TIMESTAMP}/"
    
    # Alte Backups bereinigen
    log "🧹 Bereinige Backups älter als ${BACKUP_RETENTION_DAYS} Tage..."
    aws s3 ls "s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/" | \
      awk '{print $2}' | \
      while read -r prefix; do
        backup_date=$(echo "$prefix" | grep -oP '^\d{8}')
        if [[ -n "$backup_date" ]]; then
          cutoff=$(date -d "-${BACKUP_RETENTION_DAYS} days" +%Y%m%d 2>/dev/null || date -v-${BACKUP_RETENTION_DAYS}d +%Y%m%d)
          if [[ "$backup_date" < "$cutoff" ]]; then
            aws s3 rm "s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/${prefix}" --recursive --quiet
            log "Gelöscht: ${prefix}"
          fi
        fi
      done
    success "Bereinigung abgeschlossen"
  else
    warn "AWS CLI nicht gefunden — S3 Upload übersprungen"
  fi
else
  warn "BACKUP_S3_BUCKET nicht gesetzt — lokales Backup only"
fi

# ---- 5. Backup-Report ------------------------------------
log ""
log "📊 Backup Summary:"
log "  Tenant: ${TENANT_ID}"
log "  Timestamp: ${TIMESTAMP}"
log "  Backup Dir: ${BACKUP_DIR}"
if [[ -n "$BACKUP_S3_BUCKET" ]]; then
  log "  S3 Pfad: s3://${BACKUP_S3_BUCKET}/backups/${TENANT_ID}/${TIMESTAMP}/"
fi
log "  Dateien:"
ls -lh "$BACKUP_DIR" | tee -a "$LOG_FILE"

success "Backup abgeschlossen!"
log "Log: ${LOG_FILE}"
