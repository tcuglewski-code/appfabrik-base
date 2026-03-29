/**
 * NextAuth.js Main Configuration
 * 
 * Multi-Tenant Auth System für AppFabrik
 * 
 * Features:
 * - Credentials-basierte Authentifizierung (Email + Passwort)
 * - Multi-Tenant Support (User gehört zu genau einem Tenant)
 * - Role-based Access Control (RBAC)
 * - Feingranulare Permissions
 * - 2FA Support (vorbereitet)
 * 
 * Login-Flow:
 * 1. User gibt Email + Passwort ein
 * 2. System ermittelt Tenant anhand der Domain oder Subdomain
 * 3. User wird in diesem Tenant gesucht
 * 4. Bei Erfolg: JWT mit tenantId, role, permissions
 */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { tenantConfig, hasPermission as checkTenantPermission } from "@/config/tenant"

// ============================================================
// NEXTAUTH EXPORT
// ============================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Email & Passwort",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Passwort", type: "password" },
        tenantId: { label: "Tenant", type: "text" }, // Optional, kann aus Domain ermittelt werden
      },
      
      /**
       * Authorize - validiert Credentials und gibt User zurück
       */
      async authorize(credentials) {
        const { email, password, tenantId } = credentials as {
          email?: string
          password?: string
          tenantId?: string
        }
        
        if (!email || !password) {
          return null
        }
        
        try {
          // Tenant ermitteln (aus credentials oder Default)
          const activeTenantId = tenantId || tenantConfig.id
          
          // User in diesem Tenant suchen
          const user = await prisma.user.findUnique({
            where: {
              tenantId_email: {
                tenantId: activeTenantId,
                email: email,
              },
            },
          })
          
          // User nicht gefunden oder inaktiv
          if (!user || !user.active) {
            return null
          }
          
          // Passwort prüfen
          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) {
            return null
          }
          
          // Last Login aktualisieren (async, non-blocking)
          prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          }).catch(() => {}) // Fehler ignorieren
          
          // Activity Log (async, non-blocking)
          prisma.activityLog.create({
            data: {
              tenantId: user.tenantId,
              userId: user.id,
              action: "login",
              entityType: "User",
              entityId: user.id,
              entityName: user.name,
            },
          }).catch(() => {}) // Fehler ignorieren
          
          // User-Objekt für Session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            tenantId: user.tenantId,
            role: user.role,
            permissions: user.permissions,
            twoFactorEnabled: user.twoFactorEnabled,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  
  // Event-Hooks für Logging
  events: {
    async signIn({ user }) {
      // Zusätzliches Logging bei Bedarf
    },
    async signOut() {
      // Cleanup bei Bedarf
    },
  },
})

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Server-seitige Session abrufen
 * 
 * Nutzung in Server Components und API Routes:
 * ```ts
 * const session = await getServerSession()
 * if (!session) redirect("/login")
 * ```
 */
export async function getServerSession() {
  return await auth()
}

/**
 * Prüft ob der aktuelle User eine Permission hat
 * 
 * Kombiniert User-Permissions mit Tenant-Konfiguration
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const session = await auth()
  if (!session?.user) return false
  
  const { role, permissions } = session.user
  
  // Admin hat immer alle Rechte
  if (role === "admin") return true
  
  // Direkte User-Permissions
  if (permissions.includes(permission)) return true
  
  // Wildcard-Check (z.B. "auftraege:*" matched "auftraege:read")
  const [resource] = permission.split(":")
  if (permissions.includes(`${resource}:*`)) return true
  if (permissions.includes("*")) return true
  
  // Prüfe Tenant-Rollen-Konfiguration
  return checkTenantPermission(role, permission)
}

/**
 * Guard für API-Routes - wirft Error wenn nicht berechtigt
 */
export async function requirePermission(permission: string) {
  const hasAccess = await checkPermission(permission)
  if (!hasAccess) {
    throw new Error("Nicht berechtigt")
  }
}

/**
 * Guard für API-Routes - gibt Response zurück wenn nicht berechtigt
 */
export async function withPermission(
  permission: string,
  handler: () => Promise<Response>
): Promise<Response> {
  const hasAccess = await checkPermission(permission)
  if (!hasAccess) {
    return new Response(
      JSON.stringify({ error: "Nicht berechtigt" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    )
  }
  return handler()
}
