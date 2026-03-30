# Service Level Agreement (SLA)
## AppFabrik — Software-as-a-Service

**Version:** 1.0  
**Datum:** 30.03.2026  
**Anbieter:** FELDWERK UG (haftungsbeschränkt) *(in Gründung)*  
**Gültig für:** Alle AppFabrik Tenants ab Vertragsschluss

---

## 1. Gegenstand

Dieses Service Level Agreement (SLA) definiert die Qualitäts- und Verfügbarkeitszusagen von FELDWERK UG (nachfolgend "Anbieter") gegenüber dem Auftraggeber (nachfolgend "Kunde") für die Nutzung der AppFabrik SaaS-Plattform.

---

## 2. Verfügbarkeit (Uptime)

### 2.1 Verfügbarkeitszusage

| Plan | Zugesicherte Verfügbarkeit | Wartungsfenster |
|------|---------------------------|-----------------|
| Starter | 99,0 % pro Monat | Sa 02:00–06:00 Uhr |
| Professional | 99,5 % pro Monat | Sa 02:00–04:00 Uhr |
| Enterprise | 99,9 % pro Monat | Nach Absprache |

### 2.2 Berechnung

> **Verfügbarkeit (%)** = (Gesamtminuten − ungeplante Ausfallminuten) / Gesamtminuten × 100

Geplante Wartungsfenster werden **nicht** als Ausfall gewertet, sofern sie mindestens **48 Stunden** vorher angekündigt werden.

### 2.3 Ausnahmen

Folgende Ereignisse zählen nicht zur Verfügbarkeitsberechnung:
- Force Majeure (Naturkatastrophen, Stromausfall, Cyberangriffe)
- Ausfälle durch fehlerhafte Kunden-Konfiguration
- Geplante und angekündigte Wartungen
- Ausfälle bei Drittanbietern (Vercel, Neon DB, Cloudflare) außerhalb des Einflussbereichs

---

## 3. Reaktionszeiten (Incident Response)

### 3.1 Schweregrad-Definition

| Schweregrad | Definition | Beispiele |
|-------------|------------|-----------|
| P1 — Kritisch | System komplett nicht verfügbar | Login unmöglich, alle Daten nicht zugänglich |
| P2 — Hoch | Hauptfunktion ausgefallen | Aufträge nicht ladbar, App abstürzt |
| P3 — Mittel | Teilfunktion eingeschränkt | Export fehlerhaft, Benachrichtigungen verzögert |
| P4 — Niedrig | Schönheitsfehler, Wunsch | UI-Fehler, neue Feature-Anfrage |

### 3.2 Reaktions- und Lösungszeiten

| Schweregrad | Erstreaktion | Statusupdate | Angestrebte Lösung |
|-------------|-------------|--------------|-------------------|
| P1 Kritisch | 1 Stunde | alle 2 Stunden | 4 Stunden |
| P2 Hoch | 4 Stunden | alle 8 Stunden | 24 Stunden |
| P3 Mittel | 1 Werktag | 2× pro Woche | 5 Werktage |
| P4 Niedrig | 3 Werktage | 1× pro Woche | Nach Sprint-Planung |

*Servicezeiten: Mo–Fr 08:00–18:00 Uhr (CET/CEST), außer gesetzliche Feiertage Baden-Württemberg*

---

## 4. Support-Kanäle

| Plan | Kanal | Verfügbarkeit |
|------|-------|---------------|
| Starter | E-Mail | Mo–Fr 09:00–17:00 |
| Professional | E-Mail + Telegram | Mo–Fr 08:00–18:00 |
| Enterprise | E-Mail + Telegram + Telefon | Mo–Fr 08:00–20:00 |

**Support-Kontakt:**
- E-Mail: support@appfabrik.de *(in Einrichtung)*
- Telegram: @appfabrik_support *(geplant)*

---

## 5. Datensicherung (Backup)

