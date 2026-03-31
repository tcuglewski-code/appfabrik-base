/**
 * Feldhub Forst-Modul — FoerderantragForm Komponente
 * 
 * Generisches Förderantrag-Formular.
 * Zeigt verfügbare Programme + Antragsdaten.
 */

'use client';

import React, { useState } from 'react';
import type { FoerderAntrag, FoerderProgramm, AntragSteller } from '../types';
import { FOERDER_STATUS_LABELS, FOERDER_STATUS_COLORS, berechneFoerdersumme, formatEuro, isProgrammAktuell } from '../utils/foerderung';

// =============================================================================
// PROPS
// =============================================================================

interface FoerderantragFormProps {
  programme: FoerderProgramm[];
  antrag?: Partial<FoerderAntrag>;
  onSubmit: (data: Partial<FoerderAntrag>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

// =============================================================================
// KOMPONENTE
// =============================================================================

export function FoerderantragForm({
  programme,
  antrag,
  onSubmit,
  onCancel,
  isLoading = false,
}: FoerderantragFormProps) {
  const [selectedProgrammId, setSelectedProgrammId] = useState(
    antrag?.programmId ?? ''
  );
  const [flaeche, setFlaeche] = useState(antrag?.flaeche ?? 0);
  const [massnahme, setMassnahme] = useState(antrag?.massnahmenBeschreibung ?? '');
  const [antragsteller, setAntragsteller] = useState<Partial<AntragSteller>>(
    antrag?.antragsteller ?? {}
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedProgramm = programme.find((p) => p.id === selectedProgrammId);

  const geschaetzteFoerderung =
    selectedProgramm && flaeche > 0
      ? berechneFoerdersumme(selectedProgramm, flaeche, 0, flaeche * 2000)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedProgrammId) {
      setSubmitError('Bitte wählen Sie ein Förderprogramm aus.');
      return;
    }
    if (flaeche <= 0) {
      setSubmitError('Bitte geben Sie eine gültige Fläche an.');
      return;
    }

    try {
      await onSubmit({
        ...antrag,
        programmId: selectedProgrammId,
        flaeche,
        massnahmenBeschreibung: massnahme,
        antragsteller: antragsteller as AntragSteller,
        status: 'entwurf',
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    }
  };

  const aktuelleProGramme = programme.filter(isProgrammAktuell);
  const abgelaufeneProGramme = programme.filter((p) => !isProgrammAktuell(p));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Förderprogramm auswählen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Förderprogramm *
        </label>
        <select
          value={selectedProgrammId}
          onChange={(e) => setSelectedProgrammId(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Bitte auswählen...</option>
          {aktuelleProGramme.length > 0 && (
            <optgroup label="Aktuelle Programme">
              {aktuelleProGramme.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.foerderstelle}
                  {p.foerderquote ? ` (${p.foerderquote}%)` : ''}
                </option>
              ))}
            </optgroup>
          )}
          {abgelaufeneProGramme.length > 0 && (
            <optgroup label="Abgelaufene Programme">
              {abgelaufeneProGramme.map((p) => (
                <option key={p.id} value={p.id} disabled>
                  {p.name} (Frist abgelaufen)
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Programm-Details */}
      {selectedProgramm && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-medium text-green-800 dark:text-green-300">
            {selectedProgramm.name}
          </h4>
          <p className="text-green-700 dark:text-green-400">{selectedProgramm.beschreibung}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            {selectedProgramm.foerderquote && (
              <span className="text-green-700 dark:text-green-400">
                ✅ Förderquote: <strong>{selectedProgramm.foerderquote}%</strong>
              </span>
            )}
            {selectedProgramm.maxFoerderung && (
              <span className="text-green-700 dark:text-green-400">
                📊 Max: <strong>{formatEuro(selectedProgramm.maxFoerderung)}</strong>
              </span>
            )}
            {selectedProgramm.antragsFrist && (
              <span className="text-green-700 dark:text-green-400">
                📅 Frist: <strong>{selectedProgramm.antragsFrist.toLocaleDateString('de-DE')}</strong>
              </span>
            )}
          </div>
          {selectedProgramm.voraussetzungen.length > 0 && (
            <div>
              <p className="font-medium text-green-800 dark:text-green-300 mt-2">Voraussetzungen:</p>
              <ul className="list-disc list-inside text-green-700 dark:text-green-400 space-y-1 mt-1">
                {selectedProgramm.voraussetzungen.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Fläche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Fläche (Hektar) *
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={flaeche || ''}
          onChange={(e) => setFlaeche(parseFloat(e.target.value) || 0)}
          placeholder="z.B. 2.5"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        {geschaetzteFoerderung !== null && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            🌱 Geschätzte Förderung: <strong>{formatEuro(geschaetzteFoerderung)}</strong>
          </p>
        )}
      </div>

      {/* Maßnahmen-Beschreibung */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Maßnahmen-Beschreibung
        </label>
        <textarea
          value={massnahme}
          onChange={(e) => setMassnahme(e.target.value)}
          rows={4}
          placeholder="Beschreiben Sie die geplanten Aufforstungsmaßnahmen..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Antragsteller */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Antragsteller</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name / Firmenname *"
            value={antragsteller.name ?? ''}
            onChange={(e) => setAntragsteller((prev) => ({ ...prev, name: e.target.value }))}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            placeholder="E-Mail *"
            value={antragsteller.email ?? ''}
            onChange={(e) => setAntragsteller((prev) => ({ ...prev, email: e.target.value }))}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="text"
            placeholder="Straße + Nr."
            value={antragsteller.adresse ?? ''}
            onChange={(e) => setAntragsteller((prev) => ({ ...prev, adresse: e.target.value }))}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="PLZ"
              value={antragsteller.plz ?? ''}
              onChange={(e) => setAntragsteller((prev) => ({ ...prev, plz: e.target.value }))}
              className="w-28 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Ort"
              value={antragsteller.ort ?? ''}
              onChange={(e) => setAntragsteller((prev) => ({ ...prev, ort: e.target.value }))}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Fehler */}
      {submitError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {submitError}
        </div>
      )}

      {/* Aktionen */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Abbrechen
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Wird gespeichert...' : 'Antrag speichern'}
        </button>
      </div>
    </form>
  );
}

export default FoerderantragForm;
