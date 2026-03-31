/**
 * Feldhub Forst-Modul — Baumarten Utilities
 * 
 * Generische Hilfsfunktionen für den Baumarten-Katalog.
 */

import type { Baumart, BaumartenKatalogFilter, BaumarkategoriE } from '../types';

// =============================================================================
// VORDEFINIERTE BAUMARTEN (Basis-Set Mitteleuropa)
// =============================================================================

/**
 * Standard Baumarten-Katalog für mitteleuropäische Forstwirtschaft.
 * Kann durch Tenant-Konfiguration erweitert werden.
 */
export const STANDARD_BAUMARTEN: Omit<Baumart, 'id' | 'istAktiv'>[] = [
  {
    code: 'EI',
    name: 'Stieleiche',
    latinName: 'Quercus robur',
    kategorie: 'laubbaum',
    standortanforderungen: {
      bodentypen: ['lehmig', 'tonig', 'frisch-feucht'],
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'frisch',
    },
    beschreibung: 'Heimische Hauptbaumart, robust und langlebig. Wichtig für Biodiversität.',
  },
  {
    code: 'BU',
    name: 'Rotbuche',
    latinName: 'Fagus sylvatica',
    kategorie: 'laubbaum',
    standortanforderungen: {
      bodentypen: ['lehmig', 'sandig-lehmig'],
      lichtbedarf: 'halbschatten',
      feuchtigkeitsbedarf: 'frisch',
    },
    beschreibung: 'Klimax-Baumart in Mitteleuropa. Schattentolerant, bodenpflegend.',
  },
  {
    code: 'FI',
    name: 'Fichte',
    latinName: 'Picea abies',
    kategorie: 'nadelbaum',
    standortanforderungen: {
      bodentypen: ['sandig', 'lehmig'],
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'frisch',
      hoehenlage: { min: 300 },
    },
    beschreibung: 'Wirtschaftsbaumart, aber zunehmend klimaempfindlich. Borkenkäfer-gefährdet.',
  },
  {
    code: 'KI',
    name: 'Waldkiefer',
    latinName: 'Pinus sylvestris',
    kategorie: 'nadelbaum',
    standortanforderungen: {
      bodentypen: ['sandig', 'kiesig'],
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'trocken',
    },
    beschreibung: 'Pionierbaumart auf Sandböden. Sehr trockenheitstolerant.',
  },
  {
    code: 'ES',
    name: 'Esche',
    latinName: 'Fraxinus excelsior',
    kategorie: 'laubbaum',
    standortanforderungen: {
      bodentypen: ['lehmig', 'tonig'],
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'feucht',
    },
    beschreibung: 'Standortanspruchsvoll. Derzeit durch Eschensterben (Chalara) bedroht.',
  },
  {
    code: 'AH',
    name: 'Bergahorn',
    latinName: 'Acer pseudoplatanus',
    kategorie: 'laubbaum',
    standortanforderungen: {
      bodentypen: ['lehmig', 'steinig'],
      lichtbedarf: 'halbschatten',
      feuchtigkeitsbedarf: 'frisch',
    },
    beschreibung: 'Wertholz, klimaresilient. Gut für Mischbestände.',
  },
  {
    code: 'LA',
    name: 'Europäische Lärche',
    latinName: 'Larix decidua',
    kategorie: 'nadelbaum',
    standortanforderungen: {
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'frisch',
      hoehenlage: { min: 400 },
    },
    beschreibung: 'Laubabwerfendes Nadelholz. Sehr robust, windwurffest.',
  },
  {
    code: 'BI',
    name: 'Birke',
    latinName: 'Betula pendula',
    kategorie: 'pioniergehoelz',
    standortanforderungen: {
      bodentypen: ['sandig', 'kiesig'],
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'trocken',
    },
    beschreibung: 'Pionierbaumart für Erstaufforstungen. Bereitet Standort für Hauptbaumarten vor.',
  },
  {
    code: 'ER',
    name: 'Erle',
    latinName: 'Alnus glutinosa',
    kategorie: 'laubbaum',
    standortanforderungen: {
      bodentypen: ['tonig', 'torfig'],
      lichtbedarf: 'vollsonne',
      feuchtigkeitsbedarf: 'feucht',
    },
    beschreibung: 'Wichtig für Auenwald und feuchte Standorte. Stickstoff-fixierend.',
  },
  {
    code: 'HBU',
    name: 'Hainbuche',
    latinName: 'Carpinus betulus',
    kategorie: 'laubbaum',
    standortanforderungen: {
      bodentypen: ['lehmig'],
      lichtbedarf: 'halbschatten',
      feuchtigkeitsbedarf: 'frisch',
    },
    beschreibung: 'Sehr schattentolerant. Gut für Unterpflanzungen und Mischwald.',
  },
];

// =============================================================================
// FILTER-FUNKTIONEN
// =============================================================================

/**
 * Filtert Baumarten nach Kriterien
 */
export function filterBaumarten(
  baumarten: Baumart[],
  filter: BaumartenKatalogFilter
): Baumart[] {
  return baumarten.filter((baumart) => {
    // Nur aktive anzeigen wenn Flag gesetzt
    if (filter.nurAktiv && !baumart.istAktiv) return false;

    // Kategorie-Filter
    if (filter.kategorie && baumart.kategorie !== filter.kategorie) return false;

    // Suchbegriff (Name, latinName, Code, Beschreibung)
    if (filter.suchbegriff) {
      const query = filter.suchbegriff.toLowerCase();
      const searchIn = [
        baumart.name,
        baumart.latinName ?? '',
        baumart.code,
        baumart.beschreibung ?? '',
      ].join(' ').toLowerCase();
      
      if (!searchIn.includes(query)) return false;
    }

    return true;
  });
}

/**
 * Sortiert Baumarten alphabetisch nach Name
 */
export function sortBaumartenAlphabetisch(baumarten: Baumart[]): Baumart[] {
  return [...baumarten].sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

/**
 * Gruppiert Baumarten nach Kategorie
 */
export function groupBaumartenByKategorie(
  baumarten: Baumart[]
): Record<BaumarkategoriE, Baumart[]> {
  return baumarten.reduce(
    (acc, baumart) => {
      if (!acc[baumart.kategorie]) acc[baumart.kategorie] = [];
      acc[baumart.kategorie].push(baumart);
      return acc;
    },
    {} as Record<BaumarkategoriE, Baumart[]>
  );
}

// =============================================================================
// LABEL-FUNKTIONEN
// =============================================================================

export const KATEGORIE_LABELS: Record<BaumarkategoriE, string> = {
  laubbaum: 'Laubbäume',
  nadelbaum: 'Nadelbäume',
  strauch: 'Sträucher',
  pioniergehoelz: 'Pioniergehölze',
  obstbaum: 'Obstbäume',
  sonstiges: 'Sonstiges',
};

export const FEUCHTIGKEITS_LABELS = {
  trocken: 'Trocken',
  frisch: 'Frisch',
  feucht: 'Feucht/Nass',
} as const;

export const LICHT_LABELS = {
  vollsonne: 'Vollsonne',
  halbschatten: 'Halbschatten',
  schatten: 'Schatten',
} as const;
