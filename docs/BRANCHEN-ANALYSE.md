# Branchen-Analyse — Top 5 Zielmärkte AppFabrik

> **Version:** 1.0.0  
> **Erstellt:** 2026-03-30 (Sprint HO)  
> **Research:** Perplexity sonar-pro  
> **Basis:** DACH-Markt, Stand 2025

---

## 📊 Executive Summary

**Gesamt-TAM:** ~2–3,5 Mrd. € (DACH FSM für KMU-Außendienst)  
**Digitalisierungsgrad:** Niedrig bis Mittel — massive Marktchance  
**FSM-Penetrationsrate:** Aktuell 10–25% → großes Wachstumspotenzial  

---

## 🏆 Priorisierungs-Matrix

| Rang | Branche | TAM (€) | KMU-Betriebe | Digitalisierung | Priorität |
|------|---------|---------|-------------|----------------|-----------|
| 1 | Handwerk & Bau | 1,2–2 Mrd. | 650.000 | Mittel | 🔴 TOP |
| 2 | GaLaBau | 150–250 Mio. | 45.000 | Niedrig | 🔴 TOP |
| 3 | Agrar | 300–500 Mio. | 220.000 | Niedrig | 🟡 MITTEL |
| 4 | Facility / Reinigung | 200–350 Mio. | 28.000 | Mittel | 🟡 MITTEL |
| 5 | Forst & Aufforstung | 80–150 Mio. | 12.000 | Niedrig | 🟢 REFERENZ |

---

## 🌲 Markt 1: Forst & Aufforstung (Referenz-Markt)

> **Status:** ✅ Bereits erschlossen — Koch Aufforstung als Referenzkunde

| Kennzahl | Wert |
|---------|------|
| KMU-Betriebe DACH | ~12.000 (DE: 9.000 · AT: 2.000 · CH: 1.000) |
| TAM | 80–150 Mio. € |
| Digitalisierungsgrad | 🔴 Niedrig (<15% digital) |
| Mitarbeiter im Außendienst | 12–20 pro KMU |
| AppFabrik-Eintritt | ✅ Sofort möglich (Referenz vorhanden) |

**Pain Points die AppFabrik löst:**
- Geländekoordination ohne Mobilfunk (Offline-First)
- Sicherheitsprotokolle + Abnahmedokumentation
- Holz-/Flächen-Tracking + Förderantrag-Unterstützung
- Projektstatus für Waldbesitzer (Kundenportal)

**Akquise-Kanäle:**
- Forstverbände (Deutscher Forstwirtschaftsrat, DFS, Waldbesitzerverbände)
- Content-Marketing: "Digitalisierung im Forst"
- Messen: Forst Live, KWF-Tagung
- **Koch Aufforstung als Case Study + Empfehler**

---

## 🌿 Markt 2: Landschaftsbau & GaLaBau (TOP Priorität)

> **Status:** 🎯 Nächster Zielmarkt — ähnlichste Branche zu Forst

| Kennzahl | Wert |
|---------|------|
| KMU-Betriebe DACH | ~45.000 (DE: 35.000 · AT: 6.000 · CH: 4.000) |
| TAM | 150–250 Mio. € |
| Digitalisierungsgrad | 🔴 Niedrig (<30% mit FSM-Tools) |
| Mitarbeiter im Außendienst | 15–25 pro KMU |
| AppFabrik-Eintritt | 🟡 Konfiguration nötig (tenant.ts anpassen) |

**Pain Points die AppFabrik löst:**
- Terminplanung bei wetterabhängigen Einsätzen
- Materialnachverfolgung (Pflanzen, Maschinen)
- Rechnungsstellung vor Ort + Teilabrechnungen
- Saisonale Projektplanung (Herbst/Frühjahr-Peaks)

**Akquise-Kanäle:**
- BGL (Bundesverband Garten-, Landschafts- und Sportplatzbau)
- Messe: GaLaBau Nürnberg (alle 2 Jahre)
- Google Ads: "Auftrags-Software GaLaBau"
- LinkedIn: GaLaBau-Unternehmer-Netzwerke

**AppFabrik Anpassungen nötig:**
```
tenant.ts: serviceTypes = ["Pflanzung", "Rasen", "Wegebau", "Bewässerung"]
Neue Module: Maschinenverwaltung, Wetter-Integration, Pflanzen-DB
```

---

## 🔨 Markt 3: Handwerk & Bau (GRÖSSTER MARKT)

> **Status:** 🎯 Größter TAM — mittel-langfristiger Fokus

| Kennzahl | Wert |
|---------|------|
| KMU-Betriebe DACH | ~650.000 (DE: 520.000 · AT: 80.000 · CH: 50.000) |
| TAM | 1,2–2 Mrd. € |
| Digitalisierungsgrad | 🟡 Mittel (50% nutzen Apps, fragmentiert) |
| Mitarbeiter im Außendienst | 10–20 pro KMU |
| AppFabrik-Eintritt | 🔴 Mehr Anpassung nötig (Handwerk-Flows) |

