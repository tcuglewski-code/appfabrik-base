/**
 * Feldhub Forst-Modul — TypeScript Types
 * 
 * Generische Typen für Forstwirtschaft-Mandanten.
 * Erweiterbar durch tenant-spezifische Konfiguration.
 */

// =============================================================================
// REVIERPLAN
// =============================================================================

export interface Revier {
  id: string;
  name: string;
  flaeche: number; // Hektar
  geometrie?: GeoJSON;
  beschreibung?: string;
  verantwortlicher?: string;
  erstelltAm: Date;
  aktualisiertAm: Date;
}

export interface RevierplanEintrag {
  id: string;
  revierId: string;
  massnahme: string;
  beschreibung?: string;
  geplantAm: Date;
  erledigtAm?: Date;
  status: 'geplant' | 'in_bearbeitung' | 'erledigt' | 'abgebrochen';
  kosten?: number;
  mitarbeiterId?: string;
}

// =============================================================================
// BAUMARTEN-KATALOG
// =============================================================================

export interface Baumart {
  id: string;
  code: string;             // z.B. "EI" für Eiche
  name: string;             // Deutscher Name
  latinName?: string;       // Wissenschaftlicher Name
  kategorie: BaumarkategoriE;
  standortanforderungen?: StandortanfoRderungen;
  preisProStueck?: number;  // Standard-Preis in EUR
  bildUrl?: string;
  beschreibung?: string;
  istAktiv: boolean;
}

export type BaumarkategoriE = 
  | 'laubbaum' 
  | 'nadelbaum' 
  | 'strauch' 
  | 'pioniergehoelz'
  | 'obstbaum'
  | 'sonstiges';

export interface StandortanfoRderungen {
  bodentypen?: string[];    // z.B. ['lehmig', 'sandig']
  lichtbedarf: 'vollsonne' | 'halbschatten' | 'schatten';
  feuchtigkeitsbedarf: 'trocken' | 'frisch' | 'feucht';
  klimazone?: string[];
  hoehenlage?: { min?: number; max?: number }; // Meter über NN
}

export interface BaumartenKatalogFilter {
  kategorie?: BaumarkategoriE;
  suchbegriff?: string;
  nurAktiv?: boolean;
  standort?: Partial<StandortanfoRderungen>;
}

// =============================================================================
// FÖRDERANTRAG
// =============================================================================

export interface FoerderProgramm {
  id: string;
  name: string;
  foerderstelle: string;    // z.B. "Bayerischer Staatsforst"
  beschreibung: string;
  foerderquote?: number;    // Prozent, z.B. 80
  maxFoerderung?: number;   // EUR
  voraussetzungen: string[];
  antragsFrist?: Date;
  url?: string;
  bundesland: string;
  programmTyp: FoerderProgrammTyp;
}

export type FoerderProgrammTyp = 
  | 'aufforstung'
  | 'wiederaufforstung'
  | 'waldumbau'
  | 'naturverjuengung'
  | 'schutzwald'
  | 'sonstiges';

export interface FoerderAntrag {
  id: string;
  programmId: string;
  auftragId?: string;
  antragsteller: AntragSteller;
  flaeche: number;          // Hektar
  massnahmenBeschreibung: string;
  baumarten: { baumartenId: string; anzahl: number }[];
  beantragtesVolumen?: number; // EUR
  status: FoerderAntragStatus;
  eingereichtAm?: Date;
  bewilligtAm?: Date;
  abgelehntAm?: Date;
  ablehnungsgrund?: string;
  dokumente: string[];      // URLs zu Dokumenten
  erstelltAm: Date;
  aktualisiertAm: Date;
}

export type FoerderAntragStatus = 
  | 'entwurf'
  | 'eingereicht'
  | 'in_pruefung'
  | 'bewilligt'
  | 'abgelehnt'
  | 'ausgezahlt';

export interface AntragSteller {
  name: string;
  adresse: string;
  ort: string;
  plz: string;
  email: string;
  telefon?: string;
  iban?: string;
}

// =============================================================================
// WALDKARTE
// =============================================================================

export type GeoJSON = {
  type: 'FeatureCollection' | 'Feature' | 'Polygon' | 'Point' | 'LineString';
  features?: GeoJSONFeature[];
  geometry?: GeoJSONGeometry;
  properties?: Record<string, unknown>;
};

export type GeoJSONGeometry = {
  type: 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon';
  coordinates: number[] | number[][] | number[][][] | number[][][][];
};

export type GeoJSONFeature = {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties?: Record<string, unknown>;
};

export interface WaldkarteLayer {
  id: string;
  name: string;
  typ: WaldkarteLayerTyp;
  farbe?: string;           // Hex-Farbe für Darstellung
  sichtbar: boolean;
  daten?: GeoJSON;
  wmsUrl?: string;          // Für externe WMS-Dienste (z.B. BayernAtlas)
}

export type WaldkarteLayerTyp = 
  | 'bestand'
  | 'revier'
  | 'massnahme'
  | 'foerderflaeche'
  | 'biotop'
  | 'wege'
  | 'custom';

// =============================================================================
// FORSTRECHT-DOKUMENTATION
// =============================================================================

export interface ForstRechtDokument {
  id: string;
  titel: string;
  kategorie: ForstRechtKategorie;
  beschreibung?: string;
  inhalt?: string;          // Markdown-Text
  dateiUrl?: string;        // Link zu PDF/Dokument
  gueltigkeit?: {
    von?: Date;
    bis?: Date;
  };
  bundesland?: string;
  tags: string[];
  erstelltAm: Date;
  aktualisiertAm: Date;
}

export type ForstRechtKategorie = 
  | 'bundeswaldgesetz'
  | 'landeswaldgesetz'
  | 'naturschutz'
  | 'foerderrichtlinie'
  | 'betriebsplanung'
  | 'unfallverhuetung'
  | 'sonstiges';

// =============================================================================
// MODUL-KONFIGURATION
// =============================================================================

export interface ForstModulConfig {
  revierplan: boolean;
  baumartenKatalog: boolean;
  foerderantrag: boolean;
  waldkarte: boolean;
  forstRechtDoku: boolean;
  
  // Regionale Konfiguration
  bundesland?: string;
  
  // Karten-Dienste
  kartenDienst?: 'openstreetmap' | 'bayernatlas' | 'mapbox';
  wmsLayerUrls?: Record<string, string>;
}
