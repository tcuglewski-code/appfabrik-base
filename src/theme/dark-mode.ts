/**
 * Feldhub Dark Mode Provider Setup
 *
 * Nutzt `next-themes` für persistentes Theme-Switching.
 * Installation: npm install next-themes
 */

'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

/**
 * FeldhubThemeProvider — wraps next-themes ThemeProvider.
 * Platziere ihn im Root Layout (app/layout.tsx).
 *
 * @example
 * // app/layout.tsx
 * import { FeldhubThemeProvider } from '@/theme/dark-mode'
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="de" suppressHydrationWarning>
 *       <body>
 *         <FeldhubThemeProvider>{children}</FeldhubThemeProvider>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function FeldhubThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"        // setzt class="dark" auf <html>
      defaultTheme="system"    // folgt System-Präferenz
      enableSystem             // prefers-color-scheme
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

/**
 * useTheme Hook — re-export für einfachen Import.
 * @example
 * const { theme, setTheme, resolvedTheme } = useTheme()
 */
export { useTheme } from 'next-themes'
