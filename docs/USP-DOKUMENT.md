# USP-Dokument — AppFabrik: Differenzierung & Alleinstellungsmerkmale

> **Version:** 1.0.0  
> **Erstellt:** 2026-03-30 (Sprint HP)  
> **Zweck:** Sales-Gespräche, Pitch, Website-Texte, Investoren-Briefs  
> **Basis:** Differenzierungsanalyse HN + Branchen-Analyse HO

---

## 🎯 Die Ein-Satz-Positionierung

> **AppFabrik baut maßgeschneiderte digitale Betriebssysteme für KMU im Außendienst — in Tagen statt Monaten, vollständig white-label, mit KI eingebaut und DSGVO-nativ.**

---

## 🏆 Die 5 Alleinstellungsmerkmale (USPs)

### USP 1: 100% White-Label — Ihr Name, nicht unserer

**Was es bedeutet:**  
Das komplette System läuft unter dem Namen und Brand des Kunden. App-Icon, App-Name, Farben, Texte, Domain — alles gehört dem Kunden. Kein "Powered by AppFabrik", kein Vendor-Logo, kein Hinweis auf uns.

**Warum es relevant ist:**  
KMU-Inhaber wollen **ihre** Software für ihre Mitarbeiter und Kunden. Nicht eine Fremdsoftware, die sie geduldet haben. White-Label erzeugt Identifikation, Akzeptanz und macht es fast unmöglich zu wechseln.

**Warum kein Wettbewerber das hat:**  
Fieldcode, Salesforce, SAP, mfr, Jobber — alle verkaufen ihr eigenes Produkt. White-Label erfordert ein Template-System (unser `appfabrik-base`), das kein Software-Verkäufer freiwillig baut.

**Beweisbar mit:**  
Koch Aufforstung GmbH — ForstManager läuft vollständig unter deren Branding.

---

### USP 2: Setup in Tagen, nicht Monaten

**Was es bedeutet:**  
Ein neuer Kunde hat sein vollständig konfiguriertes System in 1–2 Wochen live. Kein 6-monatiges Implementierungsprojekt, keine Beraterheere, keine endlosen Workshops.

**Wie es funktioniert:**  
`tenant.ts` enthält alle kundspezifischen Parameter — Branding, Features, Nutzerrollen, Preise. Das Template-System (`appfabrik-base` + `appfabrik-app-base`) übernimmt alles andere automatisch.

**Was der Kunde spart:**  
- Keine Implementierungskosten (40.000–200.000 € bei Enterprise-Anbietern)
- Keine verlorene Zeit bis zur Produktivität
- Schneller ROI

**Zahlen-Vergleich:**

| Anbieter | Setup-Zeit | Implementierungskosten |
|---------|-----------|----------------------|
| AppFabrik | 1–2 Wochen | Setup-Fee ~5.000–15.000 € |
| Salesforce Field Service | 3–9 Monate | 50.000–300.000 € |
| SAP FSM | 6–18 Monate | 100.000–500.000 € |
| Fieldcode | 4–8 Wochen | 10.000–50.000 € |

---

### USP 3: KI-Agenten — Automatisierung out-of-the-box

**Was es bedeutet:**  
AppFabrik ist das einzige KMU-FSM-System, das KI-Agenten als erste Klasse eingebaut hat — nicht als teures Add-on oder Lab-Feature, sondern als Kern der Plattform.

**Konkrete Anwendungen:**
- **Sylvia (Förder-Intelligence):** Automatische Förderberatung für Forst + Agrar (255 Programme)
- **Berichte-Automatisierung:** Tagesprotokolle, Abnahmedokumentation, Kunden-Updates
- **Routen-Optimierung:** KI-gestützte Einsatzplanung für Außendienst
- **Dokumenten-Erstellung:** Angebote, Rechnungstexte, Projekt-Dokumentation

**Warum es relevant ist:**  
Ein Mitarbeiter im Außendienst verbringt heute 2–4 Stunden/Tag mit Administration. KI-Agenten reduzieren das auf 20–40 Minuten. Das ist messbar, beweisbar und ist ein harter ROI.

**Wettbewerber:** KI bei Salesforce = teures Einstein-Modul. KI bei SAP = Beraterprojekt. AppFabrik = Standard.

---

### USP 4: Offline-First + DSGVO-nativ (EU-Server)

**Was es bedeutet:**  
Die mobile App funktioniert **ohne Mobilfunk** — im Wald, auf dem Feld, in Keller-Baustellen, überall. Alle Daten liegen auf EU-Servern (Neon.tech Frankfurt, Vercel EU).

