# Feldhub Brand Guidelines v1.0

> Verbindliche Brand-Standards für alle Feldhub-Materialien
> Version 1.0 — 2026-03-30
> Status: Draft (Logo noch nicht final — Tomeks Entscheidung ausstehend)

---

## 🎯 Markenpersönlichkeit

### Was Feldhub ist

Feldhub ist das **digitale Betriebssystem für Außendienst-KMU**. Wir bauen keine generische Software. Wir bauen maßgeschneiderte digitale Werkzeuge für Betriebe, die draußen arbeiten.

### Brand-Attribute

| Attribut | Bedeutung |
|----------|----------|
| **Präzise** | Wir reden nicht um den heißen Brei. Klare Aussagen, klare Ergebnisse. |
| **Bodenständig** | Wir verstehen Handwerk, Forst, Außendienst. Kein Tech-Jargon gegenüber Kunden. |
| **Kompetent** | Wir liefern. Keine Versprechen ohne Umsetzung. |
| **Modern** | Moderne Technologie — aber ohne Spielerei. Technik muss dienen. |
| **Verlässlich** | Unsere Kunden bauen ihre Betriebe auf unsere Software. Das ist Verantwortung. |

### Was Feldhub nicht ist

- Nicht: aggressiv, laut, hype-getrieben
- Nicht: verspielt, bunt, "startup-y"
- Nicht: technisch überwältigend für Kunden
- Nicht: generisch wie ein SaaS-Template

---

## 🎨 Farben

### Primärpalette

| Name | HEX | RGB | Verwendung |
|------|-----|-----|-----------|
| **Feldhub Grün** | `#2D6A4F` | 45, 106, 79 | Primary CTA, Headings, Akzente |
| **Feldhub Dunkelgrün** | `#1B4332` | 27, 67, 50 | Dark Mode BG, Footer, Hover-States |
| **Feldhub Hellgrün** | `#52B788` | 82, 183, 136 | Erfolg, Positive States, Tags |

### Sekundärpalette

| Name | HEX | Verwendung |
|------|-----|-----------|
| **Erde** | `#6B4423` | Wärme, Kontrast, Branche-Referenz |
| **Sand** | `#D4A853` | Highlights, Preise, Badges |
| **Schiefer** | `#4A5568` | Body Text, Sekundäre Elemente |

### Neutral-Palette

| Name | HEX | Verwendung |
|------|-----|-----------|
| `Gray-900` | `#1A202C` | Headlines, starker Text |
| `Gray-700` | `#2D3748` | Body Text |
| `Gray-500` | `#718096` | Sekundärer Text, Platzhalter |
| `Gray-200` | `#EDF2F7` | Hintergrund, Cards |
| `Gray-50` | `#F7FAFC` | Page Background |
| `White` | `#FFFFFF` | Cards, Panels |

### Semantische Farben

| Name | HEX | Verwendung |
|------|-----|-----------|
| Erfolg | `#52B788` | Bestätigungen, abgeschlossen |
| Warnung | `#ED8936` | Achtung, ausstehend |
| Fehler | `#E53E3E` | Fehler, abgelehnt |
| Info | `#3182CE` | Informationen, Hinweise |

### Verwendungsregeln

- **Nie:** Feldhub Grün auf weißem Text (zu wenig Kontrast)
- **Immer:** WCAG AA Kontrast auf interaktiven Elementen (mind. 4.5:1)
- **Outdoor-Display:** WCAG AAA für Mobile App (mind. 7:1) — Außendienst im Sonnenlicht

---

## ✍️ Typografie

### Font-Stack

| Rolle | Font | Fallback |
|-------|------|---------|
| Headlines | **Inter** (Semibold/Bold) | System-UI, sans-serif |
| Body Text | **Inter** (Regular/Medium) | System-UI, sans-serif |
| Code / Monospace | **JetBrains Mono** | Consolas, monospace |
| (Optional Premium) | **Bricolage Grotesque** | Inter |

**Warum Inter:** Hervorragende Lesbarkeit bei kleinen Größen, kostenlos, weit verbreitet, funktioniert auf allen Plattformen perfekt.

### Größen-Skala

