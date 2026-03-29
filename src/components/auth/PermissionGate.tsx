/**
 * Permission Gate Components
 * 
 * Zeigt Content nur an wenn der User die entsprechende Permission hat.
 * 
 * Verwendung:
 * ```tsx
 * <PermissionGate permission="auftraege:create">
 *   <CreateAuftragButton />
 * </PermissionGate>
 * 
 * <RequirePermission permission="admin:users" fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </RequirePermission>
 * 
 * <AdminOnly>
 *   <DangerZone />
 * </AdminOnly>
 * ```
 */

"use client"

import { ReactNode } from "react"
import { usePermissions } from "@/hooks/usePermissions"

// ============================================================
// TYPES
// ============================================================

interface PermissionGateProps {
  /** Benötigte Permission */
  permission: string
  /** Content der angezeigt wird wenn Permission vorhanden */
  children: ReactNode
  /** Optional: Content wenn Permission fehlt */
  fallback?: ReactNode
  /** Optional: Loading-State anzeigen? */
  showLoader?: boolean
}

interface MultiPermissionGateProps {
  /** Benötigte Permissions */
  permissions: string[]
  /** Modus: alle oder mindestens eine Permission benötigt */
  mode?: "all" | "any"
  children: ReactNode
  fallback?: ReactNode
  showLoader?: boolean
}

interface RoleGateProps {
  /** Erlaubte Rollen */
  roles: string[]
  children: ReactNode
  fallback?: ReactNode
  showLoader?: boolean
}

interface ModuleGateProps {
  /** Modul das aktiviert sein muss */
  module: string
  children: ReactNode
  fallback?: ReactNode
}

// ============================================================
// COMPONENTS
// ============================================================

/**
 * Zeigt Content nur wenn User eine bestimmte Permission hat
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
  showLoader = false,
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermissions()
  
  if (isLoading && showLoader) {
    return <LoadingPlaceholder />
  }
  
  if (hasPermission(permission)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Zeigt Content nur wenn User mehrere Permissions hat
 */
export function MultiPermissionGate({
  permissions,
  mode = "all",
  children,
  fallback = null,
  showLoader = false,
}: MultiPermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } =
    usePermissions()
  
  if (isLoading && showLoader) {
    return <LoadingPlaceholder />
  }
  
  const hasAccess =
    mode === "all"
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  
  if (hasAccess) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Zeigt Content nur wenn User eine bestimmte Rolle hat
 */
export function RoleGate({
  roles,
  children,
  fallback = null,
  showLoader = false,
}: RoleGateProps) {
  const { hasRole, isLoading } = usePermissions()
  
  if (isLoading && showLoader) {
    return <LoadingPlaceholder />
  }
  
  if (hasRole(...roles)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Zeigt Content nur für Admins
 */
export function AdminOnly({
  children,
  fallback = null,
  showLoader = false,
}: Omit<PermissionGateProps, "permission">) {
  const { isAdmin, isLoading } = usePermissions()
  
  if (isLoading && showLoader) {
    return <LoadingPlaceholder />
  }
  
  if (isAdmin) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Zeigt Content nur für Manager und Admins
 */
export function ManagerOnly({
  children,
  fallback = null,
  showLoader = false,
}: Omit<PermissionGateProps, "permission">) {
  const { isManager, isLoading } = usePermissions()
  
  if (isLoading && showLoader) {
    return <LoadingPlaceholder />
  }
  
  if (isManager) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Zeigt Content nur wenn ein Modul aktiviert ist
 */
export function ModuleGate({
  module,
  children,
  fallback = null,
}: ModuleGateProps) {
  const { isModuleEnabled } = usePermissions()
  
  if (isModuleEnabled(module)) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

/**
 * Wrapper für Permission mit Fehlermeldung
 */
export function RequirePermission({
  permission,
  children,
  fallback,
}: PermissionGateProps) {
  const { hasPermission, isLoading } = usePermissions()
  
  if (isLoading) {
    return <LoadingPlaceholder />
  }
  
  if (!hasPermission(permission)) {
    return (
      fallback ?? (
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Zugriff verweigert</h2>
          <p className="text-muted-foreground">
            Sie haben keine Berechtigung für diesen Bereich.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Benötigt: <code className="bg-muted px-1 rounded">{permission}</code>
          </p>
        </div>
      )
    )
  }
  
  return <>{children}</>
}

// ============================================================
// HELPERS
// ============================================================

function LoadingPlaceholder() {
  return (
    <div className="animate-pulse bg-muted rounded h-8 w-24" />
  )
}

// ============================================================
// EXPORTS
// ============================================================

export {
  PermissionGate as default,
}
