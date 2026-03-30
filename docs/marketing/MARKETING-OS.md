# MarketingOS — Feldhub Marketing Betriebssystem
## Konzept + Produktstrategie

> Sprint JA | 30.03.2026
> Version: 1.0

---

## Was ist MarketingOS?

**MarketingOS** ist Feldhubs internes System, das alle Marketing-Aktivitäten automatisiert, trackt und orchestriert. Es verbindet Content-Produktion, Lead-Erfassung, CRM und Analytics zu einem einheitlichen Prozess — gesteuert von KI-Agenten.

**Kernprinzip:** Marketing wie Software — reproduzierbar, messbar, skalierbar.

---

## Architektur (3 Ebenen)

```
┌─────────────────────────────────────────────────────┐
│               AWARENESS (Top of Funnel)              │
│  LinkedIn · Blog · SEO · Perplexity Research-Cron   │
└────────────────────────┬────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│             CONSIDERATION (Middle of Funnel)         │
│     Demo-Anfrage · ROI-Rechner · Case Studies       │
└────────────────────────┬────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│               CONVERSION (Bottom of Funnel)          │
│    Demo-Call → Angebot → Pilot → Kunde → Upsell    │
└─────────────────────────────────────────────────────┘
```

---

## MarketingOS Komponenten

### 1. 📡 Magnet-Agent (Lead Generation Monitoring)
- **Aufgabe:** Überwacht Branchenforen, LinkedIn, Google Alerts für Signale
- **Trigger:** Jemand sucht nach "Außendienst Software", "Forstbetrieb digitalisieren"
- **Output:** Lead-Karte in Mission Control Sales Pipeline
- **Status:** 🔴 Geplant (JY)

### 2. ✍️ Content-Agent (Quill)
- **Aufgabe:** Erstellt wöchentlich LinkedIn-Posts, Blog-Artikel, Email-Newsletter
- **Input:** Branchennews (von Research-Cron JC), aktueller Fokus-Thema
- **Output:** Fertige Entwürfe → Tomek reviewed → publiziert
- **Status:** 🟡 Teils aktiv (LinkedIn-Plan IZ)

### 3. 📊 Analytics-Agent
- **Aufgabe:** Wertet Plausible + LinkedIn Analytics aus
- **Trigger:** Jeden Montag 09:00
- **Output:** Weekly Marketing Report in Mission Control
- **Status:** 🟡 Geplant (nach IY Plausible-Setup)

### 4. 🔍 Research-Cron (Sylvia-like)
- **Aufgabe:** Sammelt Branchennews und Wettbewerber-Updates wöchentlich
- **Tool:** Perplexity Sonar Pro
- **Output:** research/YYYY-WW.md im feldhub-base Repo
- **Status:** 🟡 Sprint JC

### 5. 📧 Email-Automation (Ersttermin-Workflow)
- **Aufgabe:** Lead füllt Formular aus → automatische Bestätigung → Erinnerung → Follow-up
- **Tool:** Calendly + Mailchimp/Resend
- **Output:** Gebuchter Demo-Call
- **Status:** 🔴 Geplant (JK)

### 6. 💰 ROI-Rechner
- **Aufgabe:** Interaktiver Rechner auf feldhub.io Website
- **Input:** Mitarbeiterzahl, Stundenlohn, Papierprozess-Stunden/Woche
- **Output:** "Feldhub spart euch €X pro Monat" + CTA Demo buchen
- **Status:** 🔴 Geplant (JH)

---

## Marketing Funnel (Detailliert)

### Phase 1: Awareness
```
Touchpoints:
├── LinkedIn Posts (3x/Woche) ← IZ
├── SEO Blog (2x/Monat) ← IV, IW
├── Case Studies (Koch Aufforstung) ← ID, IE
├── Perplexity Research → Content-Ideen ← JC
└── Branchenverbände-Events ← JI

Metriken:
- Impressions, Follower-Growth, Organic Traffic
```

### Phase 2: Consideration
```
Touchpoints:
├── Demo-Anfrage CTA auf Website + LinkedIn
├── ROI-Rechner ← JH
├── Angebots-Template PDF ← JG
├── FAQ / Knowledge Base ← JM
└── Case Study Downloads

Metriken:
- Demo-Anfragen/Woche, Time-on-Site, Scroll-Depth
```