```
xs:   12px / 0.75rem  — Labels, Badges
sm:   14px / 0.875rem — Sekundärer Text
base: 16px / 1rem     — Body Text (Standard)
lg:   18px / 1.125rem — Größerer Body
xl:   20px / 1.25rem  — Abschnitt-Leads
2xl:  24px / 1.5rem   — H3 / Card Headlines
3xl:  30px / 1.875rem — H2 / Section Headlines
4xl:  36px / 2.25rem  — H1 / Page Headlines
5xl:  48px / 3rem     — Hero Headlines
6xl:  60px / 3.75rem  — Display Headlines
```

### Zeilenabstand (Line Height)

| Kontext | Wert |
|---------|------|
| Headlines | 1.2 |
| Body Text | 1.6 |
| UI-Labels | 1.0-1.2 |

### Typografie-Regeln

- **Max. Zeilenlänge:** 65-75 Zeichen (optimale Lesbarkeit)
- **Nie:** mehr als 2 Schriftschnitte auf einer Seite
- **Nie:** weniger als 14px Schriftgröße für Fließtext
- **Immer:** ausreichend Whitespace zwischen Textelementen

---

## 📐 Layout & Spacing

### Grid-System

```
Container max-width: 1200px
Padding left/right: 24px (mobile), 48px (tablet), 80px (desktop)

Grid: 12 Spalten
Gutter: 24px (mobile), 32px (desktop)
```

### Spacing-Skala (Tailwind-kompatibel)

```
1: 4px    2: 8px    3: 12px   4: 16px   5: 20px
6: 24px   8: 32px   10: 40px  12: 48px  16: 64px
20: 80px  24: 96px  32: 128px
```

### Abstands-Regeln

- **Section-Abstand:** min. 80px (desktop), 48px (mobile)
- **Card-Padding:** 24px (standard), 32px (featured)
- **Button-Padding:** 12px top/bottom, 24px left/right
- **Formular-Felder:** 8px gap zwischen Label und Input

---

## 🔘 Buttons & CTAs

### Button-Hierarchie

```
Primary:   Feldhub Grün BG, weißer Text — Hauptaktionen
Secondary: Weiß BG, Grün Border+Text — Sekundäre Aktionen
Ghost:     Transparent BG, Grau Text — Tertiäre Aktionen
Danger:    Rot BG, weißer Text — Destruktive Aktionen
```

### Tailwind-Klassen (Reference)

```html
<!-- Primary Button -->
<button class="bg-[#2D6A4F] text-white px-6 py-3 rounded-lg font-semibold 
               hover:bg-[#1B4332] transition-colors focus:ring-2 
               focus:ring-[#52B788] focus:ring-offset-2">
  Jetzt starten
</button>

<!-- Secondary Button -->
<button class="bg-white text-[#2D6A4F] border-2 border-[#2D6A4F] px-6 py-3 
               rounded-lg font-semibold hover:bg-green-50 transition-colors">
  Mehr erfahren
</button>
```

### CTA-Texte (Best Practices)

**Gut:**
- "Demo anfordern"
- "Kostenlos testen"
- "Jetzt starten"
- "Beratungsgespräch buchen"

**Schlecht:**
- "Klicken Sie hier"
- "Senden"
- "Submit"
- "Mehr Infos"

---

## 🖼️ Bildsprache

### Fotografie-Stil

**Zeige:**
- Echte Außendienst-Situationen (Wald, Baustelle, Feld)
- Menschen bei der Arbeit mit der App
- Natur + Technologie als Kombination
- Praktische, bodenständige Szenen

**Vermeide:**
- Stock-Fotos mit offensichtlich gestellten Situationen
- Übermäßig glänzende Tech-Ästhetik
- Leere Office-Szenen (nicht unsere Zielgruppe)
- Übersättigte, HDR-bearbeitete Naturfotos

### Bildbearbeitung

```
Farbtemperatur: leicht warm (kein kühles Blaufilter)
Kontrast: leicht erhöht
Sättigung: natürlich bis leicht gedämpft
Kein: Heavy Vignette, Instagram-Filter, Vintage-Effekte
```

### Illustrationen / Icons

- **Stil:** Line Icons (2px Stroke, rounded caps)
- **Bibliothek:** Heroicons (Open Source, MIT) als Standard
- **Custom Icons:** gleicher Stil, konsistente Stroke-Breite
- **Keine:** Comic-Illustrationen, 3D-Renders, Cartoon-Figuren

---

## 🏷️ Logo-Verwendung

