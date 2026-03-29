/**
 * NextAuth.js Type Definitions
 * 
 * Erweitert die Standard-Session und JWT Typen um:
 * - tenantId (Multi-Tenant)
 * - role (Rolle des Users)
 * - permissions (Feingranulare Berechtigungen)
 */

import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tenantId: string
      role: string
      permissions: string[]
      twoFactorEnabled: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    tenantId: string
    role: string
    permissions: string[]
    twoFactorEnabled: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    tenantId: string
    role: string
    permissions: string[]
    twoFactorEnabled: boolean
  }
}
