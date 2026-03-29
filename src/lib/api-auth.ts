/**
 * API Route Authentication Helpers
 * 
 * Hilfsfunktionen für Permission-geschützte API Routes.
 * 
 * Verwendung:
 * ```ts
 * // In einer API Route
 * import { withAuth, requireAuth } from "@/lib/api-auth"
 * 
 * // Option 1: Higher-Order Function
 * export const GET = withAuth("auftraege:read", async (req, session) => {
 *   // session ist garantiert vorhanden
 *   return Response.json({ data: [] })
 * })
 * 
 * // Option 2: Direkte Prüfung
 * export async function GET(req: Request) {
 *   const session = await requireAuth()
 *   // Wirft Error wenn nicht authentifiziert
 * }
 * ```
 */

import { NextRequest } from "next/server"
import { Session } from "next-auth"
import { auth, checkPermission } from "@/lib/auth"
import { hasPermission, hasAnyPermission } from "@/lib/permissions"

// ============================================================
// TYPES
// ============================================================

type AuthenticatedHandler = (
  req: NextRequest,
  session: Session
) => Promise<Response>

// ============================================================
// ERROR RESPONSES
// ============================================================

export function unauthorizedResponse(message = "Nicht authentifiziert") {
  return Response.json(
    { error: message, code: "UNAUTHORIZED" },
    { status: 401 }
  )
}

export function forbiddenResponse(message = "Nicht berechtigt") {
  return Response.json(
    { error: message, code: "FORBIDDEN" },
    { status: 403 }
  )
}

// ============================================================
// AUTH GUARDS
// ============================================================

/**
 * Prüft ob User authentifiziert ist und gibt Session zurück
 * Wirft Error wenn nicht authentifiziert
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Nicht authentifiziert")
  }
  return session
}

/**
 * Prüft ob User authentifiziert ist und eine Permission hat
 * Wirft Error wenn nicht berechtigt
 */
export async function requirePermission(permission: string): Promise<Session> {
  const session = await requireAuth()
  const allowed = await checkPermission(permission)
  if (!allowed) {
    throw new Error(`Berechtigung fehlt: ${permission}`)
  }
  return session
}

/**
 * Prüft ob User zum angegebenen Tenant gehört
 */
export async function requireTenant(tenantId: string): Promise<Session> {
  const session = await requireAuth()
  if (session.user.tenantId !== tenantId) {
    throw new Error("Zugriff auf diesen Tenant nicht erlaubt")
  }
  return session
}

// ============================================================
// HIGHER-ORDER FUNCTIONS
// ============================================================

/**
 * Wrapper für authentifizierte API Routes
 * 
 * Prüft Authentifizierung und optional Permissions vor dem Handler.
 */
export function withAuth(
  permissionOrHandler: string | AuthenticatedHandler,
  handler?: AuthenticatedHandler
): (req: NextRequest) => Promise<Response> {
  // Überladung: nur Handler ohne Permission
  if (typeof permissionOrHandler === "function") {
    return async (req: NextRequest) => {
      try {
        const session = await auth()
        if (!session?.user) {
          return unauthorizedResponse()
        }
        return await permissionOrHandler(req, session)
      } catch (error) {
        console.error("API Auth Error:", error)
        return Response.json(
          { error: "Interner Fehler", code: "INTERNAL_ERROR" },
          { status: 500 }
        )
      }
    }
  }
  
  // Mit Permission
  const permission = permissionOrHandler
  if (!handler) {
    throw new Error("Handler required when permission is specified")
  }
  
  return async (req: NextRequest) => {
    try {
      const session = await auth()
      if (!session?.user) {
        return unauthorizedResponse()
      }
      
      if (!hasPermission(session, permission)) {
        return forbiddenResponse(`Berechtigung fehlt: ${permission}`)
      }
      
      return await handler(req, session)
    } catch (error) {
      console.error("API Auth Error:", error)
      return Response.json(
        { error: "Interner Fehler", code: "INTERNAL_ERROR" },
        { status: 500 }
      )
    }
  }
}

/**
 * Wrapper der eine von mehreren Permissions akzeptiert
 */
export function withAnyPermission(
  permissions: string[],
  handler: AuthenticatedHandler
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    try {
      const session = await auth()
      if (!session?.user) {
        return unauthorizedResponse()
      }
      
      if (!hasAnyPermission(session, permissions)) {
        return forbiddenResponse(
          `Eine der folgenden Berechtigungen fehlt: ${permissions.join(", ")}`
        )
      }
      
      return await handler(req, session)
    } catch (error) {
      console.error("API Auth Error:", error)
      return Response.json(
        { error: "Interner Fehler", code: "INTERNAL_ERROR" },
        { status: 500 }
      )
    }
  }
}

// ============================================================
// TENANT HELPERS
// ============================================================

/**
 * Extrahiert tenantId aus Session für Prisma-Queries
 */
export async function getTenantId(): Promise<string> {
  const session = await requireAuth()
  return session.user.tenantId
}

/**
 * Erstellt ein Prisma-Where-Objekt das tenantId enthält
 */
export async function withTenant<T extends object>(
  where: T
): Promise<T & { tenantId: string }> {
  const tenantId = await getTenantId()
  return { ...where, tenantId }
}
