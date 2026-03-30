'use client';

/**
 * ROI Calculator — Feldhub
 * Sprint JH: Interaktiver Einspar-Rechner für Interessenten
 *
 * Einbindung:
 *   import { ROICalculator } from '@/components/sales/ROICalculator';
 *   <ROICalculator />
 *
 * Tracking via Plausible (optional, kein import nötig — window.plausible)
 */

import { useState, useMemo, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Branches ────────────────────────────────────────────────────────────────

const BRANCHES = [
  'Forstwirtschaft / Aufforstung',
  'Landschaftsbau / Gartenbau',
  'Tiefbau / Straßenbau',
  'Landwirtschaft / Agrar',
  'Gebäudereinigung',
  'Anderer Außendienst',
] as const;

const FELDHUB_MONTHLY_COST = 449; // Professional Paket
const FELDHUB_SETUP_FEE = 4990;

// ─── Core Calculation ────────────────────────────────────────────────────────

function calculateROI(inputs: ROIInputs): ROIResult {
  const { employees, docPercent, hourlyRate, ordersPerMonth } = inputs;

  // Documentation savings
  const hoursPerWeekTeam = employees * 40;
  const docHoursPerWeek = hoursPerWeekTeam * (docPercent / 100);
  const savedHoursPerWeek = Math.round(docHoursPerWeek * 0.7);
  const savedCostPerMonth = savedHoursPerWeek * 4.33 * hourlyRate;

  // Error reduction savings (5% error rate, 60% reducible)
  const errorsPerMonth = ordersPerMonth * 0.05;
  const costPerError = hourlyRate * 3;
  const errorSavings = errorsPerMonth * 0.6 * costPerError;

  // GPS + routing efficiency (~€50/employee/month)
  const gpsGains = employees * 50;

  // Totals
  const totalSavingsPerMonth = savedCostPerMonth + errorSavings + gpsGains;
  const netGainPerMonth = totalSavingsPerMonth - FELDHUB_MONTHLY_COST;
  const roiPercent = FELDHUB_MONTHLY_COST > 0
    ? Math.round((netGainPerMonth / FELDHUB_MONTHLY_COST) * 100)
    : 0;
  const amortizationMonths = netGainPerMonth > 0
    ? Math.ceil(FELDHUB_SETUP_FEE / netGainPerMonth)
    : 99;

  return {
    savedHoursPerWeek,
    savedCostPerMonth: Math.round(savedCostPerMonth),
    errorSavings: Math.round(errorSavings),
    gpsGains: Math.round(gpsGains),
    totalSavingsPerMonth: Math.round(totalSavingsPerMonth),
    feldhubCost: FELDHUB_MONTHLY_COST,
    netGainPerMonth: Math.round(netGainPerMonth),
    roiPercent,
    amortizationMonths,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
  return n.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && (window as { plausible?: Function }).plausible) {
    (window as { plausible: Function }).plausible(name, { props });
  }
}

// ─── Slider Component ─────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, format, onChange }: SliderProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}: <span className="text-green-700 font-bold">{format(value)}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-green-700 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    employees: 20,
    docPercent: 25,
    hourlyRate: 18,
    ordersPerMonth: 50,
    branch: BRANCHES[0],
  });

  const [ctaClicked, setCtaClicked] = useState(false);

  const result = useMemo(() => calculateROI(inputs), [inputs]);

  const update = useCallback(<K extends keyof ROIInputs>(key: K, value: ROIInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCTAClick = () => {
    setCtaClicked(true);
    trackEvent('ROI Calculator CTA Click', {
      roi_percent: result.roiPercent,
      employees: inputs.employees,
      branch: inputs.branch,
    });
  };

  // Track when user interacts
  const handleSliderChange = <K extends keyof ROIInputs>(key: K, value: ROIInputs[K]) => {
    update(key, value);
    trackEvent('ROI Calculator Used', {
      employees: inputs.employees,
      branch: inputs.branch,
      roi_percent: result.roiPercent,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🧮 Was spart Feldhub Ihrem Betrieb?
        </h2>
        <p className="text-gray-500">
          Antworten Sie auf 4 Fragen — wir rechnen den Rest.
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        <Slider
          label="Mitarbeiter im Außendienst"
          value={inputs.employees}
          min={3} max={100}
          format={v => String(v)}
          onChange={v => handleSliderChange('employees', v)}
        />

        <Slider
          label="Anteil Dokumentation an Arbeitszeit"
          value={inputs.docPercent}
          min={10} max={40}
          format={v => `${v}%`}
          onChange={v => handleSliderChange('docPercent', v)}
        />

        <Slider
          label="Durchschnittlicher Stundenlohn"
          value={inputs.hourlyRate}
          min={12} max={45}
          format={v => `€${v}`}
          onChange={v => handleSliderChange('hourlyRate', v)}
        />

        <Slider
          label="Aufträge pro Monat"
          value={inputs.ordersPerMonth}
          min={10} max={500} step={10}
          format={v => String(v)}
          onChange={v => handleSliderChange('ordersPerMonth', v)}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Ihre Branche
          </label>
          <select
            value={inputs.branch}
            onChange={e => update('branch', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-bold text-green-900 mb-4">
          Ihre Einspar-Prognose
        </h3>

        {/* Big Numbers */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-700">
              {result.savedHoursPerWeek}h
            </div>
            <div className="text-xs text-gray-500 mt-1">gespart pro Woche</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-700">
              {fmtEur(result.totalSavingsPerMonth)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Ersparnis pro Monat</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 text-sm text-gray-700 mb-5">
          <div className="flex justify-between">
            <span>✅ Weniger Dokumentationsaufwand</span>
            <span className="font-semibold">{fmtEur(result.savedCostPerMonth)}</span>
          </div>
          <div className="flex justify-between">
            <span>✅ Weniger Fehler & Nacharbeit</span>
            <span className="font-semibold">{fmtEur(result.errorSavings)}</span>
          </div>
          <div className="flex justify-between">
            <span>✅ Bessere Routenplanung (GPS)</span>
            <span className="font-semibold">{fmtEur(result.gpsGains)}</span>
          </div>
          <div className="border-t border-green-200 pt-2 flex justify-between text-red-600">
            <span>❌ Feldhub Professional (mtl.)</span>
            <span className="font-semibold">- {fmtEur(result.feldhubCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-green-900 pt-1">
            <span>Netto-Gewinn pro Monat</span>
            <span className="text-xl">{fmtEur(result.netGainPerMonth)}</span>
          </div>
        </div>

        {/* ROI + Amortization */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-700 text-white rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">
              {result.roiPercent > 0 ? `${result.roiPercent.toLocaleString('de-DE')}%` : '—'}
            </div>
            <div className="text-xs opacity-80 mt-0.5">Return on Investment</div>
          </div>
          <div className="bg-green-800 text-white rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">
              {result.amortizationMonths < 99
                ? `${result.amortizationMonths} Mo`
                : '> 3 J'}
            </div>
            <div className="text-xs opacity-80 mt-0.5">Amortisation Setup</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <a
          href="/kontakt"
          onClick={handleCTAClick}
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg"
        >
          {ctaClicked ? '✓ Weiter zum Formular →' : 'Kostenloses Beratungsgespräch →'}
        </a>
        <p className="text-xs text-gray-400 mt-2">
          Keine Verpflichtung · 30 Minuten · Persönlich mit Tomek Cuglewski
        </p>
      </div>
    </div>
  );
}

export default ROICalculator;
