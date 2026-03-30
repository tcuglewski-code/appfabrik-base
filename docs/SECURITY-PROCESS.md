# Security Standard-Prozess — AppFabrik

> **Version:** 1.0.0  
> **Erstellt:** 2026-03-30  
> **Verantwortlich:** Argus (QA & Security) koordiniert von Amadeus  
> **Gilt für:** Jedes neue AppFabrik-Projekt ab Tag 1

---

## 🎯 Ziel

Jeder AppFabrik-Tenant muss denselben Security-Mindeststandard erfüllen.
Dieser Prozess definiert **wann** welche Security-Maßnahmen umgesetzt werden.

---

## 📋 Pflicht-Checkliste bei Projektstart

### Phase 1: Repository-Setup (Tag 1)

- [ ] `.gitignore` mit `.env`, `node_modules`, `.next`, `.vercel`
- [ ] `.env.example` mit allen benötigten Variablen (keine echten Werte!)
- [ ] GitHub Secrets für alle Credentials setzen (nie in Code!)
- [ ] Branch Protection für `main` aktivieren (kein Force Push, PR Required)
- [ ] GitHub Actions: `security.yml` Workflow aus `appfabrik-base` kopieren

### Phase 2: Authentication (vor erstem Deploy)

- [ ] NextAuth v5 aus `appfabrik-base` übernehmen
- [ ] RBAC-Rollen definieren: `ADMIN`, `MANAGER`, `WORKER`, `CLIENT`
- [ ] Session-Timeout konfigurieren (Standard: 8h)
- [ ] Password-Hashing via bcrypt (bereits in NextAuth)
- [ ] 2FA-Pflicht für Admin-Accounts dokumentieren (manuell bei Tenant einrichten)

### Phase 3: API Security (vor erstem Deploy)

- [ ] Rate Limiting in `middleware.ts` aktiv
- [ ] Alle API Routes prüfen: Authentifizierung und Autorisierung
- [ ] Input Validation via Zod für alle API-Inputs
- [ ] SQL Injection: Prisma ORM verwendet (nie Raw SQL ohne Sanitierung)
- [ ] CORS konfiguriert (nur eigene Domain(s) erlaubt)

### Phase 4: Next.js Security Headers (vor erstem Deploy)

```typescript
// next.config.ts — Security Headers (PFLICHT)
const securityHeaders = [
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-XSS-Protection',         value: '1; mode=block' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.neon.tech wss:",
    ].join('; ')
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];
```

### Phase 5: DSGVO Basics (vor Go-Live)

- [ ] Datenschutzerklärung vorhanden und zugänglich
- [ ] Cookie-Banner implementiert (falls Marketing-Cookies)
- [ ] AVV mit Vercel unterzeichnet (Tomek)
- [ ] AVV mit Neon unterzeichnet (Tomek)
- [ ] Datenverarbeitungsverzeichnis angelegt

---

## 🔄 Laufende Security-Prozesse

### Automatisch (GitHub Actions)

| Workflow | Frequenz | Was wird geprüft |
|---------|----------|-----------------|
| `security.yml` | Jeder PR + wöchentlich | Abhängigkeiten, Secrets im Code, .gitignore |
| `monitoring.yml` | Alle 30 min | Uptime, API Health |
| `backup.yml` | Täglich 02:00 UTC | DB Backup Vollständigkeit |

### Manuell (Quartalsweise)

- [ ] Security Audit: `bash scripts/security-audit.sh` lokal ausführen
- [ ] Alle Dependencies updaten: `npm update` + Review
- [ ] Passwords/Tokens rotieren: DB, API Keys, GitHub Secrets
- [ ] Penetration Test (light): OWASP ZAP gegen Staging-URL
- [ ] Vercel/Neon Dashboard: ungewöhnliche Aktivitäten prüfen

---

## 🚨 Incident Response

### Wenn ein Security-Incident passiert:

1. **Sofort:** Betroffen System isolieren (Vercel → Feature Flags / Maintenance Mode)
2. **Binnen 1h:** Credentials rotieren (DB, API Keys, Auth Secrets)
3. **Binnen 4h:** Ursache analysieren, Patch entwickeln
4. **Binnen 24h:** Patch deployen + testen
5. **Binnen 72h:** Incident Report an Kunden (falls Daten betroffen: DSGVO Meldepflicht!)
6. **Post-Mortem:** Was passierte, was wird geändert?

### DSGVO Meldepflicht

Bei Datenpanne mit Personenbezug:
- **72 Stunden** Frist zur Meldung an Datenschutzbehörde
- Kontakt: Datenschutzbeauftragter (Tomek oder beauftragter Anwalt)
- Betroffene Personen informieren wenn hohes Risiko

---

## 🔐 Credential-Management

### Wo Credentials gespeichert werden

| Credential | Ablageort | Rotation |
|-----------|-----------|---------|
| Neon DB URL | GitHub Secrets | Quartalsweise |
| NextAuth Secret | GitHub Secrets | Quartalsweise |
| API Keys (intern) | GitHub Secrets | Bei Verdacht sofort |
| Tenant Admin PW | Lastpass/1Password (Tomek) | Jährlich |

### NIEMALS

- ❌ Credentials in Git committen
- ❌ .env Files pushen
- ❌ Credentials per Email/Chat teilen
- ❌ Credentials in Kommentaren

---

## 📊 Security-Metriken

| Metrik | Ziel | Frequenz |
|--------|------|---------|
| Offene HIGH CVEs | 0 | Wöchentlich |
| Offene CRITICAL CVEs | 0 | Täglich |
| Secrets im Code | 0 | Bei jedem Commit |
| HTTPS Enforced | 100% | Permanent |
| Security Headers | 100% | Quartalsweise |

---

## 📚 Ressourcen

- [OWASP Top 10](https://owasp.org/Top10/)
- [Next.js Security Docs](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Neon Security](https://neon.tech/docs/security/security-overview)
- [Vercel Security](https://vercel.com/docs/security)
- Interne Checkliste: `docs/SECURITY-CHECKLIST.md`
