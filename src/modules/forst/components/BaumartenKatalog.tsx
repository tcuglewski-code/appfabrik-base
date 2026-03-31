/**
 * Feldhub Forst-Modul — BaumartenKatalog Komponente
 * 
 * Generischer Baumarten-Katalog mit Filter, Suche und Kategorisierung.
 * Tenant-neutral, anpassbar via Props.
 */

'use client';

import React from 'react';
import type { Baumart, BaumarkategoriE } from '../types';
import { useBaumarten } from '../hooks/useBaumarten';
import { KATEGORIE_LABELS, FEUCHTIGKEITS_LABELS, LICHT_LABELS } from '../utils/baumarten';

// =============================================================================
// PROPS
// =============================================================================

interface BaumartenKatalogProps {
  /** Baumarten-Daten vom Server/API */
  baumarten: Baumart[];
  /** Optional: Callback wenn Baumart ausgewählt wird */
  onSelect?: (baumart: Baumart) => void;
  /** Optional: Mehrfachauswahl für Auftragserstellung */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Optional: Kompakt-Modus für Einbettung in Formulare */
  compact?: boolean;
}

// =============================================================================
// SUB-KOMPONENTEN
// =============================================================================

function KategorieFilter({
  aktiv,
  onChange,
}: {
  aktiv: BaumarkategoriE | undefined;
  onChange: (k: BaumarkategoriE | undefined) => void;
}) {
  const kategorien = Object.entries(KATEGORIE_LABELS) as [BaumarkategoriE, string][];

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(undefined)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          !aktiv
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
        }`}
      >
        Alle
      </button>
      {kategorien.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(aktiv === key ? undefined : key)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            aktiv === key
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function BaumartenCard({
  baumart,
  onSelect,
  isSelected,
  compact,
}: {
  baumart: Baumart;
  onSelect?: (b: Baumart) => void;
  isSelected?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      onClick={() => onSelect?.(baumart)}
      className={`
        border rounded-lg p-4 transition-all cursor-pointer
        ${isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-sm'
        }
        ${compact ? 'p-3' : 'p-4'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
              {baumart.code}
            </span>
            {!baumart.istAktiv && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                Inaktiv
              </span>
            )}
          </div>
          <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mt-1 ${compact ? 'text-sm' : ''}`}>
            {baumart.name}
          </h3>
          {baumart.latinName && (
            <p className="text-xs text-gray-500 italic">{baumart.latinName}</p>
          )}
        </div>
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded whitespace-nowrap">
          {KATEGORIE_LABELS[baumart.kategorie]}
        </span>
      </div>

      {/* Standort-Anforderungen */}
      {!compact && baumart.standortanforderungen && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            ☀️ {LICHT_LABELS[baumart.standortanforderungen.lichtbedarf]}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            💧 {FEUCHTIGKEITS_LABELS[baumart.standortanforderungen.feuchtigkeitsbedarf]}
          </span>
          {baumart.standortanforderungen.hoehenlage?.min && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              ⛰️ ab {baumart.standortanforderungen.hoehenlage.min}m
            </span>
          )}
        </div>
      )}

      {/* Beschreibung */}
      {!compact && baumart.beschreibung && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {baumart.beschreibung}
        </p>
      )}

      {/* Preis */}
      {baumart.preisProStueck && (
        <div className="mt-3 text-sm font-medium text-primary">
          {baumart.preisProStueck.toFixed(2)} €/Stück
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HAUPTKOMPONENTE
// =============================================================================

export function BaumartenKatalog({
  baumarten,
  onSelect,
  selectedIds = [],
  onSelectionChange,
  compact = false,
}: BaumartenKatalogProps) {
  const {
    baumarten: filtered,
    filter,
    updateFilter,
    resetFilter,
    totalCount,
    filteredCount,
  } = useBaumarten(baumarten);

  const handleSelect = (baumart: Baumart) => {
    if (onSelectionChange) {
      const isSelected = selectedIds.includes(baumart.id);
      if (isSelected) {
        onSelectionChange(selectedIds.filter((id) => id !== baumart.id));
      } else {
        onSelectionChange([...selectedIds, baumart.id]);
      }
    }
    onSelect?.(baumart);
  };

  return (
    <div className="space-y-4">
      {/* Filter-Leiste */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Suche */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Baumart suchen..."
            value={filter.suchbegriff ?? ''}
            onChange={(e) => updateFilter({ suchbegriff: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Reset */}
        {(filter.suchbegriff || filter.kategorie) && (
          <button
            onClick={resetFilter}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 whitespace-nowrap"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Kategorie-Filter */}
      <KategorieFilter
        aktiv={filter.kategorie}
        onChange={(k) => updateFilter({ kategorie: k })}
      />

      {/* Ergebnis-Anzahl */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {filteredCount === totalCount
          ? `${totalCount} Baumarten`
          : `${filteredCount} von ${totalCount} Baumarten`}
      </div>

      {/* Baumarten-Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-2xl mb-2">🌳</p>
          <p>Keine Baumarten gefunden</p>
          <button
            onClick={resetFilter}
            className="mt-2 text-primary hover:underline text-sm"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3 ${
            compact
              ? 'grid-cols-2 sm:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filtered.map((baumart) => (
            <BaumartenCard
              key={baumart.id}
              baumart={baumart}
              onSelect={handleSelect}
              isSelected={selectedIds.includes(baumart.id)}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BaumartenKatalog;
