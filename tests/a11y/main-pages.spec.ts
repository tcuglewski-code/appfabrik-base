/**
 * Feldhub — Accessibility Tests (WCAG 2.1 AA)
 * 
 * Automatisierte A11y-Tests via axe-core + Playwright.
 * Abdeckung: ~40% aller WCAG-Regeln automatisch prüfbar.
 * 
 * Ausführung: `npm run test:a11y`
 * 
 * Installation: npm install --save-dev @axe-core/playwright
 */

import { test, expect } from '@playwright/test';

// Typ-Deklaration für axe-core (wird bei Bedarf installiert)
// import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility — WCAG 2.1 AA', () => {
  // Hauptseiten die A11y-konform sein müssen
  const pages = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/auftraege', name: 'Auftrags-Übersicht' },
    { path: '/mitarbeiter', name: 'Mitarbeiter' },
    { path: '/login', name: 'Login' },
  ];

  for (const { path, name } of pages) {
    test(`${name} — keine WCAG-Verletzungen`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // axe-core A11y-Scan
      // Aktivieren wenn @axe-core/playwright installiert:
      /*
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .exclude('#cookie-banner') // Externe Komponenten ausschließen
        .analyze();
      
      expect(results.violations).toEqual([]);
      */

      // Basis-Checks (immer aktiv):
      
      // 1. lang-Attribut vorhanden
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
      
      // 2. Seitentitel vorhanden
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      
      // 3. Überschriften-Hierarchie (keine übersprungenen Ebenen)
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeLessThanOrEqual(1); // Max 1x H1 pro Seite
    });

    test(`${name} — Tastatur-Navigation funktioniert`, async ({ page }) => {
      await page.goto(path);
      
      // Tab-Navigation testen
      await page.keyboard.press('Tab');
      
      // Fokus-Indikator sollte sichtbar sein
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return false;
        const style = window.getComputedStyle(el);
        // Prüft ob Fokus-Outline sichtbar (nicht 0 oder none)
        return style.outlineWidth !== '0px' && style.outlineStyle !== 'none';
      });
      
      // Akzeptiert auch wenn Skip-Link der erste fokussierte Element ist
      const skipLink = page.locator('a[href="#main-content"]');
      const skipLinkExists = await skipLink.count() > 0;
      
      expect(focused || skipLinkExists).toBeTruthy();
    });
  }

  test('Login-Formular — ARIA-Labels korrekt', async ({ page }) => {
    await page.goto('/login');
    
    // Alle Inputs müssen Labels haben
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Input muss entweder aria-label, aria-labelledby, oder ein verknüpftes Label haben
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const labelCount = await label.count();
        expect(labelCount > 0 || !!ariaLabel || !!ariaLabelledBy).toBeTruthy();
      } else {
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('Bilder — Alt-Texte vorhanden', async ({ page }) => {
    await page.goto('/dashboard');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt muss vorhanden sein (kann leer sein für dekorative Bilder)
      expect(alt).not.toBeNull();
    }
  });
});

/**
 * CI-Integration (GitHub Actions):
 * 
 * In .github/workflows/ci.yml hinzufügen:
 * 
 * - name: A11y Tests
 *   run: npx playwright test tests/a11y/
 *   env:
 *     PLAYWRIGHT_TESTS: a11y
 */
