# Domain Management System — Feldhub Tenants

> Prozess + Checkliste für Domain-Setup bei neuen Kunden
> Version 1.0 — 2026-03-30

---

## 📋 Übersicht

Jeder neue Feldhub-Tenant bekommt:
1. **Subdomain auf feldhub.app** (schnell, kein DNS-Aufwand): `kundenname.feldhub.app`
2. **Custom Domain** (optional, kostenpflichtig): `app.kundenname.de`

---

## 🌐 Domain-Optionen für Tenants

### Option A — Feldhub Subdomain (Standard, inkl. im SaaS-Paket)

| Format | Beispiel |
|--------|---------|
| Dashboard | `kundenname.feldhub.app` |
| API | `api.kundenname.feldhub.app` |
| Status | `status.kundenname.feldhub.app` |

**Vorteile:** Keine DNS-Änderung beim Kunden, sofort live, SSL automatisch
**Nachteil:** Nicht eigene Brand

### Option B — Custom Domain (Aufpreis: +€29/Monat)

| Format | Beispiel |
|--------|---------|
| Dashboard | `app.meinunternehmen.de` |
| API | `api.meinunternehmen.de` |
| Website | `meinunternehmen.de` (eigene Verwaltung) |

**Vorteile:** Volle Brand-Kontrolle, professioneller Auftritt
**Nachteil:** DNS-Änderung beim Kunden nötig, 24-48h Propagation

---

## 🔧 Setup-Prozess für neue Domain

### Phase 1 — Vercel Domain hinzufügen

```bash
# Vercel CLI (mit Feldhub-Token aus TOOLS.md)
vercel domains add app.kundenname.de --token $VERCEL_TOKEN

# Domain zu Projekt verknüpfen
vercel alias set app.kundenname.de --scope feldhub
```

Oder via Vercel Dashboard:
1. Projekt öffnen → Settings → Domains
2. Domain eintragen
3. DNS-Records kopieren (zeigt Vercel an)

### Phase 2 — DNS-Konfiguration (beim Kunden)

Folgende Records beim Domain-Registrar des Kunden eintragen:

#### Für Apex-Domain (kundenname.de)
```
Type: A
Name: @
Value: 76.76.21.21  (Vercel IP)
TTL: 3600
```

#### Für Subdomain (app.kundenname.de)
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 3600
```

#### Für E-Mail (optional, MX-Records nicht überschreiben!)
```
# WICHTIG: Nur setzen wenn keine MX-Records vorhanden!
# Sonst E-Mail-Probleme beim Kunden!
```

### Phase 3 — SSL-Zertifikat

Vercel stellt automatisch ein Let's Encrypt Zertifikat aus.

```bash
# Status prüfen
vercel certs ls

# Manuelle Zertifikat-Ausstellung falls nötig
vercel certs issue app.kundenname.de
```

Wartezeit: 5-30 Minuten nach DNS-Propagation

### Phase 4 — Environment-Variables updaten

```bash
# .env.production des Tenants
NEXT_PUBLIC_APP_URL=https://app.kundenname.de
NEXTAUTH_URL=https://app.kundenname.de
CORS_ORIGIN=https://app.kundenname.de
```

---

## 📋 Domain-Setup Checkliste

### Für Feldhub Subdomain (Option A)

```
□ Subdomain in Vercel-Projekt eintragen (kundenname.feldhub.app)
□ tenant.ts mit korrekter appUrl updaten
□ NEXTAUTH_URL in Vercel env vars setzen
□ SSL-Status prüfen (sollte automatisch aktiv sein)
□ Redirect von www prüfen (optional)
□ Domain im Tenant-Register eintragen (s.u.)
□ Testlogin durchführen
```

### Für Custom Domain (Option B)

```
□ Domain bei Vercel hinzufügen
□ DNS-Records an Kunden senden (E-Mail-Template s.u.)
□ DNS-Propagation abwarten (nslookup domain.de — bis Vercel IP erscheint)
□ SSL-Zertifikat ausgestellt? (Vercel Dashboard → Domains → ✓)
□ HTTPS Redirect aktiviert?
□ www-Redirect eingerichtet? (www.domain.de → domain.de)
□ tenant.ts: appUrl + domain aktualisieren
□ NEXTAUTH_URL: https://domain.de
□ CORS_ORIGIN: https://domain.de
□ Vercel Preview-URLs in CORS-Whitelist (für Dev)
□ E-Mail-Verifizierungs-Links testen (Auth)
□ OAuth Redirect-URIs updaten (falls Google/GitHub Login)
□ Domain im Tenant-Register eintragen (s.u.)
□ Go-Live E-Mail an Kunden senden
```

---

## 📧 E-Mail-Template — DNS-Konfiguration für Kunden

```
Betreff: Koch Aufforstung App — DNS-Konfiguration benötigt