### 5.1 Backup-Frequenz

| Typ | Frequenz | Aufbewahrung |
|-----|----------|--------------|
| Datenbank (täglich) | 1× täglich, 02:00 Uhr | 30 Tage |
| Datenbank (stündlich) | 1× stündlich | 7 Tage |
| Datei-Uploads | Täglich | 30 Tage |
| Vollbackup (wöchentlich) | Sonntag 03:00 Uhr | 12 Wochen |

### 5.2 Wiederherstellung

| Szenario | Angestrebte Wiederherstellungszeit (RTO) |
|----------|-----------------------------------------|
| Einzelne Datensätze | 2 Stunden |
| Vollständige Datenbankwiederherstellung | 4 Stunden |
| Komplettes System (DR) | 8 Stunden |

*Recovery Point Objective (RPO): maximal 1 Stunde Datenverlust*

---

## 6. Datenschutz & Datensicherheit

- **Hosting:** Vercel (EU-Region Frankfurt) + Neon DB (EU-Region Frankfurt)
- **Verschlüsselung:** TLS 1.3 in Transit, AES-256 at Rest
- **DSGVO:** Auftragsverarbeitungsvertrag (AVV) wird separat geschlossen
- **Datenspeicherung:** Ausschließlich in der EU
- **Zugriffskontrolle:** Role-Based Access Control (RBAC) nach Prinzip der minimalen Rechte

---

## 7. Geplante Wartungen

- Ankündigung mindestens **48 Stunden** im Voraus per E-Mail
- Wartungsfenster: Samstag 02:00–06:00 Uhr (außer P1-Notfallwartungen)
- Notfallwartungen: Ankündigung so früh wie möglich, Benachrichtigung während Durchführung

---

## 8. SLA-Gutschriften

Bei Unterschreitung der zugesagten Verfügbarkeit erhält der Kunde folgende Gutschriften:

| Verfügbarkeit (Professional) | Gutschrift |
|-----------------------------|------------|
| 99,0 % – 99,49 % | 5 % der Monatsgebühr |
| 98,0 % – 98,99 % | 10 % der Monatsgebühr |
| 95,0 % – 97,99 % | 25 % der Monatsgebühr |
| < 95,0 % | 50 % der Monatsgebühr |

**Maximale Gutschrift:** 50 % der monatlichen Gebühr  
**Geltendmachung:** Innerhalb von 30 Tagen nach Monatsendeende per E-Mail

---

## 9. Ausschlüsse

Dieser SLA gilt **nicht** für:
- Ausfälle durch Fehlbedienung oder fehlerhafte Konfiguration durch den Kunden
- Ausfälle durch Drittanbieter-APIs (externe Dienste)
- Beta- oder Testfunktionen (als solche gekennzeichnet)
- Ausfälle während vereinbarter Migrationsphasen

---

## 10. Änderungen am SLA

- Änderungen werden mindestens **30 Tage** vorher per E-Mail angekündigt
- Wesentliche Verschlechterungen berechtigen den Kunden zur außerordentlichen Kündigung
- Aktuelle SLA-Version immer auf: https://appfabrik.de/sla

---

## 11. Kontakt & Eskalation

| Ebene | Kontakt | Erreichbarkeit |
|-------|---------|----------------|
| 1. Support | support@appfabrik.de | Mo–Fr 09:00–17:00 |
| 2. Projektleiter | tomek@appfabrik.de | Mo–Fr 08:00–18:00 |
| 3. Geschäftsführung | gf@appfabrik.de | Nur P1 |

---

## 12. Gültigkeit

Dieses SLA ist Bestandteil des Softwarenutzungsvertrags zwischen FELDWERK UG und dem Kunden. Es gilt ab dem im Vertrag genannten Vertragsbeginn.

---

*Stand: 30.03.2026 — Version 1.0*  
*⚠️ Vorlage — vor Verwendung rechtlich prüfen lassen (Tomek)*
