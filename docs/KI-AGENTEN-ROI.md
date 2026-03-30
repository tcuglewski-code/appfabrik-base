# KI-Agenten ROI Tracking — Feldhub

> Sprint JE | Stand: März 2026

## Überblick

Dieses Dokument definiert, wie der Return on Investment (ROI) der eingesetzten KI-Agenten gemessen, getrackt und kommuniziert wird. Es dient als Grundlage für Business-Entscheidungen, Kunden-Reporting und interne Optimierung.

---

## 1. ROI-Metriken Framework

### Zwei Dimensionen

```
ROI = (Wert durch KI) - (Kosten für KI)
      ────────────────────────────────────
              (Kosten für KI)
```

**Wert durch KI** = Eingesparte Arbeitsstunden × Stundensatz + Qualitätssteigerung + Umsatzbeitrag
**Kosten für KI** = LLM API-Kosten + Infrastruktur + Implementierungszeit

---

## 2. Wert-Metriken pro Agenten-Typ

### 2.1 Entwicklungs-Agenten (Volt, Bruno, Nomad, Archie)

| Metrik | Messung | Ziel |
|--------|---------|------|
| Code-Lines pro $1 LLM-Kosten | LOC / Kosten | > 500 LOC/$1 |
| Tasks completed pro Woche | MC-Tasks Status → Done | > 15/Woche |
| Bug-Rate (KI vs. Mensch) | Bugs gemeldet / Feature | < 0.5 Bugs/Feature |
| Time-to-Feature (Std) | Ticket erstellt → Deployed | < 4h für Medium Tasks |
| Review-Runden nötig | PR review cycles | < 2 Runden |

### 2.2 Sales & Marketing Agenten (Quill, Pixel, JA-MarketingOS)

| Metrik | Messung | Ziel |
|--------|---------|------|
| Content-Pieces pro $1 | Outputs / LLM-Kosten | > 10/$1 |
| Lead-Conversion Rate | Leads → Demos | > 15% |
| Website Traffic durch Content | Google Search Console | +20% MoM |
| Angebot-Erstellungszeit | Minuten pro Angebot | < 15 min |
| Content-Approval-Rate | Tomek akzeptiert ohne Änderung | > 70% |

### 2.3 Operations-Agenten (Argus, Amadeus-Loop)

| Metrik | Messung | Ziel |
|--------|---------|------|
| Incidents verhindert | Argus Alerts → kritisch | 0 kritische/Monat |
| Sprint-Velocity | Erledigte Tasks/Sprint-Loop | > 4/5 Sprints erfolgreich |
| Dokumentations-Coverage | Docs vorhanden / Features | > 85% |
| Onboarding-Zeit neuer Tenant | Setup → Live (Tage) | < 3 Tage |

### 2.4 Research-Agenten (Sylvia, Perplexity-Cron)

| Metrik | Messung | Ziel |
|--------|---------|------|
| Förderquoten-Erhöhung | Fördergelder / Antrag | +15% vs. ohne KI |
| Recherche-Zeit gespart | Std/Woche | > 10h/Woche |
| Qualität Recherche-Reports | Tomek-Rating 1-5 | > 4.0 |

---

## 3. Baseline: Ohne KI (Vergleichswert)

### Geschätzter Aufwand ohne KI-Agenten

| Aufgabe | Mit KI (Std) | Ohne KI (Std) | Ersparnis |
|---------|-------------|---------------|-----------|
| Feature entwickeln (Medium) | 2 | 8 | 6h |
| Blog-Artikel schreiben | 0.5 | 3 | 2.5h |
| Rechtsdokument erstellen | 1 | 10 | 9h |
| Security Audit (komplett) | 0.5 | 8 | 7.5h |
| Branchen-Recherche | 1 | 5 | 4h |
| Sprint-Planung | 0.2 | 1 | 0.8h |
| **Pro Woche gesamt** | **~20h** | **~100h** | **~80h** |

**Stundensatz Senior Developer:** €80/Stunde
**Ersparnis pro Woche:** 80h × €80 = **€6.400**
**Monatlich:** **€27.600 eingesparte Kosten**
**LLM-Kosten/Monat:** **~$400 (~€370)**
**ROI:** **7.359%** 🚀

