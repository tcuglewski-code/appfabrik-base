# Feature-Prioritäts-Framework — Feldhub ICE Scoring

> Sprint JF | Stand: März 2026

## Überblick

Das ICE-Score-Framework (Impact · Confidence · Ease) ist Feldhubs Standard-Methode zur Priorisierung von Features, Tasks und Projekten. Jeder Sprint-Loop, jedes Agenten-Team und jedes Kunden-Projekt nutzt dieses Framework.

---

## 1. ICE Score Formel

```
ICE Score = Impact × Confidence × Ease
            ────────────────────────────
                    10 (normiert)

Score Range: 0 – 100
```

### Bewertungs-Kriterien

#### Impact (1–10) — Wie groß ist der Nutzen?

| Score | Bedeutung |
|-------|-----------|
| 9–10 | Kern-Feature: Ohne das ist das Produkt unvollständig / Kunden-Churn-Risiko |
| 7–8 | Großer Mehrwert: Direkter Einfluss auf Umsatz / Kundenzufriedenheit |
| 5–6 | Mittlerer Mehrwert: Nützlich, aber kein Deal-Breaker |
| 3–4 | Kleiner Mehrwert: Nice-to-have, kaum Kundenanfragen |
| 1–2 | Marginaler Nutzen: Nur ein Nutzer hat das je erwähnt |

#### Confidence (1–10) — Wie sicher sind wir?

| Score | Bedeutung |
|-------|-----------|
| 9–10 | Proven: A/B-Test oder Kunden-Feedback validiert |
| 7–8 | Strong Signal: Mehrere Kunden haben explizit gefragt |
| 5–6 | Hypothesis: Wir vermuten starken Nutzen |
| 3–4 | Weak Signal: Nur interne Annahme |
| 1–2 | Reine Spekulation: Keine Validierung |

#### Ease (1–10) — Wie einfach umsetzbar?

| Score | Bedeutung |
|-------|-----------|
| 9–10 | Trivial: < 2h, eine Datei, fertige Libraries |
| 7–8 | Einfach: < 1 Tag, klare Anforderungen |
| 5–6 | Mittel: 1–3 Tage, einige Abhängigkeiten |
| 3–4 | Komplex: 1–2 Wochen, mehrere Systeme betroffen |
| 1–2 | Sehr komplex: > 2 Wochen, hohe technische Schulden / Risiko |

---

## 2. Score-Interpretation

| ICE Score | Priorität | Empfehlung |
|-----------|-----------|------------|
| 70–100 | 🔴 CRITICAL | Sofort in nächsten Sprint |
| 50–69 | 🟠 HIGH | Nächste 2 Wochen |
| 30–49 | 🟡 MEDIUM | Nächsten Monat |
| 15–29 | 🟢 LOW | Backlog, wenn Kapazität |
| < 15 | ⚪ DEFER | Nicht jetzt — archivieren |

---

## 3. Feldhub Feature-Backlog mit ICE-Scores

### Aktuelle Bewertungen (März 2026)

| Feature | Bereich | Impact | Conf. | Ease | ICE | Prio |
|---------|---------|--------|-------|------|-----|------|
| ROI-Rechner Website | Sales | 9 | 8 | 7 | 50.4 | 🟠 HIGH |
| MC LLM Cost Dashboard | OPS | 7 | 9 | 6 | 37.8 | 🟡 MEDIUM |
| Angebots-PDF Template | Sales | 8 | 7 | 8 | 44.8 | 🟡 MEDIUM |
| FAQ / Knowledge Base | CS | 7 | 8 | 6 | 33.6 | 🟡 MEDIUM |
| Kalender-Integration App | Prod | 8 | 6 | 4 | 19.2 | 🟢 LOW |
| Offline GPS-Tracking | App | 9 | 8 | 3 | 21.6 | 🟢 LOW |
| Dark/Light Theme | Base | 4 | 7 | 7 | 19.6 | 🟢 LOW |
| WhatsApp Notifications | App | 6 | 5 | 5 | 15.0 | 🟢 LOW |
| Multi-Language Support | Base | 5 | 4 | 3 | 6.0 | ⚪ DEFER |

