import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider, ContrastWarningBanner } from "@/components/providers/ThemeProvider"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { tenantConfig } from "@/config/tenant"

export const metadata: Metadata = {
  title: `${tenantConfig.shortName} — ${tenantConfig.tagline}`,
  description: tenantConfig.tagline,
  icons: {
    icon: tenantConfig.branding.favicon,
    apple: tenantConfig.branding.appleTouchIcon,
  },
  openGraph: {
    title: tenantConfig.name,
    description: tenantConfig.tagline,
    images: tenantConfig.branding.ogImage ? [tenantConfig.branding.ogImage] : [],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={tenantConfig.locale.language} suppressHydrationWarning>
      <head>
        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('appfabrik-theme-mode');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (mode === 'dark' || (mode === 'system' && systemDark) || (!mode && systemDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased theme-transition">
        <SessionProvider>
          <ThemeProvider config={tenantConfig}>
            {children}
            <Toaster 
              position="top-right" 
              richColors 
              toastOptions={{
                className: 'surface',
              }}
            />
            {/* Kontrast-Warnungen nur in Development */}
            <ContrastWarningBanner />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
