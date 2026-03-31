# Feldhub 3-Layer-Architektur

> Stand: 31.03.2026 | Sprint JN-MOD

## Überblick

Feldhub verwendet eine **3-Layer-Architektur**, die maximale Wiederverwendbarkeit mit
branchenspezifischer Tiefe kombiniert.

```
┌─────────────────────────────────────────────────┐
│               TENANT LAYER                       │
│  src/config/tenants/[kunde].ts                   │
│  • Kundendaten (Name, Logo, Farben)              │
│  • Feature-Flags (modules{}, integrations{})     │
│  • Tenant-spezifische Texte                     │
├─────────────────────────────────────────────────┤
│               MODULES LAYER                      │
│  src/modules/[branche]/                          │
│  • Branchenspezifische Komponenten               │
│  • Branchenspezifische Hooks + Utils             │
│  • Branchenspezifische Types                     │
│  Verfügbar: forst | landschaftsbau | tiefbau     │
├─────────────────────────────────────────────────┤
│               BASE LAYER                         │
│  src/components/, src/lib/, src/hooks/           │
│  • Generische UI-Komponenten                     │
│  • Auth, RBAC, Tenant-Config                     │
│  • API-Standards, Monitoring, Backup             │
│  • Für alle Branchen nutzbar                     │
└─────────────────────────────────────────────────┘
```

---

## Layer 1: Base

**Pfad:** `src/components/`, `src/lib/`, `src/hooks/`, `src/config/`

Die Base-Layer enthält alles, was für **jeden Feldhub-Kunden** gilt, unabhängig von
der Branche.

### Was gehört hier rein?
- UI-Primitives (Button, Card, Modal, Table, Form)
- Auth/RBAC System (NextAuth v5, Rollen, Permissions)
- Tenant-Konfiguration (tenant.ts, Zod-Schemas)
- API-Standards (OpenAPI Spec, Error-Handling, Rate-Limiting)
- Monitoring & Alerts (Uptime, Error-Tracking)
- Backup-Automatisierung (täglich, S3)
- CI/CD-Pipeline (GitHub Actions)
- Analytics (Plausible DSGVO-konform)
- Dark/Light Theme (next-themes, Tailwind CSS Vars)
- Import-Wizard (CSV/Excel mit KI-Mapping)

### Komponenten-Kategorien

| Kategorie | Beispiele |
|-----------|-----------|
| `ui/` | Button, Card, Badge, Modal, Table, Alert |
| `layout/` | Sidebar, Header, PageLayout, Nav |
| `auth/` | LoginForm, UserMenu, PermissionGate |
| `auftraege/` | Auftragsliste, AuftragForm (generisch) |
| `mitarbeiter/` | Mitarbeiterliste, ProfilCard (generisch) |
| `import/` | ImportWizard, ColumnMapper, Preview |

---

## Layer 2: Modules

**Pfad:** `src/modules/[branche]/`

Module sind **branchenspezifisch** und optional. Sie werden über `tenant.ts` aktiviert
und erweitern die Base-Layer mit domänenspezifischer Funktionalität.

### Modul-Struktur

```
src/modules/
├── forst/                    # Forstwirtschaft
│   ├── index.ts              # Public API des Moduls
│   ├── components/           # React-Komponenten
│   │   ├── RevierplanKarte.tsx
│   │   ├── BaumartenKatalog.tsx
│   │   ├── FoerderantragForm.tsx
│   │   ├── WaldkarteViewer.tsx
│   │   └── ForstRechtDoku.tsx
│   ├── hooks/                # React Hooks
│   │   ├── useRevierplan.ts
│   │   ├── useBaumarten.ts
│   │   └── useFoerderung.ts
│   ├── types/                # TypeScript Types
│   │   └── index.ts
│   └── utils/                # Hilfsfunktionen
│       ├── baumarten.ts
│       └── foerderung.ts
├── landschaftsbau/           # (Geplant: Kunde #2)
├── tiefbau/                  # (Geplant: Zukunft)
└── agrar/                    # (Geplant: Zukunft)
```

### Aktivierung via tenant.ts

```typescript
// src/config/tenants/koch-aufforstung.ts
export const kochAufforstungConfig: TenantConfig = {
  modules: {
    // Base-Module (für alle)
    dashboard: { enabled: true },
    auftraege: { enabled: true },
    mitarbeiter: { enabled: true },
    
    // Forst-Module (Branchenspezifisch)
    forst: {
      enabled: true,
      features: {
        revierplan: true,
        baumartenKatalog: true,
        foerderantrag: true,
        waldkarte: true,
        forstRechtDoku: true,
      }
    }
  }
};
```

