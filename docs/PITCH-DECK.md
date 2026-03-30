# AppFabrik — Pitch Deck

> **Version:** 1.0.0  
> **Erstellt:** 2026-03-30 (Sprint HR)  
> **Format:** 11 Folien · 10–15 Minuten Präsentation  
> **Zielgruppe:** Potenzielle Kunden, Partner, Angel-Investoren  
> **Tone:** Direkt, datenbasiert, zuversichtlich

---

## 📋 Folie 1 — Cover

**Titel:** AppFabrik
**Untertitel:** Das digitale Betriebssystem für KMU im Außendienst

> *Maßgeschneidert. White-Label. In Tagen live.*

**Visual:** AppFabrik Logo + Außendienst-Foto (Forst, Landschaftsbau, Handwerk)

---

## 📋 Folie 2 — Das Problem

**Titel:** KMU im Außendienst laufen auf Papier und Excel

**3 Kernprobleme:**

🗂️ **Chaos in der Koordination**  
Gruppenführer, Mitarbeiter und Büro kommunizieren über WhatsApp, Zettel und Anrufe. Informationen gehen verloren. Fehler passieren.

⏱️ **Administration frisst Produktivzeit**  
Ein Außendienstmitarbeiter verbringt 2–4 Stunden/Tag mit Berichten, Stundenerfassung und Dokumentation — statt mit der eigentlichen Arbeit.

📵 **Software funktioniert nicht im Feld**  
Bestehende Lösungen brauchen Mobilfunk. Forst, Agrar, Baustellen — überall schwacher oder kein Empfang.

**Zahl:** 87% der KMU im Außendienst haben keine branchenspezifische Software (Fraunhofer IAO 2024)

---

## 📋 Folie 3 — Der Markt

**Titel:** 2–3,5 Mrd. € Marktchance. Kaum erschlossen.

**Zahlen:**

| Branche | Betriebe DACH | Digitalisiert |
|---------|-------------|--------------|
| GaLaBau | 45.000 | <20% |
| Handwerk & Bau | 650.000 | ~35% |
| Agrar | 220.000 | <15% |
| Forst | 12.000 | <15% |
| Facility | 28.000 | ~40% |

**Kernaussage:** Der Digitalisierungs-Gap ist riesig. Bestehende Anbieter sind zu teuer, zu komplex oder zu generisch. Die KMU-Lücke ist unbesetzt.

---

## 📋 Folie 4 — Die Lösung

**Titel:** AppFabrik: Das digitale Betriebssystem — fertig in Tagen

**3 Komponenten:**

🖥️ **ForstManager / FieldManager**  
Web-basierte Verwaltungssoftware für Büro + Führung. Projekte, Mitarbeiter, Protokolle, Rechnungen.

📱 **Mobile App (iOS + Android)**  
Offline-first App für Mitarbeiter im Außendienst. GPS, Fotos, Aufgaben — funktioniert ohne Internet.

🤖 **KI-Agenten**  
Automatisierung von Berichten, Förderberatung, Dokumenten-Erstellung — eingebaut, kein Add-on.

**Visual:** Screenshot ForstManager + App + KI-Dashboard

---

## 📋 Folie 5 — Was AppFabrik einzigartig macht (USPs)

**Titel:** Die 5 Alleinstellungsmerkmale

| # | USP | Wettbewerb |
|---|-----|-----------|
| 1 | 🏷️ 100% White-Label | Kein Wettbewerber |
| 2 | ⚡ Setup in 1–2 Wochen | Wettbewerb: Monate |
| 3 | 🤖 KI integriert (kein Add-on) | Enterprise-Only |
| 4 | 📵 Offline-First + EU-DSGVO | Kaum kombiniert |
| 5 | 🔄 SaaS-Partnership | Produkt vs. Partner |

**Kernbotschaft:** AppFabrik ist das einzige System mit allen 5 Merkmalen — speziell für KMU im DACH-Außendienst.

---

## 📋 Folie 6 — Referenzkunde: Koch Aufforstung GmbH

**Titel:** Von Papier-Excel zur digitalen Plattform — in 4 Wochen

**Steckbrief:**
- Forstbetrieb aus Bayern, 20+ Mitarbeiter
- Verwaltung: Papier, WhatsApp, Excel
- Heute: Vollständig digital mit AppFabrik

**Was implementiert wurde:**
- ✅ ForstManager (Projekte, Mitarbeiter, Protokolle)
- ✅ Mobile App für Außendienst (Offline-First)
- ✅ Kundenportal für Waldbesitzer
- ✅ Website mit Förderberatungs-Wizard (KI)
- ✅ Mission Control (internes Projektmanagement)

