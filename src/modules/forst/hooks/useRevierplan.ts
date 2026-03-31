/**
 * Feldhub Forst-Modul — useRevierplan Hook
 * 
 * React Hook für Revierplan-Datenzugriff und -Verwaltung.
 */

'use client';

import { useState, useMemo } from 'react';
import type { Revier, RevierplanEintrag } from '../types';

// =============================================================================
// HOOK: useRevierplan
// =============================================================================

interface UseRevierplanReturn {
  reviere: Revier[];
  selectedRevierID: string | null;
  selectedRevier: Revier | null;
  setSelectedRevier: (id: string | null) => void;
  eintraege: RevierplanEintrag[];
  eintraegeForRevier: RevierplanEintrag[];
  totalFlaeche: number;
  offeneMassnahmen: number;
}

export function useRevierplan(
  reviere: Revier[] = [],
  eintraege: RevierplanEintrag[] = []
): UseRevierplanReturn {
  const [selectedRevierID, setSelectedRevier] = useState<string | null>(null);

  const selectedRevier = useMemo(
    () => reviere.find((r) => r.id === selectedRevierID) ?? null,
    [reviere, selectedRevierID]
  );

  const eintraegeForRevier = useMemo(() => {
    if (!selectedRevierID) return eintraege;
    return eintraege.filter((e) => e.revierId === selectedRevierID);
  }, [eintraege, selectedRevierID]);

  const totalFlaeche = useMemo(
    () => reviere.reduce((sum, r) => sum + r.flaeche, 0),
    [reviere]
  );

  const offeneMassnahmen = useMemo(
    () => eintraege.filter((e) => e.status === 'geplant' || e.status === 'in_bearbeitung').length,
    [eintraege]
  );

  return {
    reviere,
    selectedRevierID,
    selectedRevier,
    setSelectedRevier,
    eintraege,
    eintraegeForRevier,
    totalFlaeche,
    offeneMassnahmen,
  };
}
