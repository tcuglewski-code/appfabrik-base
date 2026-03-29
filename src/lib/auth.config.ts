/**
 * NextAuth Configuration (Edge-safe)
 * 
 * Diese Datei enthält keine Prisma-Importe und kann in Edge-Runtimes
 * (z.B. Middleware) verwendet werden.
 * 
 * Multi-Tenant Konzept:
 * - tenantId wird bei Login aus User-Daten übernommen
 * - JWT enthält tenantId, role, permissions
 * - Session-Callbacks reichen diese Daten durch
 */

import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  // JWT-basierte Sessions (stateless, edge-safe)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
  },
  
  // Custom Login-Seite
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  callbacks: {
    /**
     * JWT Callback - wird bei jedem Token-Update aufgerufen
     * 
     * Bei Login (user vorhanden): Übernimmt User-Daten ins Token
     * Bei jedem Request: Token wird unverändert weitergegeben
     */
    jwt({ token, user, trigger, session }) {
      // Beim initialen Login User-Daten ins Token schreiben
      if (user) {
        token.id = user.id as string
        token.tenantId = (user as any).tenantId
        token.role = (user as any).role
        token.permissions = (user as any).permissions ?? []
        token.twoFactorEnabled = (user as any).twoFactorEnabled ?? false
      }
      
      // Bei Session-Update (z.B. nach Rollen-Änderung)
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role
        if (session.permissions) token.permissions = session.permissions
      }
      
      return token
    },
    
    /**
     * Session Callback - macht Token-Daten in der Session verfügbar
     */
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.tenantId = token.tenantId as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
      }
      return session
    },
    
    /**
     * Authorized Callback - prüft ob Zugriff erlaubt ist
     * 
     * Wird von der Middleware für Route-Protection genutzt.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLogin = nextUrl.pathname === "/login"
      const isOnRegister = nextUrl.pathname === "/register"
      const isOnApi = nextUrl.pathname.startsWith("/api/")
      const isPublicApi = nextUrl.pathname.startsWith("/api/auth/") ||
                          nextUrl.pathname.startsWith("/api/public/")
      
      // Public Routes
      if (isOnLogin || isOnRegister || isPublicApi) {
        return true
      }
      
      // API Routes brauchen Auth (außer public)
      if (isOnApi && !isLoggedIn) {
        return false
      }
      
      // Dashboard Routes brauchen Auth
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl))
      }
      
      // Eingeloggt → Zugriff erlaubt (Fein-Permissions in den Routes selbst)
      return true
    },
  },
  
  // Providers werden in auth.ts hinzugefügt
  providers: [],
  
  // Debug nur in Development
  debug: process.env.NODE_ENV === "development",
  
} satisfies NextAuthConfig
