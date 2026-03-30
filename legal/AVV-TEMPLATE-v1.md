# Auftragsverarbeitungsvertrag (AVV)
## gemäß Art. 28 DSGVO

**Version:** 1.0  
**Stand:** März 2026  
**Verantwortlicher (Auftraggeber):** [KUNDENNAME] — nachfolgend „Verantwortlicher"  
**Auftragsverarbeiter:** AppFabrik UG (haftungsbeschränkt) [in Gründung] — nachfolgend „Auftragsverarbeiter"

> ⚠️ **Template-Hinweis:** Dieses Dokument ist ein Muster-AVV. Vor Verwendung bitte rechtlich prüfen lassen. Platzhalter in [ECKIGEN KLAMMERN] sind vor Unterzeichnung auszufüllen.

---

## Präambel

Der Auftragsverarbeiter erbringt für den Verantwortlichen Leistungen (Software-as-a-Service), bei deren Durchführung der Auftragsverarbeiter auf personenbezogene Daten des Verantwortlichen zugreift oder zugreifen kann. Die Parteien schließen daher nachfolgenden Vertrag zur Regelung der datenschutzrechtlichen Anforderungen an die Auftragsverarbeitung gemäß Art. 28 DSGVO.

---

## § 1 Gegenstand und Dauer der Verarbeitung

(1) Gegenstand der Auftragsverarbeitung ist die Bereitstellung und der Betrieb der AppFabrik SaaS-Plattform im Rahmen des Hauptvertrages.

(2) Die Laufzeit dieses AVV entspricht der Laufzeit des zugrundeliegenden Hauptvertrages.

(3) Nach Beendigung des Hauptvertrages gelten die Regelungen zur Rückgabe und Löschung gemäß § 9 dieses Vertrages.

---

## § 2 Art und Zweck der Verarbeitung

### Art der Verarbeitung
Erhebung, Speicherung, Übermittlung, Veränderung, Abfrage, Verwendung, Verknüpfung, Bereitstellung, Löschung personenbezogener Daten.

### Zweck der Verarbeitung
Bereitstellung der SaaS-Software: Nutzerverwaltung, Betriebsdaten-Erfassung (Aufträge, Projekte, Protokolle), mobile Anwendung für Außendienstmitarbeiter.

---

## § 3 Kategorien betroffener Personen

- Mitarbeiter und Außendienstmitarbeiter des Verantwortlichen
- Kunden des Verantwortlichen (Endkunden des Unternehmens)
- Sonstige durch den Verantwortlichen eingebrachte natürliche Personen

---

## § 4 Kategorien personenbezogener Daten

| Datenkategorie | Beispiele |
|---------------|-----------|
| Identifikationsdaten | Name, Vorname, Personalnummer |
| Kontaktdaten | E-Mail, Telefon, Adresse |
| Standortdaten | GPS-Koordinaten bei Außendiensteinsätzen |
| Betriebliche Daten | Aufträge, Projekte, Fotos, Protokolle |
| Zugangsdaten | Benutzername (kein Klartext-Passwort) |
| Metadaten | Login-Zeiten, App-Nutzungsdaten |

Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) werden grundsätzlich **nicht** verarbeitet.

---

## § 5 Weisungsrecht des Verantwortlichen

(1) Der Auftragsverarbeiter verarbeitet personenbezogene Daten ausschließlich entsprechend den dokumentierten Weisungen des Verantwortlichen (Weisungsgebundenheit).

(2) Weisungen erfolgen in der Regel im Rahmen der vertraglich vereinbarten Leistungsbeschreibung. Weitere Weisungen erteilt der Verantwortliche in Textform.

(3) Ist der Auftragsverarbeiter der Ansicht, dass eine Weisung gegen die DSGVO oder andere EU- bzw. mitgliedstaatliche Datenschutzvorschriften verstößt, informiert er den Verantwortlichen unverzüglich. Der Auftragsverarbeiter ist berechtigt, die Durchführung der betreffenden Weisung so lange auszusetzen, bis der Verantwortliche diese bestätigt oder geändert hat.

