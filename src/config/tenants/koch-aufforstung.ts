/**
 * Koch Aufforstung GmbH - Tenant Configuration
 * 
 * Referenz-Implementierung für Forstwirtschafts-Unternehmen.
 * Diese Konfiguration kann als Vorlage für ähnliche Kunden verwendet werden.
 */

import { TenantConfig, registerTenant } from '../tenant';

export const kochAufforstungTenant: TenantConfig = {
  id: 'koch-aufforstung',
  name: 'Koch Aufforstung GmbH',
  shortName: 'Koch',
  tagline: 'Professionelle Forstwirtschaft seit 1985',
  
  branding: {
    logo: '/logo-koch.png',
    logoLight: '/logo-koch.png',
    logoDark: '/logo-koch-dark.png',
    favicon: '/favicon-koch.ico',
    appleTouchIcon: '/apple-touch-icon-koch.png',
    ogImage: '/og-koch.png',
  },
  
  colors: {
    // Waldgrün Palette
    primary: '#2C5F2D',        // Waldgrün
    primaryLight: '#4A8C4B',
    primaryDark: '#1A3A1A',
    secondary: '#97BC62',      // Hellgrün/Laub
    secondaryLight: '#B5D389',
    secondaryDark: '#7A9F45',
    
    // Background
    background: '#F5F7F2',     // Leicht grünlicher Hintergrund
    backgroundAlt: '#FFFFFF',
    surface: '#FFFFFF',
    
    // Text
    text: '#1A2E1A',
    textMuted: '#4A5D4A',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#1A2E1A',
    
    // Semantic
    success: '#2C5F2D',
    successLight: '#DCE8DC',
    warning: '#D4A843',
    warningLight: '#FDF6E3',
    error: '#8B2323',
    errorLight: '#F8E0E0',
    info: '#3B6E8F',
    infoLight: '#E3EFF5',
    
    // UI
    border: '#C8D4C8',
    divider: '#E5EBE5',
    sidebarBg: '#1A3A1A',
    sidebarText: '#FFFFFF',
    sidebarActive: '#97BC62',
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
    auftraege: { enabled: true, label: 'Pflanzaufträge', icon: 'TreeDeciduous' },
    mitarbeiter: { enabled: true, label: 'Pflanzer', icon: 'Users' },
    lager: { enabled: true, label: 'Pflanzgut & Material', icon: 'Warehouse' },
    fuhrpark: { enabled: true, icon: 'Truck' },
    rechnungen: { enabled: true, icon: 'Receipt' },
    protokolle: { enabled: true, label: 'Pflanzprotokolle', icon: 'FileText' },
    kontakte: { enabled: true, label: 'Waldbesitzer & Partner', icon: 'Contact' },
    dokumente: { enabled: true, icon: 'FolderOpen' },
    reports: { enabled: true, icon: 'BarChart3' },
    lohn: { enabled: true, icon: 'Banknote' },
    wochenplan: { enabled: true, icon: 'Calendar' },
    saisons: { enabled: true, label: 'Pflanzsaisons', icon: 'CalendarRange' },
    schulungen: { enabled: true, label: 'Qualifikationen', icon: 'GraduationCap' },
    gruppen: { enabled: true, label: 'Pflanzkolonnen', icon: 'UsersRound' },
    angebote: { enabled: true, icon: 'FileSignature' },
    // Branchenspezifisch (aktiviert für Forst)
    foerderung: { 
      enabled: true, 
      label: 'Förderberatung', 
      icon: 'Sprout', 
      description: 'GAK & Landesförderprogramme' 
    },
    abnahme: { enabled: true, label: 'Abnahmeprotokolle', icon: 'CheckSquare' },
    qualifikationen: { enabled: true, icon: 'Award' },
    saatguternte: { enabled: true, icon: 'TreeDeciduous' },
    flaechen: { enabled: true, label: 'Waldflächen', icon: 'Map' },
    
    // 3-Layer: Forst-Modul mit Feature-Flags
    forst: {
      enabled: true,
      features: {
        revierplan: true,        // Revierplan + Maßnahmenplanung
        baumartenKatalog: true,  // Baumarten-Datenbank mit Preisen
        foerderantrag: true,     // GAK + Bayerische Förderanträge
        waldkarte: true,         // GIS-Karte mit Revieren + Beständen
        forstRechtDoku: true,    // BWaldG + BayWaldG Dokumentation
      },
      region: {
        bundesland: 'Bayern',
        kartenDienst: 'bayernatlas', // BayernAtlas WMS für Bayern
      },
    },
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
      id: 'verwaltung',
      name: 'Verwaltung/Büro',
      description: 'Zugriff auf Verwaltungsfunktionen',
      permissions: [
        'auftraege:*',
        'mitarbeiter:*',
        'rechnungen:*',
        'lager:*',
        'dokumente:*',
        'reports:*',
        'kontakte:*',
        'angebote:*',
        'lohn:*',
        'foerderung:*',
        'saisons:*',
        'gruppen:*',
      ],
    },
    {
      id: 'gruppenfuehrer',
      name: 'Gruppenführer',
      description: 'Leitet eine Pflanzkolonne',
      permissions: [
        'auftraege:read',
        'auftraege:update',
        'protokolle:*',
        'mitarbeiter:read',
        'lager:read',
        'lager:create',
        'fuhrpark:read',
        'fuhrpark:update',
        'gruppen:read',
        'abnahme:create',
        'stunden:*',
        'wochenplan:read',
        'wochenplan:update',
      ],
    },
    {
      id: 'mitarbeiter',
      name: 'Pflanzer',
      description: 'Außendienstmitarbeiter',
      permissions: [
        'auftraege:read',
        'protokolle:read',
        'stunden:create',
        'profil:*',
      ],
      isDefault: true,
    },
    {
      id: 'waldbesitzer',
      name: 'Waldbesitzer',
      description: 'Kundenportal für Auftraggeber',
      permissions: [
        'kundenportal:*',
        'auftraege:read:own',
        'protokolle:read:own',
        'rechnungen:read:own',
        'dokumente:read:own',
        'foerderung:read',
        'abnahme:read:own',
      ],
    },
  ],
  defaultRole: 'mitarbeiter',
  
  auth: {
    providers: ['credentials', 'magic-link'],
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 Tage
    requireEmailVerification: false,
    allowRegistration: false, // Nur Admin kann Accounts erstellen
    passwordMinLength: 8,
  },
  
  database: {
    provider: 'neon',
  },
  
  branche: {
    id: 'forst',
    name: 'Forstwirtschaft',
    auftragstypen: [
      'Aufforstung',
      'Flächenvorbereitung',
      'Kulturschutz',
      'Kulturpflege',
      'Saatguternte',
      'Zaunbau',
      'Pflanzenbeschaffung',
      'Jungbestandspflege',
      'Beratung',
    ],
    leistungseinheiten: [
      'ha',           // Hektar (Pflanzfläche)
      'Stück',        // Pflanzen
      'lfm',          // Laufende Meter (Zaun)
      'Stunde',       // Arbeitszeit
      'Pauschal',
      'kg',           // Saatgut
    ],
    protokollFelder: [
      'arbeitsbeginn',
      'arbeitsende',
      'pflanzflaeche',
      'pflanzenAnzahl',
      'baumart',
      'pflanzverfahren',
      'witterung',
      'temperatur',
      'bodenverhaeltnisse',
      'besonderheiten',
    ],
    lagerKategorien: [
      'Pflanzen (Nadelholz)',
      'Pflanzen (Laubholz)',
      'Saatgut',
      'Zaunmaterial',
      'Wuchshüllen',
      'Dünger',
      'Pflanzenschutz',
      'Werkzeug',
      'Ersatzteile',
    ],
  },
  
  labels: {
    auftrag: 'Pflanzauftrag',
    auftraege: 'Pflanzaufträge',
    protokoll: 'Pflanzprotokoll',
    protokolle: 'Pflanzprotokolle',
    mitarbeiter: 'Pflanzer',
    mitarbeiterPlural: 'Pflanzer',
    lager: 'Pflanzgutlager',
    fuhrpark: 'Fuhrpark & Geräte',
    kunde: 'Waldbesitzer',
    kunden: 'Waldbesitzer',
    rechnung: 'Rechnung',
    rechnungen: 'Rechnungen',
    dokument: 'Dokument',
    dokumente: 'Dokumente',
    kontakt: 'Kontakt',
    kontakte: 'Kontakte',
    gruppe: 'Pflanzkolonne',
    gruppen: 'Pflanzkolonnen',
    saison: 'Pflanzsaison',
    saisons: 'Pflanzsaisons',
    neuerAuftrag: 'Neuer Pflanzauftrag',
    neuerMitarbeiter: 'Neuer Pflanzer',
    neuesProtokoll: 'Neues Pflanzprotokoll',
    statusOffen: 'Anfrage',
    statusInBearbeitung: 'In Pflanzung',
    statusAbgeschlossen: 'Gepflanzt',
  },
  
  contact: {
    email: 'info@koch-aufforstung.de',
    phone: '+49 2234 12345',
    mobile: '+49 170 1234567',
    address: 'Waldstraße 42',
    plz: '50859',
    city: 'Köln',
    country: 'Deutschland',
    website: 'https://koch-aufforstung.de',
  },
  
  legal: {
    companyName: 'Koch Aufforstung GmbH',
    companyType: 'GmbH',
    registerId: 'HRB 12345',
    registerCourt: 'Amtsgericht Köln',
    taxId: '215/5781/1234',
    vatId: 'DE123456789',
    ceo: 'Thomas Koch',
    privacyUrl: '/datenschutz',
    imprintUrl: '/impressum',
    termsUrl: '/agb',
  },
  
  banking: {
    bankName: 'Sparkasse Köln',
    iban: 'DE89 3704 0044 0123 4567 89',
    bic: 'COBADEFFXXX',
  },
  
  integrations: {
    nextcloud: {
      enabled: true,
      config: {
        baseUrl: 'http://187.124.18.244:32774',
        basePath: '/Koch-Aufforstung/',
      },
    },
    wordpress: {
      enabled: true,
      config: {
        baseUrl: 'https://koch-aufforstung.de',
        apiPath: '/wp-json/ka/v1',
      },
    },
    stripe: { enabled: false },
    smtp: {
      enabled: true,
      config: {
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        from: 'noreply@koch-aufforstung.de',
        fromName: 'Koch Aufforstung',
      },
    },
    webhooks: {
      enabled: true,
      config: {
        statusChange: 'https://mission-control-tawny-omega.vercel.app/api/webhooks/auftrag-status',
        newAuftrag: 'https://mission-control-tawny-omega.vercel.app/api/webhooks/new-auftrag',
      },
    },
    slack: { enabled: false },
  },
  
  features: {
    darkMode: true,
    multiLanguage: false,
    pushNotifications: true,
    twoFactorAuth: true,
    auditLog: true,
    offlineMode: true,          // Wichtig für Wald ohne Netz!
    gpsTracking: true,
    signaturCapture: true,
    photoUpload: true,
    pdfExport: true,
    excelExport: true,
    customerPortal: true,       // Waldbesitzer-Portal
    apiAccess: true,            // WP-Integration
    advancedReporting: true,
    bulkOperations: true,
    customFields: false,
    autoBackup: true,
  },
  
  ui: {
    sidebarStyle: 'collapsible',
    tableRowsPerPage: 25,
    showWelcomeOnboarding: false, // Bereits genutzt
    defaultDashboardWidgets: ['stats', 'auftraege', 'wetter', 'saison', 'aktivitaet'],
    dateRangePresets: ['heute', 'woche', 'monat', 'saison', 'jahr'],
  },
  
  numberFormats: {
    auftrag: 'KA-{YYYY}-{NNNN}',
    rechnung: 'RE-{YYYY}-{NNNN}',
    angebot: 'AN-{YYYY}-{NNNN}',
    protokoll: 'PP-{YYYY}-{NNNN}',
  },
};

// Registriere den Tenant beim Import
registerTenant(kochAufforstungTenant);

export default kochAufforstungTenant;
