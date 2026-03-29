# Vercel Organization Setup — AppFabrik

> **Stand:** 29.03.2026  
> **Autor:** Amadeus (Auto-Loop)  
> **Zweck:** Standardisierte Anleitung für das Deployment neuer Tenant-Projekte auf Vercel

---

## 📋 Übersicht

Diese Dokumentation beschreibt den vollständigen Prozess für das Aufsetzen eines neuen Kunden-Projekts (Tenant) auf Vercel. Sie dient als Checkliste für das Kunden-Onboarding.

---

## 🏗️ 1. Vercel-Projekt erstellen

### 1.1 Voraussetzungen

- [ ] Vercel Account (Team oder Pro für kommerzielle Nutzung)
- [ ] GitHub Repository für den Tenant (Fork von `appfabrik-base` oder Kunden-spezifisches Repo)
- [ ] Neon Datenbank bereits angelegt (siehe `NEON-SETUP.md`)
- [ ] Domain-Zugang beim Kunden oder Subdomain unter `appfabrik.de`

### 1.2 Neues Projekt anlegen

1. **Vercel Dashboard öffnen:** https://vercel.com/dashboard
2. **"Add New..." → "Project"** klicken
3. **Repository importieren:**
   - GitHub verbinden (falls noch nicht geschehen)
   - Repository auswählen: `tcuglewski-code/<tenant-repo>`
   - Branch: `main` (oder `production` je nach Workflow)

4. **Framework Preset:** Next.js (automatisch erkannt)

5. **Root Directory:** `.` (Standard, es sei denn Monorepo)

6. **Build & Output Settings:**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### 1.3 Projekt-Name wählen

- **Format:** `<kunde>-<produkt>`
- **Beispiele:**
  - `koch-forstmanager`
  - `mueller-gartenbau-manager`
  - `demo-appfabrik`

---

## 🔐 2. Environment Variables konfigurieren

### 2.1 Pflicht-Variablen (alle Tenants)

| Variable | Beschreibung | Beispiel |
|----------|--------------|----------|
| `DATABASE_URL` | Neon PostgreSQL Connection String (Pooler) | `postgresql://user:pass@host/db?sslmode=require` |
| `DIRECT_URL` | Neon Direct Connection (für Migrations) | `postgresql://user:pass@direct-host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Random 32+ Zeichen für Session-Encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Produktions-URL der App | `https://forstmanager.koch-aufforstung.de` |
| `TENANT_ID` | Eindeutige Tenant-ID (aus tenant.ts) | `koch-aufforstung` |

### 2.2 Optionale Variablen

| Variable | Beschreibung | Standard |
|----------|--------------|----------|
| `SMTP_HOST` | Email-Server für Transaktions-Mails | — |
| `SMTP_PORT` | SMTP Port | `587` |
| `SMTP_USER` | SMTP Benutzername | — |
| `SMTP_PASS` | SMTP Passwort | — |
| `SMTP_FROM` | Absender-Adresse | — |
| `ANTHROPIC_API_KEY` | Für KI-Features (Förderberater etc.) | — |
| `CRON_SECRET` | Bearer Token für Cron-Endpoints | — |

### 2.3 Variablen setzen (CLI oder Dashboard)

**Via Vercel CLI:**
```bash
# Vercel CLI installieren
npm i -g vercel

# Projekt verknüpfen
cd /path/to/tenant-repo
vercel link

# Einzelne Variable setzen
vercel env add DATABASE_URL production

# Mehrere Variablen aus .env.local importieren
vercel env pull .env.production.local
```

**Via Dashboard:**
1. Project → Settings → Environment Variables
2. Variable eintragen
3. Environment auswählen: `Production` / `Preview` / `Development`
4. "Save" klicken

### 2.4 Secrets sicher generieren

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -hex 16

# API Keys
# → Aus 1Password/Bitwarden kopieren, niemals im Repo speichern!
```

---

## 🌐 3. Domain konfigurieren

### 3.1 Subdomain unter appfabrik.de (empfohlen für Start)

1. **Vercel:** Project → Settings → Domains
2. **Domain hinzufügen:** `<kunde>.appfabrik.de`
3. **DNS bei Domain-Provider:**
   - Typ: `CNAME`
   - Name: `<kunde>`
   - Wert: `cname.vercel-dns.com`

### 3.2 Eigene Kunden-Domain

1. **Option A: CNAME (Subdomain)**
   - DNS-Eintrag beim Kunden:
   ```
   Type: CNAME
   Name: forstmanager (für forstmanager.koch-aufforstung.de)
   Value: cname.vercel-dns.com
   ```

2. **Option B: A/AAAA Records (Apex Domain)**
   - DNS-Einträge beim Kunden:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: AAAA
   Name: @
   Value: 2606:4700:90:0:f22e:fbec:5bed:a9b9
   ```

