# DSGVO Compliance Monitor

Automatisierte wöchentliche DSGVO-Compliance-Prüfung für alle Feldhub Tenants.

## Überblick

Der DSGVO Monitor läuft **jeden Montag um 08:00 UTC** und prüft alle aktiven Tenants auf DSGVO-Konformität.

## Geprüfte Bereiche

### Globale Checks (Feldhub-Ebene)

| Check | Beschreibung | Threshold |
|-------|--------------|-----------|
| SSL-Zertifikat | Feldhub Hauptdomain | >30 Tage gültig |
| Datenschutzerklärung | Globale DSE aktuell | Max. 12 Monate alt |

### Tenant-spezifische Checks

| Check | Beschreibung | Status |
|-------|--------------|--------|
| **SSL-Zertifikat** | Tenant-Domain SSL-Prüfung | ✅ >30 Tage / ⚠️ <30 Tage / ❌ abgelaufen |
| **Cookie-Consent** | Cookie-Banner vorhanden | Automatische Erkennung |
| **Datenschutzerklärung** | DSE Aktualisierungsdatum | Max. 12 Monate |
| **TOMs** | Technische/Org. Maßnahmen dokumentiert | Vorhanden/nicht vorhanden |
| **AVV** | Auftragsverarbeitungsvertrag | Unterschrieben/nicht vorhanden |
| **Datenverarbeiter** | Sub-Prozessoren gelistet | Vollständig/unvollständig |

## Konfiguration

### Umgebungsvariablen

```env
# Mission Control API
MC_API_URL=https://mission-control-tawny-omega.vercel.app
MC_API_KEY=mc_live_xxx

# Feldhub Domain für globale Checks
FELDHUB_DOMAIN=feldhub.de

# Datum der globalen Datenschutzerklärung
PRIVACY_POLICY_DATE=2026-01-15
```

### Datenbank-Anforderungen

Das Tenant-Model muss folgende Felder enthalten:

```prisma
model Tenant {
  id                     String    @id @default(cuid())
  name                   String
  domain                 String?   // Tenant-spezifische Domain
  status                 String    @default("active")
  
  // DSGVO Compliance Felder
  privacyPolicyUpdatedAt DateTime? // Letztes Update der DSE
  cookieConsentEnabled   Boolean   @default(false)
  subProcessors          Json?     // Array von Datenverarbeitern
  avvSignedAt            DateTime? // AVV Unterzeichnungsdatum
  tomsDocumentedAt       DateTime? // TOMs Dokumentationsdatum
}
```

## Cron Setup

### Vercel Cron

In `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/dsgvo-monitor",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

### API Route

```typescript
// /app/api/cron/dsgvo-monitor/route.ts
import { NextResponse } from 'next/server'
import { runDSGVOMonitor } from '@/src/cron/dsgvo-monitor'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const report = await runDSGVOMonitor()
    return NextResponse.json({ 
      success: true, 
      summary: report.summary,
      hasIssues: report.summary.nonCompliant > 0
    })
  } catch (error) {
    console.error('[DSGVO Monitor] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

### Manueller Aufruf

```bash
npx ts-node src/cron/dsgvo-monitor.ts
```

## Scoring-System

### Tenant Score (0-100%)

- **Pass** = 100 Punkte
- **Warn** = 50 Punkte  
- **Fail** = 0 Punkte

Durchschnitt aller Checks = Tenant Score

### Overall Status

| Status | Bedingung |
|--------|-----------|
| 🟢 Compliant | Keine Fails, keine Warns |
| 🟡 Warning | Mindestens 1 Warn, keine Fails |
| 🔴 Non-Compliant | Mindestens 1 Fail |

## Mission Control Integration

Bei kritischen Issues (Status: `fail`) wird automatisch:

1. **Alert** an Mission Control gesendet
2. **Task** mit Priorität `high` erstellt
3. Tags: `dsgvo`, `compliance`, `automated`

### Task-Format

```
🔴 DSGVO Compliance Issues (X Probleme)

## Kritische Probleme
- **Tenant Name:** SSL-Zertifikat: Zertifikat abgelaufen!
- **Tenant Name:** AVV: Kein Auftragsverarbeitungsvertrag hinterlegt

## Erforderliche Maßnahmen
...
```

## SSL-Prüfung Details

Die SSL-Prüfung verwendet TLS-Verbindung zu Port 443:

- Prüft Zertifikatsgültigkeit
- Warnt bei <30 Tagen Restlaufzeit
- Fail bei abgelaufenem Zertifikat
- Timeout: 10 Sekunden

## Cookie-Consent Erkennung

Automatische Erkennung gängiger Cookie-Consent-Lösungen:

- Tarteaucitron
- CookieFirst
- OneTrust
- TrustArc
- Generische CSS-Klassen (`.cookie-consent`, `.cookie-banner`, etc.)

⚠️ **Hinweis:** Automatische Erkennung ist nicht 100% zuverlässig. Bei `warn` manuelle Prüfung empfohlen.

## Checkliste für neue Tenants

Vor dem Go-Live prüfen:

- [ ] SSL-Zertifikat konfiguriert (Let's Encrypt via Vercel)
- [ ] Domain in Tenant-Config hinterlegt
- [ ] Datenschutzerklärung veröffentlicht + Datum in DB
- [ ] Cookie-Consent-Banner aktiviert
- [ ] TOMs dokumentiert (Datum in DB)
- [ ] AVV unterzeichnet (Datum in DB)
- [ ] Datenverarbeiter vollständig gelistet (Vercel, Neon, Anthropic, etc.)

## Report-Beispiel

```markdown
# DSGVO Compliance Report

## 📊 Summary

| Metrik | Wert |
|--------|------|
| **Gesamtscore** | 92% |
| **Geprüfte Tenants** | 3 |
| **Compliant** | 2 🟢 |
| **Warnungen** | 1 🟡 |
| **Non-Compliant** | 0 🔴 |
```

## Fehlerbehebung

### "DB nicht verfügbar"

- Prisma-Connection prüfen
- `DATABASE_URL` Umgebungsvariable setzen

### "SSL-Prüfung Timeout"

- Domain erreichbar?
- Firewall/WAF blockiert Verbindung?
- Timeout ggf. erhöhen (Standard: 10s)

### "Keine offensichtlicher Cookie-Consent gefunden"

- Consent-Banner verwendet nicht-standardmäßige Klassennamen
- Banner wird erst bei GDPR-relevanten Ländern angezeigt
- → Manuelle Prüfung durchführen

## Erweiterungen (geplant)

- [ ] E-Mail Benachrichtigung bei Critical Issues
- [ ] Integration mit externer Audit-Plattform
- [ ] Automatische Zertifikats-Erneuerung Trigger
- [ ] Compliance-History Dashboard
