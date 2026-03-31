/**
 * Feldhub — useA11y Hook
 * 
 * Accessibility-Hilfsfunktionen für Komponenten.
 * Fokus-Management, ARIA-Patterns, Keyboard-Navigation.
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

// =============================================================================
// FOCUS TRAP (für Modals/Dialogs)
// =============================================================================

/**
 * Hält den Fokus innerhalb eines Elements (z.B. Modal).
 * 
 * @example
 * ```tsx
 * function Modal({ isOpen }) {
 *   const { containerRef } = useFocusTrap(isOpen);
 *   return <div ref={containerRef} role="dialog">...</div>;
 * }
 * ```
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Vorherigen Fokus merken
    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Fokussierbare Elemente
    const getFocusableElements = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    // Erstes fokussierbares Element fokussieren
    const firstEl = getFocusableElements()[0];
    firstEl?.focus();

    // Tab-Falle implementieren
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: Rückwärts
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: Vorwärts
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Fokus zurück zum auslösenden Element
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return { containerRef };
}

// =============================================================================
// ANNOUNCE (für Screen-Reader Live-Regions)
// =============================================================================

/**
 * Kündigt Nachrichten für Screen-Reader an.
 * 
 * @example
 * ```tsx
 * const { announce } = useAnnounce();
 * 
 * async function saveData() {
 *   await save();
 *   announce('Daten wurden gespeichert', 'polite');
 * }
 * ```
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Erstelle eine unsichtbare Live-Region
    const div = document.createElement('div');
    div.setAttribute('aria-live', 'polite');
    div.setAttribute('aria-atomic', 'true');
    div.className = 'sr-only';
    document.body.appendChild(div);
    announceRef.current = div;

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  const announce = useCallback(
    (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
      const el = announceRef.current;
      if (!el) return;
      el.setAttribute('aria-live', politeness);
      // Kurze Pause um Screen-Reader zu triggern
      el.textContent = '';
      setTimeout(() => {
        el.textContent = message;
      }, 100);
    },
    []
  );

  return { announce };
}

// =============================================================================
// KEYBOARD NAVIGATION (für Listen/Grids)
// =============================================================================

/**
 * Arrow-Key Navigation für Listen/Grids.
 * 
 * @example
 * ```tsx
 * const { handleKeyDown, itemProps } = useArrowNavigation(items.length);
 * 
 * return (
 *   <ul role="listbox">
 *     {items.map((item, i) => (
 *       <li key={item.id} {...itemProps(i)} onClick={() => select(item)}>
 *         {item.label}
 *       </li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useArrowNavigation(
  itemCount: number,
  onSelect?: (index: number) => void
) {
  const focusedIndexRef = useRef(0);
  const containerRef = useRef<HTMLElement>(null);

  const focusItem = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>('[data-nav-item]');
    items[index]?.focus();
    focusedIndexRef.current = index;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const current = focusedIndexRef.current;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusItem(Math.min(current + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusItem(Math.max(current - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          focusItem(0);
          break;
        case 'End':
          e.preventDefault();
          focusItem(itemCount - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(current);
          break;
      }
    },
    [itemCount, focusItem, onSelect]
  );

  const itemProps = (index: number) => ({
    'data-nav-item': true,
    tabIndex: index === 0 ? 0 : -1,
    onFocus: () => { focusedIndexRef.current = index; },
  });

  return { containerRef, handleKeyDown, itemProps };
}
