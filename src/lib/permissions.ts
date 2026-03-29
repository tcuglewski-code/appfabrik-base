/**
 * AppFabrik Permissions System
 * 
 * Generisches RBAC (Role-Based Access Control) das mit der
 * Tenant-Konfiguration (tenant.ts) zusammenarbeitet.
 * 
 * Konzept:
 * - Permissions sind Strings im Format "resource:action" oder "resource:action:scope"
 * - Rollen haben eine Liste von Permissions (inkl. Wildcards)
 * - "*" = alle Permissions
 * - "auftraege:*" = alle Auftrags-Permissions
 * - "auftraege:read:own" = nur eigene Aufträge lesen
 */

import { Session } from "next-auth"
import { tenantConfig, TenantRole } from "@/config/tenant"

// ============================================================
// PERMISSION DEFINITIONS
// ============================================================

/**
 * Alle verfügbaren Permissions mit Beschreibung
 * 
 * Format: "resource:action"
 * Resources: auftraege, mitarbeiter, lohn, rechnungen, angebote, lager, protokolle, abnahme, fuhrpark, admin, etc.
 * Actions: read, create, update, delete, export, approve
 */
export const ALL_PERMISSIONS = {
  // Aufträge / Projekte
  "auftraege:read": "Aufträge ansehen",
  "auftraege:create": "Aufträge erstellen",
  "auftraege:update": "Aufträge bearbeiten",
  "auftraege:delete": "Aufträge löschen",
  "auftraege:export": "Aufträge exportieren",
  
  // Mitarbeiter / Team
  "mitarbeiter:read": "Mitarbeiter ansehen",
  "mitarbeiter:create": "Mitarbeiter anlegen",
  "mitarbeiter:update": "Mitarbeiter bearbeiten",
  "mitarbeiter:delete": "Mitarbeiter löschen",
  
  // Lohn & Finanzen
  "lohn:read": "Lohndaten ansehen",
  "lohn:update": "Lohndaten bearbeiten",
  "lohn:export": "Lohndaten exportieren (DATEV)",
  
  // Rechnungen
  "rechnungen:read": "Rechnungen ansehen",
  "rechnungen:create": "Rechnungen erstellen",
  "rechnungen:update": "Rechnungen bearbeiten",
  "rechnungen:delete": "Rechnungen löschen",
  "rechnungen:export": "Rechnungen exportieren",
  
  // Angebote
  "angebote:read": "Angebote ansehen",
  "angebote:create": "Angebote erstellen",
  "angebote:update": "Angebote bearbeiten",
  "angebote:delete": "Angebote löschen",
  
  // Lager / Inventar
  "lager:read": "Lager ansehen",
  "lager:create": "Lagerbestand hinzufügen",
  "lager:update": "Lagerbestand bearbeiten",
  "lager:delete": "Lagerbestand löschen",
  
  // Protokolle / Tagesberichte
  "protokolle:read": "Protokolle ansehen",
  "protokolle:create": "Protokolle erstellen",
  "protokolle:update": "Protokolle bearbeiten",
  "protokolle:approve": "Protokolle freigeben",
  
  // Abnahmen
  "abnahme:read": "Abnahmen ansehen",
  "abnahme:create": "Abnahmen erstellen",
  "abnahme:approve": "Abnahmen freigeben",
  
  // Fuhrpark / Equipment
  "fuhrpark:read": "Fuhrpark ansehen",
  "fuhrpark:update": "Fuhrpark bearbeiten",
  
  // Dokumente
  "dokumente:read": "Dokumente ansehen",
  "dokumente:create": "Dokumente hochladen",
  "dokumente:delete": "Dokumente löschen",
  
  // Kontakte
  "kontakte:read": "Kontakte ansehen",
  "kontakte:create": "Kontakte anlegen",
  "kontakte:update": "Kontakte bearbeiten",
  "kontakte:delete": "Kontakte löschen",
  
  // Reports
  "reports:read": "Reports ansehen",
  "reports:export": "Reports exportieren",
  
  // Gruppen / Teams
  "gruppen:read": "Teams ansehen",
  "gruppen:create": "Teams erstellen",
  "gruppen:update": "Teams bearbeiten",
  
  // Stunden / Zeiterfassung
  "stunden:read": "Stundenerfassung ansehen",
  "stunden:create": "Stunden erfassen",
  "stunden:approve": "Stunden freigeben",
  
  // Profil
  "profil:read": "Eigenes Profil ansehen",
  "profil:update": "Eigenes Profil bearbeiten",
  
  // Kundenportal
  "kundenportal:read": "Kundenportal Zugriff",
  
  // Förderung (branchenspezifisch)
  "foerderung:read": "Förderberatung ansehen",
  "foerderung:create": "Förderanträge erstellen",
  
  // Administration
  "admin:users": "Benutzerverwaltung",
  "admin:settings": "Systemeinstellungen",
  "admin:roles": "Rollenverwaltung",
  "admin:tenant": "Tenant-Konfiguration",
  "admin:logs": "Audit-Logs ansehen",
} as const

