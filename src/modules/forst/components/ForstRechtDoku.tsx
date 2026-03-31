/**
 * Feldhub Forst-Modul — ForstRechtDoku Komponente
 * 
 * Forstrecht-Dokumentationsbibliothek mit Suche und Kategorisierung.
 * Zeigt Gesetze, Richtlinien und Betriebsvorschriften.
 */

'use client';

import React, { useState, useMemo } from 'react';
import type { ForstRechtDokument, ForstRechtKategorie } from '../types';

// =============================================================================
// LABELS
// =============================================================================

const KATEGORIE_LABELS: Record<ForstRechtKategorie, string> = {
  bundeswaldgesetz: '🌲 Bundeswaldgesetz',
  landeswaldgesetz: '📜 Landeswaldgesetz',
  naturschutz: '🦋 Naturschutz',
  foerderrichtlinie: '💚 Förderrichtlinien',
  betriebsplanung: '📋 Betriebsplanung',
  unfallverhuetung: '⚠️ Arbeitssicherheit',
  sonstiges: '📄 Sonstiges',
};

// =============================================================================
// PROPS
// =============================================================================

interface ForstRechtDokuProps {
  dokumente: ForstRechtDokument[];
  onDokumentSelect?: (dokument: ForstRechtDokument) => void;
}

// =============================================================================
// DOKUMENT-CARD
// =============================================================================

function DokumentCard({
  dokument,
  onSelect,
}: {
  dokument: ForstRechtDokument;
  onSelect?: (d: ForstRechtDokument) => void;
}) {
  const isAbgelaufen =
    dokument.gueltigkeit?.bis && dokument.gueltigkeit.bis < new Date();

  return (
    <div
      className={`
        border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
        ${isAbgelaufen
          ? 'border-gray-200 dark:border-gray-700 opacity-60'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
        }
      `}
      onClick={() => onSelect?.(dokument)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {KATEGORIE_LABELS[dokument.kategorie]}
            </span>
            {isAbgelaufen && (
              <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded">
                Abgelaufen
              </span>
            )}
            {dokument.bundesland && (
              <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-1.5 py-0.5 rounded">
                {dokument.bundesland}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1 truncate">
            {dokument.titel}
          </h3>
          {dokument.beschreibung && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {dokument.beschreibung}
            </p>
          )}
        </div>
        {dokument.dateiUrl && (
          <a
            href={dokument.dateiUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-primary hover:text-primary/80 text-xs font-medium flex items-center gap-1"
          >
            📄 PDF
          </a>
        )}
      </div>

      {/* Gültigkeitszeitraum */}
      {dokument.gueltigkeit && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex gap-3">
          {dokument.gueltigkeit.von && (
            <span>Von: {dokument.gueltigkeit.von.toLocaleDateString('de-DE')}</span>
          )}
          {dokument.gueltigkeit.bis && (
            <span>Bis: {dokument.gueltigkeit.bis.toLocaleDateString('de-DE')}</span>
          )}
        </div>
      )}

      {/* Tags */}
      {dokument.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {dokument.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {dokument.tags.length > 4 && (
            <span className="text-xs text-gray-400">+{dokument.tags.length - 4}</span>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HAUPTKOMPONENTE
// =============================================================================

export function ForstRechtDoku({ dokumente, onDokumentSelect }: ForstRechtDokuProps) {
  const [suchbegriff, setSuchbegriff] = useState('');
  const [kategorieFilter, setKategorieFilter] = useState<ForstRechtKategorie | 'alle'>('alle');
  const [nurGueltig, setNurGueltig] = useState(true);

  const filtered = useMemo(() => {
    return dokumente.filter((dok) => {
      // Gültigkeit
      if (nurGueltig && dok.gueltigkeit?.bis && dok.gueltigkeit.bis < new Date()) {
        return false;
      }
      // Kategorie
      if (kategorieFilter !== 'alle' && dok.kategorie !== kategorieFilter) return false;
      // Suche
      if (suchbegriff) {
        const query = suchbegriff.toLowerCase();
        const searchIn = [dok.titel, dok.beschreibung ?? '', ...dok.tags].join(' ').toLowerCase();
        if (!searchIn.includes(query)) return false;
      }
      return true;
    });
  }, [dokumente, suchbegriff, kategorieFilter, nurGueltig]);

  const kategorien = Object.keys(KATEGORIE_LABELS) as ForstRechtKategorie[];

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Dokumente durchsuchen..."
              value={suchbegriff}
              onChange={(e) => setSuchbegriff(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            <input
              type="checkbox"
              checked={nurGueltig}
              onChange={(e) => setNurGueltig(e.target.checked)}
              className="accent-primary"
            />
            Nur gültige
          </label>
        </div>

        {/* Kategorie-Filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setKategorieFilter('alle')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              kategorieFilter === 'alle'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Alle
          </button>
          {kategorien.map((kat) => (
            <button
              key={kat}
              onClick={() => setKategorieFilter(kategorieFilter === kat ? 'alle' : kat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                kategorieFilter === kat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {KATEGORIE_LABELS[kat]}
            </button>
          ))}
        </div>
      </div>

      {/* Ergebnisanzahl */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} Dokument{filtered.length !== 1 ? 'e' : ''} gefunden
      </p>

      {/* Dokument-Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-3xl mb-2">📚</p>
          <p>Keine Dokumente gefunden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((dok) => (
            <DokumentCard key={dok.id} dokument={dok} onSelect={onDokumentSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ForstRechtDoku;