### Modul-Feature-Flags

Innerhalb eines Moduls können einzelne Features aktiviert/deaktiviert werden:

```typescript
// Beispiel: Forst-Modul check in einer Komponente
import { useTenant } from '@/hooks/useTenant';

function ForstNavigation() {
  const { isModuleEnabled, isFeatureEnabled } = useTenant();
  
  if (!isModuleEnabled('forst')) return null;
  
  return (
    <nav>
      {isFeatureEnabled('forst.revierplan') && <RevierplanLink />}
      {isFeatureEnabled('forst.waldkarte') && <WaldkarteLink />}
      {isFeatureEnabled('forst.foerderantrag') && <FoerderantragLink />}
    </nav>
  );
}
```

---

## Layer 3: Tenant

**Pfad:** `src/config/tenants/[kunde].ts`

Der Tenant-Layer ist **kundenspezifisch** und überschreibt Defaults aus Base + Modules.
Hier werden Branding, Texte, Feature-Flags und Integrationen pro Kunde konfiguriert.

### Was gehört hier rein?
- Kundendaten (Name, Logo-URL, Farben, Schriften)
- Welche Base-Module sind aktiv?
- Welche Branchenmodule + Features sind aktiv?
- Integrations-Konfiguration (Nextcloud, WordPress, Stripe)
- Tenant-spezifische Texte und Übersetzungen
- SMTP, Backup, Monitoring-Einstellungen

### Beispiel-Konfiguration

```typescript
// src/config/tenants/muster-gmbh.ts
import { TenantConfig } from '../tenant';

export const musterGmbhConfig: TenantConfig = {
  id: 'muster-gmbh',
  name: 'Muster GmbH',
  logo: { url: '/logos/muster-gmbh.svg', alt: 'Muster GmbH Logo' },
  
  colors: {
    primary: '#1A6B4A',
    secondary: '#F5C842',
    // ... weitere Farben
  },
  
  modules: {
    dashboard: { enabled: true },
    auftraege: { enabled: true },
    mitarbeiter: { enabled: true },
    
    // Forst-Modul aktivieren
    forst: {
      enabled: true,
      features: {
        revierplan: true,
        baumartenKatalog: true,
        foerderantrag: false,   // Kunde nutzt Förderung nicht
        waldkarte: true,
        forstRechtDoku: false,
      }
    }
  },
  
  integrations: {
    nextcloud: {
      enabled: true,
      config: { baseUrl: 'https://cloud.muster-gmbh.de', basePath: '/Feldhub/' }
    }
  }
};
```

---

## Neuen Kunden anlegen — Checkliste

1. **Tenant-Config erstellen:**  
   `cp src/config/tenants/demo.ts src/config/tenants/[kunde].ts`

2. **Branche bestimmen:**  
   Welche Module braucht der Kunde? (`forst`, `landschaftsbau`, etc.)

3. **Feature-Flags setzen:**  
   In der neuen `[kunde].ts` nur aktivieren was gebraucht wird

4. **TENANT_ID env setzen:**  
   In Vercel/`.env.local` auf die neue Tenant-ID

5. **Testen:**  
   `npm run dev` → prüfe Navigation, Farbschema, Module

6. **Deploy:**  
   `git push` → Vercel auto-deploy (eigenes Projekt pro Tenant)

---

## Modul-Erstellung — Template

Neues Branchenmodul anlegen:

```bash
mkdir -p src/modules/[branche]/{components,hooks,types,utils}
touch src/modules/[branche]/index.ts
```

`index.ts` exportiert die Public API:
```typescript
// src/modules/[branche]/index.ts
export * from './components';
export * from './hooks';
export * from './types';
```

Dann in `tenant.ts` (TenantModulesSchema) ein neues Schema-Feld hinzufügen:
```typescript
forst: TenantForstModuleSchema.optional(),
landschaftsbau: TenantLandschaftsbauModuleSchema.optional(),
```

---

## Entscheidungsbaum: Wo kommt Code hin?

```
Neue Komponente/Funktion:
       │
       ▼
Ist es für ALLE Kunden relevant?
       │
   JA ─┼─ → Base Layer (src/components/ oder src/lib/)
       │
  NEIN ┼─ → Branchenspezifisch?
       │
   JA ─┼─ → Module Layer (src/modules/[branche]/)
       │
  NEIN ┼─ → Tenant-spezifisch?
       │
   JA ─┼─ → Tenant Layer (src/config/tenants/[kunde].ts oder
            eigener Override)
```
