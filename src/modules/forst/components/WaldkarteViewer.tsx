/**
 * Feldhub Forst-Modul — WaldkarteViewer Komponente
 * 
 * Generischer Kartenviewer für Waldbestände.
 * Unterstützt Layer-System für Reviere, Maßnahmen, etc.
 * Verwendet Leaflet (lightweight, DSGVO-konform via OpenStreetMap).
 */

'use client';

import React, { useState } from 'react';
import type { WaldkarteLayer, WaldkarteLayerTyp } from '../types';

// =============================================================================
// PROPS
// =============================================================================

interface WaldkarteViewerProps {
  layer: WaldkarteLayer[];
  onLayerToggle?: (layerId: string, sichtbar: boolean) => void;
  /** Initiales Kartenzentrum [lat, lng] */
  center?: [number, number];
  zoom?: number;
  /** Höhe der Karte */
  height?: string;
}

// =============================================================================
// LAYER-TYP LABELS
// =============================================================================

const LAYER_TYP_LABELS: Record<WaldkarteLayerTyp, string> = {
  bestand: '🌲 Bestände',
  revier: '📍 Reviere',
  massnahme: '⚒️ Maßnahmen',
  foerderflaeche: '💚 Förderflächen',
  biotop: '🦋 Biotope',
  wege: '🛤️ Wege',
  custom: '📌 Sonstiges',
};

// =============================================================================
// PLATZHALTER-KARTE (Leaflet wird lazy geladen)
// =============================================================================

/**
 * Fallback wenn Leaflet nicht verfügbar (SSR/Tests)
 */
function KartenPlatzhalter({ height }: { height: string }) {
  return (
    <div
      style={{ height }}
      className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p className="text-4xl mb-2">🗺️</p>
        <p className="text-sm font-medium">Karte wird geladen...</p>
        <p className="text-xs mt-1">Leaflet + OpenStreetMap</p>
      </div>
    </div>
  );
}

// =============================================================================
// LAYER-STEUERUNG
// =============================================================================

function LayerSteuerung({
  layer,
  onToggle,
}: {
  layer: WaldkarteLayer[];
  onToggle?: (id: string, sichtbar: boolean) => void;
}) {
  if (layer.length === 0) return null;

  return (
    <div className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 min-w-40">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Layer</h4>
      <div className="space-y-1.5">
        {layer.map((l) => (
          <label key={l.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={l.sichtbar}
              onChange={(e) => onToggle?.(l.id, e.target.checked)}
              className="accent-primary w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
              {l.farbe && (
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ backgroundColor: l.farbe }}
                />
              )}
              {l.name || LAYER_TYP_LABELS[l.typ]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// HAUPTKOMPONENTE
// =============================================================================

/**
 * WaldkarteViewer — Generischer Kartenviewer für Forst-Module
 * 
 * @example
 * ```tsx
 * <WaldkarteViewer
 *   layer={[
 *     {
 *       id: 'reviere',
 *       name: 'Reviere',
 *       typ: 'revier',
 *       farbe: '#2C3A1C',
 *       sichtbar: true,
 *       daten: reviereGeoJSON,
 *     }
 *   ]}
 *   center={[48.5, 11.5]}
 *   zoom={10}
 * />
 * ```
 * 
 * Installation für Live-Karte:
 * `npm install leaflet react-leaflet @types/leaflet`
 * Dann dynamisch importieren: `const Map = dynamic(() => import('./LeafletMap'), { ssr: false })`
 */
export function WaldkarteViewer({
  layer,
  onLayerToggle,
  center = [48.5, 11.5], // Mitteleuropa als Default
  zoom = 10,
  height = '400px',
}: WaldkarteViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const actualHeight = isExpanded ? '600px' : height;

  const sichtbareLayer = layer.filter((l) => l.sichtbar);

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Karte */}
      <div style={{ height: actualHeight }}>
        {/* 
          INTEGRATION HINWEIS:
          Für echte Karte: npm install leaflet react-leaflet
          Dann hier einbinden (dynamisch, da SSR nicht supported):
          
          const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false })
          <LeafletMap center={center} zoom={zoom} layer={sichtbareLayer} />
        */}
        <KartenPlatzhalter height={actualHeight} />
      </div>

      {/* Layer-Steuerung */}
      <LayerSteuerung layer={layer} onToggle={onLayerToggle} />

      {/* Toolbar */}
      <div className="absolute bottom-2 left-2 z-10 flex gap-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
        >
          {isExpanded ? '↙ Verkleinern' : '↗ Vergrößern'}
        </button>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs text-gray-500 dark:text-gray-400 shadow-sm">
          {sichtbareLayer.length} Layer aktiv
        </div>
      </div>
    </div>
  );
}

export default WaldkarteViewer;
