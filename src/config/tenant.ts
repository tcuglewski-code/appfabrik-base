/**
 * AppFabrik Tenant Configuration System
 * 
 * Vollständig typsicher mit Zod-Validation.
 * Tenant-spezifische Konfigurationen liegen in src/config/tenants/
 * 
 * Workflow für neuen Kunden:
 * 1. Kopiere src/config/tenants/demo.ts → src/config/tenants/[kunde].ts
 * 2. Passe alle Werte an
 * 3. Setze TENANT_ID env variable
 * 4. Deploy
 */

import { z } from 'zod';

// =============================================================================
// ZOD SCHEMAS
// =============================================================================

/**
 * Farb-Schema (Hex-Farben)
 */
const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Muss HEX-Farbcode sein (#RRGGBB)');

/**
 * Tenant Colors Schema
 */
export const TenantColorsSchema = z.object({
  // Brand Colors
  primary: HexColorSchema.describe('Hauptfarbe (Buttons, Links, Highlights)'),
  primaryLight: HexColorSchema.describe('Hellere Primary-Variante'),
  primaryDark: HexColorSchema.describe('Dunklere Primary-Variante'),
  secondary: HexColorSchema.describe('Akzentfarbe'),
  secondaryLight: HexColorSchema.describe('Hellere Secondary-Variante'),
  secondaryDark: HexColorSchema.describe('Dunklere Secondary-Variante'),
  
  // Background Colors
  background: HexColorSchema.describe('Haupt-Hintergrund'),
  backgroundAlt: HexColorSchema.describe('Alternative Hintergrundfarbe (Cards)'),
  surface: HexColorSchema.describe('Oberflächen (Modals, Dropdowns)'),
  
  // Text Colors
  text: HexColorSchema.describe('Haupttext'),
  textMuted: HexColorSchema.describe('Sekundärtext'),
  textOnPrimary: HexColorSchema.describe('Text auf primary-Hintergrund'),
  textOnSecondary: HexColorSchema.describe('Text auf secondary-Hintergrund'),
  
  // Semantic Colors
  success: HexColorSchema,
  successLight: HexColorSchema,
  warning: HexColorSchema,
  warningLight: HexColorSchema,
  error: HexColorSchema,
  errorLight: HexColorSchema,
  info: HexColorSchema,
  infoLight: HexColorSchema,
  
  // Border & Divider
  border: HexColorSchema,
  divider: HexColorSchema,
  
  // Sidebar/Navigation
  sidebarBg: HexColorSchema,
  sidebarText: HexColorSchema,
  sidebarActive: HexColorSchema,
});

/**
 * Modul-Konfiguration Schema
 */
export const TenantModuleSchema = z.object({
  enabled: z.boolean().describe('Ist das Modul aktiviert?'),
  label: z.string().optional().describe('Überschreibt Standard-Label'),
  description: z.string().optional(),
  icon: z.string().optional().describe('Lucide Icon Name'),
  permissions: z.array(z.string()).optional().describe('Benötigte Permissions'),
});

/**
 * Rollen-Schema
 */
export const TenantRoleSchema = z.object({
  id: z.string().min(1).describe('Unique Role ID'),
  name: z.string().min(1).describe('Anzeigename'),
  description: z.string().describe('Beschreibung der Rolle'),
  permissions: z.array(z.string()).describe('Array von Permission-Strings'),
  isDefault: z.boolean().optional().describe('Standard-Rolle für neue User'),
  canBeDeleted: z.boolean().optional().describe('Kann die Rolle gelöscht werden?'),
});

/**
 * Branchen-Konfiguration Schema
 */
export const TenantBrancheSchema = z.object({
  id: z.string().min(1).describe('Branchen-ID'),
  name: z.string().min(1).describe('Branchenname'),
  auftragstypen: z.array(z.string()).min(1).describe('Mögliche Auftragstypen'),
  leistungseinheiten: z.array(z.string()).min(1).describe('Einheiten für Leistungen'),
  protokollFelder: z.array(z.string()).optional().describe('Pflichtfelder in Protokollen'),
  lagerKategorien: z.array(z.string()).optional().describe('Kategorien für Lagerverwaltung'),
});

/**
 * Integration Schema
 */
export const TenantIntegrationSchema = z.object({
  enabled: z.boolean(),
  config: z.record(z.unknown()).optional(),
});

/**
 * Branding Schema
 */
export const TenantBrandingSchema = z.object({
  logo: z.string().describe('Pfad zum Logo'),
  logoLight: z.string().describe('Logo für hellen Hintergrund'),
  logoDark: z.string().describe('Logo für Dark Mode'),
  favicon: z.string().describe('Favicon-Pfad'),
  appleTouchIcon: z.string().optional(),
  ogImage: z.string().optional().describe('Open Graph Image für Social Sharing'),
});

/**
 * Typografie Schema
 */
export const TenantTypographySchema = z.object({
  fontFamily: z.string().describe('Hauptschriftart'),
  fontFamilyMono: z.string().describe('Monospace-Schrift'),
  fontSizeBase: z.string().describe('Basis-Schriftgröße'),
});

/**
 * Lokalisierung Schema
 */
export const TenantLocaleSchema = z.object({
  language: z.enum(['de', 'en', 'pl', 'fr']).describe('Sprache'),
  timezone: z.string().describe('Zeitzone'),
  dateFormat: z.string().describe('Datumsformat'),
  timeFormat: z.string().describe('Zeitformat'),
  currency: z.enum(['EUR', 'USD', 'GBP', 'CHF', 'PLN']).describe('Währung'),
  currencySymbol: z.string().describe('Währungssymbol'),
});

/**
 * Labels Schema (branchenspezifische Bezeichnungen)
 */
export const TenantLabelsSchema = z.object({
  // Entitäten
  auftrag: z.string(),
  auftraege: z.string(),
  protokoll: z.string(),
  protokolle: z.string(),
  mitarbeiter: z.string(),
  mitarbeiterPlural: z.string(),
  lager: z.string(),
  fuhrpark: z.string(),
  kunde: z.string(),
  kunden: z.string(),
  rechnung: z.string(),
  rechnungen: z.string(),
  dokument: z.string(),
  dokumente: z.string(),
  kontakt: z.string(),
  kontakte: z.string(),
  gruppe: z.string(),
  gruppen: z.string(),
  saison: z.string(),
  saisons: z.string(),
  
  // Actions
  neuerAuftrag: z.string(),
  neuerMitarbeiter: z.string(),
  neuesProtokoll: z.string(),
  
  // Status
  statusOffen: z.string(),
  statusInBearbeitung: z.string(),
  statusAbgeschlossen: z.string(),
});

/**
 * Kontakt-Schema
 */
export const TenantContactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  address: z.string(),
  plz: z.string(),
  city: z.string(),
  country: z.string().default('Deutschland'),
  website: z.string().url().optional(),
});

