/**
 * Demo Tenant Configuration
 * 
 * Dies ist die Standard-Konfiguration für Demo/Entwicklung.
 * Kopiere diese Datei als Vorlage für neue Kunden.
 */

import { TenantConfig, registerTenant } from '../tenant';

export const demoTenant: TenantConfig = {
  id: 'demo',
  name: 'AppFabrik Demo',
  shortName: 'Demo',
  tagline: 'Field Service Management',
  
  branding: {
    logo: '/logo.png',
    logoLight: '/logo.png',
    logoDark: '/logo-dark.png',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    ogImage: '/og-image.png',
  },
  
  colors: {
    // Brand
    primary: '#2C3A1C',
    primaryLight: '#4A6030',
    primaryDark: '#1A2410',
    secondary: '#C5A55A',
    secondaryLight: '#D4BC7F',
    secondaryDark: '#A68A3E',
    
    // Background
    background: '#F8F7F2',
    backgroundAlt: '#FFFFFF',
    surface: '#FFFFFF',
    
    // Text
    text: '#1A1A1A',
    textMuted: '#6B7280',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#1A1A1A',
    
    // Semantic
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // UI
    border: '#E5E7EB',
    divider: '#E5E7EB',
    sidebarBg: '#2C3A1C',
    sidebarText: '#FFFFFF',
    sidebarActive: '#C5A55A',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    fontSizeBase: '16px',
  },
  
  locale: {
    language: 'de',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    currencySymbol: '€',
  },
  
  modules: {
    dashboard: { enabled: true, icon: 'LayoutDashboard' },
    auftraege: { enabled: true, icon: 'ClipboardList' },
    mitarbeiter: { enabled: true, icon: 'Users' },
    lager: { enabled: true, icon: 'Warehouse' },
    fuhrpark: { enabled: true, icon: 'Truck' },
    rechnungen: { enabled: true, icon: 'Receipt' },
    protokolle: { enabled: true, icon: 'FileText' },
    kontakte: { enabled: true, icon: 'Contact' },
    dokumente: { enabled: true, icon: 'FolderOpen' },
    reports: { enabled: true, icon: 'BarChart3' },
    lohn: { enabled: true, icon: 'Banknote' },
    wochenplan: { enabled: true, icon: 'Calendar' },
    saisons: { enabled: true, icon: 'CalendarRange' },
    schulungen: { enabled: false, icon: 'GraduationCap' },
    gruppen: { enabled: true, icon: 'UsersRound' },
    angebote: { enabled: true, icon: 'FileSignature' },
    // Branchenspezifisch (deaktiviert für Demo)
    foerderung: { enabled: false, icon: 'Sprout' },
    abnahme: { enabled: false, icon: 'CheckSquare' },
    qualifikationen: { enabled: false, icon: 'Award' },
    saatguternte: { enabled: false, icon: 'TreeDeciduous' },
    flaechen: { enabled: false, icon: 'Map' },
  },
  
  roles: [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Voller Zugriff auf alle Funktionen',
      permissions: ['*'],
      canBeDeleted: false,
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Verwaltet Teams und Operationen',
      permissions: [
        'auftraege:*',
        'mitarbeiter:read',
        'protokolle:*',
        'lager:*',
        'fuhrpark:*',
        'gruppen:*',
        'reports:read',
      ],
    },
    {
      id: 'worker',
      name: 'Mitarbeiter',
      description: 'Basis-Zugriff für Außendienst',
      permissions: [
        'auftraege:read',
        'protokolle:read',
        'protokolle:create',
        'stunden:create',
        'profil:*',
      ],
      isDefault: true,
    },
    {
      id: 'client',
      name: 'Kunde',
      description: 'Kundenportal-Zugang',
      permissions: [
        'kundenportal:*',
        'auftraege:read:own',
        'rechnungen:read:own',
        'dokumente:read:own',
      ],
    },
  ],
  defaultRole: 'worker',
  
  auth: {
    providers: ['credentials', 'magic-link'],
    sessionMaxAge: 30 * 24 * 60 * 60,
    requireEmailVerification: false,
    allowRegistration: false,
    passwordMinLength: 8,
  },
  
  database: {
    provider: 'neon',
  },
  
  branche: {
    id: 'generic',
    name: 'Allgemein',
    auftragstypen: [
      'Service',
      'Wartung',
      'Installation',
      'Reparatur',
      'Beratung',
      'Sonstiges',
    ],
    leistungseinheiten: [
      'Stück',
      'Stunde',
      'Pauschal',
      'lfm',
      'm²',
      'm³',
    ],
    protokollFelder: ['arbeitsbeginn', 'arbeitsende', 'leistung', 'bericht'],
    lagerKategorien: ['Material', 'Werkzeug', 'Ersatzteile', 'Verbrauchsmaterial'],
  },
  
  labels: {
    auftrag: 'Auftrag',
    auftraege: 'Aufträge',
    protokoll: 'Tagesprotokoll',
    protokolle: 'Tagesprotokolle',
    mitarbeiter: 'Mitarbeiter',
    mitarbeiterPlural: 'Mitarbeiter',
    lager: 'Lager',
    fuhrpark: 'Fuhrpark',
    kunde: 'Kunde',
    kunden: 'Kunden',
    rechnung: 'Rechnung',
    rechnungen: 'Rechnungen',
    dokument: 'Dokument',
    dokumente: 'Dokumente',
    kontakt: 'Kontakt',
    kontakte: 'Kontakte',
    gruppe: 'Team',
    gruppen: 'Teams',
    saison: 'Saison',
    saisons: 'Saisons',
    neuerAuftrag: 'Neuer Auftrag',
    neuerMitarbeiter: 'Neuer Mitarbeiter',
    neuesProtokoll: 'Neues Protokoll',
    statusOffen: 'Offen',
    statusInBearbeitung: 'In Bearbeitung',
    statusAbgeschlossen: 'Abgeschlossen',
  },
  
  contact: {
    email: 'info@example.com',
    phone: '',
    address: '',
    plz: '',
    city: '',
    country: 'Deutschland',
  },
  
  legal: {
    companyName: 'Demo GmbH',
    companyType: 'GmbH',
    privacyUrl: '/datenschutz',
    imprintUrl: '/impressum',
  },
  
  banking: {
    bankName: '',
    iban: '',
    bic: '',
  },
  
  integrations: {
    nextcloud: { enabled: false },
    wordpress: { enabled: false },
    stripe: { enabled: false },
    smtp: { enabled: false },
    webhooks: { enabled: false },
    slack: { enabled: false },
  },
  
  features: {
    darkMode: true,
    multiLanguage: false,
    pushNotifications: true,
    twoFactorAuth: true,
    auditLog: true,
    offlineMode: false,
    gpsTracking: true,
    signaturCapture: true,
    photoUpload: true,
    pdfExport: true,
    excelExport: true,
    customerPortal: false,
    apiAccess: false,
    advancedReporting: false,
    bulkOperations: true,
    customFields: false,
    autoBackup: true,
  },
  
  ui: {
    sidebarStyle: 'collapsible',
    tableRowsPerPage: 25,
    showWelcomeOnboarding: true,
    defaultDashboardWidgets: ['stats', 'auftraege', 'aktivitaet'],
    dateRangePresets: ['heute', 'woche', 'monat', 'quartal', 'jahr'],
  },
  
  numberFormats: {
    auftrag: 'AU-{YYYY}-{NNNN}',
    rechnung: 'RE-{YYYY}-{NNNN}',
    angebot: 'AN-{YYYY}-{NNNN}',
    protokoll: 'TP-{YYYY}-{NNNN}',
  },
};

// Registriere den Tenant beim Import
registerTenant(demoTenant);

export default demoTenant;