(4) Soweit der Auftragsverarbeiter nach EU-Recht oder dem Recht eines Mitgliedstaats zur Verarbeitung verpflichtet ist, teilt er dem Verantwortlichen diese Anforderungen vor der Verarbeitung mit.

---

## § 6 Technische und organisatorische Maßnahmen (TOM)

Der Auftragsverarbeiter hat gemäß Art. 32 DSGVO die folgenden technischen und organisatorischen Maßnahmen implementiert:

### Vertraulichkeit
| Maßnahme | Umsetzung |
|----------|-----------|
| Zutrittskontrolle | Physischer Serverzugang nur für autorisiertes Rechenzentrum-Personal |
| Zugangskontrolle | Passwortrichtlinie, MFA für Admin-Zugänge |
| Zugriffskontrolle | Rollenbasiertes Zugriffsmanagement (RBAC) |
| Trennungskontrolle | Datenisolation per Tenant (Row-Level Security in PostgreSQL) |

### Integrität
| Maßnahme | Umsetzung |
|----------|-----------|
| Weitergabekontrolle | TLS 1.3 Verschlüsselung in Transit |
| Eingabekontrolle | Audit-Log für kritische Datenoperationen |

### Verfügbarkeit & Belastbarkeit
| Maßnahme | Umsetzung |
|----------|-----------|
| Verfügbarkeitskontrolle | Tägliche automatisierte Backups, Redundanz bei Cloud-Hoster |
| Wiederherstellbarkeit | Backup-Restore-Tests vierteljährlich |
| Disaster Recovery | Recovery Time Objective (RTO): 24h, RPO: 24h |

### Verfahren zur regelmäßigen Überprüfung
| Maßnahme | Umsetzung |
|----------|-----------|
| Auftragskontrolle | Schriftliche AVV-Vereinbarung mit Subprozessoren |
| Sicherheitsreview | Jährliches Security Audit |
| Dependency Updates | Automatisiertes Monitoring mit Dependabot |

---

## § 7 Subauftragsverarbeiter

(1) Der Auftragsverarbeiter ist berechtigt, Subauftragsverarbeiter einzusetzen.

(2) Folgende Subauftragsverarbeiter werden zum Zeitpunkt des Vertragsschlusses eingesetzt:

| Subprozessor | Leistung | Sitz | Datenschutzbasis |
|-------------|---------|------|-----------------|
| Vercel Inc. | Hosting & CDN (Web) | USA (SCCs) | EU-US Data Privacy Framework |
| Neon Inc. | PostgreSQL Datenbank | USA (SCCs) | EU-US Data Privacy Framework |
| Expo (Expo Inc.) | Mobile Build Pipeline | USA (SCCs) | EU-US Data Privacy Framework |
| [ggf. weitere] | [Leistung] | [Sitz] | [Basis] |

(3) Der Auftragsverarbeiter informiert den Verantwortlichen über beabsichtigte Änderungen der Subauftragsverarbeiter mit einer Vorankündigung von mindestens 4 Wochen. Der Verantwortliche kann gegen die Änderung begründeten Einspruch erheben.

(4) Der Auftragsverarbeiter schließt mit allen Subauftragsverarbeitern Verträge ab, die datenschutzrechtlich mindestens das Niveau dieses AVV erreichen.

---

## § 8 Rechte der betroffenen Personen

(1) Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der Erfüllung seiner Pflichten gegenüber Betroffenen nach Kapitel III DSGVO (Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch).

(2) Der Auftragsverarbeiter leitet Anfragen betroffener Personen, die direkt an ihn gerichtet werden, unverzüglich an den Verantwortlichen weiter.

(3) Auf Anfrage des Verantwortlichen stellt der Auftragsverarbeiter alle zur Erfüllung der Anforderungen notwendigen Informationen bereit.

---

## § 9 Meldepflichten bei Datenpannen

(1) Der Auftragsverarbeiter meldet dem Verantwortlichen Verletzungen des Schutzes personenbezogener Daten (Art. 33 DSGVO) unverzüglich, spätestens innerhalb von 24 Stunden nach Bekanntwerden.

