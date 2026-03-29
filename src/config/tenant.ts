/**
 * AppFabrik Tenant Configuration
 * 
 * Diese Datei definiert alle konfigurierbaren Aspekte eines Tenants.
 * Passe sie für jeden neuen Kunden an.
 * 
 * Workflow für neuen Kunden:
 * 1. Kopiere diese Datei
 * 2. Passe alle Werte an den Kunden an
 * 3. Setze ENV-Variablen (DATABASE_URL, AUTH_SECRET, etc.)
 * 4. Deploy mit `vercel deploy`
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface TenantColors {
  // Brand Colors
  primary: string;           // Hauptfarbe (Buttons, Links, Highlights)
  primaryLight: string;      // Hellere Variante
  primaryDark: string;       // Dunklere Variante
  secondary: string;         // Akzentfarbe
  secondaryLight: string;
  secondaryDark: string;
  
  // Background Colors
  background: string;        // Haupt-Hintergrund
  backgroundAlt: string;     // Alternative (Cards, Sections)
  surface: string;           // Oberflächen (Modals, Dropdowns)
  
  // Text Colors
  text: string;              // Haupttext
  textMuted: string;         // Sekundärtext
  textOnPrimary: string;     // Text auf primary-Hintergrund
  textOnSecondary: string;   // Text auf secondary-Hintergrund
  
  // Semantic Colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  
  // Border & Divider
  border: string;
  divider: string;
  
  // Sidebar/Navigation
  sidebarBg: string;
  sidebarText: string;
  sidebarActive: string;
}

export interface TenantModule {
  enabled: boolean;
  label?: string;           // Überschreibt Standard-Label
  description?: string;
  icon?: string;            // Lucide Icon Name
  permissions?: string[];   // Benötigte Permissions
}

export interface TenantRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
  canBeDeleted?: boolean;
}

export interface TenantBrancheConfig {
  id: string;
  name: string;
  auftragstypen: string[];
  leistungseinheiten: string[];
  protokollFelder?: string[];
  lagerKategorien?: string[];
}

export interface TenantIntegration {
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface TenantConfig {
  // ==========================================================================
  // GRUNDINFORMATIONEN
  // ==========================================================================
  id: string;                // Unique Tenant ID (z.B. "koch-aufforstung")
  name: string;              // Vollständiger Firmenname
  shortName: string;         // Kurzname für UI
  tagline: string;           // Slogan/Untertitel
  
  // ==========================================================================
  // BRANDING
  // ==========================================================================
  branding: {
    logo: string;            // Pfad zum Logo (z.B. "/logo.png")
    logoLight: string;       // Logo für hellen Hintergrund
    logoDark: string;        // Logo für dunklen Hintergrund (Dark Mode)
    favicon: string;         // Favicon
    appleTouchIcon?: string;
    ogImage?: string;        // Open Graph Image für Social Sharing
  };
  
  // ==========================================================================
  // FARBEN
  // ==========================================================================
  colors: TenantColors;
  
  // ==========================================================================
  // TYPOGRAFIE
  // ==========================================================================
  typography: {
    fontFamily: string;
    fontFamilyMono: string;
    fontSizeBase: string;
  };
  
  // ==========================================================================
  // LOKALISIERUNG
  // ==========================================================================
  locale: {
    language: string;        // "de", "en", etc.
    timezone: string;        // "Europe/Berlin"
    dateFormat: string;      // "DD.MM.YYYY"
    timeFormat: string;      // "HH:mm"
    currency: string;        // "EUR"
    currencySymbol: string;  // "€"
  };
  
  // ==========================================================================
  // MODULE / FEATURES
  // ==========================================================================
  modules: {
    // Core-Module (immer verfügbar)
    dashboard: TenantModule;
    auftraege: TenantModule;
    mitarbeiter: TenantModule;
    
    // Optionale Core-Module
    lager: TenantModule;
    fuhrpark: TenantModule;
    rechnungen: TenantModule;
    protokolle: TenantModule;
    kontakte: TenantModule;
    dokumente: TenantModule;
    reports: TenantModule;
    lohn: TenantModule;
    wochenplan: TenantModule;
    saisons: TenantModule;
    schulungen: TenantModule;
    gruppen: TenantModule;
    angebote: TenantModule;
    
    // Branchenspezifische Module
    foerderung: TenantModule;      // Förderanträge (Forst)
    abnahme: TenantModule;         // Abnahmeprotokolle
    qualifikationen: TenantModule; // Qualifikationsnachweise
    saatguternte: TenantModule;    // Saatguternte-Tracking (Forst)
    flaechen: TenantModule;        // Flächenmanagement mit GeoJSON
  };
  
  // ==========================================================================
  // ROLLEN & BERECHTIGUNGEN
  // ==========================================================================
  roles: TenantRole[];
  defaultRole: string;       // ID der Standard-Rolle für neue User
  
  // ==========================================================================
  // BRANCHENSPEZIFISCHE KONFIGURATION
  // ==========================================================================
  branche: TenantBrancheConfig;
  
  // ==========================================================================
  // LABELS (für unterschiedliche Branchen anpassbar)
  // ==========================================================================
  labels: {
    // Entitäten
    auftrag: string;
    auftraege: string;
    protokoll: string;
    protokolle: string;
    mitarbeiter: string;
    mitarbeiterPlural: string;
    lager: string;
    fuhrpark: string;
    kunde: string;
    kunden: string;
    rechnung: string;
    rechnungen: string;
    dokument: string;
    dokumente: string;
    kontakt: string;
    kontakte: string;
    gruppe: string;
    gruppen: string;
    saison: string;
    saisons: string;
    
    // Actions
    neuerAuftrag: string;
    neuerMitarbeiter: string;
    neuesProtokoll: string;
    
    // Status
    statusOffen: string;
    statusInBearbeitung: string;
    statusAbgeschlossen: string;
  };
  
  // ==========================================================================
  // KONTAKT & IMPRESSUM
  // ==========================================================================
  contact: {
    email: string;
    phone: string;
    mobile?: string;
    fax?: string;
    address: string;
    plz: string;
    city: string;
    country: string;
    website?: string;
  };
  
  legal: {
    companyName: string;
    companyType: string;     // "GmbH", "UG", etc.
    registerId?: string;     // HRB-Nummer
    registerCourt?: string;  // "Amtsgericht Köln"
    taxId?: string;          // Steuernummer
    vatId?: string;          // USt-ID
    ceo?: string;            // Geschäftsführer
    privacyUrl: string;
    imprintUrl: string;
    termsUrl?: string;
  };
  
  banking: {
    bankName: string;
    iban: string;
    bic: string;
  };
  
  // ==========================================================================
  // INTEGRATIONEN
  // ==========================================================================
  integrations: {
    nextcloud: TenantIntegration & {
      config?: {
        baseUrl: string;
        basePath: string;
      };
    };
    wordpress: TenantIntegration & {
      config?: {
        baseUrl: string;
        apiPath: string;
      };
    };
    stripe: TenantIntegration;
    smtp: TenantIntegration & {
      config?: {
        host: string;
        port: number;
        secure: boolean;
        from: string;
        fromName: string;
      };
    };
    webhooks: TenantIntegration & {
      config?: {
        statusChange?: string;  // Webhook URL
        newAuftrag?: string;
        protokollSubmit?: string;
      };
    };
    slack: TenantIntegration & {
      config?: {
        webhookUrl: string;
        channel: string;
      };
    };
  };
  
  // ==========================================================================
  // FEATURE FLAGS
  // ==========================================================================
  features: {
    darkMode: boolean;
    multiLanguage: boolean;
    pushNotifications: boolean;
    twoFactorAuth: boolean;
    auditLog: boolean;
    offlineMode: boolean;
    gpsTracking: boolean;
    signaturCapture: boolean;
    photoUpload: boolean;
    pdfExport: boolean;
    excelExport: boolean;
    customerPortal: boolean;
    apiAccess: boolean;
    advancedReporting: boolean;
    bulkOperations: boolean;
    customFields: boolean;
    autoBackup: boolean;
  };
  
  // ==========================================================================
  // UI-EINSTELLUNGEN
  // ==========================================================================
  ui: {
    sidebarStyle: 'compact' | 'expanded' | 'collapsible';
    tableRowsPerPage: number;
    showWelcomeOnboarding: boolean;
    defaultDashboardWidgets: string[];
    dateRangePresets: string[];  // ["heute", "woche", "monat", "quartal", "jahr"]
  };
  
  // ==========================================================================
  // NUMMERNKREISE
  // ==========================================================================
  numberFormats: {
    auftrag: string;         // "AU-{YYYY}-{NNNN}"
    rechnung: string;        // "RE-{YYYY}-{NNNN}"
    angebot: string;         // "AN-{YYYY}-{NNNN}"
    protokoll: string;       // "TP-{YYYY}-{NNNN}"
  };
}

// =============================================================================
// STANDARD-KONFIGURATION (Demo/Template)
// =============================================================================

export const tenantConfig: TenantConfig = {
  id: "appfabrik-demo",
  name: "AppFabrik Demo",
  shortName: "Demo",
  tagline: "Field Service Management",
  
  branding: {
    logo: "/logo.png",
    logoLight: "/logo.png",
    logoDark: "/logo-dark.png",
    favicon: "/favicon.ico",
    appleTouchIcon: "/apple-touch-icon.png",
    ogImage: "/og-image.png",
  },
  
  colors: {
    // Brand
    primary: "#2C3A1C",
    primaryLight: "#4A6030",
    primaryDark: "#1A2410",
    secondary: "#C5A55A",
    secondaryLight: "#D4BC7F",
    secondaryDark: "#A68A3E",
    
    // Background
    background: "#F8F7F2",
    backgroundAlt: "#FFFFFF",
    surface: "#FFFFFF",
    
    // Text
    text: "#1A1A1A",
    textMuted: "#6B7280",
    textOnPrimary: "#FFFFFF",
    textOnSecondary: "#1A1A1A",
    
    // Semantic
    success: "#16A34A",
    successLight: "#DCFCE7",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    error: "#DC2626",
    errorLight: "#FEE2E2",
    info: "#3B82F6",
    infoLight: "#DBEAFE",
    
    // UI
    border: "#E5E7EB",
    divider: "#E5E7EB",
    sidebarBg: "#2C3A1C",
    sidebarText: "#FFFFFF",
    sidebarActive: "#C5A55A",
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    fontSizeBase: "16px",
  },
  
  locale: {
    language: "de",
    timezone: "Europe/Berlin",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "HH:mm",
    currency: "EUR",
    currencySymbol: "€",
  },
  
  modules: {
    dashboard: { enabled: true, icon: "LayoutDashboard" },
    auftraege: { enabled: true, icon: "ClipboardList" },
    mitarbeiter: { enabled: true, icon: "Users" },
    lager: { enabled: true, icon: "Warehouse" },
    fuhrpark: { enabled: true, icon: "Truck" },
    rechnungen: { enabled: true, icon: "Receipt" },
    protokolle: { enabled: true, icon: "FileText" },
    kontakte: { enabled: true, icon: "Contact" },
    dokumente: { enabled: true, icon: "FolderOpen" },
    reports: { enabled: true, icon: "BarChart3" },
    lohn: { enabled: true, icon: "Banknote" },
    wochenplan: { enabled: true, icon: "Calendar" },
    saisons: { enabled: true, icon: "CalendarRange" },
    schulungen: { enabled: false, icon: "GraduationCap" },
    gruppen: { enabled: true, icon: "UsersRound" },
    angebote: { enabled: true, icon: "FileSignature" },
    // Branchenspezifisch
    foerderung: { enabled: false, icon: "Sprout" },
    abnahme: { enabled: false, icon: "CheckSquare" },
    qualifikationen: { enabled: false, icon: "Award" },
    saatguternte: { enabled: false, icon: "TreeDeciduous" },
    flaechen: { enabled: false, icon: "Map" },
  },
  
  roles: [
    {
      id: "admin",
      name: "Administrator",
      description: "Voller Zugriff auf alle Funktionen",
      permissions: ["*"],
      canBeDeleted: false,
    },
    {
      id: "gruppenführer",
      name: "Gruppenführer",
      description: "Verwaltet Teams und Protokolle",
      permissions: [
        "auftraege:read", "auftraege:update",
        "protokolle:*",
        "mitarbeiter:read",
        "lager:read", "lager:create",
        "fuhrpark:read",
        "gruppen:read",
      ],
    },
    {
      id: "mitarbeiter",
      name: "Mitarbeiter",
      description: "Basis-Zugriff für Außendienst",
      permissions: [
        "auftraege:read",
        "protokolle:read", "protokolle:create",
        "stunden:create",
        "profil:*",
      ],
      isDefault: true,
    },
    {
      id: "viewer",
      name: "Betrachter",
      description: "Nur Lesezugriff",
      permissions: [
        "dashboard:read",
        "auftraege:read",
        "reports:read",
      ],
    },
    {
      id: "kunde",
      name: "Kunde",
      description: "Kundenportal-Zugang",
      permissions: [
        "kundenportal:*",
        "auftraege:read:own",
        "rechnungen:read:own",
        "dokumente:read:own",
      ],
    },
  ],
  defaultRole: "mitarbeiter",
  
  branche: {
    id: "generic",
    name: "Allgemein",
    auftragstypen: [
      "Service",
      "Wartung",
      "Installation",
      "Reparatur",
      "Beratung",
      "Sonstiges",
    ],
    leistungseinheiten: [
      "Stück",
      "Stunde",
      "Pauschal",
      "lfm",
      "m²",
      "m³",
    ],
    protokollFelder: ["arbeitsbeginn", "arbeitsende", "leistung", "bericht"],
    lagerKategorien: ["Material", "Werkzeug", "Ersatzteile", "Verbrauchsmaterial"],
  },
  
  labels: {
    auftrag: "Auftrag",
    auftraege: "Aufträge",
    protokoll: "Tagesprotokoll",
    protokolle: "Tagesprotokolle",
    mitarbeiter: "Mitarbeiter",
    mitarbeiterPlural: "Mitarbeiter",
    lager: "Lager",
    fuhrpark: "Fuhrpark",
    kunde: "Kunde",
    kunden: "Kunden",
    rechnung: "Rechnung",
    rechnungen: "Rechnungen",
    dokument: "Dokument",
    dokumente: "Dokumente",
    kontakt: "Kontakt",
    kontakte: "Kontakte",
    gruppe: "Team",
    gruppen: "Teams",
    saison: "Saison",
    saisons: "Saisons",
    neuerAuftrag: "Neuer Auftrag",
    neuerMitarbeiter: "Neuer Mitarbeiter",
    neuesProtokoll: "Neues Protokoll",
    statusOffen: "Offen",
    statusInBearbeitung: "In Bearbeitung",
    statusAbgeschlossen: "Abgeschlossen",
  },
  
  contact: {
    email: "info@example.com",
    phone: "",
    address: "",
    plz: "",
    city: "",
    country: "Deutschland",
  },
  
  legal: {
    companyName: "Muster GmbH",
    companyType: "GmbH",
    privacyUrl: "/datenschutz",
    imprintUrl: "/impressum",
  },
  
  banking: {
    bankName: "",
    iban: "",
    bic: "",
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
    auftrag: "AU-{YYYY}-{NNNN}",
    rechnung: "RE-{YYYY}-{NNNN}",
    angebot: "AN-{YYYY}-{NNNN}",
    protokoll: "TP-{YYYY}-{NNNN}",
  },
};

// =============================================================================
// REFERENZ-KONFIGURATION: KOCH AUFFORSTUNG GMBH
// =============================================================================

/**
 * Beispiel-Konfiguration für einen Forstbetrieb.
 * Diese kann als Vorlage für ähnliche Kunden verwendet werden.
 */
