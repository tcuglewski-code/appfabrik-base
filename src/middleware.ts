/**
 * Next.js Middleware
 * 
 * Schützt Routes und prüft Authentifizierung.
 * Läuft auf Edge Runtime (kein Prisma möglich).
 * 
 * Protection-Levels:
 * 1. Public Routes (/login, /register, /api/auth/*, /api/public/*)
 * 2. Authenticated Routes (alle anderen)
 * 3. Permission-basierte Routes (in den API-Routes selbst)
 */

import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// NextAuth Middleware mit unserer Config
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // Der authorized-Callback in auth.config.ts handhabt die Logik
  // Hier können wir zusätzliche Headers setzen oder loggen
  
  // Beispiel: Request-ID für Debugging
  const requestId = crypto.randomUUID()
  req.headers.set("x-request-id", requestId)
  
  return
})

// Welche Routes sollen durch die Middleware laufen?
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - images, fonts, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
}