### Phase 3: Conversion
```
Touchpoints:
├── Demo-Call (30 min via Calendly) ← JK
├── Angebotserstellung (Vorlage ← JG)
├── Pilotbetrieb-Angebot (50% Setup-Rabatt)
└── Onboarding-Start

Metriken:
- Demo → Pilot Conversion Rate (Ziel: 30%)
- Pilot → Zahlendes-Kunden Rate (Ziel: 70%)
- CAC, LTV/CAC
```

### Phase 4: Retention + Upsell
```
Touchpoints:
├── Monatlicher Kunden-Report ← JO
├── Upselling-Trigger ← JP
├── Quarterly Business Review
└── Feature-Release Notes

Metriken:
- Churn Rate (Ziel: <5%/Jahr)
- NPS (Ziel: >50)
- Upsell Revenue
```

---

## Kanäle + Priorisierung

| Kanal | Priorität | Status | Ziel |
|-------|-----------|--------|------|
| LinkedIn (Tomek) | 🔴 Hoch | 🟡 In Planung | Thought Leadership |
| Feldhub Website | 🔴 Hoch | 🟢 Gebaut | SEO + Demo-CTA |
| Blog (WordPress/Next.js) | 🟡 Mittel | 🟡 2 Posts live | Organischer Traffic |
| Email Newsletter | 🟡 Mittel | 🔴 Nicht gestartet | Nurturing |
| Kalt-Akquise (Branchenverbände) | 🟡 Mittel | 🔴 Nicht gestartet | Direct Sales |
| Messen/Events | 🟢 Lang | 🔴 Nicht gestartet | Brand + Networking |
| Paid Ads (LinkedIn/Google) | 🟢 Lang | 🔴 Nicht gestartet | Skalierung |

---

## Marketing-Kalender 2026

| Monat | Fokus | Key Action |
|-------|-------|-----------|
| April | Awareness-Start | LinkedIn Day-1, Website live |
| Mai | Lead Gen | ROI-Rechner, 1. Demo-Calls |
| Juni | Pilot-Akquise | 2-3 Pilotbetriebe gewinnen |
| Juli | Case Studies | Koch Aufforstung + Pilot-Ergebnisse |
| Aug | Product Hunt? | Feldhub Launch (wenn Produkt reif) |
| Sep | Messe-Saison | Agritechnica/GaLaBau Networking |
| Okt | Q4-Push | Jahres-Abschlüsse nutzen |
| Nov | Rückblick | Learnings + 2027 Planung |
| Dez | Warm-Up | Nurturing bestehender Leads |

---

## Budget-Schätzung (Monatlich)

| Posten | Kosten/Monat | Notizen |
|--------|-------------|---------|
| Plausible Analytics | €19 | Growth Plan |
| Calendly Pro | €10 | Demo-Buchungen |
| Mailchimp/Resend | €0–15 | bis 1.000 Kontakte kostenlos |
| Canva Pro | €13 | LinkedIn-Grafiken |
| Buffer/Hootsuite | €15 | Social Scheduling |
| **Gesamt** | **~€57/Mo** | Sehr günstig für Marketing-Stack |

Paid Ads Budget: erst bei Monat 6+ (wenn Conversion-Funnel validiert)

---

## KPIs Dashboard (Mission Control Integration)

```typescript
// mc-api: POST /api/metrics/marketing
interface MarketingMetrics {
  week: string; // ISO week "2026-W14"
  linkedin: {
    followers: number;
    impressions: number;
    engagementRate: number;
    demoRequests: number;
  };
  website: {
    visitors: number;
    pageviews: number;
    bounceRate: number;
    demoClicks: number;
  };
  funnel: {
    leads: number;
    demos_booked: number;
    demos_done: number;
    proposals_sent: number;
    pilots_active: number;
    customers: number;
  };
}
```

---

## Nächste Schritte (Priorisiert)

1. **Sofort (April 2026)**
   - [ ] LinkedIn Company Page anlegen (JJ) — Tomek
   - [ ] Tomek LinkedIn Profil optimieren — Tomek
   - [ ] Ersten LinkedIn Post publizieren (01.04.2026)
   - [ ] Plausible Analytics Account erstellen (Tomek)

2. **Mai 2026**
   - [ ] ROI-Rechner bauen (JH)
   - [ ] Calendly einrichten + ersten Demo-Calls führen (JK)
   - [ ] Email-Newsletter starten (1x/Monat)

3. **Juni 2026**
   - [ ] Branchenverbände kontaktieren (JI)
   - [ ] 2-3 Pilotbetriebe gewinnen
   - [ ] Angebots-Template PDF fertigstellen (JG)
