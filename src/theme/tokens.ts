/**
 * Feldhub Design Tokens
 *
 * Alle Design-Variablen zentral definiert.
 * Werden als CSS Custom Properties injiziert (Light + Dark).
 */

// ─── Brand Palette ────────────────────────────────────────────────────────────

/** Forest Green — Feldhub Primary */
export const primaryColors = {
  50:  '#f3f6f2',
  100: '#e4ebe2',
  200: '#c9d7c5',
  300: '#a5bb9f',
  400: '#7d9a74',
  500: '#5d7d53',
  600: '#486440',
  700: '#3a5034',
  800: '#2D5A27', // Feldhub Primary
  900: '#283623',
  950: '#141c12',
} as const

/** Gold/Amber — Feldhub Accent (Koch Aufforstung Gold) */
export const accentColors = {
  500: '#C5A55A',
  600: '#b38c35',
} as const

// ─── Theme Token Maps ─────────────────────────────────────────────────────────

export interface ThemeTokens {
  // Brand
  colorPrimary:        string
  colorPrimary50:      string
  colorPrimary100:     string
  colorPrimary200:     string
  colorPrimary300:     string
  colorPrimary400:     string
  colorPrimary500:     string
  colorPrimary600:     string
  colorPrimary700:     string
  colorPrimary800:     string
  colorPrimary900:     string
  colorPrimary950:     string
  colorAccent:         string
  colorAccent500:      string
  colorAccent600:      string
  // Semantic
  colorBackground:     string
  colorForeground:     string
  colorMuted:          string
  colorMutedForeground:string
  colorBorder:         string
  colorInput:          string
  colorRing:           string
  colorCard:           string
  colorCardForeground: string
  // Status
  colorSuccess:        string
  colorWarning:        string
  colorError:          string
  colorInfo:           string
  // Shadows
  shadowSm:            string
  shadowMd:            string
  shadowLg:            string
  // Radius
  radiusSm:            string
  radiusMd:            string
  radiusLg:            string
}

export const lightTheme: ThemeTokens = {
  colorPrimary:         primaryColors[800],
  colorPrimary50:       primaryColors[50],
  colorPrimary100:      primaryColors[100],
  colorPrimary200:      primaryColors[200],
  colorPrimary300:      primaryColors[300],
  colorPrimary400:      primaryColors[400],
  colorPrimary500:      primaryColors[500],
  colorPrimary600:      primaryColors[600],
  colorPrimary700:      primaryColors[700],
  colorPrimary800:      primaryColors[800],
  colorPrimary900:      primaryColors[900],
  colorPrimary950:      primaryColors[950],
  colorAccent:          accentColors[500],
  colorAccent500:       accentColors[500],
  colorAccent600:       accentColors[600],
  colorBackground:      '#ffffff',
  colorForeground:      '#0a0a0a',
  colorMuted:           '#f4f4f5',
  colorMutedForeground: '#71717a',
  colorBorder:          '#e4e4e7',
  colorInput:           '#e4e4e7',
  colorRing:            primaryColors[800],
  colorCard:            '#ffffff',
  colorCardForeground:  '#0a0a0a',
  colorSuccess:         '#16a34a',
  colorWarning:         '#d97706',
  colorError:           '#dc2626',
  colorInfo:            '#2563eb',
  shadowSm:             '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadowMd:             '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  shadowLg:             '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  radiusSm:             '0.25rem',
  radiusMd:             '0.5rem',
  radiusLg:             '0.75rem',
}

export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colorBackground:      '#0a0a0a',
  colorForeground:      '#fafafa',
  colorMuted:           '#27272a',
  colorMutedForeground: '#a1a1aa',
  colorBorder:          '#3f3f46',
  colorInput:           '#3f3f46',
  colorCard:            '#18181b',
  colorCardForeground:  '#fafafa',
  // Shadows softer in dark
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
}

/**
 * Konvertiert ThemeTokens in CSS Custom Properties Objekt.
 * CamelCase → --color-primary etc.
 */
export function tokensToCSSVars(tokens: ThemeTokens): Record<string, string> {
  const cssVars: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    // colorPrimary800 → --color-primary-800
    const cssKey = '--' + key
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^--color-primary-(\d)/, '--color-primary-$1')
    cssVars[cssKey] = value
  }
  return cssVars
}
