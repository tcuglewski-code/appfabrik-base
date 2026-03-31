/**
 * Feldhub Forst-Modul — RevierplanKarte Komponente
 * 
 * Übersicht aller Reviere + Maßnahmen-Status.
 * Tabellarische Ansicht + Kartenvorschau.
 */

'use client';

import React from 'react';
import type { Revier, RevierplanEintrag } from '../types';
import { useRevierplan } from '../hooks/useRevierplan';

// =============================================================================
// PROPS
// =============================================================================

interface RevierplanKarteProps {
  reviere: Revier[];
  eintraege: RevierplanEintrag[];
  onRevierSelect?: (revier: Revier) => void;
  onMassnahmeAdd?: (revierId: string) => void;
}

// =============================================================================
// STATUS-BADGE
// =============================================================================

const STATUS_CONFIG = {
  geplant: { label: 'Geplant', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_bearbeitung: { label: 'In Arbeit', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  erledigt: { label: 'Erledigt', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  abgebrochen: { label: 'Abgebrochen', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
} as const;

function StatusBadge({ status }: { status: RevierplanEintrag['status'] }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

// =============================================================================
// REVIER-CARD
// =============================================================================

function RevierCard({
  revier,
  eintraege,
  isSelected,
  onSelect,
  onMassnahmeAdd,
}: {
  revier: Revier;
  eintraege: RevierplanEintrag[];
  isSelected: boolean;
  onSelect: () => void;
  onMassnahmeAdd?: () => void;
}) {
  const offen = eintraege.filter((e) => e.status === 'geplant' || e.status === 'in_bearbeitung');
  const erledigt = eintraege.filter((e) => e.status === 'erledigt');

  return (
    <div
      className={`
        border rounded-lg p-4 cursor-pointer transition-all
        ${isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/40 hover:shadow-sm'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{revier.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {revier.flaeche.toFixed(1)} ha
            {revier.verantwortlicher && ` · ${revier.verantwortlicher}`}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="text-amber-600 font-medium">{offen.length}</span> offen
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="text-green-600 font-medium">{erledigt.length}</span> erledigt
        </div>
      </div>

      {revier.beschreibung && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {revier.beschreibung}
        </p>
      )}

      {onMassnahmeAdd && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMassnahmeAdd();
          }}
          className="mt-3 text-xs text-primary hover:text-primary/80 font-medium"
        >
          + Maßnahme hinzufügen
        </button>
      )}
    </div>
  );
}

// =============================================================================
// HAUPTKOMPONENTE
// =============================================================================

export function RevierplanKarte({
  reviere,
  eintraege,
  onRevierSelect,
  onMassnahmeAdd,
}: RevierplanKarteProps) {
  const {
    selectedRevierID,
    selectedRevier,
    setSelectedRevier,
    eintraegeForRevier,
    totalFlaeche,
    offeneMassnahmen,
  } = useRevierplan(reviere, eintraege);

  const handleRevierSelect = (revier: Revier) => {
    setSelectedRevier(revier.id === selectedRevierID ? null : revier.id);
    onRevierSelect?.(revier);
  };

  return (
    <div className="space-y-4">
      {/* Statistik-Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{reviere.length}</div>
          <div className="text-xs text-green-600 dark:text-green-500 mt-0.5">Reviere</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {totalFlaeche.toFixed(0)}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">Hektar gesamt</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{offeneMassnahmen}</div>
          <div className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Offene Maßnahmen</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revier-Liste */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reviere</h3>
          {reviere.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              Noch keine Reviere angelegt
            </p>
          ) : (
            reviere.map((revier) => (
              <RevierCard
                key={revier.id}
                revier={revier}
                eintraege={eintraege.filter((e) => e.revierId === revier.id)}
                isSelected={selectedRevierID === revier.id}
                onSelect={() => handleRevierSelect(revier)}
                onMassnahmeAdd={onMassnahmeAdd ? () => onMassnahmeAdd(revier.id) : undefined}
              />
            ))
          )}
        </div>

        {/* Maßnahmen-Detail */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {selectedRevier ? `Maßnahmen: ${selectedRevier.name}` : 'Alle Maßnahmen'}
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {eintraegeForRevier.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                Keine Maßnahmen {selectedRevier ? 'für dieses Revier' : 'vorhanden'}
              </p>
            ) : (
              eintraegeForRevier.map((eintrag) => (
                <div
                  key={eintrag.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {eintrag.massnahme}
                      </p>
                      {eintrag.beschreibung && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {eintrag.beschreibung}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={eintrag.status} />
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>📅 {eintrag.geplantAm.toLocaleDateString('de-DE')}</span>
                    {eintrag.kosten && <span>💰 {eintrag.kosten.toFixed(0)} €</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevierplanKarte;