> ⚠️ **Status:** Logo-Design noch in Entwicklung (Sprint IG abgeschlossen — Tomeks Entscheidung ausstehend)

### Grundregeln (vorläufig)

- **Minimum-Größe:** 24px Höhe (digital), 15mm (Print)
- **Schutzraum:** mind. 1x Logo-Höhe auf allen Seiten
- **Nie:** Logo auf unruhigem Hintergrund ohne Kontrast
- **Nie:** Logo verzerren, drehen, umfärben (außer offizielle Varianten)

### Zukünftige Logo-Varianten (geplant)

| Variante | Verwendung |
|----------|-----------|
| Logo + Wortmarke (Standard) | Website, Präsentationen, Dokumente |
| Nur Bildmarke | App-Icon, Favicon, kleine Flächen |
| Monochrom Weiß | Dunkle Hintergründe |
| Monochrom Schwarz | Print, helle Hintergründe |

---

## 📊 Daten-Visualisierung

### Chart-Farben (in Reihenfolge)

```
1. #2D6A4F  (Feldhub Grün)
2. #52B788  (Hellgrün)
3. #D4A853  (Sand)
4. #6B4423  (Erde)
5. #4A5568  (Schiefer)
6. #3182CE  (Info-Blau)
```

### Chart-Regeln

- **Nie:** Mehr als 5-6 Farben in einem Chart
- **Immer:** Ausreichend Kontrast zwischen benachbarten Segmenten
- **Empfohlen:** Recharts oder Chart.js mit Feldhub-Theme

---

## ✉️ Ton & Stimme (Copywriting)

### Grundhaltung

- **Direkt:** Keine Füllwörter, kein Bürokraten-Deutsch
- **Kompetent ohne Arroganz:** Wir wissen was wir tun, ohne das herauszustellen
- **Verständlich:** Kunden sind Handwerker, keine Software-Entwickler
- **Ehrlich:** Keine Versprechen, die wir nicht halten

### Sprachbeispiele

**Gut:**
> "Ihre Außendienstmitarbeiter dokumentieren Aufträge in unter 2 Minuten — auch ohne Internetzugang."

**Schlecht:**
> "Unsere innovative, KI-gestützte Plattform revolutioniert Ihre Außendienstprozesse durch modernste Cloud-Technologie."

**Gut:**
> "Gebaut für Forstbetriebe. Nicht für Software-Experten."

**Schlecht:**
> "Benutzerfreundliche Oberfläche mit intuitiver UX."

### Anrede

- **B2B:** "Sie" (formell, respektvoll)
- **Marketing:** manchmal "du" (je nach Kanal und Kontext)
- **App / UI:** "du" (persönlich, vertraut)

---

## 📱 App Brand (Mobile)

Für die Mobile App gelten eigene, angepasste Regeln:

- **Touch-Targets:** min. 48x48px
- **Kontrast:** WCAG AAA (Outdoor-Nutzung)
- **Dark Mode:** vollständig unterstützt (System-Preference)
- **Icons:** gefüllte Variante (besser erkennbar bei kleinen Größen)
- **Animations:** sparsam, maximal 200ms, keine Ablenkung

---

## 🗂️ Asset-Verwaltung

### Dateinamen-Konvention

```
feldhub-logo-primary.svg
feldhub-logo-white.svg
feldhub-logo-black.svg
feldhub-icon-only.svg
feldhub-og-image.png       (1200x630px)
feldhub-twitter-card.png   (1200x600px)
feldhub-favicon.ico
feldhub-apple-touch-icon.png (180x180px)
```

### Ordner-Struktur (Repo)

```
/public/
  brand/
    logos/
    icons/
    og-images/
  fonts/
    inter/
  images/
    blog/
    team/
    product/
```

---

## ✅ Brand-Compliance Checklist

```
□ Farben aus der offiziellen Palette?
□ Schriften: Inter + JetBrains Mono?
□ CTA-Texte: aktiv und konkret?
□ Bildsprache: echt, bodenständig, passend?
□ Kontrast: WCAG AA (Web) / AAA (App)?
□ Logo: korrekte Schutzzone?
□ Ton: direkt, kompetent, verständlich?
□ Keine generischen Stock-Fotos?
□ Mobile-First geprüft?
```

---

*Letzte Aktualisierung: 2026-03-30 — Sprint IX*  
*Nächste Überarbeitung: nach Logo-Entscheidung durch Tomek*
