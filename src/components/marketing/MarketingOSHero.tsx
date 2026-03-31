/**
 * MarketingOS Hero Section
 * Sprint JZ | 31.03.2026
 *
 * Landingpage Hero für Feldhubs Marketing-Betriebssystem
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface MarketingOSHeroProps {
  headline?: string;
  subline?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export function MarketingOSHero({
  headline = 'Dein Marketing läuft von selbst',
  subline = 'MarketingOS automatisiert Content, Lead-Erfassung und CRM — gesteuert von KI-Agenten, gebaut auf Feldhub.',
  ctaPrimary = { label: 'Demo anfragen', href: '/demo' },
  ctaSecondary = { label: 'Mehr erfahren', href: '#funktionen' },
}: MarketingOSHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f1923] via-[#1a2e1a] to-[#0f2310] py-24 px-6 text-white">
      {/* Background grid decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(197,165,90,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,165,90,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C5A55A]/30 bg-[#C5A55A]/10 px-4 py-1.5 text-sm font-medium text-[#C5A55A]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#C5A55A]" />
          MarketingOS — Beta
        </span>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          {headline}
        </h1>

        {/* Subline */}
        <p className="mb-10 text-xl leading-relaxed text-gray-300 md:text-2xl">
          {subline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={ctaPrimary.href}
            className="rounded-xl bg-[#C5A55A] px-8 py-4 text-lg font-semibold text-[#0f1923] shadow-lg transition-all hover:bg-[#d4b56a] hover:shadow-xl"
          >
            {ctaPrimary.label}
          </Link>
          <Link
            href={ctaSecondary.href}
            className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
          >
            {ctaSecondary.label}
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-12 text-sm text-gray-400">
          Bereits eingesetzt bei Koch Aufforstung GmbH · 100% DSGVO-konform · Made in Germany
        </p>
      </div>
    </section>
  );
}