---

## 4. Tracking Implementation

### Mission Control Dashboard Schema

```typescript
// ROI-Tracking-Datenpunkt
interface AgentROISnapshot {
  date: string;                    // ISO date YYYY-MM-DD
  agentId: string;
  
  // Kosten
  llmCostUsd: number;
  
  // Output-Metriken
  tasksCompleted: number;
  linesOfCode?: number;
  contentPieces?: number;
  
  // Zeit-Metriken
  estimatedHoursSaved: number;
  hourlyRateFallback: number;       // Standard: 80 EUR
  
  // Berechneter Wert
  valueCreatedEur: number;          // estimatedHoursSaved × hourlyRateFallback
  roiPercent: number;               // ((value - cost) / cost) * 100
}
```

### Wöchentlicher ROI-Report (Cron)

```typescript
// scripts/weekly-roi-report.ts
// Führt jeden Montag um 8:00 Uhr aus

import { logUsage, MODEL_PRICING } from '../src/lib/llm-cost-tracker';

async function generateWeeklyROIReport() {
  const mcBase = 'https://mission-control-tawny-omega.vercel.app';
  const token = process.env.AMADEUS_TOKEN;
  
  // 1. Hole Nutzungsdaten der letzten 7 Tage von MC
  const usageRes = await fetch(`${mcBase}/api/ai/usage?days=7`, {
    headers: { 'x-amadeus-token': token ?? '' }
  });
  
  // 2. Berechne aggregierten ROI
  // 3. Erstelle Markdown-Report
  // 4. Speichere in docs/research/roi-YYYY-WW.md
  // 5. Optional: Sende Zusammenfassung an Amadeus
}
```

---

## 5. ROI-Kommunikation gegenüber Kunden

### Für Koch Aufforstung (Pilotbeispiel)

```
KI-Agenten Mehrwert — Monatsbericht

Dieser Monat durch KI-Automatisierung erreicht:
✅ 18 Features deployed (ø 2h vs. 8h ohne KI)
✅ 3 Security-Audits durchgeführt (0 kritische Lücken)
✅ 12 Blog/Content-Pieces erstellt
✅ 4 Förderprogramme analysiert (+2 neue Anträge empfohlen)

Eingesparte Entwicklerzeit: ~75 Stunden
Bei €80/Std. entspricht das: €6.000 Wert
Ihre monatliche Feldhub-Gebühr: €449

ROI für Sie als Kunde: 1.237%
```

→ Diese Kommunikation ist ein starkes Argument für Vertragsverlängerung und Preiserhöhungen.

---

## 6. Dashboard Wireframe (Mission Control)

```
┌─────────────────────────────────────────────────────────┐
│  🤖 KI-Agenten ROI Dashboard                    [7T|30T|3M] │
├─────────────────────┬───────────────┬───────────────────┤
│ Gesamter Wert       │ LLM-Kosten    │ ROI               │
│ €27.600/Mo          │ $394/Mo       │ 7.359%            │
├─────────────────────┴───────────────┴───────────────────┤
│ Top Performer                                            │
│ 1. Bruno (WP Dev)     ROI: 9.200%  ████████████         │
│ 2. Quill (Content)    ROI: 8.100%  ███████████          │
│ 3. Amadeus (Loop)     ROI: 7.800%  ██████████           │
├─────────────────────────────────────────────────────────┤
│ Wert-Zeitreihe [Linie] LLM-Kosten [Balken]              │
│ 📈 +12% MoM Produktivität                                │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Nächste Schritte

- [ ] MC Dashboard `/dashboard/roi` implementieren (Volt-Task, Prio MEDIUM)
- [ ] `AgentROISnapshot` in MC Prisma Schema ergänzen
- [ ] Wöchentlicher ROI-Cron aktivieren (jeden Montag 8:00)
- [ ] Kunden-Report-Template für Koch Aufforstung nutzen (Sprint JO: Monatlicher Kunden-Report)
- [ ] ROI-Zahlen in Pitch Deck und Sales-Materialien integrieren
