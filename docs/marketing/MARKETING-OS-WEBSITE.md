# MarketingOS — Website + Landingpage
## Sprint JZ | 31.03.2026

---

## Überblick

Route: `/marketing-os`  
Zweck: Landingpage für Feldhubs MarketingOS — erklärt das Konzept, zeigt die 6 Agenten, leitet zur Demo-Anfrage.

---

## Komponenten

| Datei | Beschreibung |
|-------|-------------|
| `src/app/marketing-os/page.tsx` | Next.js Page mit SEO-Metadata |
| `src/components/marketing/MarketingOSHero.tsx` | Hero Section (Headline, Subline, 2 CTAs) |
| `src/components/marketing/MarketingOSFeatures.tsx` | 6 Agenten-Cards + Funnel-Architektur-Diagramm |
| `src/components/marketing/MarketingOSCTA.tsx` | Bottom CTA (Demo + Preise) |

---

## SEO-Daten

```
title: MarketingOS — Automatisiertes Marketing für KMU | Feldhub
description: Feldhubs MarketingOS automatisiert Content, Lead-Erfassung und CRM mit 6 KI-Agenten.
keywords: Marketing Automatisierung KMU, KI Marketing, MarketingOS, Feldhub
```

---

## Funnel-Struktur auf der Seite

```
Hero (Awareness)
  └─ Headline: "Dein Marketing läuft von selbst"
  └─ CTA: Demo anfragen → /demo

Features (Consideration)
  └─ 6 Agenten-Cards: Research, Magnet, Pulse, Analytics, Hunter, ROI
  └─ Funnel-Architektur-Diagramm: Awareness → Consideration → Conversion

CTA Bottom (Conversion)
  └─ Demo anfragen + Preise ansehen
```

---

## Agenten-Status auf der Seite

| Agent | Code | Status |
|-------|------|--------|
| Research-Agent | JC | ✅ aktiv |
| Magnet-Agent | JY | ✅ aktiv |
| Pulse-Agent | KA | 🟡 beta |
| Analytics-Agent | IY | ✅ aktiv |
| Hunter-Agent | JL | ✅ aktiv |
| ROI-Agent | JE | ✅ aktiv |

---

## Design-Prinzipien

- Dark Hero mit Feldhub-Farben (#0f1923, #C5A55A)
- Cards auf weißem Hintergrund mit hover-Effekt
- Status-Badges (aktiv/beta/geplant) pro Agent
- Responsive: Mobile-first, 3-Column Grid ab lg

---

## Nächste Schritte (nicht im Auto-Loop)

- [ ] Hero-Image / Illustration generieren (Pixel-Agent)
- [ ] `/demo` Route mit Calendly-Embed (JK)
- [ ] A/B Test: Headline-Varianten via Plausible