---

## 4. Scoring-Prozess (für neue Features)

### Schritt 1: Feature Card ausfüllen

```markdown
## Feature: [Name]

**Problem Statement:**
[Welches Problem löst es? Für wen?]

**Proposed Solution:**
[1-3 Sätze Beschreibung]

**User Story:**
Als [Rolle] möchte ich [Funktion], damit [Nutzen].

**Impact Score:** /10
Begründung: [...]

**Confidence Score:** /10
Begründung: [Validierung vorhanden? Woher?]

**Ease Score:** /10
Begründung: [Geschätzte Tage, betroffene Systeme]

**ICE Score:** [Impact × Confidence × Ease / 10]
**Empfehlung:** CRITICAL / HIGH / MEDIUM / LOW / DEFER
```

### Schritt 2: Review

- Amadeus prüft Impact- und Confidence-Score
- Volt/Bruno/Nomad schätzen Ease-Score
- Bei Konflikt > 2 Punkte Differenz: Kurzes Sync-Meeting

### Schritt 3: Sprint-Aufnahme

- ICE ≥ 50: Automatisch in nächsten Sprint-Loop
- ICE 30-49: Wöchentliche Queue-Priorisierung
- ICE < 30: Backlog mit Revisit-Datum

---

## 5. Spezial-Regeln für Feldhub

### "Kunden-Veto" Regel
Wenn ein Bestandskunde (Koch Aufforstung oder zukünftige Tenants) ein Feature explizit anfragt → **Impact minimum 7**, **Confidence minimum 8** (unabhängig vom ICE Score).

### "Foundation First" Regel
Features die feldhub-base betreffen und anderen Kunden zugute kommen → **Ease +2 Bonus** (amortisiert über mehrere Kunden).

### "Security Override" Regel
Sicherheits-relevante Bugs/Features haben **automatisch ICE = 100** unabhängig von anderen Faktoren.

### "Debt Penalty" Regel
Features die technische Schulden einführen → **Ease -3 Malus**.

---

## 6. Monatlicher Review-Prozess

```
1. Woche des Monats: Score-Review aller Items im Backlog
├── Veraltete Items (> 3 Monate) neu bewerten oder archivieren
├── Neue Kunden-Anfragen eintragen + bewerten
└── Abgeschlossene Items aus Backlog entfernen

Output: Aktualisierter Backlog in Mission Control + LOOP-STATE.md
```

---

## 7. Integration mit Mission Control

```typescript
// MC Task Schema Erweiterung
interface MCTask {
  id: string;
  title: string;
  description: string;
  
  // ICE Scoring
  iceImpact: number;       // 1-10
  iceConfidence: number;   // 1-10
  iceEase: number;         // 1-10
  iceScore: number;        // Berechnet: I×C×E/10
  icePriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'DEFER';
  
  // Feldhub Spezial-Flags
  customerRequest?: string;   // Kunden-ID
  affectsBase: boolean;       // Betrifft feldhub-base?
  securityRelevant: boolean;  // Security-Override?
  
  // Standard MC Felder
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  sprintCode?: string;
  assignedAgent?: string;
}
```

---

## 8. CSV Export für Sprint-Planung

Die Datei `docs/feature-backlog.csv` enthält alle priorisierten Features als maschinenlesbare Liste:

```csv
feature,area,impact,confidence,ease,ice_score,priority,sprint_code,status
ROI-Rechner Website,sales,9,8,7,50.4,HIGH,JH,todo
MC LLM Cost Dashboard,ops,7,9,6,37.8,MEDIUM,JD,done
Angebots-PDF Template,sales,8,7,8,44.8,MEDIUM,JG,todo
FAQ Knowledge Base,cs,7,8,6,33.6,MEDIUM,JM,todo
```
