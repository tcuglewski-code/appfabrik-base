/**
 * Feldhub Forst-Modul — useBaumarten Hook
 * 
 * React Hook für Baumarten-Katalog Datenzugriff und -Filterung.
 * Nutzt SWR für Caching + Revalidierung.
 */

'use client';

import { useState, useMemo } from 'react';
import type { Baumart, BaumartenKatalogFilter } from '../types';
import { filterBaumarten, sortBaumartenAlphabetisch, groupBaumartenByKategorie } from '../utils/baumarten';

// =============================================================================
// HOOK
// =============================================================================

interface UseBaumartenOptions {
  initialFilter?: BaumartenKatalogFilter;
}

interface UseBaumartenReturn {
  baumarten: Baumart[];
  baumartenGruppiert: ReturnType<typeof groupBaumartenByKategorie>;
  filter: BaumartenKatalogFilter;
  setFilter: (filter: BaumartenKatalogFilter) => void;
  updateFilter: (partial: Partial<BaumartenKatalogFilter>) => void;
  resetFilter: () => void;
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  filteredCount: number;
}

const DEFAULT_FILTER: BaumartenKatalogFilter = {
  nurAktiv: true,
};

/**
 * Hook für Baumarten-Katalog
 * 
 * @example
 * ```tsx
 * function BaumartenSeite() {
 *   const { baumarten, filter, updateFilter } = useBaumarten();
 *   
 *   return (
 *     <>
 *       <input 
 *         value={filter.suchbegriff ?? ''} 
 *         onChange={(e) => updateFilter({ suchbegriff: e.target.value })} 
 *       />
 *       {baumarten.map(b => <BaumartenCard key={b.id} baumart={b} />)}
 *     </>
 *   );
 * }
 * ```
 */
export function useBaumarten(
  alleBaumarten: Baumart[] = [],
  options: UseBaumartenOptions = {}
): UseBaumartenReturn {
  const [filter, setFilter] = useState<BaumartenKatalogFilter>(
    options.initialFilter ?? DEFAULT_FILTER
  );
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const filteredBaumarten = useMemo(
    () => sortBaumartenAlphabetisch(filterBaumarten(alleBaumarten, filter)),
    [alleBaumarten, filter]
  );

  const baumartenGruppiert = useMemo(
    () => groupBaumartenByKategorie(filteredBaumarten),
    [filteredBaumarten]
  );

  const updateFilter = (partial: Partial<BaumartenKatalogFilter>) => {
    setFilter((prev) => ({ ...prev, ...partial }));
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  return {
    baumarten: filteredBaumarten,
    baumartenGruppiert,
    filter,
    setFilter,
    updateFilter,
    resetFilter,
    isLoading,
    error,
    totalCount: alleBaumarten.length,
    filteredCount: filteredBaumarten.length,
  };
}