/**
 * Legal/Impressum Schema
 */
export const TenantLegalSchema = z.object({
  companyName: z.string().min(1),
  companyType: z.string().describe('GmbH, UG, AG, etc.'),
  registerId: z.string().optional().describe('HRB-Nummer'),
  registerCourt: z.string().optional(),
  taxId: z.string().optional().describe('Steuernummer'),
  vatId: z.string().optional().describe('USt-ID'),
  ceo: z.string().optional().describe('Geschäftsführer'),
  privacyUrl: z.string(),
  imprintUrl: z.string(),
  termsUrl: z.string().optional(),
});

/**
 * Banking Schema
 */
export const TenantBankingSchema = z.object({
  bankName: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
});

/**
 * Features Schema
 */
export const TenantFeaturesSchema = z.object({
  darkMode: z.boolean().default(true),
  multiLanguage: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  twoFactorAuth: z.boolean().default(true),
  auditLog: z.boolean().default(true),
  offlineMode: z.boolean().default(false),
  gpsTracking: z.boolean().default(true),
  signaturCapture: z.boolean().default(true),
  photoUpload: z.boolean().default(true),
  pdfExport: z.boolean().default(true),
  excelExport: z.boolean().default(true),
  customerPortal: z.boolean().default(false),
  apiAccess: z.boolean().default(false),
  advancedReporting: z.boolean().default(false),
  bulkOperations: z.boolean().default(true),
  customFields: z.boolean().default(false),
  autoBackup: z.boolean().default(true),
});

/**
 * UI-Settings Schema
 */
export const TenantUISchema = z.object({
  sidebarStyle: z.enum(['compact', 'expanded', 'collapsible']).default('collapsible'),
  tableRowsPerPage: z.number().min(10).max(100).default(25),
  showWelcomeOnboarding: z.boolean().default(true),
  defaultDashboardWidgets: z.array(z.string()).default(['stats', 'auftraege', 'aktivitaet']),
  dateRangePresets: z.array(z.string()).default(['heute', 'woche', 'monat', 'quartal', 'jahr']),
});