export const kochAufforstungConfig: TenantConfig = {
  id: "koch-aufforstung",
  name: "Koch Aufforstung GmbH",
  shortName: "Koch",
  tagline: "Professionelle Forstwirtschaft seit 1985",
  
  branding: {
    logo: "/logo-koch.png",
    logoLight: "/logo-koch.png",
    logoDark: "/logo-koch-dark.png",
    favicon: "/favicon-koch.ico",
    appleTouchIcon: "/apple-touch-icon-koch.png",
    ogImage: "/og-koch.png",
  },
  
  colors: {
    // Waldgrün Palette
    primary: "#2C5F2D",        // Waldgrün
    primaryLight: "#4A8C4B",
    primaryDark: "#1A3A1A",
    secondary: "#97BC62",      // Hellgrün/Laub
    secondaryLight: "#B5D389",
    secondaryDark: "#7A9F45",
    
    // Background
    background: "#F5F7F2",     // Leicht grünlicher Hintergrund
    backgroundAlt: "#FFFFFF",
    surface: "#FFFFFF",
    
    // Text
    text: "#1A2E1A",
    textMuted: "#4A5D4A",
    textOnPrimary: "#FFFFFF",
    textOnSecondary: "#1A2E1A",
    
    // Semantic
    success: "#2C5F2D",
    successLight: "#DCE8DC",
    warning: "#D4A843",
    warningLight: "#FDF6E3",
    error: "#8B2323",
    errorLight: "#F8E0E0",
    info: "#3B6E8F",
    infoLight: "#E3EFF5",
    
    // UI
    border: "#C8D4C8",
    divider: "#E5EBE5",
    sidebarBg: "#1A3A1A",
    sidebarText: "#FFFFFF",
    sidebarActive: "#97BC62",
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    fontSizeBase: "16px",
  },
  
  locale: {
    language: "de",
    timezone: "Europe/Berlin",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "HH:mm",
    currency: "EUR",
    currencySymbol: "€",
  },
  
  modules: {
    dashboard: { enabled: true, icon: "LayoutDashboard" },
    auftraege: { enabled: true, label: "Pflanzaufträge", icon: "TreeDeciduous" },
    mitarbeiter: { enabled: true, label: "Pflanzer", icon: "Users" },
    lager: { enabled: true, label: "Pflanzgut & Material", icon: "Warehouse" },
    fuhrpark: { enabled: true, icon: "Truck" },
    rechnungen: { enabled: true, icon: "Receipt" },
    protokolle: { enabled: true, label: "Pflanzprotokolle", icon: "FileText" },
    kontakte: { enabled: true, label: "Waldbesitzer & Partner", icon: "Contact" },
    dokumente: { enabled: true, icon: "FolderOpen" },
    reports: { enabled: true, icon: "BarChart3" },
    lohn: { enabled: true, icon: "Banknote" },
    wochenplan: { enabled: true, icon: "Calendar" },
    saisons: { enabled: true, label: "Pflanzsaisons", icon: "CalendarRange" },
    schulungen: { enabled: true, label: "Qualifikationen", icon: "GraduationCap" },
    gruppen: { enabled: true, label: "Pflanzkolonnen", icon: "UsersRound" },
    angebote: { enabled: true, icon: "FileSignature" },
    // Branchenspezifisch (aktiviert für Forst)
    foerderung: { enabled: true, label: "Förderberatung", icon: "Sprout", description: "GAK & Landesförderprogramme" },
    abnahme: { enabled: true, label: "Abnahmeprotokolle", icon: "CheckSquare" },
    qualifikationen: { enabled: true, icon: "Award" },
    saatguternte: { enabled: true, icon: "TreeDeciduous" },
    flaechen: { enabled: true, label: "Waldflächen", icon: "Map" },
  },
  
  roles: [
    {
      id: "admin",
      name: "Administrator",
      description: "Voller Zugriff auf alle Funktionen",
      permissions: ["*"],
      canBeDeleted: false,
    },
    {
      id: "verwaltung",
      name: "Verwaltung/Büro",
      description: "Zugriff auf Verwaltungsfunktionen",
      permissions: [
        "auftraege:*",
        "mitarbeiter:*",
        "rechnungen:*",
        "lager:*",
        "dokumente:*",
        "reports:*",
        "kontakte:*",
        "angebote:*",
        "lohn:*",
        "foerderung:*",
      ],
    },
    {
      id: "gruppenführer",
      name: "Gruppenführer",
      description: "Leitet eine Pflanzkolonne",
      permissions: [
        "auftraege:read", "auftraege:update",
        "protokolle:*",
        "mitarbeiter:read",
        "lager:read", "lager:create",
        "fuhrpark:read", "fuhrpark:update",
        "gruppen:read",
        "abnahme:create",
        "stunden:*",
      ],
    },
    {
      id: "mitarbeiter",
      name: "Pflanzer",
      description: "Außendienstmitarbeiter",
      permissions: [
        "auftraege:read",
        "protokolle:read",
        "stunden:create",
        "profil:*",
      ],
      isDefault: true,
    },
    {
      id: "waldbesitzer",
      name: "Waldbesitzer",
      description: "Kundenportal für Auftraggeber",
      permissions: [
        "kundenportal:*",
        "auftraege:read:own",
        "protokolle:read:own",
        "rechnungen:read:own",
        "dokumente:read:own",
        "foerderung:read",
      ],
    },
  ],
  defaultRole: "mitarbeiter",
  
  branche: {
    id: "forst",
    name: "Forstwirtschaft",
    auftragstypen: [
      "Aufforstung",
      "Flächenvorbereitung",
      "Kulturschutz",
      "Kulturpflege",
      "Saatguternte",
      "Zaunbau",
      "Pflanzenbeschaffung",
      "Jungbestandspflege",
      "Beratung",
    ],
    leistungseinheiten: [
      "ha",           // Hektar (Pflanzfläche)
      "Stück",        // Pflanzen
      "lfm",          // Laufende Meter (Zaun)
      "Stunde",       // Arbeitszeit
      "Pauschal",
      "kg",           // Saatgut
    ],
    protokollFelder: [
      "arbeitsbeginn",
      "arbeitsende",
      "pflanzflaeche",
      "pflanzenAnzahl",
      "baumart",
      "pflanzverfahren",
      "witterung",
      "temperatur",
      "bodenverhaeltnisse",
      "besonderheiten",
    ],
    lagerKategorien: [
      "Pflanzen (Nadelholz)",
      "Pflanzen (Laubholz)",
      "Saatgut",
      "Zaunmaterial",
      "Wuchshüllen",
      "Dünger",
      "Pflanzenschutz",
      "Werkzeug",
      "Ersatzteile",
    ],
  },
  
  labels: {
    auftrag: "Pflanzauftrag",
    auftraege: "Pflanzaufträge",
    protokoll: "Pflanzprotokoll",
    protokolle: "Pflanzprotokolle",
    mitarbeiter: "Pflanzer",
    mitarbeiterPlural: "Pflanzer",
    lager: "Pflanzgutlager",
    fuhrpark: "Fuhrpark & Geräte",
    kunde: "Waldbesitzer",
    kunden: "Waldbesitzer",
    rechnung: "Rechnung",
    rechnungen: "Rechnungen",
    dokument: "Dokument",
    dokumente: "Dokumente",
    kontakt: "Kontakt",
    kontakte: "Kontakte",
    gruppe: "Pflanzkolonne",
    gruppen: "Pflanzkolonnen",
    saison: "Pflanzsaison",
    saisons: "Pflanzsaisons",
    neuerAuftrag: "Neuer Pflanzauftrag",
    neuerMitarbeiter: "Neuer Pflanzer",
    neuesProtokoll: "Neues Pflanzprotokoll",
    statusOffen: "Anfrage",
    statusInBearbeitung: "In Pflanzung",
    statusAbgeschlossen: "Gepflanzt",
  },
  
  contact: {
    email: "info@koch-aufforstung.de",
    phone: "+49 2234 12345",
    mobile: "+49 170 1234567",
    address: "Waldstraße 42",
    plz: "50859",
    city: "Köln",
    country: "Deutschland",
    website: "https://koch-aufforstung.de",
  },
  
  legal: {
    companyName: "Koch Aufforstung GmbH",
    companyType: "GmbH",
    registerId: "HRB 12345",
    registerCourt: "Amtsgericht Köln",
    taxId: "215/5781/1234",
    vatId: "DE123456789",
    ceo: "Thomas Koch",
    privacyUrl: "/datenschutz",
    imprintUrl: "/impressum",
    termsUrl: "/agb",
  },
  
  banking: {
    bankName: "Sparkasse Köln",
    iban: "DE89 3704 0044 0123 4567 89",
    bic: "COBADEFFXXX",
  },
  
  integrations: {
    nextcloud: {
      enabled: true,
      config: {
        baseUrl: "http://187.124.18.244:32774",
        basePath: "/Koch-Aufforstung/",
      },
    },
    wordpress: {
      enabled: true,
      config: {
        baseUrl: "https://koch-aufforstung.de",
        apiPath: "/wp-json/ka/v1",
      },
    },
    stripe: { enabled: false },
    smtp: {
      enabled: true,
      config: {
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        from: "noreply@koch-aufforstung.de",
        fromName: "Koch Aufforstung",
      },
    },
    webhooks: {
      enabled: true,
      config: {
        statusChange: "https://mission-control-tawny-omega.vercel.app/api/webhooks/auftrag-status",
        newAuftrag: "https://mission-control-tawny-omega.vercel.app/api/webhooks/new-auftrag",
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
    auftrag: "KA-{YYYY}-{NNNN}",
    rechnung: "RE-{YYYY}-{NNNN}",
    angebot: "AN-{YYYY}-{NNNN}",
    protokoll: "PP-{YYYY}-{NNNN}",
  },
};

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
    '--color-border': config.colors.border,
    '--color-success': config.colors.success,
    '--color-warning': config.colors.warning,
    '--color-error': config.colors.error,
    '--color-info': config.colors.info,
    '--font-family': config.typography.fontFamily,
    '--font-family-mono': config.typography.fontFamilyMono,
  };
}

