/**
 * Feldhub Forst-Modul — useFoerderung Hook
 * 
 * React Hook für Förderantrag-Datenzugriff.
 */

'use client';

import { useState, useMemo } from 'react';
import type { FoerderAntrag, FoerderAntragStatus, FoerderProgramm } from '../types';
import { sortFoerderProgramme, isProgrammAktuell } from '../utils/foerderung';

// =============================================================================
// HOOK: useForederprogramme
// =============================================================================

interface UseFoerderprogrammeReturn {
  programme: FoerderProgramm[];
  aktuelleProGramme: FoerderProgramm[];
  filteredProgramme: FoerderProgramm[];
  bundeslandFilter: string | null;
  setBundeslandFilter: (bl: string | null) => void;
}

export function useFoerderprogramme(
  alleProgramme: FoerderProgramm[] = []
): UseFoerderprogrammeReturn {
  const [bundeslandFilter, setBundeslandFilter] = useState<string | null>(null);

  const sortierte = useMemo(() => sortFoerderProgramme(alleProgramme), [alleProgramme]);
  
  const aktuelleProGramme = useMemo(
    () => sortierte.filter(isProgrammAktuell),
    [sortierte]
  );

  const filteredProgramme = useMemo(() => {
    if (!bundeslandFilter) return sortierte;
    return sortierte.filter(
      (p) => !p.bundesland || p.bundesland === bundeslandFilter
    );
  }, [sortierte, bundeslandFilter]);

  return {
    programme: sortierte,
    aktuelleProGramme,
    filteredProgramme,
    bundeslandFilter,
    setBundeslandFilter,
  };
}

// =============================================================================
// HOOK: useFoerderAntraege
// =============================================================================

interface UseFoerderAntraegeReturn {
  antraege: FoerderAntrag[];
  antraegeByStatus: Record<FoerderAntragStatus, FoerderAntrag[]>;
  statusFilter: FoerderAntragStatus | 'alle';
  setStatusFilter: (s: FoerderAntragStatus | 'alle') => void;
  filteredAntraege: FoerderAntrag[];
}

export function useFoerderAntraege(
  alleAntraege: FoerderAntrag[] = []
): UseFoerderAntraegeReturn {
  const [statusFilter, setStatusFilter] = useState<FoerderAntragStatus | 'alle'>('alle');

  const antraegeByStatus = useMemo(() => {
    return alleAntraege.reduce(
      (acc, antrag) => {
        if (!acc[antrag.status]) acc[antrag.status] = [];
        acc[antrag.status].push(antrag);
        return acc;
      },
      {} as Record<FoerderAntragStatus, FoerderAntrag[]>
    );
  }, [alleAntraege]);

  const filteredAntraege = useMemo(() => {
    if (statusFilter === 'alle') return alleAntraege;
    return alleAntraege.filter((a) => a.status === statusFilter);
  }, [alleAntraege, statusFilter]);

  return {
    antraege: alleAntraege,
    antraegeByStatus,
    statusFilter,
    setStatusFilter,
    filteredAntraege,
  };
}
