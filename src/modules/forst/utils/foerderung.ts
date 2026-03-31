/**
 * Feldhub Forst-Modul — Förderung Utilities
 * 
 * Hilfsfunktionen für Förderantrag-Verwaltung.
 */

import type { FoerderAntrag, FoerderAntragStatus, FoerderProgramm } from '../types';

// =============================================================================
// STATUS-UTILS
// =============================================================================

export const FOERDER_STATUS_LABELS: Record<FoerderAntragStatus, string> = {
  entwurf: 'Entwurf',
  eingereicht: 'Eingereicht',
  in_pruefung: 'In Prüfung',
  bewilligt: 'Bewilligt',
  abgelehnt: 'Abgelehnt',
  ausgezahlt: 'Ausgezahlt',
};

export const FOERDER_STATUS_COLORS: Record<FoerderAntragStatus, string> = {
  entwurf: '#6B7280',     // gray
  eingereicht: '#3B82F6', // blue
  in_pruefung: '#F59E0B', // amber
  bewilligt: '#10B981',   // green
  abgelehnt: '#EF4444',   // red
  ausgezahlt: '#8B5CF6',  // purple
};

/**
 * Prüft ob ein Antrag noch editierbar ist (nur Entwürfe)
 */
export function isAntragEditierbar(antrag: FoerderAntrag): boolean {
  return antrag.status === 'entwurf';
}

/**
 * Berechnet geschätzte Fördersumme
 */
export function berechneFoerdersumme(
  programm: FoerderProgramm,
  flaeche: number,
  anzahlBaeume: number,
  gesamtkosten: number
): number | null {
  if (!programm.foerderquote) return null;
  
  const berechnete = gesamtkosten * (programm.foerderquote / 100);
  
  if (programm.maxFoerderung) {
    return Math.min(berechnete, programm.maxFoerderung);
  }
  
  return berechnete;
}

/**
 * Formatiert Fördersumme als Euro-String
 */
export function formatEuro(betrag: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(betrag);
}

/**
 * Prüft ob ein Förderprogramm noch aktuell ist
 */
export function isProgrammAktuell(programm: FoerderProgramm): boolean {
  if (!programm.antragsFrist) return true;
  return programm.antragsFrist > new Date();
}

/**
 * Sortiert Förderprogramme: zuerst aktuelle, dann nach Förderstelle
 */
export function sortFoerderProgramme(programme: FoerderProgramm[]): FoerderProgramm[] {
  return [...programme].sort((a, b) => {
    const aAktuell = isProgrammAktuell(a);
    const bAktuell = isProgrammAktuell(b);
    if (aAktuell !== bAktuell) return aAktuell ? -1 : 1;
    return a.foerderstelle.localeCompare(b.foerderstelle, 'de');
  });
}