export type Permission = keyof typeof ALL_PERMISSIONS

// ============================================================
// PERMISSION GROUPS (für UI)
// ============================================================

export const PERMISSION_GROUPS = {
  auftraege: {
    label: "Aufträge",
    icon: "ClipboardList",
    permissions: [
      "auftraege:read",
      "auftraege:create",
      "auftraege:update",
      "auftraege:delete",
      "auftraege:export",
    ],
  },
  mitarbeiter: {
    label: "Mitarbeiter",
    icon: "Users",
    permissions: [
      "mitarbeiter:read",
      "mitarbeiter:create",
      "mitarbeiter:update",
      "mitarbeiter:delete",
    ],
  },
  lohn: {
    label: "Lohn & Finanzen",
    icon: "Banknote",
    permissions: ["lohn:read", "lohn:update", "lohn:export"],
  },
  rechnungen: {
    label: "Rechnungen",
    icon: "Receipt",
    permissions: [
      "rechnungen:read",
      "rechnungen:create",
      "rechnungen:update",
      "rechnungen:delete",
      "rechnungen:export",
    ],
  },
  angebote: {
    label: "Angebote",
    icon: "FileSignature",
    permissions: [
      "angebote:read",
      "angebote:create",
      "angebote:update",
      "angebote:delete",
    ],
  },
  lager: {
    label: "Lager",
    icon: "Warehouse",
    permissions: ["lager:read", "lager:create", "lager:update", "lager:delete"],
  },
  protokolle: {
    label: "Protokolle",
    icon: "FileText",
    permissions: [
      "protokolle:read",
      "protokolle:create",
      "protokolle:update",
      "protokolle:approve",
    ],
  },
  abnahme: {
    label: "Abnahmen",
    icon: "CheckSquare",
    permissions: ["abnahme:read", "abnahme:create", "abnahme:approve"],
  },
  fuhrpark: {
    label: "Fuhrpark",
    icon: "Truck",
    permissions: ["fuhrpark:read", "fuhrpark:update"],
  },
  dokumente: {
    label: "Dokumente",
    icon: "FolderOpen",
    permissions: ["dokumente:read", "dokumente:create", "dokumente:delete"],
  },
  kontakte: {
    label: "Kontakte",
    icon: "Contact",
    permissions: [
      "kontakte:read",
      "kontakte:create",
      "kontakte:update",
      "kontakte:delete",
    ],
  },
  admin: {
    label: "Administration",
    icon: "Shield",
    permissions: [
      "admin:users",
      "admin:settings",
      "admin:roles",
      "admin:tenant",
      "admin:logs",
    ],
  },
} as const

// ============================================================
// PERMISSION CHECKS
// ============================================================

/**
 * Prüft ob eine Permission in einer Liste enthalten ist (inkl. Wildcards)
 */
function matchesPermission(
  userPermissions: string[],
  required: string
): boolean {
  // Exakte Übereinstimmung
  if (userPermissions.includes(required)) return true
  
  // Global-Wildcard
  if (userPermissions.includes("*")) return true
  
  // Resource-Wildcard (z.B. "auftraege:*" matched "auftraege:read")
  const [resource] = required.split(":")
  if (userPermissions.includes(`${resource}:*`)) return true
  
  return false
}

/**
 * Ermittelt die Permissions für eine Rolle aus der Tenant-Konfiguration
 */
