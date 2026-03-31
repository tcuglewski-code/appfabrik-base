/**
 * Feldhub — Skip Link (Accessibility)
 * 
 * "Zum Inhalt springen" Link für Tastatur-Nutzer.
 * Muss als erstes Element im RootLayout platziert werden.
 * 
 * WCAG 2.4.1 — Bypass Blocks (Level A)
 */

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export function SkipLink({
  targetId = 'main-content',
  label = 'Zum Inhalt springen',
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white
        focus:rounded-lg focus:shadow-lg focus:font-medium focus:text-sm
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
        focus:ring-offset-primary
      "
    >
      {label}
    </a>
  );
}

export default SkipLink;
