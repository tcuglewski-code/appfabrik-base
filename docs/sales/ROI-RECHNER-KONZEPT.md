# ROI-Rechner Feldhub — Konzept & Implementierung

> Sprint JH | Stand: März 2026

## Ziel

Ein interaktiver ROI-Rechner auf der Feldhub Website und (später) als WordPress-Seite für Koch Aufforstung, der Interessenten in < 2 Minuten zeigt, wie viel sie mit Feldhub einsparen.

**Psychologisches Ziel:** Interessent rechnet selbst und überzeugt sich damit selbst.
**Conversion-Ziel:** Direkt nach dem Rechner → "Jetzt Beratungstermin buchen"-CTA.

---

## Berechnungs-Logik

### Eingaben (Slider/Input)

```
1. Mitarbeiter im Außendienst:    [5 – 100] Standard: 20
2. Arbeitsstunden/Woche (Team):   [20 – 400h] (autom. = Mitarb × 40h)
3. Anteil Dokumentation:          [10% – 40%] Standard: 25%
4. Durchschnittlicher Stundenlohn: [€12 – €40] Standard: €18
5. Branche:                       [Dropdown]
6. Aufträge/Monat:                [10 – 500]
```

### Berechnungen

```
Dokumentationszeit/Woche = Mitarbeiter × Arbeitsstunden × Anteil
Wöchentliche Kosten Doku  = Dokumentationszeit × Stundenlohn

KI-Ersparnis (70% der Doku-Zeit = automatisiert):
  Eingesparte Stunden/Woche = Dokumentationszeit × 0.70
  Eingesparte Kosten/Monat  = Eingesparte Stunden/Woche × 4.33 × Stundenlohn

Fehler-Reduktion (geschätzt):
  Kosten pro Fehler/Nacharbeit = Stundenlohn × 3h
  Fehler/Monat = Aufträge × 0.05 (5% Fehlerquote)
  Ersparnis Fehler = Fehler × 0.60 × Kosten pro Fehler

GPS + Routenplanung:
  Fahrtkostenersparnis = Mitarbeiter × €50/Monat (geschätzt 10% Effizienz)

GESAMT Ersparnis/Monat:
  = Doku-Ersparnis + Fehler-Ersparnis + Fahrtkosten-Ersparnis

ROI-Berechnung:
  Feldhub Professional = €449/Monat
  Ersparnis - €449 = Netto-Gewinn/Monat
  ROI % = (Netto-Gewinn / €449) × 100
  Amortisation Setup (€4.990) = Setup / Netto-Gewinn (Monate)
```

---

## React-Komponente

