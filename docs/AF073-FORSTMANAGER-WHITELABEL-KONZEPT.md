# AF073 — ForstManager → White-Label-Version

> Delta-Analyse & Migrations-Plan: Was muss in ka-forstmanager abstrahiert werden um es als feldhub-base Template zu nutzen?

**Stand:** 31.03.2026  
**Autor:** Amadeus (Auto-Loop)  
**Referenz:** SPRINT-QUEUE.md Task AF073

---

## 1. Executive Summary

**Ziel:** ka-forstmanager als Referenz-Implementierung analysieren und die fehlenden Abstraktionen für feldhub-base identifizieren.

**Ergebnis:** ~70% des Codes ist bereits branchenunabhängig in feldhub-base vorhanden. ~30% sind forstspezifische Module die entweder als optionale Branchen-Module portiert oder durch generische Alternativen ersetzt werden müssen.

**Empfehlung:** 3-Layer-Architektur konsequent umsetzen:
1. **Core Layer** (feldhub-base) — Branchenunabhängig, 100% wiederverwendbar
2. **Industry Layer** (src/modules/) — Branchen-Module (forst/, landschaftsbau/, bau/)
3. **Tenant Layer** (src/config/tenants/) — Kundenspezifische Konfiguration

---

## 2. Repo-Vergleich: Strukturanalyse

### 2.1 ka-forstmanager — Dateistruktur

```
src/
├── app/(dashboard)/
│   ├── dashboard/
│   ├── auftraege/           # ~80% generisch, 20% forstspezifisch
│   ├── mitarbeiter/         # 100% generisch
│   ├── protokolle/          # 95% generisch
│   ├── lager/               # 100% generisch
│   ├── fuhrpark/ (geraete/) # 100% generisch
│   ├── rechnungen/          # 100% generisch
│   ├── dokumente/           # 100% generisch
│   ├── lohn/                # 100% generisch
│   ├── stunden/             # 100% generisch
│   ├── kontakte/            # 100% generisch
│   ├── reports/             # 95% generisch
│   ├── profil/              # 100% generisch
│   ├── admin/               # 100% generisch
│   │
│   ├── saatguternte/        # ❌ 100% forstspezifisch (15+ Screens)
│   ├── foerderung/          # ❌ 95% forstspezifisch
│   ├── abnahmen/            # ⚠️ 50% generisch (Signatur = generisch)
│   ├── qualifikationen/     # ⚠️ 70% generisch (könnte Zertifikate heißen)
│   ├── gruppen/             # 100% generisch
│   ├── saisons/             # 100% generisch
│   ├── schulungen/          # 100% generisch
│   ├── wissensbank/         # ⚠️ 80% generisch (Second Brain = kundenspezifisch)
│   └── jahresuebersicht/    # 100% generisch
│
├── components/
│   ├── saatguternte/        # ❌ forstspezifisch
│   ├── foerderung/          # ❌ forstspezifisch
│   ├── abnahme/             # ⚠️ SignaturPad = generisch
│   ├── gruppen/             # 100% generisch
│   ├── auftraege/           # 90% generisch (GanttChart, Bulk)
│   ├── karten/              # 90% generisch (GPS, Polygon)
│   ├── kundenportal/        # 100% generisch
│   └── payments/            # 100% generisch (Zipayo)
│
└── lib/
    ├── secondbrain-db.ts    # ❌ forstspezifisch (RAG für Forstwissen)
    ├── foerderung/          # ❌ forstspezifisch
    ├── nextcloud.ts         # 100% generisch
    └── ...                  # Rest generisch
```

### 2.2 feldhub-base — Bereits vorhanden