/**
 * Prüft ob ein User eine bestimmte Permission hat
 */
export function hasPermission(
  userRole: string,
  permission: string,
  config: TenantConfig = tenantConfig
): boolean {
  const role = config.roles.find(r => r.id === userRole);
  if (!role) return false;
  
  // Admin hat immer Zugriff
  if (role.permissions.includes('*')) return true;
  
  // Exakte Übereinstimmung
  if (role.permissions.includes(permission)) return true;
  
  // Wildcard-Check (z.B. "auftraege:*" matched "auftraege:read")
  const [resource] = permission.split(':');
  if (role.permissions.includes(`${resource}:*`)) return true;
  
  return false;
}

/**
 * Gibt alle aktivierten Module zurück
 */
export function getEnabledModules(config: TenantConfig = tenantConfig): string[] {
  return Object.entries(config.modules)
    .filter(([, module]) => module.enabled)
    .map(([key]) => key);
}

/**
 * Formatiert eine Nummer nach dem konfigurierten Format
 */
export function formatNumber(
  type: keyof TenantConfig['numberFormats'],
  sequence: number,
  config: TenantConfig = tenantConfig
): string {
  const format = config.numberFormats[type];
  const year = new Date().getFullYear();
  const paddedSeq = sequence.toString().padStart(4, '0');
  
  return format
    .replace('{YYYY}', year.toString())
    .replace('{NNNN}', paddedSeq);
}

// =============================================================================
// EXPORT
// =============================================================================

export type { TenantConfig };
export default tenantConfig;