```tsx
// src/components/ROICalculator.tsx
'use client';

import { useState, useMemo } from 'react';

interface ROIInputs {
  employees: number;
  docPercent: number;
  hourlyRate: number;
  ordersPerMonth: number;
  branch: string;
}

interface ROIResult {
  savedHoursPerWeek: number;
  savedCostPerMonth: number;
  errorSavings: number;
  gpsGains: number;
  totalSavingsPerMonth: number;
  feldhubCost: number;
  netGainPerMonth: number;
  roiPercent: number;
  amortizationMonths: number;
}

function calculateROI(inputs: ROIInputs): ROIResult {
  const { employees, docPercent, hourlyRate, ordersPerMonth } = inputs;

  const hoursPerWeekTeam = employees * 40;
  const docHoursPerWeek = hoursPerWeekTeam * (docPercent / 100);
  const savedHoursPerWeek = docHoursPerWeek * 0.7;
  const savedCostPerMonth = savedHoursPerWeek * 4.33 * hourlyRate;

  const errorsPerMonth = ordersPerMonth * 0.05;
  const costPerError = hourlyRate * 3;
  const errorSavings = errorsPerMonth * 0.6 * costPerError;

  const gpsGains = employees * 50;

  const totalSavingsPerMonth = savedCostPerMonth + errorSavings + gpsGains;
  const feldhubCost = 449;
  const netGainPerMonth = totalSavingsPerMonth - feldhubCost;
  const roiPercent = Math.round((netGainPerMonth / feldhubCost) * 100);
  const amortizationMonths = netGainPerMonth > 0
    ? Math.ceil(4990 / netGainPerMonth)
    : 99;

  return {
    savedHoursPerWeek: Math.round(savedHoursPerWeek),
    savedCostPerMonth: Math.round(savedCostPerMonth),
    errorSavings: Math.round(errorSavings),
    gpsGains: Math.round(gpsGains),
    totalSavingsPerMonth: Math.round(totalSavingsPerMonth),
    feldhubCost,
    netGainPerMonth: Math.round(netGainPerMonth),
    roiPercent,
    amortizationMonths,
  };
}

const BRANCHES = [
  'Forstwirtschaft / Aufforstung',
  'Landschaftsbau / Gartenbau',
  'Tiefbau / Straßenbau',
  'Landwirtschaft / Agrar',
  'Gebäudereinigung',
  'Anderer Außendienst',
];

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    employees: 20,
    docPercent: 25,
    hourlyRate: 18,
    ordersPerMonth: 50,
    branch: BRANCHES[0],
  });

  const result = useMemo(() => calculateROI(inputs), [inputs]);

  const update = (key: keyof ROIInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const fmt = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        🧮 Was spart Feldhub Ihrem Betrieb?
      </h2>
      <p className="text-gray-500 mb-8">
        Antworten Sie auf 4 Fragen — wir rechnen den Rest.
      </p>

      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Mitarbeiter im Außendienst: <span className="text-green-700">{inputs.employees}</span>
          </label>
          <input
            type="range" min={3} max={100} value={inputs.employees}
            onChange={e => update('employees', Number(e.target.value))}
            className="w-full accent-green-700"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>3</span><span>100</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Zeit für Dokumentation: <span className="text-green-700">{inputs.docPercent}%</span> der Arbeitszeit
          </label>
          <input
            type="range" min={10} max={40} value={inputs.docPercent}
            onChange={e => update('docPercent', Number(e.target.value))}
            className="w-full accent-green-700"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>10%</span><span>40%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Durchschnittlicher Stundenlohn: <span className="text-green-700">€{inputs.hourlyRate}</span>
          </label>
          <input
            type="range" min={12} max={45} value={inputs.hourlyRate}
            onChange={e => update('hourlyRate', Number(e.target.value))}
            className="w-full accent-green-700"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>€12</span><span>€45</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Aufträge / Monat: <span className="text-green-700">{inputs.ordersPerMonth}</span>
          </label>
          <input
            type="range" min={10} max={500} step={10} value={inputs.ordersPerMonth}
            onChange={e => update('ordersPerMonth', Number(e.target.value))}
            className="w-full accent-green-700"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>10</span><span>500</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ihre Branche</label>
          <select
            value={inputs.branch}
            onChange={e => update('branch', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
          >
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">Ihr Ergebnis</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-700">
              {result.savedHoursPerWeek}h
            </div>
            <div className="text-xs text-gray-500 mt-1">gespart/Woche</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-700">
              {fmt(result.totalSavingsPerMonth)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Ersparnis/Monat</div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex justify-between">
            <span>Weniger Dokumentationsaufwand</span>
            <span className="font-semibold">{fmt(result.savedCostPerMonth)}</span>
          </div>
          <div className="flex justify-between">
            <span>Weniger Fehler & Nacharbeit</span>
            <span className="font-semibold">{fmt(result.errorSavings)}</span>
          </div>
          <div className="flex justify-between">
            <span>Routenplanung & GPS</span>
            <span className="font-semibold">{fmt(result.gpsGains)}</span>
          </div>
          <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-green-800">
            <span>Feldhub Professional (mtl.)</span>
            <span>- {fmt(result.feldhubCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-green-900">
            <span>Netto-Gewinn/Monat</span>
            <span>{fmt(result.netGainPerMonth)}</span>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="flex-1 bg-green-700 text-white rounded-lg p-3">
            <div className="text-2xl font-bold">{result.roiPercent}%</div>
            <div className="text-xs opacity-80">ROI</div>
          </div>
          <div className="flex-1 bg-green-800 text-white rounded-lg p-3">
            <div className="text-2xl font-bold">
              {result.amortizationMonths < 99 ? `${result.amortizationMonths}Mo` : '—'}
            </div>
            <div className="text-xs opacity-80">Amortisation</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <a
          href="/kontakt"
          className="inline-block bg-green-700 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-800 transition-colors text-lg"
        >
          Kostenloses Beratungsgespräch buchen →
        </a>
        <p className="text-xs text-gray-400 mt-2">
          Keine Verpflichtung · 30 Minuten · Persönlich mit Tomek Cuglewski
        </p>
      </div>
    </div>
  );
}

export default ROICalculator;
```

---

## WordPress Integration (Shortcode)

Für die WP-Seite (Koch Aufforstung oder Feldhub-WP-Site) kann die Komponente als iFrame oder via WP-Block eingebettet werden:

```php
// In Bruno's Plugin: roi-calculator shortcode
add_shortcode('feldhub_roi_rechner', function() {
  return '<div id="feldhub-roi-root"></div>
    <script src="https://feldhub.de/roi-calculator/widget.js"></script>';
});
```

→ Alternativ: Stand-alone React-App auf Vercel deployen, iFrame einbetten.

---

## Deployment-Plan

1. **Feldhub Website** (Next.js): Komponente direkt in `/seiten/roi-rechner` integrieren
2. **Koch Aufforstung WP**: Shortcode `[feldhub_roi_rechner]` in Bruno-Plugin
3. **A/B Test**: ROI-Rechner in Sales-E-Mails als Link teilen → Conversion messen
4. **Lead-Capture**: Nach Berechnung optionales "Ergebnis per E-Mail senden" Formular

---

## Tracking

```typescript
// Plausible Custom Event
plausible('ROI Calculator Used', {
  props: {
    employees: inputs.employees,
    branch: inputs.branch,
    roi_percent: result.roiPercent,
    net_gain: result.netGainPerMonth,
  }
});

// Bei CTA-Klick
plausible('ROI Calculator CTA Click', {
  props: { roi_percent: result.roiPercent }
});
```