### 3.3 SSL/TLS

- **Automatisch:** Vercel stellt Let's Encrypt Zertifikate bereit
- **Prüfen:** Nach Domain-Hinzufügung Status "Valid Configuration" abwarten (1-10 Min)
- **Fehler:** Falls DNS nicht propagiert, 1-24h warten

---

## 🚀 4. Deployment & CI/CD

### 4.1 Automatisches Deployment

- **Push to main:** Automatisches Production Deployment
- **Push to andere Branches:** Preview Deployment mit eindeutiger URL
- **Pull Requests:** Preview-Link automatisch im PR-Kommentar

### 4.2 Manuelles Deployment

```bash
# Production Deployment
vercel --prod

# Preview Deployment
vercel
```

### 4.3 GitHub Actions Integration (optional)

Falls bereits in `.github/workflows/deploy.yml` konfiguriert:
- Automatische Deployments bei Push
- Prisma Migrations vor Deploy
- Tests vor Deploy

**Vercel Token für GitHub Actions:**
```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📝 5. Post-Deployment Checks

### 5.1 Deployment verifizieren

- [ ] Seite lädt ohne Fehler
- [ ] Login funktioniert
- [ ] Datenbank-Verbindung aktiv (Dashboard zeigt Daten)
- [ ] SSL-Zertifikat aktiv (🔒 in Browser)

### 5.2 Prisma Migration ausführen

Bei neuem Projekt oder Schema-Änderungen:
```bash
# Lokal mit DIRECT_URL
npx prisma migrate deploy

# Oder via Vercel Build (postinstall Script)
# Bereits in package.json konfiguriert
```

### 5.3 Seed-Daten einspielen (optional)

```bash
npx prisma db seed
```

---

## ✅ 6. Onboarding-Checkliste (Kunden-Setup)

### Phase 1: Technisches Setup (Tag 1)

- [ ] GitHub Repository erstellt (Fork von appfabrik-base)
- [ ] Neon Datenbank angelegt
- [ ] Vercel Projekt erstellt
- [ ] ENV-Variablen gesetzt (alle Pflicht-Variablen)
- [ ] Domain konfiguriert
- [ ] Erstes Deployment erfolgreich
- [ ] SSL aktiv

### Phase 2: Konfiguration (Tag 1-2)

- [ ] `tenant.ts` angepasst (Firmenname, Farben, Logo)
- [ ] Admin-Account angelegt
- [ ] Rollen definiert
- [ ] Prisma Schema migriert
- [ ] Basis-Daten importiert (Mitarbeiter, Projekte)

### Phase 3: Integration (Tag 2-3)

- [ ] Email/SMTP konfiguriert
- [ ] Cron-Jobs aktiviert (falls benötigt)
- [ ] WordPress-Sync eingerichtet (falls WP-Integration)
- [ ] Mobile App konfiguriert (EAS Build)

### Phase 4: Go-Live (Tag 3-5)

- [ ] Kundenschulung durchgeführt
- [ ] Test-Daten gelöscht
- [ ] Produktionsdaten importiert
- [ ] DNS auf finale Domain umgestellt
- [ ] Go-Live Bestätigung vom Kunden

---

## 🔧 7. Troubleshooting

### Build schlägt fehl

```bash
# Lokalen Build testen
npm run build

# Logs prüfen
vercel logs <deployment-url>
```

### Datenbank-Verbindungsfehler

- `DATABASE_URL` prüfen (Pooler-Endpunkt für App)
- `DIRECT_URL` prüfen (Direct-Endpunkt für Migrations)
- IP-Allowlist in Neon prüfen (0.0.0.0/0 für Vercel)

### Domain zeigt nicht auf Vercel

1. DNS-Propagation abwarten (bis 24h)
2. `nslookup <domain>` prüfen
3. Bei CNAME: Zeigt auf `cname.vercel-dns.com`?

### 504 Gateway Timeout

- Serverless Function Timeout erhöhen (Vercel Pro: 60s)
- Datenbank-Query optimieren
- Connection Pooling prüfen

---

## 📚 Weiterführende Dokumentation

- [Vercel Docs: Deployments](https://vercel.com/docs/deployments/overview)
- [Vercel Docs: Environment Variables](https://vercel.com/docs/environment-variables)
- [Neon Docs: Connect from Vercel](https://neon.tech/docs/guides/vercel)
- [NextAuth.js: Deployment](https://next-auth.js.org/deployment)

---

## 🗓️ Changelog

| Datum | Änderung | Autor |
|-------|----------|-------|
| 29.03.2026 | Initiale Version | Amadeus |
