/**
 * Feldhub — VisuallyHidden (Accessibility Utility)
 * 
 * Macht Inhalt für Screen-Reader sichtbar, visuell unsichtbar.
 * Alternative zu `className="sr-only"` wenn React-Komponente bevorzugt.
 * 
 * WCAG: Hilfsmittel für Labels und Beschreibungen ohne visuelle Darstellung.
 */

import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  /** Als span (inline) oder div (block) rendern */
  as?: 'span' | 'div';
}

export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
  return (
    <Tag className="sr-only">
      {children}
    </Tag>
  );
}

export default VisuallyHidden;