/**
 * Nummernkreise Schema
 */
export const TenantNumberFormatsSchema = z.object({
  auftrag: z.string().describe('Format: AU-{YYYY}-{NNNN}'),
  rechnung: z.string().describe('Format: RE-{YYYY}-{NNNN}'),
  angebot: z.string().describe('Format: AN-{YYYY}-{NNNN}'),
  protokoll: z.string().describe('Format: TP-{YYYY}-{NNNN}'),
});

/**
 * Module-Map Schema
 */
export const TenantModulesSchema = z.object({
  // Core-Module
  dashboard: TenantModuleSchema,
  auftraege: TenantModuleSchema,
  mitarbeiter: TenantModuleSchema,
  
  // Optionale Module
  lager: TenantModuleSchema,
  fuhrpark: TenantModuleSchema,
  rechnungen: TenantModuleSchema,
  protokolle: TenantModuleSchema,
  kontakte: TenantModuleSchema,
  dokumente: TenantModuleSchema,
  reports: TenantModuleSchema,
  lohn: TenantModuleSchema,
  wochenplan: TenantModuleSchema,
  saisons: TenantModuleSchema,
  schulungen: TenantModuleSchema,
  gruppen: TenantModuleSchema,
  angebote: TenantModuleSchema,
  
  // Branchenspezifische Module
  foerderung: TenantModuleSchema,
  abnahme: TenantModuleSchema,
  qualifikationen: TenantModuleSchema,
  saatguternte: TenantModuleSchema,
  flaechen: TenantModuleSchema,
});

/**
 * Integrationen Schema
 */
export const TenantIntegrationsSchema = z.object({
  nextcloud: TenantIntegrationSchema.extend({
    config: z.object({
      baseUrl: z.string().url(),
      basePath: z.string(),
    }).optional(),
  }),
  wordpress: TenantIntegrationSchema.extend({
    config: z.object({
      baseUrl: z.string().url(),
      apiPath: z.string(),
    }).optional(),
  }),
  stripe: TenantIntegrationSchema,
  smtp: TenantIntegrationSchema.extend({
    config: z.object({
      host: z.string(),
      port: z.number(),
      secure: z.boolean(),
      from: z.string().email(),
      fromName: z.string(),
    }).optional(),
  }),
  webhooks: TenantIntegrationSchema.extend({
    config: z.object({
      statusChange: z.string().url().optional(),
      newAuftrag: z.string().url().optional(),
      protokollSubmit: z.string().url().optional(),
    }).optional(),
  }),
  slack: TenantIntegrationSchema.extend({
    config: z.object({
      webhookUrl: z.string().url(),
      channel: z.string(),
    }).optional(),
  }),
});

/**
 * Datenbank-Konfiguration Schema
 */
export const TenantDatabaseSchema = z.object({
  provider: z.enum(['neon', 'postgres', 'supabase']).default('neon'),
  // URL kommt aus ENV, nicht aus Config
});

/**
 * Auth-Konfiguration Schema
 */
export const TenantAuthSchema = z.object({
  providers: z.array(z.enum(['credentials', 'magic-link', 'google', 'github'])).default(['credentials', 'magic-link']),
  sessionMaxAge: z.number().default(30 * 24 * 60 * 60), // 30 Tage in Sekunden
  requireEmailVerification: z.boolean().default(false),
  allowRegistration: z.boolean().default(false),
  passwordMinLength: z.number().min(6).default(8),
});

// =============================================================================
// HAUPT-TENANT SCHEMA
// =============================================================================

export const TenantConfigSchema = z.object({
  // Grundinformationen
  id: z.string().min(1).describe('Unique Tenant ID'),
  name: z.string().min(1).describe('Vollständiger Firmenname'),
  shortName: z.string().min(1).describe('Kurzname für UI'),
  tagline: z.string().describe('Slogan/Untertitel'),
  
  // Branding
  branding: TenantBrandingSchema,
  
  // Farben
  colors: TenantColorsSchema,
  
  // Typografie
  typography: TenantTypographySchema,
  
  // Lokalisierung
  locale: TenantLocaleSchema,
  
  // Module
  modules: TenantModulesSchema,
  
  // Rollen & Berechtigungen
  roles: z.array(TenantRoleSchema).min(1),
  defaultRole: z.string().describe('ID der Standard-Rolle'),
  
  // Auth-Konfiguration
  auth: TenantAuthSchema.optional().default({
    providers: ['credentials', 'magic-link'],
    sessionMaxAge: 30 * 24 * 60 * 60,
    requireEmailVerification: false,
    allowRegistration: false,
    passwordMinLength: 8,
  }),
  
  // Datenbank-Konfiguration
  database: TenantDatabaseSchema.optional().default({
    provider: 'neon',
  }),
  
  // Branchenspezifische Konfiguration
  branche: TenantBrancheSchema,
  
  // Labels
  labels: TenantLabelsSchema,
  
  // Kontakt
  contact: TenantContactSchema,
  
  // Legal
  legal: TenantLegalSchema,
  
  // Banking
  banking: TenantBankingSchema,
  
  // Integrationen
  integrations: TenantIntegrationsSchema,
  
  // Features
  features: TenantFeaturesSchema,
  
  // UI-Einstellungen
  ui: TenantUISchema,
  
  // Nummernkreise
  numberFormats: TenantNumberFormatsSchema,
});