**Pain Points die AppFabrik löst:**
- Einsatzkoordination mehrerer Kolonnen
- Arbeitszeitnachweis + Lohnabrechnung-Vorbereitung
- Kundenaufträge + Angebote digital
- Bautagebuch + Mängelprotokoll

**Akquise-Kanäle:**
- Handwerkskammern (HWK) als Partner
- Mittelstand-Digital-Berater (Bundesministerium)
- Google Ads: "Handwerker-Software", "Auftragsverwaltung Handwerk"
- LinkedIn: Meister-Netzwerke

**Wettbewerb:** Stärker (SevDesk, lexoffice, Craftsman, mfr) — Differenzierung durch White-Label + KI

---

## 🌾 Markt 4: Agrar & Landwirtschaft

> **Status:** 🟡 Interessant — saisonales Muster, Offline kritisch

| Kennzahl | Wert |
|---------|------|
| KMU-Betriebe DACH | ~220.000 (DE: 170.000 · AT: 30.000 · CH: 20.000) |
| TAM | 300–500 Mio. € |
| Digitalisierungsgrad | 🔴 Niedrig (<20% mit FSM) |
| Mitarbeiter im Außendienst | 8–15 pro KMU |
| AppFabrik-Eintritt | 🔴 Spezialisierter Anpassungsaufwand |

**Pain Points die AppFabrik löst:**
- Saisonale Einsatzplanung (Ernte, Pflanzung)
- Maschineneinsatz-Tracking (Traktor, Erntemaschine)
- Lieferanten- und Hilfskraft-Koordination
- Flächenbewirtschaftungsprotokoll (DSGVO-konform für EU-Förderung)

**Akquise-Kanäle:**
- Landwirtschaftliche Verbände (DBV, LsV)
- Agrar-Software-Reseller als Partner
- Facebook-Gruppen: Landwirte DACH
- Messer: Agritechnica, EuroTier

---

## 🧹 Markt 5: Facility Management & Reinigung

> **Status:** 🟡 Niedrig-Komplexität, viele kleine Betriebe

| Kennzahl | Wert |
|---------|------|
| KMU-Betriebe DACH | ~28.000 (DE: 22.000 · AT: 4.000 · CH: 2.000) |
| TAM | 200–350 Mio. € |
| Digitalisierungsgrad | 🟡 Mittel (40% mobil, schwach integriert) |
| Mitarbeiter im Außendienst | 20–30 pro KMU |
| AppFabrik-Eintritt | 🟡 Standard-Module ausreichend |

**Pain Points die AppFabrik löst:**
- Schichtplanung + Mitarbeiter-Disposition
- Qualitätskontrolle vor Ort (Checklisten + Fotos)
- Kundenzufriedenheit tracken
- Abrechnung nach Fläche/Stunden/Objekt

**Akquise-Kanäle:**
- BIV Gebäudereiniger-Handwerk
- SEO: "Reinigungsunternehmen Software"
- Webinare: "Digitalisierung Gebäudemanagement"
- FM-Messen: EXPO REAL, Facility Management Kongress

---

## 🗺️ Empfohlene Go-to-Market Reihenfolge

```
Phase 1 (2026): Forst/GaLaBau
  → Referenz Koch Aufforstung nutzen
  → Ähnliche Branchen-DNA (outdoor, projektbasiert)
  → TAM: ~230–400 Mio. €

Phase 2 (2027): Facility/Reinigung
  → Standard-Workflows, schnell konfigurierbar
  → TAM: ~200–350 Mio. €

Phase 3 (2028+): Handwerk/Agrar
  → Größter Markt aber mehr Wettbewerb
  → Separate Vertikal-Varianten nötig
  → TAM: ~1,5–2,5 Mrd. €
```

---

## 💰 SAM & SOM (Realistisch)

| Metrik | Berechnung | Wert |
|--------|-----------|------|
| TAM (gesamt) | Alle 5 Branchen DACH | 2–3,5 Mrd. € |
| SAM (Phase 1: Forst+GaLaBau) | 57.000 Betriebe × ~180 €/Monat × 12 | ~120 Mio. €/Jahr |
| SOM (3 Jahre, 0,5% Marktanteil) | SAM × 0,5% | ~600.000 €/Jahr ARR |
| **Realistisches Ziel 2027** | 50 Kunden × 1.200 €/Monat | **720.000 €/Jahr ARR** |

---

*Research-Basis: Perplexity sonar-pro, Statista, Destatis, BGL, HWK — März 2026.*  
*TAM-Schätzungen basieren auf öffentlichen Marktdaten + eigener Kalkulation.*
