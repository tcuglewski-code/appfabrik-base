# Analytics Setup — Feldhub (Plausible Analytics, DSGVO-konform)

> Stand: 30.03.2026 | Sprint IY

## Warum Plausible?

| Kriterium | Plausible | Google Analytics 4 |
|-----------|-----------|-------------------|
| DSGVO-konform | ✅ Kein Consent Banner nötig | ❌ Consent Banner erforderlich |
| Cookie-frei | ✅ Kein Cookie | ❌ Setzt Cookies |
| Datenspeicherort | 🇪🇺 EU-Server | ❌ USA (SCCs nötig) |
| Datenschutzerklärung | Einfacher Hinweis reicht | Ausführliche Erwähnung nötig |
| Open Source | ✅ | ❌ |
| Monatliche Kosten | ab €9/mo (Starter) | Kostenlos (bis GA360) |

## Setup pro Tenant

### 1. Plausible Account

```
URL: https://plausible.io
Team: Feldhub (eine Organisation für alle Tenants)
Domains: jeweils ein Site pro Tenant
  - feldhub.io (Feldhub Website)
  - ka-forstmanager.vercel.app (Koch Aufforstung ForstManager)
  - [neuer-tenant].vercel.app (zukünftige Tenants)
```

### 2. Next.js Integration

Paket installieren:
```bash
npm install next-plausible
```

### 3. Umgebungsvariablen

```env
# .env.local
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=ka-forstmanager.vercel.app
NEXT_PUBLIC_PLAUSIBLE_ENABLED=true
# Optional: Self-hosted
NEXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

### 4. Tenant-Config Erweiterung

In `tenant.ts` ergänzen:
```typescript
analytics: {
  plausible: {
    domain: 'ka-forstmanager.vercel.app',
    enabled: true,
    // Optional: Custom Domain falls self-hosted
    apiHost?: 'https://plausible.io',
  }
}
```

## Tracked Events (Custom Events)

| Event | Trigger | Wichtigkeit |
|-------|---------|-------------|
| `pageview` | Jede Seitennavigation | Auto |
| `Login` | Erfolgreicher Login | Hoch |
| `Task Created` | Neue Aufgabe angelegt | Hoch |
| `Report Generated` | Bericht exportiert | Mittel |
| `Onboarding Complete` | Wizard abgeschlossen | Hoch |
| `Feature: Upload` | Datei hochgeladen | Mittel |

## Self-Hosting Option (für Enterprise-Tenants)

```yaml
# docker-compose.plausible.yml
version: "3.3"
services:
  plausible_db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${PLAUSIBLE_DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data

  plausible_events_db:
    image: clickhouse/clickhouse-server:24.3.3.102-alpine
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

  plausible:
    image: ghcr.io/plausible/community-edition:v2.1.1
    depends_on:
      - plausible_db
      - plausible_events_db
    ports:
      - 8000:8000
    environment:
      BASE_URL: ${PLAUSIBLE_BASE_URL}
      SECRET_KEY_BASE: ${PLAUSIBLE_SECRET_KEY}

volumes:
  db-data:
```

## DSGVO Datenschutzerklärung Hinweis

Einfacher Hinweis in der Datenschutzerklärung:

> "Zur Analyse des Nutzungsverhaltens auf unserer Website verwenden wir Plausible Analytics
> (Plausible Insights OÜ, Tallinn, Estland). Plausible Analytics ist cookie-frei, sammelt
> keine personenbezogenen Daten und verarbeitet alle Daten auf EU-Servern.
> Eine separate Einwilligung ist nicht erforderlich."

## Kosten-Kalkulation

| Plan | Seitenaufrufe/Monat | Preis | Empfehlung |
|------|-------------------|-------|-----------|
| Starter | 10.000 | €9/mo | Feldhub Website |
| Growth | 100.000 | €19/mo | 1-3 Tenants |
| Business | 1.000.000 | €49/mo | 5-10 Tenants |

→ Start mit Growth Plan für Feldhub + Koch Aufforstung gemeinsam.

## Roadmap

- [ ] Plausible Growth Plan abonnieren (Tomek)
- [ ] Feldhub Website Domain hinzufügen
- [ ] Koch Aufforstung ForstManager Domain hinzufügen
- [ ] `next-plausible` in feldhub-base integrieren
- [ ] Custom Events implementieren
- [ ] Analytics Dashboard im Mission Control einbinden (API-Key)