Hallo [ANSPRECHPARTNER],

um Ihre eigene Domain für den ForstManager zu verwenden,
benötigen wir eine kleine Änderung in Ihrem DNS-System.

Bitte tragen Sie bei Ihrem Domain-Anbieter ([REGISTRAR]) 
folgende DNS-Einstellung ein:

Typ:  CNAME
Name: app
Wert: cname.vercel-dns.com
TTL:  3600 (oder "Automatisch")

Nach der Änderung dauert es 24-48 Stunden bis das System
erreichbar ist. Wir informieren Sie sobald alles aktiv ist.

Falls Sie Hilfe benötigen, rufen Sie uns gern an oder
senden Sie uns Zugangsdaten zum DNS-Panel (wir erledigen es für Sie).

Mit freundlichen Grüßen,
[TOMEK] — Feldhub
```

---

## 🗂️ Tenant-Domain-Register

Alle aktiven Domains dokumentieren:

```yaml
# docs/tenants/domains.yaml
tenants:
  - id: koch-aufforstung
    name: Koch Aufforstung GmbH
    subdomain: ka-forstmanager.vercel.app
    customDomain: null
    status: active
    createdAt: 2025-12-01
    plan: professional
    
  - id: demo
    name: Feldhub Demo
    subdomain: demo.feldhub.app
    customDomain: null
    status: active
    createdAt: 2026-01-15
    plan: starter
```

---

## 🔍 DNS-Diagnose Befehle

```bash
# Domain-Auflösung prüfen
nslookup app.kundenname.de
dig app.kundenname.de CNAME

# SSL-Zertifikat prüfen
openssl s_client -connect app.kundenname.de:443 -showcerts

# HTTP → HTTPS Redirect prüfen
curl -I http://app.kundenname.de

# Vercel Deployment-URL prüfen
curl -I https://app.kundenname.de -H "Host: app.kundenname.de"
```

---

## ⚠️ Häufige Probleme & Lösungen

### Problem: SSL-Zertifikat wird nicht ausgestellt

**Ursache:** DNS noch nicht propagiert oder A-Record statt CNAME gesetzt
**Lösung:**
1. `dig app.kundenname.de` — zeigt aktuellen Record
2. Warten (bis zu 48h)
3. Vercel Dashboard → Domain → "Refresh" klicken

### Problem: Auth-Redirect geht auf falsche URL

**Ursache:** NEXTAUTH_URL in Vercel-Env-Vars nicht aktualisiert
**Lösung:**
```bash
vercel env add NEXTAUTH_URL production
# Wert: https://app.kundenname.de
vercel --prod  # Neu deployen
```

### Problem: CORS-Fehler bei API-Calls

**Ursache:** Custom Domain nicht in CORS_ORIGIN
**Lösung:**
```typescript
// lib/cors.ts — Tenant-Config lesen
const allowedOrigins = [
  process.env.NEXTAUTH_URL,
  process.env.CORS_ORIGIN,
  // Vercel Preview-URLs (für Dev)
  /https:\/\/.*\.vercel\.app$/,
].filter(Boolean);
```

### Problem: E-Mails zeigen alte Domain

**Ursache:** NEXT_PUBLIC_APP_URL noch nicht geändert
**Lösung:** Alle E-Mail-Templates auf `process.env.NEXT_PUBLIC_APP_URL` umstellen

---

## 🔄 Domain-Migration (Subdomain → Custom Domain)

Wenn Bestandskunde auf eigene Domain wechseln möchte:

1. **Custom Domain in Vercel hinzufügen** (parallel zur alten)
2. **DNS konfigurieren + SSL abwarten**
3. **Env-Vars updaten** (NEXTAUTH_URL, NEXT_PUBLIC_APP_URL)
4. **Neu deployen**
5. **Testen** — Login, Auth-Mails, Redirects
6. **Alte Subdomain** noch 30 Tage behalten (Redirect einrichten)
7. **Kunden informieren**: Neue URL ab [Datum] aktiv
8. **Nach 30 Tagen**: Alte Domain aus Vercel entfernen

---

## 💰 Preisstruktur Domain-Services

| Service | Preis | Wer zahlt |
|---------|-------|----------|
| Feldhub Subdomain | inkl. | Feldhub (Vercel) |
| Custom Domain Setup (einmalig) | €99 | Kunde |
| Custom Domain Hosting | +€29/Monat | Kunde |
| Domain-Registrierung | €10-15/Jahr | Kunde (selbst) |
| SSL-Zertifikat | €0 (Let's Encrypt) | Feldhub |

---

*Letzte Aktualisierung: 2026-03-30 — Sprint IU*
