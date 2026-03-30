# Backup-Strategie — AppFabrik Multi-Tenant

> **Version:** 1.0.0  
> **Erstellt:** 2026-03-30  
> **Verantwortlich:** Amadeus (Orchestrator)

---

## 📋 Überblick

Jeder AppFabrik-Tenant bekommt automatische tägliche Backups seiner Datenbank.
Die Backups laufen via GitHub Actions Cron und werden in S3-kompatiblem Storage gespeichert.

---

## 🎯 Backup-Ziele (RPO/RTO)

| Metrik | Ziel | Beschreibung |
|--------|------|-------------|
| **RPO** (Recovery Point Objective) | ≤ 24h | Maximal 24h Datenverlust |
| **RTO** (Recovery Time Objective) | ≤ 4h | Wiederherstellung in 4h |
| Backup-Frequenz | Täglich 03:00 Uhr (Berlin) | Automatisch via GitHub Actions |
| Retention | 30 Tage | Ältere Backups werden automatisch gelöscht |

---

## 🏗️ Architektur

```
┌──────────────────────────────────────────────────────────┐
│  GitHub Actions (Cron: täglich 02:00 UTC)               │
│                                                          │
│  ┌─────────────────┐    ┌─────────────────┐             │
│  │  Tenant A       │    │  Tenant B       │   ...       │
│  │  backup.sh      │    │  backup.sh      │             │
│  └────────┬────────┘    └────────┬────────┘             │
│           │                     │                       │
└───────────┼─────────────────────┼───────────────────────┘
            │                     │
            ▼                     ▼
    ┌───────────────────────────────────┐
    │  S3 / Cloudflare R2               │
    │  backups/                         │
    │  ├── tenant-a/                    │
    │  │   ├── 20260330_020000/         │
    │  │   │   ├── db_*.sql.gz          │
    │  │   │   ├── db_*.dump            │
    │  │   │   └── manifest.json        │
    │  │   └── 20260329_020000/         │
    │  └── tenant-b/                    │
    │      └── ...                      │
    └───────────────────────────────────┘
```

---

## 📦 Was wird gesichert?

| Komponente | Methode | Format | Priorität |
|-----------|---------|--------|-----------|
| **PostgreSQL (Neon)** | `pg_dump` | `.dump` (custom) + `.sql.gz` | 🔴 Kritisch |
| **Prisma Schema** | File-Copy | `.prisma` | 🟡 Hoch |
| **Backup Manifest** | Auto-generiert | `.json` | 🟡 Hoch |

> **Hinweis:** Dateien (Fotos, Dokumente) werden in Nextcloud gespeichert —
> diese haben eigene Backup-Strategie (WebDAV-Sync).

---

## ⚙️ Konfiguration für neuen Tenant

### 1. GitHub Secrets setzen

```bash
# In Repository Settings → Secrets → Actions:
NEON_DATABASE_URL_<TENANT-ID>   # z.B. NEON_DATABASE_URL_MUSTER-BETRIEB
BACKUP_S3_BUCKET                 # Einmal für alle Tenants
BACKUP_AWS_ACCESS_KEY_ID         # AWS/R2 Credentials
BACKUP_AWS_SECRET_ACCESS_KEY
MC_API_KEY                       # Mission Control API Key
```

### 2. Tenant zur GitHub Actions Matrix hinzufügen

```yaml
# .github/workflows/backup.yml → jobs.backup.strategy.matrix.tenant:
matrix:
  tenant:
    - koch-aufforstung
    - muster-betrieb   # ← NEU
```

### 3. Backup verifizieren (nach erstem Lauf)

```bash
TENANT_ID=muster-betrieb \
BACKUP_S3_BUCKET=appfabrik-backups \
bash scripts/backup-verify.sh
```

---

## 🔄 Manuelles Backup

```bash
# Lokales Backup (ohne S3 Upload)
TENANT_ID=koch-aufforstung \
NEON_DATABASE_URL="postgresql://..." \
bash scripts/backup.sh

# Mit S3 Upload
TENANT_ID=koch-aufforstung \
NEON_DATABASE_URL="postgresql://..." \
BACKUP_S3_BUCKET=appfabrik-backups \
AWS_DEFAULT_REGION=eu-central-1 \
bash scripts/backup.sh
```

---

## 🔁 Wiederherstellung (Restore)

```bash
# 1. Backup aus S3 herunterladen
aws s3 cp s3://appfabrik-backups/backups/koch-aufforstung/20260330_020000/ \
  ./restore/ --recursive

# 2. DB wiederherstellen (custom format)
pg_restore \
  --dbname="$NEON_DATABASE_URL" \
  --no-owner \
  --no-privileges \
  ./restore/db_koch-aufforstung_20260330_020000.dump

# Alternativ: Plain SQL
gunzip < ./restore/db_*.sql.gz | psql "$NEON_DATABASE_URL"
```

---

## 📊 Monitoring

- **Erfolg:** GitHub Actions Badge + Artifact-Log
- **Fehler:** Mission Control Notification (🔴 High Priority)
- **Verifizierung:** Täglich nach Backup läuft `backup-verify.sh`
- **Alerting:** Bei Backup-Alter > 26h → Alert via Mission Control API

---

## 💰 Kosten-Schätzung

| Component | Kosten/Monat |
|-----------|-------------|
| Cloudflare R2 (10 GB) | ~$0.15 |
| GitHub Actions Minutes | Kostenlos (public/private je 2000 min) |
| **Total pro Tenant** | **~$0.15/Monat** |

---

## 🔐 Sicherheit

- Backup-Files sind verschlüsselt (S3 Server-Side Encryption)
- Zugriff nur via IAM-Rolle mit MinimalPermissions (S3 read/write)
- Credentials nie im Code — immer via GitHub Secrets
- Backup-Buckets sind private (kein Public Access)
