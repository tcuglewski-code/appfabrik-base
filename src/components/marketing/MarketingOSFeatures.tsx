/**
 * MarketingOS Features Section
 * Sprint JZ | 31.03.2026
 *
 * Zeigt die 6 Kern-Agenten des MarketingOS
 */

'use client';

import React from 'react';

const FEATURES = [
  {
    icon: '🔍',
    name: 'Research-Agent',
    code: 'JC',
    description:
      'Perplexity-basierte Branchenrecherche — wöchentlicher Report über Trends, Wettbewerber, Nachrichten.',
    status: 'aktiv',
  },
  {
    icon: '🧲',
    name: 'Magnet-Agent',
    code: 'JY',
    description:
      'Automatisches Lead-Monitoring: Webformulare, LinkedIn, Direktanfragen. Lead-Scoring 0–100 in Echtzeit.',
    status: 'aktiv',
  },
  {
    icon: '📣',
    name: 'Pulse-Agent',
    code: 'KA',
    description:
      'Social Media Scheduling: LinkedIn, Instagram, X — KI-generierte Posts aus Content-Plan.',
    status: 'beta',
  },
  {
    icon: '📊',
    name: 'Analytics-Agent',
    code: 'IY',
    description:
      'Plausible Analytics DSGVO-konform + Custom Events + Stats API Dashboard. Kein Cookie-Banner nötig.',
    status: 'aktiv',
  },
  {
    icon: '🤖',
    name: 'Hunter-Agent',
    code: 'JL',
    description:
      'Automatische Lead-Recherche via Perplexity: 4 Branchen, CSV/JSON-Export, Mission Control Upload.',
    status: 'aktiv',
  },
  {
    icon: '📈',
    name: 'ROI-Agent',
    code: 'JE',
    description:
      'KI-Agenten ROI Tracking: automatische Bewertung welche Agenten wie viel Wert schaffen.',
    status: 'aktiv',
  },
];

const STATUS_STYLES: Record<string, string> = {
  aktiv: 'bg-green-500/10 text-green-400 border-green-500/20',
  beta: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  geplant: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export function MarketingOSFeatures() {
  return (
    <section id="funktionen" className="bg-white py-20 px-6 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            6 KI-Agenten. Ein Marketing-System.
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            MarketingOS verbindet spezialisierte Agenten zu einem Funnel — von der Recherche bis zum
            qualifizierten Lead.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.code}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-[#C5A55A]/30 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{feature.icon}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[feature.status]}`}
                  >
                    {feature.status}
                  </span>
                  <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-mono text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {feature.code}
                  </span>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Funnel-Architektur
          </h3>
          <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-0">
            {[
              { label: 'AWARENESS', sub: 'Research + Blog + SEO', color: 'bg-blue-500' },
              { label: 'CONSIDERATION', sub: 'ROI-Rechner + Case Studies', color: 'bg-purple-500' },
              { label: 'CONVERSION', sub: 'Demo + Ersttermin', color: 'bg-[#C5A55A]' },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <div
                  className={`flex flex-col items-center rounded-xl ${step.color} bg-opacity-10 p-4 text-center md:flex-1`}
                >
                  <span
                    className={`mb-1 text-xs font-bold tracking-widest ${step.color.replace('bg-', 'text-')}`}
                  >
                    {step.label}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{step.sub}</span>
                </div>
                {i < 2 && (
                  <span className="hidden text-2xl text-gray-400 md:block md:px-2">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
