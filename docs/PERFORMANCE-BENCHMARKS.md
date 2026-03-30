# Performance Benchmarks — Core Web Vitals & Standards

> Feldhub-Standard für alle Tenants
> Version 1.0 — 2026-03-30

---

## 🎯 Ziel

Jedes Feldhub-Produkt (Web-Dashboard, Website, Landing Pages) muss messbare Performance-Standards erfüllen. Diese Benchmarks gelten als **Mindestanforderung** für Go-Live und als **Monitoring-Schwellenwerte** nach Live-Schaltung.

---

## 📊 Core Web Vitals — Zielwerte

### Web-Dashboard (ForstManager / Feldhub Admin)

| Metrik | Beschreibung | Ziel (Gut) | Maximum (Akzeptabel) |
|--------|-------------|-----------|---------------------|
| **LCP** | Largest Contentful Paint | < 2.5s | < 4.0s |
| **INP** | Interaction to Next Paint | < 200ms | < 500ms |
| **CLS** | Cumulative Layout Shift | < 0.1 | < 0.25 |
| **FCP** | First Contentful Paint | < 1.8s | < 3.0s |
| **TTFB** | Time to First Byte | < 600ms | < 1.8s |

### Marketing-Website (feldhub.de / Kunden-Sites)

| Metrik | Ziel (Gut) | Maximum (Akzeptabel) |
|--------|-----------|---------------------|
| LCP | < 2.0s | < 2.5s |
| INP | < 150ms | < 200ms |
| CLS | < 0.05 | < 0.1 |
| FCP | < 1.5s | < 2.0s |
| TTFB | < 400ms | < 800ms |

### Mobile App (React Native / Expo)

| Metrik | Ziel | Maximum |
|--------|------|---------|
| Cold Start | < 3s | < 5s |
| Screen Transition | < 300ms | < 500ms |
| API Response (cached) | < 100ms | < 300ms |
| API Response (network) | < 1.5s | < 3s |
| Bundle Size (iOS) | < 50MB | < 80MB |
| Bundle Size (Android) | < 45MB | < 70MB |
| JS Bundle (OTA) | < 5MB | < 10MB |

---

## 🔧 Lighthouse Score-Anforderungen

### Minimum für Go-Live

| Kategorie | Minimum Score | Ziel-Score |
|-----------|--------------|-----------|
| Performance | 85 | 95+ |
| Accessibility | 90 | 100 |
| Best Practices | 90 | 100 |
| SEO | 90 | 100 |

### Messung

```bash
# Lokal mit Lighthouse CLI
npx lighthouse https://your-tenant.vercel.app \
  --output=html \
  --output-path=./reports/lighthouse-$(date +%Y%m%d).html \
  --chrome-flags="--headless" \
  --throttling-method=simulate \
  --throttling.cpuSlowdownMultiplier=4

# Mobile Profil
npx lighthouse https://your-tenant.vercel.app \
  --form-factor=mobile \
  --output=json \
  --output-path=./reports/lighthouse-mobile-$(date +%Y%m%d).json
```

---

## 📦 Bundle-Größen (Next.js)

### Zielwerte pro Route

| Route-Typ | JS Budget | CSS Budget |
|-----------|-----------|-----------|
| Landing Page | < 80KB | < 20KB |
| Dashboard (initial) | < 200KB | < 30KB |
| Dashboard (lazy) | < 500KB total | — |
| API Route Response | < 100KB JSON | — |

### Next.js Bundle Analyzer

```bash
# Bundle analysieren
ANALYZE=true npm run build

# package.json script
"analyze": "ANALYZE=true next build"
```

```typescript
// next.config.ts — Bundle-Analyzer Integration
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer({
  // ... rest of config
});
```

---

## 🗄️ Datenbank-Performance

### Query-Anforderungen

| Query-Typ | Ziel | Maximum |
|-----------|------|---------|
| Simple SELECT | < 5ms | < 20ms |
| JOIN (2-3 Tabellen) | < 20ms | < 100ms |
| Dashboard-Aggregate | < 100ms | < 500ms |
| Full-Text-Search | < 50ms | < 200ms |
| Bulk Insert (100 rows) | < 200ms | < 1s |

### Pflichtindizes (Prisma Schema)

