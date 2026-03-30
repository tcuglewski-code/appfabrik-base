# AppFabrik Preismodell v1.0

> Stand: März 2026 | Interne Kalkulation + Kundenpreise

---

## Übersicht

AppFabrik verkauft **digitale Betriebssysteme** als SaaS.  
Jeder Kunde zahlt einmalig eine **Setup-Fee** + laufende **monatliche SaaS-Gebühr**.  
Keine Übergabe, kein Einmalverkauf — Tomek hostet und wartet dauerhaft.

---

## Preistabelle

### Pakete (nach Betriebsgröße)

| Paket | Zielgruppe | Setup-Fee (netto) | Monatlich (netto) | Jahreswert |
|-------|-----------|-------------------|-------------------|------------|
| **Starter** | 1–5 Mitarbeiter, einfache Prozesse | 1.500 € | 149 € | 1.500 + 1.788 = **3.288 €** |
| **Business** | 5–20 Mitarbeiter, Außendienst + App | 3.500 € | 299 € | 3.500 + 3.588 = **7.088 €** |
| **Professional** | 20–50 Mitarbeiter, Multi-Features | 6.500 € | 499 € | 6.500 + 5.988 = **12.488 €** |
| **Enterprise** | 50+ Mitarbeiter, Custom Features | ab 12.000 € | ab 899 € | individuell |

> MwSt. wird hinzugerechnet (19% DE, 0% AT/CH je nach Fall)

---

### Add-Ons (optional zubuchbar)

| Add-On | Einmalig | Monatlich | Beschreibung |
|--------|----------|-----------|--------------|
| Mobile App (iOS + Android) | 2.500 € | +99 € | Expo/React Native, Offline-First |
| Förder-Beratungsmodul (RAG) | 1.500 € | +49 € | KI-gestützter Förderberater (Sylvia) |
| Erweiterte Analytik | — | +79 € | Custom Dashboards, KPI-Reports |
| Zusätzliche Nutzer (>10) | — | +15 €/User | Pro aktivem Nutzer |
| White-Label Domain | 500 € | +29 € | Eigene Domain + SSL |
| API-Zugang (Developer) | — | +149 € | REST API für Drittintegration |
| Dedizierter Support (SLA L2) | — | +199 € | 4h Response, named CSM |
| Jahresabschluss-Datenexport | — | +29 € | PDF/CSV alle Daten |

---

## Kalkulation (intern, vertraulich)

### Kostenstruktur pro Tenant

| Position | Monatlich | Jährlich |
|----------|-----------|---------|
| Vercel Pro (Team Seat) | ~10 € | ~120 € |
| Neon DB (Pro, 1 Cluster) | ~19 € | ~228 € |
| Cloudflare (DNS + WAF) | ~5 € | ~60 € |
| EAS Build Credits (App) | ~15 € | ~180 € |
| Sentry (Error Monitoring) | ~8 € | ~96 € |
| Resend (Emails) | ~5 € | ~60 € |
| Backblaze B2 (Backups) | ~3 € | ~36 € |
| LLM API Calls (OpenAI) | ~10–50 € | ~120–600 € |
| **Gesamt Infrastruktur** | **~75–115 €** | **~900–1.380 €** |

### Marge (Business-Paket, 299 €/Monat)

| Position | Wert |
|----------|------|
| Umsatz/Monat | 299 € |
| Infrastruktur/Monat | ~95 € |
| Zeitaufwand Wartung | ~2h @ 80 €/h = 160 € |
| **Rohgewinn/Monat** | **~44 €** |
| **Setup-Fee (einmalig)** | **3.500 € → ~30h Arbeit** |
| **Break-even** | ~4 Monate nach Setup |

> **Ziel:** Ab Monat 5 profitabel. Bei 10 Business-Kunden = ~440 €/Monat passiv + Setup-Fees.

---

## Zahlungsmodell

- **Setup-Fee:** 50% bei Auftragserteilung, 50% bei Go-Live
- **SaaS-Gebühr:** Monatlich im Voraus per SEPA-Lastschrift
- **Jahrestarif:** 10% Rabatt bei Jahreszahlung (2 Monate kostenlos)
- **Mindestlaufzeit:** 12 Monate (danach monatlich kündbar, 3 Monate Frist)

---

## Preispositionierung

### Vergleich mit Wettbewerbern

| Anbieter | Setup | Monatlich | Differenz zu AppFabrik |
|----------|-------|-----------|------------------------|
| Fieldpulse | — | 299–499 $ | Keine Anpassung, EN only |
| Jobber | — | 199–449 $ | Kein DE, kein White-Label |
| ServiceM8 | — | 109–349 $ | Sehr rudimentär |
| Individualagentur | 15.000–50.000 € | 0 (keine Wartung) | Einmalprodukt, veraltet schnell |
| **AppFabrik Business** | **3.500 €** | **299 €** | **Individuell + deutsch + betreut** |

> **Kernargument:** Individuelle Lösung zum Preis einer Standard-Software + persönliche Betreuung.

---

## Rabattregeln

| Situation | Rabatt | Bedingung |
|-----------|--------|-----------|
| Referenz-Kunden-Deal | bis 20% Setup | Kunden macht öffentliche Case Study |
| Pilot-Kunde (Branche neu) | bis 30% Setup | Co-Entwicklung + Feedback |
| Jahresvorauszahlung | 10% Monatlich | Automatisch |
| 2. Standort | 50% auf 2. Tenant | Gleicher Unternehmensverbund |

---

## Freemium / Trial?

**NEIN.** Kein Freemium.

Begründung:
- B2B-Kunden im Außendienst kaufen nicht impulsiv
- Jede Instanz kostet Infrastruktur (~95 €/Monat)
- Sales-Prozess ist Beratungsverkauf, kein Self-Serve
- Demo-Umgebung ausreichend als "Schnupperversion"

Alternative: **Demo-Call + Live-Demo** auf der AppFabrik-Demo-Instanz.

---

## Nächste Schritte (Tomek)

- [ ] Preise mit Steuerberater abstimmen (Mehrwertsteuer-Regelung EU)
- [ ] SEPA-Lastschrift einrichten (Geschäftskonto nötig)
- [ ] Stripe Account für Kartenzahlung (optional)
- [ ] Preismodell auf Website publizieren (Pricing-Seite)
- [ ] Angebots-Template mit diesen Preisen erstellen (Sprint JG)

---

*Erstellt: 30.03.2026 | Amadeus (AppFabrik Orchestrator)*
