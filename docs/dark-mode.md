# Dark/Light Theme Support — Feldhub Base

> Sprint JU | feldhub-base | Stand: 31.03.2026

## Übersicht

Feldhub Base unterstützt Dark/Light Mode via **next-themes** und **Tailwind CSS `darkMode: 'class'`**.

## Setup

### 1. Abhängigkeit installieren

```bash
npm install next-themes
```

### 2. ThemeProvider in Root Layout einbinden

```tsx
// app/layout.tsx
import { FeldhubThemeProvider } from '@/theme/dark-mode'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <FeldhubThemeProvider>
          {children}
        </FeldhubThemeProvider>
      </body>
    </html>
  )
}
```

> ⚠️ `suppressHydrationWarning` auf `<html>` ist notwendig, da next-themes die `class` serverseitig nicht kennt.

### 3. CSS Variables in globalem Stylesheet definieren

```css
/* app/globals.css */
:root {
  --color-primary: #2D5A27;
  --color-primary-50: #f3f6f2;
  /* ... alle tokens aus src/theme/tokens.ts */
  
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-muted: #f4f4f5;
  --color-muted-foreground: #71717a;
  --color-border: #e4e4e7;
  --color-input: #e4e4e7;
  --color-ring: #2D5A27;
  --color-card: #ffffff;
  --color-card-foreground: #0a0a0a;
  
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #2563eb;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-muted: #27272a;
  --color-muted-foreground: #a1a1aa;
  --color-border: #3f3f46;
  --color-input: #3f3f46;
  --color-card: #18181b;
  --color-card-foreground: #fafafa;
}
```

### 4. ThemeToggle Button verwenden

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

// In Navbar, Header, Settings etc.
<nav>
  <ThemeToggle />
</nav>
```

### 5. Theme programmatisch wechseln

```tsx
'use client'
import { useTheme } from '@/theme/dark-mode'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme('dark')}>Dark</button>
    <button onClick={() => setTheme('light')}>Light</button>
    <button onClick={() => setTheme('system')}>System</button>
  )
}
```

## Tailwind Klassen

Mit `darkMode: 'class'` in `tailwind.config.ts` funktionieren `dark:` Präfixe:

```tsx
<div className="bg-background text-foreground dark:bg-zinc-900 dark:text-white">
  <p className="text-muted-foreground dark:text-zinc-400">Beschreibung</p>
</div>
```

Besser: Semantic Colors via CSS-Vars direkt nutzen (kein `dark:` Prefix nötig):

```tsx
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Beschreibung</p>
</div>
```

## Dateien

| Datei | Beschreibung |
|-------|-------------|
| `tailwind.config.ts` | `darkMode: 'class'`, alle CSS-Var Token-Mappings |
| `src/theme/tokens.ts` | Light/Dark Farbpaletten + ThemeTokens Interface |
| `src/theme/dark-mode.ts` | FeldhubThemeProvider + useTheme re-export |
| `src/components/ThemeToggle.tsx` | Sonne/Mond Toggle Button |
| `docs/dark-mode.md` | Diese Dokumentation |

## Tenant-Konfiguration

Jeder Tenant kann in `tenant.ts` eine eigene Farbpalette definieren.
Die Tokens werden dann über CSS-Vars injiziert — das Theme-System funktioniert für alle Tenants automatisch.
