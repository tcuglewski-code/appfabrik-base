/**
 * Feldhub Analytics — Plausible Integration
 * DSGVO-konform, cookie-frei, EU-Server
 *
 * Sprint IY | 30.03.2026
 */

import { usePlausible } from 'next-plausible';

// ─── Event-Typen ──────────────────────────────────────────────────────────────

export type FeldhubAnalyticsEvent =
  | 'Login'
  | 'Logout'
  | 'Task Created'
  | 'Task Completed'
  | 'Task Deleted'
  | 'Report Generated'
  | 'File Uploaded'
  | 'Onboarding Complete'
  | 'Feature: Map View'
  | 'Feature: Export'
  | 'Feature: Import'
  | 'Error: API'
  | 'Error: Upload';

export type FeldhubEventProperties = {
  Login: { method: 'email' | 'oauth' };
  Logout: Record<string, never>;
  'Task Created': { type: string; category?: string };
  'Task Completed': { duration_days?: number };
  'Task Deleted': Record<string, never>;
  'Report Generated': { format: 'pdf' | 'excel' | 'csv' };
  'File Uploaded': { type: string; size_kb?: number };
  'Onboarding Complete': { steps_completed: number };
  'Feature: Map View': { tenant: string };
  'Feature: Export': { entity: string };
  'Feature: Import': { entity: string; row_count?: number };
  'Error: API': { endpoint: string; status: number };
  'Error: Upload': { reason: string };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Verwende diesen Hook für Custom Events in Komponenten.
 *
 * @example
 * const { trackEvent } = useFeldhubAnalytics();
 * trackEvent('Task Created', { type: 'Pflanzung' });
 */
export function useFeldhubAnalytics() {
  const plausible = usePlausible<FeldhubEventProperties>();

  function trackEvent<T extends FeldhubAnalyticsEvent>(
    event: T,
    ...props: FeldhubEventProperties[T] extends Record<string, never>
      ? []
      : [FeldhubEventProperties[T]]
  ) {
    const properties = props[0] as FeldhubEventProperties[T] | undefined;
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED !== 'true') return;
    plausible(event, { props: properties ?? {} });
  }

  return { trackEvent };
}

// ─── Server-Side: Analytics API (Plausible Stats) ────────────────────────────

export interface PlausibleStats {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
}

/**
 * Holt Statistiken vom Plausible Stats API.
 * API Key muss als PLAUSIBLE_API_KEY in .env gesetzt sein.
 */
export async function fetchPlausibleStats(
  siteId: string,
  period: '7d' | '30d' | '12mo' = '30d'
): Promise<PlausibleStats | null> {
  const apiKey = process.env.PLAUSIBLE_API_KEY;
  const apiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST ?? 'https://plausible.io';

  if (!apiKey) {
    console.warn('[Analytics] PLAUSIBLE_API_KEY not set');
    return null;
  }

  try {
    const res = await fetch(
      `${apiHost}/api/v1/stats/aggregate?site_id=${encodeURIComponent(siteId)}&period=${period}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 }, // 1h Cache
      }
    );

    if (!res.ok) throw new Error(`Plausible API error: ${res.status}`);
    const data = await res.json();

    return {
      visitors: data.results.visitors.value,
      pageviews: data.results.pageviews.value,
      bounce_rate: data.results.bounce_rate.value,
      visit_duration: data.results.visit_duration.value,
    };
  } catch (err) {
    console.error('[Analytics] fetchPlausibleStats error:', err);
    return null;
  }
}