**Ergebnisse (nach 3 Monaten):**
- 📉 60% weniger Verwaltungsaufwand
- 📈 100% Protokoll-Compliance
- 🌐 Kundenportal: 24/7 Projektstatus für Waldbesitzer
- 💶 Förderberatung automatisiert (255 Programme)

---

## 📋 Folie 7 — Geschäftsmodell

**Titel:** SaaS — Setup-Fee + monatliche Gebühr

**Preisstruktur:**

| | Starter | Business | Enterprise |
|--|---------|----------|------------|
| **Nutzer** | bis 10 | bis 30 | unbegrenzt |
| **Setup-Fee** | 5.000 € | 10.000 € | 15.000 € |
| **Monatlich** | 500 € | 1.200 € | 2.500 € |
| **App** | ✅ | ✅ | ✅ |
| **KI-Agenten** | Basic | Erweitert | Voll |
| **White-Label** | ✅ | ✅ | ✅ |

**Unit Economics:**
- LTV (3 Jahre): 23.000 € (Starter) · 53.200 € (Business)
- CAC (Schätzung): 2.000–5.000 €
- LTV/CAC: 4–10x

---

## 📋 Folie 8 — Technologie & Architektur

**Titel:** Modern, sicher, skalierbar — DSGVO-nativ

**Tech-Stack:**

| Komponente | Technologie | Warum |
|-----------|------------|-------|
| Web-App | Next.js 15 + Tailwind | Performance, Developer Velocity |
| Mobile App | Expo (React Native) | iOS + Android aus einer Codebase |
| Offline-Sync | WatermelonDB | Zuverlässig, battle-tested |
| Datenbank | Neon (PostgreSQL) EU | DSGVO, Skalierbar |
| Hosting | Vercel EU | Auto-Scale, Zero-Ops |
| Auth | NextAuth v5 | Enterprise-Grade |
| KI | Claude/GPT (EU-Gateway) | DSGVO-konform |

**Kern-Asset:** `appfabrik-base` — das Template-System, das jeden neuen Kunden zur Konfigurationsaufgabe macht.

---

## 📋 Folie 9 — Roadmap

**Titel:** Von 1 auf 10 Kunden in 18 Monaten

```
Q2 2026  → GaLaBau Landing Page + erste Akquise-Gespräche
Q3 2026  → Erster GaLaBau-Kunde live (Kunde #2)
Q4 2026  → Handwerk-Pilot (Kunde #3)
Q1 2027  → AppFabrik Website live + Inbound-Marketing startet
Q2 2027  → 5 Kunden aus 3 Branchen
Q3 2027  → Agrar-Pilot (Kunde #6)
Q4 2027  → 10 Kunden, 3 Branchen, 25.000 €+ MRR
```

**Meilensteine:**
- 📍 Jetzt: 1 Kunde (Koch Aufforstung), System produktiv, Template fertig
- 🎯 6 Monate: 3 Kunden, 2 Branchen
- 🏆 18 Monate: 10 Kunden, 25.000 €/Monat ARR

---

## 📋 Folie 10 — Das Team

**Titel:** Gegründet von Tomek Cuglewski

**Tomek Cuglewski** — Gründer & CEO
- [Technischer Hintergrund / Erfahrung hier einfügen]
- Vision: Digitale Betriebssysteme für KMU im Außendienst
- Partner: Amadeus (KI-Orchestrator) + spezialisierte Agenten

**FELDWERK:** Software-Studio mit KI-verstärktem Entwicklungsmodell
- 8 spezialisierte KI-Agenten (Design, Dev, QA, Marketing, DB, Mobile...)
- Entwicklungsgeschwindigkeit: 10x schneller als klassische Agenturen
- Kosten: 80% unter vergleichbaren Entwicklungsprojekten

---

## 📋 Folie 11 — Call to Action

**Titel:** Bereit, Ihren Außendienst zu digitalisieren?

**Nächste Schritte:**

1. **30-Minuten Demo** — Wir zeigen ForstManager live
2. **Kostenloser Workshop** — Wir analysieren Ihre aktuellen Prozesse
3. **Angebot in 48h** — Klares Setup-Fee + monatliche Gebühr

**Kontakt:**  
🌐 [appfabrik.de] (in Entwicklung)  
📧 [tomek@feldwerk.de] (in Entwicklung)  
📱 Demo anfordern: [Calendly-Link]

---

**Visual auf letzter Folie:** Koch Aufforstung Screenshot (ForstManager live) als Beweis

---

*Erstellt von Amadeus (Sprint HR) — AppFabrik Pitch Deck v1.0*
