/**
 * MarketingOS Landingpage
 * Sprint JZ | 31.03.2026
 *
 * Route: /marketing-os
 * Beschreibt Feldhubs MarketingOS: 6 KI-Agenten für automatisiertes Marketing
 */

import type { Metadata } from 'next';
import { MarketingOSHero } from '@/components/marketing/MarketingOSHero';
import { MarketingOSFeatures } from '@/components/marketing/MarketingOSFeatures';
import { MarketingOSCTA } from '@/components/marketing/MarketingOSCTA';

export const metadata: Metadata = {
  title: 'MarketingOS — Automatisiertes Marketing für KMU | Feldhub',
  description:
    'Feldhubs MarketingOS automatisiert Content, Lead-Erfassung und CRM mit 6 KI-Agenten. DSGVO-konform, Made in Germany. Jetzt Demo anfragen.',
  openGraph: {
    title: 'MarketingOS — Dein Marketing läuft von selbst',
    description:
      'Automatisiertes Marketing für KMU: Research-Agent, Magnet-Agent, Pulse-Agent, Analytics und mehr.',
    url: 'https://feldhub.de/marketing-os',
    siteName: 'Feldhub',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketingOS — Feldhub',
    description: '6 KI-Agenten automatisieren dein komplettes Marketing.',
  },
};

export default function MarketingOSPage() {
  return (
    <main>
      <MarketingOSHero />
      <MarketingOSFeatures />
      <MarketingOSCTA />
    </main>
  );
}