// =============================================================================
// TYPE EXPORTS (inferred from Zod)
// =============================================================================

export type TenantConfig = z.infer<typeof TenantConfigSchema>;
export type TenantColors = z.infer<typeof TenantColorsSchema>;
export type TenantModule = z.infer<typeof TenantModuleSchema>;
export type TenantRole = z.infer<typeof TenantRoleSchema>;
export type TenantBranche = z.infer<typeof TenantBrancheSchema>;
export type TenantBranding = z.infer<typeof TenantBrandingSchema>;
export type TenantTypography = z.infer<typeof TenantTypographySchema>;
export type TenantLocale = z.infer<typeof TenantLocaleSchema>;
export type TenantLabels = z.infer<typeof TenantLabelsSchema>;
export type TenantContact = z.infer<typeof TenantContactSchema>;
export type TenantLegal = z.infer<typeof TenantLegalSchema>;
export type TenantBanking = z.infer<typeof TenantBankingSchema>;
export type TenantFeatures = z.infer<typeof TenantFeaturesSchema>;
export type TenantUI = z.infer<typeof TenantUISchema>;
export type TenantNumberFormats = z.infer<typeof TenantNumberFormatsSchema>;
export type TenantModules = z.infer<typeof TenantModulesSchema>;
export type TenantIntegrations = z.infer<typeof TenantIntegrationsSchema>;
export type TenantAuth = z.infer<typeof TenantAuthSchema>;
export type TenantDatabase = z.infer<typeof TenantDatabaseSchema>;

// =============================================================================
// VALIDATION HELPER
// =============================================================================

/**
 * Validiert eine Tenant-Konfiguration
 * @throws ZodError bei ungültiger Konfiguration
 */
export function validateTenantConfig(config: unknown): TenantConfig {
  return TenantConfigSchema.parse(config);
}

/**
 * Validiert eine Tenant-Konfiguration und gibt Fehler zurück
 */
