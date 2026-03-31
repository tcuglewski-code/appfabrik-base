/**
 * MarketingOS CTA Section
 * Sprint JZ | 31.03.2026
 */

'use client';

import React from 'react';
import Link from 'next/link';

export function MarketingOSCTA() {
  return (
    <section className="bg-gradient-to-br from-[#1a2e1a] to-[#0f1923] py-20 px-6 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-4xl font-bold">
          Bereit, dein Marketing zu automatisieren?
        </h2>
        <p className="mb-10 text-xl text-gray-300">
          Feldhub richtet MarketingOS für dein Unternehmen ein — inklusive Konfiguration,
          Onboarding und laufender Betreuung.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/demo"
            className="rounded-xl bg-[#C5A55A] px-8 py-4 text-lg font-semibold text-[#0f1923] shadow-lg transition hover:bg-[#d4b56a]"
          >
            Jetzt Demo anfragen →
          </Link>
          <Link
            href="/preise"
            className="rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
          >
            Preise ansehen
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-400">
          Keine Kündigung nötig — monatliche Laufzeit · Setup in 2 Wochen · DSGVO-konform
        </p>
      </div>
    </section>
  );
}