(2) Die Meldung enthält mindestens:
- Beschreibung der Art der Verletzung
- Kategorien und Anzahl der betroffenen Personen und Datensätze
- Kontaktdaten des zuständigen Ansprechpartners
- Beschreibung der wahrscheinlichen Folgen
- Beschreibung der ergriffenen Maßnahmen

(3) Eine nicht vollständige Meldung kann in mehreren Teilen erfolgen, sofern die fehlenden Informationen schnellstmöglich nachgereicht werden.

---

## § 10 Datenlöschung und Rückgabe

(1) Nach Beendigung des Hauptvertrages stellt der Auftragsverarbeiter dem Verantwortlichen auf Anfrage alle gespeicherten Daten in einem gängigen Format (JSON oder CSV) zur Verfügung.

(2) Die Bereitstellung erfolgt innerhalb von 30 Tagen nach Vertragsbeendigung.

(3) Nach der Übergabe (oder ohne Anfrage 60 Tage nach Vertragsbeendigung) löscht der Auftragsverarbeiter alle personenbezogenen Daten des Verantwortlichen unwiderruflich.

(4) Der Auftragsverarbeiter bestätigt die Löschung auf Anfrage schriftlich.

(5) Ausgenommen von der Löschpflicht sind Daten, deren Aufbewahrung durch EU-Recht oder nationales Recht vorgeschrieben ist.

---

## § 11 Nachweis und Kontrollrechte

(1) Der Auftragsverarbeiter stellt dem Verantwortlichen alle zur Einhaltung der Pflichten aus Art. 28 DSGVO erforderlichen Informationen zur Verfügung.

(2) Der Verantwortliche ist berechtigt, Inspektionen und Audits beim Auftragsverarbeiter durchzuführen oder durch einen Dritten durchführen zu lassen. Ankündigungsfrist: mindestens 4 Wochen.

(3) Audits dürfen den laufenden Betrieb des Auftragsverarbeiters nicht unverhältnismäßig beeinträchtigen.

(4) Der Auftragsverarbeiter kann als gleichwertigen Nachweis anerkannte Zertifizierungen (ISO 27001, SOC 2) vorlegen.

---

## § 12 Vergütung

Die durch diesen AVV entstehenden Aufwände sind mit der Hauptvergütung abgegolten, sofern nicht durch den Verantwortlichen veranlasste Sondermaßnahmen (z.B. individuelle Löschaktionen auf ausdrückliche Anweisung) entstehen. Für letztere kann der Auftragsverarbeiter angemessene Mehraufwände in Rechnung stellen.

---

## § 13 Schlussbestimmungen

(1) Für diesen Vertrag gilt das Recht der Bundesrepublik Deutschland.

(2) Soweit Regelungen dieses AVV nicht der DSGVO entsprechen, gehen die Regelungen der DSGVO vor.

(3) Im Übrigen gelten die AGB des Hauptvertrages ergänzend.

(4) Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.

---

## Unterzeichnung

**Ort, Datum:** ____________________________

**Verantwortlicher (Auftraggeber):**  
Unternehmen: ___________________________  
Name: ___________________________  
Funktion: ___________________________  
Unterschrift: ___________________________  

**Auftragsverarbeiter (AppFabrik):**  
Unternehmen: AppFabrik UG (haftungsbeschränkt)  
Name: ___________________________  
Funktion: ___________________________  
Unterschrift: ___________________________  

---

## Anlage 1: Aktuelle Subauftragsverarbeiter

Aktualisiert: März 2026

| Unternehmen | Leistung | Sitz | Übermittlungsgrundlage |
|------------|---------|------|----------------------|
| Vercel Inc. | Web-Hosting, Edge-CDN | San Francisco, USA | EU-US DPF + SCCs |
| Neon Inc. | PostgreSQL Datenbank | USA | EU-US DPF + SCCs |
| Expo Inc. | Mobile Build & Distribution | USA | EU-US DPF + SCCs |

---

*AppFabrik UG (haftungsbeschränkt) [in Gründung]*  
*Template v1.0 — Rechtliche Prüfung erforderlich vor Nutzung*