export function safeParseTenantConfig(config: unknown): z.SafeParseReturnType<unknown, TenantConfig> {
  return TenantConfigSchema.safeParse(config);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generiert CSS-Variablen aus der Tenant-Konfiguration
 */
export function generateCssVariables(config: TenantConfig): Record<string, string> {
  return {
    '--color-primary': config.colors.primary,
    '--color-primary-light': config.colors.primaryLight,
    '--color-primary-dark': config.colors.primaryDark,
    '--color-secondary': config.colors.secondary,
    '--color-secondary-light': config.colors.secondaryLight,
    '--color-secondary-dark': config.colors.secondaryDark,
    '--color-background': config.colors.background,
    '--color-background-alt': config.colors.backgroundAlt,
    '--color-surface': config.colors.surface,
    '--color-text': config.colors.text,
    '--color-text-muted': config.colors.textMuted,
    '--color-text-on-primary': config.colors.textOnPrimary,
    '--color-text-on-secondary': config.colors.textOnSecondary,
    '--color-border': config.colors.border,
    '--color-divider': config.colors.divider,
    '--color-success': config.colors.success,
    '--color-success-light': config.colors.successLight,
    '--color-warning': config.colors.warning,
    '--color-warning-light': config.colors.warningLight,
    '--color-error': config.colors.error,
    '--color-error-light': config.colors.errorLight,
    '--color-info': config.colors.info,
    '--color-info-light': config.colors.infoLight,
    '--color-sidebar-bg': config.colors.sidebarBg,
    '--color-sidebar-text': config.colors.sidebarText,
    '--color-sidebar-active': config.colors.sidebarActive,
    '--font-family': config.typography.fontFamily,
    '--font-family-mono': config.typography.fontFamilyMono,
    '--font-size-base': config.typography.fontSizeBase,
  };
}

/**
 * Prüft ob ein User eine bestimmte Permission hat
 */
export function hasPermission(
  userRole: string,
  permission: string,
  config: TenantConfig
): boolean {
  const role = config.roles.find(r => r.id === userRole);
  if (!role) return false;
  
  // Admin/Wildcard hat immer Zugriff
  if (role.permissions.includes('*')) return true;
  
  // Exakte Übereinstimmung
  if (role.permissions.includes(permission)) return true;
  
  // Wildcard-Check (z.B. "auftraege:*" matched "auftraege:read")
  const [resource, action] = permission.split(':');
  if (role.permissions.includes(`${resource}:*`)) return true;
  
  // :own Suffix Check (z.B. "auftraege:read:own" < "auftraege:read")
  if (action && !permission.endsWith(':own')) {
    if (role.permissions.includes(`${permission}:own`)) return false; // Nur eigene
  }
  
  return false;
}

/**
 * Gibt alle aktivierten Module zurück
 */
export function getEnabledModules(config: TenantConfig): string[] {
  return Object.entries(config.modules)
    .filter(([, module]) => module.enabled)
    .map(([key]) => key);
}

/**
 * Prüft ob ein Modul aktiviert ist
 */
export function isModuleEnabled(moduleName: keyof TenantModules, config: TenantConfig): boolean {
  return config.modules[moduleName]?.enabled ?? false;
}

/**
 * Formatiert eine Nummer nach dem konfigurierten Format
 */
export function formatNumber(
  type: keyof TenantNumberFormats,
  sequence: number,
  config: TenantConfig
): string {
  const format = config.numberFormats[type];
  const year = new Date().getFullYear();
  const paddedSeq = sequence.toString().padStart(4, '0');
  
  return format
    .replace('{YYYY}', year.toString())
    .replace('{NNNN}', paddedSeq);
}

/**
 * Gibt das Label für eine Entität zurück
 */
export function getLabel(key: keyof TenantLabels, config: TenantConfig): string {
  return config.labels[key] ?? key;
}

/**
 * Gibt den Modul-Namen zurück (custom label oder Standard)
 */
export function getModuleLabel(moduleName: keyof TenantModules, config: TenantConfig): string {
  const module = config.modules[moduleName];
  if (!module) return moduleName;
  return module.label ?? moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
}

// =============================================================================
// TENANT LOADER
// =============================================================================

// Tenant-Registry: wird von den Tenant-Configs befüllt
const tenantRegistry = new Map<string, TenantConfig>();

/**
 * Registriert einen Tenant
 */
export function registerTenant(config: TenantConfig): void {
  const validated = validateTenantConfig(config);
  tenantRegistry.set(validated.id, validated);
}

/**
 * Lädt einen Tenant nach ID
 */
export function getTenant(id: string): TenantConfig | undefined {
  return tenantRegistry.get(id);
}

/**
 * Gibt alle registrierten Tenant-IDs zurück
 */
export function getRegisteredTenants(): string[] {
  return Array.from(tenantRegistry.keys());
}

/**
 * Lädt den aktuellen Tenant basierend auf TENANT_ID env variable
 * Falls nicht gesetzt, wird 'demo' verwendet
 */
export function getCurrentTenant(): TenantConfig {
  const tenantId = process.env.TENANT_ID ?? 'demo';
  const tenant = getTenant(tenantId);
  
  if (!tenant) {
    throw new Error(
      `Tenant "${tenantId}" nicht gefunden. ` +
      `Registrierte Tenants: ${getRegisteredTenants().join(', ') || 'keine'}`
    );
  }
  
  return tenant;
}

// =============================================================================
// RE-EXPORT for backwards compatibility
// =============================================================================

// Default export (wird von getCurrentTenant() überschrieben nach Laden der Tenants)
export let tenantConfig: TenantConfig;

/**
 * Initialisiert das Tenant-System
 * Muss beim App-Start aufgerufen werden
 */
export function initializeTenants(): void {
  // Dynamisches Laden aller Tenant-Configs
  // Die Tenant-Dateien rufen registerTenant() auf beim Import
  
  // Nach dem Laden setzen wir den aktuellen Tenant
  try {
    tenantConfig = getCurrentTenant();
  } catch {
    console.warn('Kein Tenant geladen - verwende Demo-Defaults');
  }
}