```
src/
├── config/
│   ├── tenant.ts            # ✅ Vollständiges Zod-Schema
│   └── tenants/             # ✅ Demo + Koch Aufforstung Beispiel
│
├── modules/
│   ├── forst/               # ✅ Angelegt (Feature-Flags in tenant.ts)
│   └── payments/            # ✅ Zipayo-Integration
│
├── components/
│   ├── setup/SetupWizard    # ✅ Tenant-Onboarding
│   ├── providers/           # ✅ Theme, Plausible, Session
│   └── ...                  # Kopien aus ka-fm
│
├── cron/
│   ├── dsgvo-monitor.ts     # ✅ Compliance
│   ├── finance-review.ts    # ✅ Reporting
│   └── ...                  # ✅ Feldhub-spezifische Crons
│
└── lib/
    ├── theme/               # ✅ Contrast-Check, Theme-Generator
    ├── permissions.ts       # ✅ Role-based Access
    └── ...
```

---

## 3. Delta-Analyse: Was fehlt in feldhub-base?

### 3.1 Prisma-Schema Differenzen

| ka-forstmanager Model | feldhub-base Äquivalent | Status | Aktion |
|----------------------|------------------------|--------|--------|
| User | User | ✅ Identisch | — |
| Mitarbeiter | TeamMember | ✅ Mapping ok | Felder prüfen |
| Auftrag | Project | ⚠️ 80% | Wizard-Daten, GeoJSON fehlen |
| Saison | Season | ✅ Identisch | — |
| Gruppe | TeamGroup | ✅ Identisch | — |
| Rechnung | Invoice | ✅ Vorhanden | — |
| Dokument | Document | ✅ Vorhanden | — |
| Stundeneintrag | TimeEntry | ✅ Vorhanden | — |
| Lager* | Inventory* | ✅ Vorhanden | — |
| Geraet | Equipment | ✅ Vorhanden | — |
| **Saatguternte*** | — | ❌ Fehlt | → Forst-Modul |
| **Abnahme** | Inspection | ⚠️ Generalisieren | → Core |
| **Qualifikation** | Certification | ⚠️ Generalisieren | → Core |
| **Foerderprogramm** | — | ❌ Fehlt | → Forst-Modul |
| **Baumschule** | Supplier | ⚠️ Generalisieren | → Core |

### 3.2 Forstspezifische Module (müssen als Industry-Module portiert werden)

#### A) Saatguternte-Modul (src/modules/forst/saatguternte/)

**Screens:**
- `/saatguternte` — Übersicht
- `/saatguternte/ernte` — Ernte-Protokolle
- `/saatguternte/ernte/neu` — Neue Ernte
- `/saatguternte/ernte/statistik` — Ernte-Statistik
- `/saatguternte/register` — Flächen-Register
- `/saatguternte/register/[id]` — Flächen-Detail
- `/saatguternte/scout/[id]` — Scout-Ansicht
- `/saatguternte/baumschulen/[id]` — Baumschul-Detail
- `/saatguternte/gruppen` — Sammelgruppen
- `/saatguternte/vertrag` — Verträge
- `/saatguternte/anfragen` — Anfragen
- `/saatguternte/crawler` — Preiscrawler

**Prisma Models:**
- SaatgutFlaeche
- SaatgutErnte
- SaatgutAnfrage
- SaatgutVertrag
- Baumschule
- BaumschulAngebot

**Aufwand:** ~40h (komplex, viele Relationen)

#### B) Förderung-Modul (src/modules/forst/foerderung/)

**Screens:**
- `/foerderung` — Übersicht
- `/foerderung/praxis` — Praxis-Statistik
- `/foerderung/dashboard` — Förder-Dashboard

**Components:**
- FoerderungWidget
- BeratungsErgebnis (KI-gestützt)
- AuftragFoerderCheck
- FristenWidget
- PraxisFormular / PraxisStatistik

**Lib:**
- `lib/foerderung/konditions-pruefung.ts`
- Second Brain RAG (lib/secondbrain-db.ts)

**Prisma Models:**
- Foerderprogramm (255 Programme)
- FoerderPraxisfall

**Aufwand:** ~25h (inkl. KI-Integration)

### 3.3 Generalisierbare Module (sollten in Core)

#### A) Abnahmen → Inspections

**Generalisierung:**
- `Abnahme` → `Inspection` (Qualitätsprüfung, Bauabnahme, TÜV, etc.)
- `AbnahmeTyp` konfigurierbar per Tenant (forst: "Kulturabnahme", bau: "Bauabnahme")
- SignaturPad bereits generisch