```prisma
// Jedes Tenant-Model MUSS diese Indizes haben:
model BaseEntity {
  id         String   @id @default(cuid())
  tenantId   String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([tenantId])           // Tenant-Isolation
  @@index([createdAt])          // Zeitbasierte Queries
  @@index([tenantId, createdAt]) // Kombiniert (häufigste Query)
}
```

---

## 🌐 API-Performance

### Response-Zeit-SLA

| Endpoint-Typ | P50 | P95 | P99 |
|-------------|-----|-----|-----|
| GET (gecacht) | < 50ms | < 150ms | < 300ms |
| GET (DB-Query) | < 100ms | < 300ms | < 800ms |
| POST (Mutation) | < 200ms | < 500ms | < 1.5s |
| File Upload | < 2s | < 5s | < 10s |
| Webhook | < 5s | < 15s | < 30s |

### Rate Limiting (Standard)

```typescript
// lib/rate-limit.ts
export const rateLimits = {
  default: { requests: 100, window: '1m' },
  auth: { requests: 20, window: '1m' },
  upload: { requests: 10, window: '1m' },
  webhook: { requests: 1000, window: '1m' },
};
```

---

## 🖼️ Bild-Optimierung

### Standards

| Format | Use Case | Max-Größe |
|--------|---------|----------|
| WebP | Fotos, komplexe Bilder | 200KB |
| AVIF | Hero-Images (modern) | 150KB |
| SVG | Icons, Logos | 20KB |
| PNG | Screenshots (wenn nötig) | 500KB |

### Next.js Image-Config

```typescript
// next.config.ts
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 Jahr
    dangerouslyAllowSVG: false,
  },
};
```

---

## ⚡ Caching-Strategie

### Next.js Cache-Hierarchie

```typescript
// Statische Daten (selten ändern)
const tenantConfig = await fetch('/api/tenant', {
  next: { revalidate: 3600 }, // 1h Cache
});

// Dashboard-Daten (täglich)
const stats = await fetch('/api/stats', {
  next: { revalidate: 300 }, // 5min Cache
});

// Real-Time (immer fresh)
const liveData = await fetch('/api/live', {
  cache: 'no-store',
});
```

### CDN-Headers (Vercel)

```typescript
// Für öffentliche Assets
res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

// Für Auth-Seiten
res.setHeader('Cache-Control', 'private, no-cache, no-store');
```

---

## 🔍 Performance-Testing im CI

### GitHub Actions Workflow

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://${{ env.VERCEL_PREVIEW_URL }}
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### Budget-File

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "interactive", "budget": 5000 },
      { "metric": "first-contentful-paint", "budget": 2000 },
      { "metric": "largest-contentful-paint", "budget": 2500 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 300 },
      { "resourceType": "total", "budget": 500 }
    ]
  }
]
```

---

## 📈 Monitoring & Alerting

### Vercel Analytics (Standard für alle Tenants)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Alert-Schwellenwerte

| Metrik | Warning | Critical |
|--------|---------|---------|
| LCP | > 3s | > 5s |
| Error Rate | > 1% | > 5% |
| API P95 | > 1s | > 3s |
| Apdex Score | < 0.85 | < 0.70 |

---

## ✅ Pre-Launch Performance-Checklist

```
□ Lighthouse Score ≥ 85 (alle Kategorien)
□ Core Web Vitals alle im "Gut"-Bereich
□ Alle kritischen Datenbank-Indizes vorhanden
□ Images in WebP/AVIF konvertiert
□ Bundle-Analyzer ohne obvious chunks
□ API-Response-Zeiten unter SLA
□ Cache-Headers korrekt gesetzt
□ Vercel Analytics + Speed Insights aktiviert
□ Rate-Limiting auf allen öffentlichen Endpoints
□ CDN aktiviert (Vercel Edge Network)
```

---

## 🔄 Regelmäßige Performance-Reviews

| Frequenz | Aktion |
|----------|--------|
| Jeder PR | Lighthouse CI läuft automatisch |
| Wöchentlich | CWV-Bericht aus Vercel Analytics |
| Monatlich | Vollständiger Performance-Audit |
| Quarterly | Bundle-Größen-Review + Dependencies-Audit |

---

*Letzte Aktualisierung: 2026-03-30 — Sprint IT*
