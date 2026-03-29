/**
 * WCAG 2.1 Kontrast-Checker Utilities
 * 
 * Ermöglicht automatische Überprüfung von Farbkontrasten
 * für Accessibility-Compliance (AA-Level).
 */

/**
 * Parst einen Hex-Farbcode in RGB-Werte
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Entferne # wenn vorhanden
  const cleanHex = hex.replace(/^#/, '');
  
  // Unterstütze 3-stellige und 6-stellige Hex-Codes
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(c => c + c).join('');
  }
  
  if (fullHex.length !== 6) {
    return null;
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Berechnet die relative Luminanz einer Farbe nach WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  
  // Konvertiere zu sRGB
  const [rs, gs, bs] = [r, g, b].map(c => {
    const srgb = c / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  
  // Berechne Luminanz
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Berechnet das Kontrastverhältnis zwischen zwei Farben
 * Ergebnis liegt zwischen 1:1 (identisch) und 21:1 (schwarz/weiß)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG 2.1 Konformitätslevel
 */
export type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

/**
 * Prüft ob ein Farbpaar WCAG-konform ist
 * 
 * WCAG AA: 
 *   - Normaler Text: 4.5:1
 *   - Großer Text (>=18pt oder >=14pt bold): 3:1
 * 
 * WCAG AAA:
 *   - Normaler Text: 7:1
 *   - Großer Text: 4.5:1
 */
export function checkWcagContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  level: WcagLevel;
  passesAA: boolean;
  passesAALarge: boolean;
  passesAAA: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  
  let level: WcagLevel = 'fail';
  if (ratio >= 7) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  } else if (ratio >= 3) {
    level = 'AA-large';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passesAA: ratio >= 4.5,
    passesAALarge: ratio >= 3,
    passesAAA: ratio >= 7,
  };
}

/**
 * Bestimmt automatisch ob Text weiß oder schwarz sein sollte
 * basierend auf der Hintergrundfarbe
 */
export function getOptimalTextColor(backgroundColor: string): '#FFFFFF' | '#000000' {
  const luminance = getLuminance(backgroundColor);
  // Wenn Hintergrund dunkel ist (Luminanz < 0.5), nutze weißen Text
  return luminance < 0.179 ? '#FFFFFF' : '#000000';
}

/**
 * Generiert eine hellere oder dunklere Variante einer Farbe
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const adjust = (value: number) => {
    const adjusted = value + (255 * percent) / 100;
    return Math.min(255, Math.max(0, Math.round(adjusted)));
  };
  
  const r = adjust(rgb.r);
  const g = adjust(rgb.g);
  const b = adjust(rgb.b);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Interface für Kontrast-Warnungen
 */
export interface ContrastWarning {
  pair: string;
  foreground: string;
  background: string;
  ratio: number;
  requiredRatio: number;
  suggestion?: string;
}

/**
 * Validiert alle kritischen Farbpaare einer Tenant-Konfiguration
 */
export function validateTenantContrast(colors: {
  primary: string;
  textOnPrimary: string;
  secondary: string;
  textOnSecondary: string;
  background: string;
  text: string;
  textMuted: string;
  sidebarBg: string;
  sidebarText: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}): {
  valid: boolean;
  warnings: ContrastWarning[];
} {
  const warnings: ContrastWarning[] = [];
  
  // Kritische Farbpaare die geprüft werden müssen
  const pairs: Array<{
    name: string;
    fg: keyof typeof colors;
    bg: keyof typeof colors;
    minRatio: number;
  }> = [
    { name: 'Primary Button Text', fg: 'textOnPrimary', bg: 'primary', minRatio: 4.5 },
    { name: 'Secondary Button Text', fg: 'textOnSecondary', bg: 'secondary', minRatio: 4.5 },
    { name: 'Main Text', fg: 'text', bg: 'background', minRatio: 4.5 },
    { name: 'Muted Text', fg: 'textMuted', bg: 'background', minRatio: 3 },
    { name: 'Sidebar Text', fg: 'sidebarText', bg: 'sidebarBg', minRatio: 4.5 },
  ];
  
  for (const pair of pairs) {
    const ratio = getContrastRatio(colors[pair.fg], colors[pair.bg]);
    
    if (ratio < pair.minRatio) {
      const optimalColor = getOptimalTextColor(colors[pair.bg]);
      warnings.push({
        pair: pair.name,
        foreground: colors[pair.fg],
        background: colors[pair.bg],
        ratio: Math.round(ratio * 100) / 100,
        requiredRatio: pair.minRatio,
        suggestion: `Empfehlung: Nutze ${optimalColor} als Textfarbe`,
      });
    }
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
  };
}

export default {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  checkWcagContrast,
  getOptimalTextColor,
  adjustBrightness,
  validateTenantContrast,
};
