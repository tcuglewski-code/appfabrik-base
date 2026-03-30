# Voice-Onboarding-Assistent — Architektur-Konzept

> Version 1.0 | März 2026

## Executive Summary

Der Voice-Onboarding-Assistent ist eine **vollständig isolierte Claude-Instanz**, die neue Feldhub-Kunden durch ein strukturiertes Kickoff-Gespräch führt. Der Output ist eine priorisierte Task-Liste, die automatisch in Mission Control erstellt wird.

## Kernprinzipien

### 1. Vollständige Isolation

Die Claude-Instanz hat:

- ❌ **Kein internes Wissen** über Feldhub-Systeme, Datenbanken, APIs
- ❌ **Keinen Tool-Zugriff** (keine Datenbankabfragen, keine API-Calls)
- ❌ **Keine Erinnerung** an andere Kunden oder Sessions
- ✅ **Nur** den strukturierten Gesprächsleitfaden als System-Prompt

### 2. Deterministische Outputs

Das Gespräch folgt einem festgelegten Schema:

```
Input:  Kundenantworten (Text/Sprache)
Output: Strukturiertes JSON nach output-schema.ts
```

### 3. Menschliche Validierung

Der generierte Task-Plan wird **niemals direkt** ausgeführt:

1. Assistent erstellt Vorschlag
2. Feldhub-Team prüft und passt an
3. Erst dann: Import in Mission Control

---

## Architektur

```
┌────────────────────────────────────────────────────────────────┐
│                         Kunde                                  │
│                  (Browser/Telefon)                             │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       │ Phase 1: Text (Chat)
                       │ Phase 2: Voice (Vapi/ElevenLabs)
                       ▼
┌────────────────────────────────────────────────────────────────┐
│              Vapi Voice Agent (optional)                       │
│                                                                │
│  • Speech-to-Text (Whisper/Deepgram)                          │
│  • Text-to-Speech (ElevenLabs)                                │
│  • Real-time Audio Streaming                                   │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────┐
│           Feldhub Onboarding API Gateway                       │
│                                                                │
│  • Session Management                                          │
│  • Rate Limiting                                               │
│  • Transcript Logging                                          │
│  • Schema Validation                                           │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────┐
│        Isolierte Claude-Instanz (Anthropic API)                │
│                                                                │
│  System Prompt:                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  conversation-guide.md                                    │  │
│  │  (Strukturierter Gesprächsleitfaden)                     │  │
│  │                                                           │  │
│  │  KEINE Tools, KEINE Datenbankverbindung,                 │  │
│  │  KEIN internes Feldhub-Wissen                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  Output: Strukturiertes JSON (output-schema.ts)                │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────┐
│               Menschliche Validierung                          │
│                                                                │
│  • Feldhub-Team prüft generierten Plan                        │
│  • Anpassungen/Korrekturen                                     │
│  • Freigabe                                                    │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────┐
│               Mission Control Import                           │
│                                                                │
│  POST /api/tasks (bulk)                                        │
│  • Priorisierte Task-Liste                                     │
│  • Projekt-Template erstellen                                  │
│  • Milestones setzen                                           │
└────────────────────────────────────────────────────────────────┘
```

---

## Komponenten

### 1. Onboarding API Gateway

**Endpoint:** `POST /api/onboarding/session`

**Funktionen:**

- Session erstellen/fortsetzen
- Nachricht an Claude weiterleiten
- Transcript speichern (DSGVO-konform)
- Output-Schema validieren
- Rate Limiting (max. 100 Nachrichten/Session)

**Technologie:** Next.js API Route + Anthropic SDK

### 2. Isolierte Claude-Instanz

**Konfiguration:**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  system: CONVERSATION_GUIDE, // Nur der Gesprächsleitfaden
  messages: sessionMessages,
  // KEINE Tools!
})
```

**Warum Sonnet?**
- Schnelle Antwortzeiten für Echtzeit-Gespräch
- Ausreichend für strukturierte Interviews
- Kosteneffizient für längere Sessions

### 3. Vapi Voice Integration (Phase 2)

**Warum Vapi?**
- Managed Voice AI Plattform
- Integriert Whisper + ElevenLabs
- WebSocket Streaming
- Latenz < 500ms

**Alternative:** Build-it-yourself mit ElevenLabs Conversational AI

### 4. ElevenLabs TTS

**Voice ID:** Professionell, freundlich, deutsch
- Empfehlung: "Rachel" oder Custom Voice Clone
- Stabilität: 0.5 | Similarity: 0.75

---

## Security & Privacy

### DSGVO-Compliance

| Aspekt | Maßnahme |
|--------|----------|
| Einwilligung | Explizite Zustimmung vor Session-Start |
| Datensparsamkeit | Nur notwendige Daten erfassen |
| Speicherdauer | Transcripts nach 30 Tagen löschen |
| Auskunftsrecht | Export-Funktion für Kunden |
| Löschrecht | Sofortige Löschung auf Anfrage |

### Keine Datenlecks

Die Claude-Instanz:
- Erhält **keine** Kundendaten anderer Tenants
- Hat **keinen** Zugriff auf Feldhub-Systeme
- Speichert **nichts** zwischen Sessions

### API Security

```typescript
// Session-spezifischer Token
const sessionToken = generateSecureToken()

// Validierung bei jedem Request
if (!validateSessionToken(token)) {
  throw new UnauthorizedError()
}
```

---

## Cost Estimation

### Phase 1 (Text-Only)

| Komponente | Kosten/Session (30 min) |
|------------|------------------------|
| Claude Sonnet | ~$0.50 (10k tokens) |
| API Gateway | ~$0.01 |
| **Gesamt** | **~$0.51** |

### Phase 2 (Voice)

| Komponente | Kosten/Session (30 min) |
|------------|------------------------|
| Vapi | ~$0.15/min = $4.50 |
| ElevenLabs | ~$0.30/min = $9.00 |
| Claude Sonnet | ~$0.50 |
| **Gesamt** | **~$14.00** |

**ROI:** Bei Setup-Fee von €500+ ist der Onboarding-Assistent wirtschaftlich sinnvoll ab 35+ Kunden/Jahr.

---

## Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Claude halluziniert Anforderungen | Mittel | Hoch | Menschliche Validierung vor Import |
| Missverständnisse bei Sprache | Mittel | Mittel | Zusammenfassung + Bestätigung |
| Session-Abbruch | Gering | Gering | Auto-Save, Fortsetzung möglich |
| Datenleck | Sehr gering | Hoch | Vollständige Isolation |

---

## Nächste Schritte

1. **Phase 1 implementieren** (Text-Only)
2. User-Testing mit 3 Pilot-Kunden
3. Feedback einarbeiten
4. **Phase 2 evaluieren** (Voice)
5. Vapi/ElevenLabs POC

---

*Konzept erstellt von Amadeus | Feldhub Engineering*
