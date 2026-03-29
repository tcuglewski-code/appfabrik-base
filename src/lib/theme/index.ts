/**
 * AppFabrik Theme System
 * 
 * Generiert CSS-Variablen aus der Tenant-Konfiguration
 * und stellt Utilities für Theme-Management bereit.
 */

import { TenantConfig, tenantConfig } from '@/config/tenant';
import { validateTenantContrast, ContrastWarning } from './contrast';

export { validateTenantContrast };
export type { ContrastWarning };

/**
 * Vollständige CSS-Variablen-Map für das Theme-System
 */
export interface ThemeCssVariables {
  // Brand Colors
  '--color-primary': string;
  '--color-primary-light': string;
  '--color-primary-dark': string;
  '--color-secondary': string;
  '--color-secondary-light': string;
  '--color-secondary-dark': string;
  
  // Background Colors
  '--color-background': string;
  '--color-background-alt': string;
  '--color-surface': string;
  
  // Text Colors
  '--color-text': string;
  '--color-text-muted': string;
  '--color-text-on-primary': string;
  '--color-text-on-secondary': string;
  
  // Semantic Colors
  '--color-success': string;
  '--color-success-light': string;
  '--color-warning': string;
  '--color-warning-light': string;
  '--color-error': string;
  '--color-error-light': string;
  '--color-info': string;
  '--color-info-light': string;
  
  // Border & Divider
  '--color-border': string;
  '--color-divider': string;
  
  // Sidebar
  '--color-sidebar-bg': string;
  '--color-sidebar-text': string;
  '--color-sidebar-active': string;
  
  // Typography
  '--font-family': string;
  '--font-family-mono': string;
  '--font-size-base': string;
  
  // Tailwind-kompatible Aliases
  '--foreground': string;
  '--background': string;
}

/**
 * Generiert alle CSS-Variablen aus der Tenant-Konfiguration
 */
export function generateCssVariables(config: TenantConfig = tenantConfig): ThemeCssVariables {
  return {
    // Brand Colors
    '--color-primary': config.colors.primary,
    '--color-primary-light': config.colors.primaryLight,
    '--color-primary-dark': config.colors.primaryDark,
    '--color-secondary': config.colors.secondary,
    '--color-secondary-light': config.colors.secondaryLight,
    '--color-secondary-dark': config.colors.secondaryDark,
    
    // Background Colors
    '--color-background': config.colors.background,
    '--color-background-alt': config.colors.backgroundAlt,
    '--color-surface': config.colors.surface,
    
    // Text Colors
    '--color-text': config.colors.text,
    '--color-text-muted': config.colors.textMuted,
    '--color-text-on-primary': config.colors.textOnPrimary,
    '--color-text-on-secondary': config.colors.textOnSecondary,
    
    // Semantic Colors
    '--color-success': config.colors.success,
    '--color-success-light': config.colors.successLight,
    '--color-warning': config.colors.warning,
    '--color-warning-light': config.colors.warningLight,
    '--color-error': config.colors.error,
    '--color-error-light': config.colors.errorLight,
    '--color-info': config.colors.info,
    '--color-info-light': config.colors.infoLight,
    
    // Border & Divider
    '--color-border': config.colors.border,
    '--color-divider': config.colors.divider,
    
    // Sidebar
    '--color-sidebar-bg': config.colors.sidebarBg,
    '--color-sidebar-text': config.colors.sidebarText,
    '--color-sidebar-active': config.colors.sidebarActive,
    
    // Typography
    '--font-family': config.typography.fontFamily,
    '--font-family-mono': config.typography.fontFamilyMono,
    '--font-size-base': config.typography.fontSizeBase,
    
    // Tailwind-kompatible Aliases
    '--foreground': config.colors.text,
    '--background': config.colors.background,
  };
}

/**
 * Generiert einen CSS-String mit allen Variablen
 */
export function generateCssString(config: TenantConfig = tenantConfig): string {
  const variables = generateCssVariables(config);
  
  const cssLines = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  
  return `:root {\n${cssLines}\n}`;
}

/**
 * Generiert Tailwind-kompatible Farb-Konfiguration
 */
export function generateTailwindColors(config: TenantConfig = tenantConfig): Record<string, string> {
  return {
    // Brand
    'primary': 'var(--color-primary)',
    'primary-light': 'var(--color-primary-light)',
    'primary-dark': 'var(--color-primary-dark)',
    'secondary': 'var(--color-secondary)',
    'secondary-light': 'var(--color-secondary-light)',
    'secondary-dark': 'var(--color-secondary-dark)',
    
    // Background
    'background': 'var(--color-background)',
    'background-alt': 'var(--color-background-alt)',
    'surface': 'var(--color-surface)',
    
    // Text
    'text': 'var(--color-text)',
    'text-muted': 'var(--color-text-muted)',
    
    // Semantic
    'success': 'var(--color-success)',
    'success-light': 'var(--color-success-light)',
    'warning': 'var(--color-warning)',
    'warning-light': 'var(--color-warning-light)',
    'error': 'var(--color-error)',
    'error-light': 'var(--color-error-light)',
    'info': 'var(--color-info)',
    'info-light': 'var(--color-info-light)',
    
    // UI
    'border': 'var(--color-border)',
    'divider': 'var(--color-divider)',
    'sidebar': 'var(--color-sidebar-bg)',
    'sidebar-text': 'var(--color-sidebar-text)',
    'sidebar-active': 'var(--color-sidebar-active)',
  };
}

/**
 * Validiert die Farbkonfiguration eines Tenants
 * und gibt Warnungen bei Kontrast-Problemen zurück
 */
export function validateTheme(config: TenantConfig = tenantConfig): {
  valid: boolean;
  warnings: ContrastWarning[];
} {
  return validateTenantContrast(config.colors);
}

/**
 * Generiert Dark-Mode-Varianten der Farben
 * (Invertiert Hintergründe, behält Brand-Colors bei)
 */
export function generateDarkModeVariables(config: TenantConfig = tenantConfig): Partial<ThemeCssVariables> {
  return {
    '--color-background': '#0f0f0f',
    '--color-background-alt': '#1a1a1a',
    '--color-surface': '#1f1f1f',
    '--color-text': '#ffffff',
    '--color-text-muted': '#a1a1aa',
    '--color-border': '#2a2a2a',
    '--color-divider': '#262626',
    // Brand-Farben bleiben gleich, aber mit leichter Anpassung
    '--color-primary': config.colors.primary,
    '--color-primary-light': config.colors.primaryLight,
    '--foreground': '#ffffff',
    '--background': '#0f0f0f',
  };
}

export default {
  generateCssVariables,
  generateCssString,
  generateTailwindColors,
  validateTheme,
  generateDarkModeVariables,
};
