/**
 * Client-Side Permission Hooks
 * 
 * React Hooks für Permission-Checks auf der Client-Seite.
 * 
 * Verwendung:
 * ```tsx
 * const { hasPermission, isAdmin, role } = usePermissions()
 * 
 * if (hasPermission("auftraege:create")) {
 *   return <CreateButton />
 * }
 * ```
 */

"use client"

import { useSession } from "next-auth/react"
import { useMemo } from "react"
import { tenantConfig } from "@/config/tenant"

// ============================================================
// TYPES
// ============================================================

interface UsePermissionsReturn {
  // Session-Status
  isLoading: boolean
  isAuthenticated: boolean
  
  // User-Infos
  userId: string | null
  userName: string | null
  userEmail: string | null
  tenantId: string | null
  role: string | null
  
  // Permission Checks
  permissions: string[]
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  
  // Role Checks
  hasRole: (...roles: string[]) => boolean
  isAdmin: boolean
  isManager: boolean
  
  // Tenant Config
  enabledModules: string[]
  isModuleEnabled: (module: string) => boolean
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function matchesPermission(
  userPermissions: string[],
  rolePermissions: string[],
  required: string
): boolean {
  const allPerms = [...userPermissions, ...rolePermissions]
  
  // Exakte Übereinstimmung
  if (allPerms.includes(required)) return true
  
  // Global-Wildcard
  if (allPerms.includes("*")) return true
  
  // Resource-Wildcard
  const [resource] = required.split(":")
  if (allPerms.includes(`${resource}:*`)) return true
  
  return false
}

function getRolePermissions(roleId: string): string[] {
  const role = tenantConfig.roles.find((r) => r.id === roleId)
  return role?.permissions ?? []
}

function getEnabledModules(): string[] {
  return Object.entries(tenantConfig.modules)
    .filter(([, mod]) => mod.enabled)
    .map(([key]) => key)
}

// ============================================================
// HOOK
// ============================================================

export function usePermissions(): UsePermissionsReturn {
  const { data: session, status } = useSession()
  
  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user
  
  const userId = session?.user?.id ?? null
  const userName = session?.user?.name ?? null
  const userEmail = session?.user?.email ?? null
  const tenantId = session?.user?.tenantId ?? null
  const role = session?.user?.role ?? null
  const permissions = session?.user?.permissions ?? []
  
  // Rollen-Permissions aus Config
  const rolePermissions = useMemo(
    () => (role ? getRolePermissions(role) : []),
    [role]
  )
  
  // Permission Check
  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!isAuthenticated) return false
      if (role === "admin") return true
      return matchesPermission(permissions, rolePermissions, permission)
    }
  }, [isAuthenticated, role, permissions, rolePermissions])
  
  const hasAnyPermission = useMemo(() => {
    return (perms: string[]): boolean => {
      return perms.some((p) => hasPermission(p))
    }
  }, [hasPermission])
  
  const hasAllPermissions = useMemo(() => {
    return (perms: string[]): boolean => {
      return perms.every((p) => hasPermission(p))
    }
  }, [hasPermission])
  
  // Role Check
  const hasRole = useMemo(() => {
    return (...roles: string[]): boolean => {
      if (!role) return false
      return roles.includes(role)
    }
  }, [role])
  
  const isAdmin = role === "admin"
  const isManager = hasRole("admin", "manager", "verwaltung")
  
  // Module Check
  const enabledModules = useMemo(() => getEnabledModules(), [])
  
  const isModuleEnabled = useMemo(() => {
    return (module: string): boolean => enabledModules.includes(module)
  }, [enabledModules])
  
  return {
    isLoading,
    isAuthenticated,
    userId,
    userName,
    userEmail,
    tenantId,
    role,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isManager,
    enabledModules,
    isModuleEnabled,
  }
}

// ============================================================
// CONVENIENCE HOOKS
// ============================================================

/**
 * Hook der true/false für eine bestimmte Permission zurückgibt
 */
export function useHasPermission(permission: string): boolean {
  const { hasPermission, isLoading } = usePermissions()
  if (isLoading) return false
  return hasPermission(permission)
}

/**
 * Hook für Admin-Check
 */
export function useIsAdmin(): boolean {
  const { isAdmin, isLoading } = usePermissions()
  if (isLoading) return false
  return isAdmin
}

/**
 * Hook für Module-Check
 */
export function useIsModuleEnabled(module: string): boolean {
  const { isModuleEnabled, isLoading } = usePermissions()
  if (isLoading) return false
  return isModuleEnabled(module)
}