**Offline-Technologie:**  
WatermelonDB + lokale SQLite — Daten werden im Hintergrund synchronisiert, sobald Verbindung besteht. Der Nutzer merkt nichts davon.

**DSGVO-Bedeutung:**  
Viele US-Anbieter (Jobber, Salesforce) können DSGVO nicht vollständig einhalten — US Cloud Act. AppFabrik ist by design compliant. Kein Anwalt-Check nötig, keine Grauzone.

**Zielgruppen-Resonanz:**  
- Forstbetriebe: 60–80% der Arbeitszeit ohne Mobilfunk
- Landschaftsbau: Baustellen mit schlechtem Empfang
- Agrar: Felder außerhalb Mobilfunk-Abdeckung

---

### USP 5: SaaS-Modell mit Lifetime-Partnership

**Was es bedeutet:**  
Kein Einmalverkauf, kein End-of-Life, keine Verlassenheit. Der Kunde zahlt monatlich und bekommt dafür kontinuierliche Weiterentwicklung, Support, neue Features — angepasst an seine Branche.

**Preismodell:**
- **Setup-Fee:** 5.000–15.000 € (einmalig, zur Deckung der initialen Entwicklung)
- **Monatliche Nutzungsgebühr:** 500–2.500 €/Monat (je nach Nutzeranzahl + Features)
- **Keine versteckten Kosten:** Kein extra Add-on-Pricing, kein Pay-per-Feature

**Was der Kunde bekommt:**
- System wächst mit seinem Unternehmen
- Neue Branchenfeatures automatisch inklusive
- FELDWERK als langfristiger Tech-Partner, nicht nur Software-Lieferant

**Differenzierung:**  
Klassische Software-Unternehmen verkaufen ein Produkt. AppFabrik verkauft eine Partnerschaft.

---

## 📊 USP-Matrix im Vergleich

| USP | AppFabrik | Fieldcode | Salesforce | SAP | mfr | Jobber |
|-----|-----------|-----------|------------|-----|-----|--------|
| White-Label | ✅ 100% | ❌ | ❌ | ❌ | ❌ | ❌ |
| Setup in Wochen | ✅ 1–2 Wo | ⚠️ 4–8 Wo | ❌ Monate | ❌ Monate | ⚠️ Wo | ⚠️ Wo |
| KI integriert | ✅ | ❌ | 💰 Add-on | 💰 Add-on | ❌ | ❌ |
| Offline-First | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ |
| EU DSGVO-nativ | ✅ | ✅ | ❌ | ⚠️ | ✅ | ❌ |
| KMU-Preis transparent | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Branche individualisierbar | ✅ voll | ⚠️ allgemein | ❌ | ❌ | ⚠️ | ⚠️ |
| SaaS-Partnership | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ |

**AppFabrik ist der einzige Anbieter mit allen ✅.**

---

## 💬 Einwand-Handling

### „Warum nicht einfach Jobber?"
Jobber ist US-Software. DSGVO-Grauzone. Kein White-Label. Keine KI. Keine Forst-spezifischen Features. Für einen Klempner in Ohio okay — für einen Forstbetrieb in Bayern nicht.

### „Salesforce hat KI auch"
Ja, als Einstein-Modul ab 75 $/Nutzer/Monat extra. Für einen 15-Mann-Betrieb: 13.500 €/Jahr nur für KI. AppFabrik: inklusive.

### „Ich habe gehört, maßgeschneidert ist teuer"
Das war früher so. `appfabrik-base` ist das Template — die Basis-Entwicklung ist schon getan. Der Kunde zahlt nur die Konfiguration, nicht die Erfindung.

### „Wer garantiert Weiterentwicklung?"
FELDWERK als Studio mit klarer Roadmap. Nicht ein anonymes Produkt-Team. Tomek persönlich hinter dem System.

---

## 🗣️ Testimonials (Stand März 2026)

> **Koch Aufforstung GmbH** — Referenzkunde seit 2025  
> Vollständiges digitales Betriebssystem: ForstManager + App + Kundenportal + Website.  
> *"Von der Papier-Excel-Hölle zur digitalen Außendienst-Koordination in unter 4 Wochen."*

---

## 📋 Verwendung

| Kontext | Empfehlung |
|---------|-----------|
| Website Startseite | USP 1, 2, 5 (kurz, klar, emotional) |
| Sales-Gespräch | Alle 5 USPs + Einwand-Handling |
| Pitch Deck | USP-Matrix + Zahlen-Vergleich |
| Case Study | USP 4 + KI-ROI |
| LinkedIn-Post | Je 1 USP pro Post (5-Wochen-Kampagne) |

---

*Erstellt von Amadeus (Sprint HP) — Basis: Differenzierungsanalyse HN + Branchen-Analyse HO*