**Felder:**
- auftragId → projectId
- abnehmer → inspector
- status: offen/bestanden/nacharbeit
- fotos, unterschrift, protokoll

**Aufwand:** ~8h

#### B) Qualifikationen → Certifications

**Generalisierung:**
- `Qualifikation` → `Certification`
- Typen per Tenant: Führerschein, Kettensäge-Schein, Ersthelfer, Staplerschein, etc.
- Ablaufdatum-Tracking + Reminder

**Aufwand:** ~4h

#### C) Wissensbank → Knowledge Base

**Generalisierung:**
- Branchen-agnostische Knowledge-Base-Architektur
- RAG-Pipeline bleibt optional (nur wenn KI-Budget vorhanden)
- Vector-DB (pgvector) als optionale Integration

**Aufwand:** ~12h für Abstraktion

---

## 4. 3-Layer-Architektur Detailplan

### 4.1 Verzeichnisstruktur (Ziel)

```
feldhub-base/
├── src/
│   ├── core/                    # Layer 1: Branchenunabhängig
│   │   ├── components/          # Generische UI-Komponenten
│   │   ├── lib/                 # Utils, Auth, Permissions
│   │   └── prisma/              # Core-Models
│   │
│   ├── modules/                 # Layer 2: Branchen-Module
│   │   ├── forst/               # 🌲 Forstwirtschaft
│   │   │   ├── saatguternte/    # Saatgut-Management
│   │   │   ├── foerderung/      # Förder-Beratung + RAG
│   │   │   └── index.ts         # Modul-Registry
│   │   │
│   │   ├── landschaftsbau/      # 🌳 Landschaftsbau (Kunde #2)
│   │   │   ├── pflanzplan/
│   │   │   └── gelaende/
│   │   │
│   │   ├── bau/                 # 🏗️ Bau/Tiefbau (zukünftig)
│   │   │   ├── bautagebuch/
│   │   │   └── bauabnahme/
│   │   │
│   │   └── payments/            # 💳 Zahlungs-Module
│   │       ├── zipayo/          # Zipayo QR/Terminal
│   │       └── mollie/          # SEPA B2B (geplant)
│   │
│   └── config/                  # Layer 3: Tenant-Konfiguration
│       └── tenants/
│           ├── demo.ts
│           ├── koch-aufforstung.ts
│           └── [neuer-kunde].ts
│
└── prisma/
    ├── schema.prisma            # Core-Models
    └── modules/
        ├── forst.prisma         # Forst-spezifische Models
        └── landschaftsbau.prisma
```

### 4.2 Modul-Registry System

```typescript
// src/modules/registry.ts
export interface IndustryModule {
  id: string;
  name: string;
  description: string;
  routes: RouteConfig[];
  sidebarItems: SidebarItem[];
  prismaModels: string[];
  requiredFeatures: string[];
}

export const moduleRegistry = new Map<string, IndustryModule>();

// src/modules/forst/index.ts
import { moduleRegistry } from '../registry';

moduleRegistry.set('forst', {
  id: 'forst',
  name: 'Forstwirtschaft',
  description: 'Saatguternte, Förderberatung, Waldkarten',
  routes: [
    { path: '/saatguternte', component: SaatguerteOverview },
    { path: '/foerderung', component: FoerderungDashboard },
  ],
  sidebarItems: [
    { label: 'Saatguternte', icon: 'Leaf', href: '/saatguternte' },
    { label: 'Förderung', icon: 'Euro', href: '/foerderung' },
  ],
  prismaModels: ['SaatgutFlaeche', 'SaatgutErnte', 'Foerderprogramm'],
  requiredFeatures: ['forst.saatguternte', 'forst.foerderung'],
});
```

### 4.3 Feature-Flag Aktivierung