export function getRolePermissions(roleId: string): string[] {
  const role = tenantConfig.roles.find((r) => r.id === roleId)
  return role?.permissions ?? []
}

/**
 * Prüft ob ein User (via Session) eine bestimmte Permission hat
 */
export function hasPermission(
  session: Session | null,
  permission: string
): boolean {
  if (!session?.user) return false
  
  const { role, permissions: userPermissions } = session.user
  
  // Admin hat immer alle Rechte
  if (role === "admin") return true
  
  // Direkte User-Permissions prüfen
  if (matchesPermission(userPermissions, permission)) return true
  
  // Rollen-Permissions aus Tenant-Config
  const rolePermissions = getRolePermissions(role)
  return matchesPermission(rolePermissions, permission)
}

/**
 * Prüft ob User eine von mehreren Permissions hat
 */
export function hasAnyPermission(
  session: Session | null,
  permissions: string[]
): boolean {
  return permissions.some((p) => hasPermission(session, p))
}

/**
 * Prüft ob User alle Permissions hat
 */
export function hasAllPermissions(
  session: Session | null,
  permissions: string[]
): boolean {
  return permissions.every((p) => hasPermission(session, p))
}

// ============================================================
// ROLE HELPERS
// ============================================================

export type UserRole = string

// ============================================================
// LEGACY ROLE TEMPLATES (für Rückwärtskompatibilität)
// ============================================================

/**
 * @deprecated Nutze stattdessen tenantConfig.roles
 */
export const ROLE_TEMPLATES: Record<string, string[]> = {
  admin: ["*"],
  manager: [
    "auftraege:*",
    "mitarbeiter:*",
    "rechnungen:*",
    "lager:*",
    "dokumente:*",
    "reports:*",
    "kontakte:*",
    "angebote:*",
    "lohn:*",
  ],
  worker: [
    "auftraege:read",
    "protokolle:read",
    "protokolle:create",
    "stunden:create",
    "profil:*",
  ],
  viewer: ["auftraege:read", "reports:read"],
}

/**
 * Prüft ob User eine bestimmte Rolle hat
 */
export function hasRole(session: Session | null, ...roles: string[]): boolean {
  if (!session?.user) return false
  return roles.includes(session.user.role)
}

/**
 * Prüft ob User Admin ist
 */
export function isAdmin(session: Session | null): boolean {
  return hasRole(session, "admin")
}

/**
 * Prüft ob User Admin oder Manager ist
 */
export function isAdminOrManager(session: Session | null): boolean {
  return hasRole(session, "admin", "manager", "verwaltung", "gruppenführer", "ka_admin", "ka_gruppenführer")
}

/**
 * @deprecated Nutze stattdessen isAdminOrManager
 */
export function isAdminOrGF(session: Session | null): boolean {
  return isAdminOrManager(session)
}

/**
 * Gibt alle verfügbaren Rollen zurück (aus Tenant-Config)
 */
export function getAvailableRoles(): TenantRole[] {
  return tenantConfig.roles
}

/**
 * Gibt die Rolle eines Users zurück
 */
export function getUserRole(session: Session | null): TenantRole | null {
  if (!session?.user) return null
  return tenantConfig.roles.find((r) => r.id === session.user.role) ?? null
}

// ============================================================
// UI HELPERS
// ============================================================

/**
 * Gibt Permissions zurück, die der User bearbeiten darf
 * (Admin kann alle bearbeiten, andere nur ihre eigenen)
 */
export function getEditablePermissions(session: Session | null): Permission[] {
  if (!session?.user) return []
  
  if (isAdmin(session)) {
    return Object.keys(ALL_PERMISSIONS) as Permission[]
  }
  
  // Nicht-Admins können keine Permissions bearbeiten
  return []
}

/**
 * Filtert Rollen auf die, die der User zuweisen darf
 */
export function getAssignableRoles(session: Session | null): TenantRole[] {
  if (!session?.user) return []
  
  const roles = getAvailableRoles()
  
  // Admin kann alle Rollen zuweisen
  if (isAdmin(session)) return roles
  
  // Manager können keine Admin-Rolle zuweisen
  if (isAdminOrManager(session)) {
    return roles.filter((r) => r.id !== "admin")
  }
  
  return []
}