```typescript
// src/config/tenants/koch-aufforstung.ts
export const kochAufforstungConfig: TenantConfig = {
  id: 'koch-aufforstung',
  name: 'Koch Aufforstung GmbH',
  // ...
  modules: {
    // Core-Module
    dashboard: { enabled: true },
    auftraege: { enabled: true, label: 'Aufträge' },
    mitarbeiter: { enabled: true },
    // ...

    // Industry-Module: Forst
    forst: {
      enabled: true,
      features: {
        saatguternte: true,
        foerderantrag: true,
        waldkarte: true,
        baumartenKatalog: true,
      },
    },
  },
};
```

---

## 5. Migrations-Plan: Schritt-für-Schritt

### Phase 1: Schema-Harmonisierung (8h)
- [ ] Prisma-Schema: ka-fm spezifische Felder in metadata:Json verschieben
- [ ] Prisma-Schema: Multi-Schema für Module (forst.prisma)
- [ ] Migration-Scripts für bestehende Daten

### Phase 2: Core-Extraktion (16h)
- [ ] Abnahme → Inspection Model + Screens
- [ ] Qualifikation → Certification Model + Screens
- [ ] Baumschule → Supplier (generischer Lieferant)
- [ ] Tests für Core-Komponenten

### Phase 3: Forst-Modul Portierung (40h)
- [ ] src/modules/forst/ Verzeichnis erstellen
- [ ] Saatguternte-Screens + Komponenten verschieben
- [ ] Förderungs-Screens + Komponenten verschieben
- [ ] Second Brain Abstraktion (optionale RAG-Integration)
- [ ] Forst-Prisma-Models extrahieren

### Phase 4: Registry + Routing (12h)
- [ ] Module-Registry implementieren
- [ ] Dynamic Routing für aktivierte Module
- [ ] Sidebar-Generation aus Registry
- [ ] Feature-Gate Komponenten

### Phase 5: Testing + Validation (16h)
- [ ] E2E Tests für Koch Aufforstung (alle Features)
- [ ] E2E Tests für Demo-Tenant (nur Core)
- [ ] Playwright-Tests für jeden Screen
- [ ] Performance-Benchmarks

### Phase 6: Dokumentation (8h)
- [ ] README.md für Module-Entwicklung
- [ ] Tenant-Onboarding Guide
- [ ] API-Dokumentation für Module

**Gesamtaufwand:** ~100h (~2,5 Wochen bei 40h/Woche)

---

## 6. Empfehlungen

### 6.1 Sofort umsetzbar (Quick Wins)

1. **Inspection Model** in Core aufnehmen — generische Qualitätsprüfungen
2. **Certification Model** in Core — Mitarbeiter-Zertifikate/Qualifikationen
3. **Supplier Model** in Core — ersetzt Baumschule durch generischen Lieferanten

### 6.2 Mittelfristig (vor Kunde #2)

1. **Module-Registry** implementieren für dynamisches Routing
2. **Forst-Modul** vollständig in src/modules/forst/ extrahieren
3. **Landschaftsbau-Modul** Template anlegen (leer, für Kunde #2)

### 6.3 Technische Schulden

1. **Second Brain / RAG:** Aktuell hardcoded auf Forstwissen — abstrahieren zu generischer Knowledge-Base mit konfigurierbarer Datenquelle
2. **Wizard-Daten im Auftrag:** wizardDaten:Json ist WP-spezifisch — braucht Abstraktion für andere Integrationen
3. **GeoJSON Flächen:** Gut generisch, aber nur für Forst genutzt — in Core dokumentieren

---

## 7. Fazit

**Ka-ForstManager ist ein solides Referenz-Produkt.** Die Architektur ist ~70% generisch, aber die forstspezifischen Module (Saatguternte, Förderung) sind tief integriert.

**Feldhub-base ist gut vorbereitet:**
- Tenant-System mit Zod-Validation ✅
- Feature-Flags für Branchen-Module ✅
- Theme-System ✅
- Modul-Verzeichnis angelegt ✅

**Nächster Meilenstein:** Phase 1 (Schema-Harmonisierung) sollte vor Kunde #2 abgeschlossen sein. Die Modul-Registry (Phase 4) ist der kritische Pfad für echte Wiederverwendbarkeit.

---

**Erstellt:** 31.03.2026 20:00 Uhr  
**Task:** AF073  
**Commit:** wird in diesem Loop erstellt
