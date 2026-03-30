# Implementation Roadmap — Voice-Onboarding-Assistent

## Übersicht

| Phase | Beschreibung | Zeitrahmen | Status |
|-------|--------------|------------|--------|
| Phase 1 | Text-Only MVP | 2 Wochen | 🔴 Geplant |
| Phase 1.5 | User Testing | 1-2 Wochen | 🔴 Geplant |
| Phase 2 | Voice Integration | 2-3 Wochen | 🔴 Geplant |
| Phase 3 | Production Rollout | 1 Woche | 🔴 Geplant |

---

## Phase 1: Text-Only MVP (2 Wochen)

### Ziel
Funktionierender Chat-basierter Onboarding-Assistent ohne Voice.

### Week 1: Core Implementation

#### Day 1-2: API Setup
- [ ] Onboarding API Route erstellen (`/api/onboarding/session`)
- [ ] Session Management implementieren (Redis/Vercel KV)
- [ ] Rate Limiting konfigurieren

```typescript
// /app/api/onboarding/session/route.ts
export async function POST(req: Request) {
  const { sessionId, message } = await req.json()
  // ... implementation
}
```

#### Day 3-4: Claude Integration
- [ ] Anthropic SDK konfigurieren
- [ ] System Prompt aus conversation-guide.md laden
- [ ] Message History Management
- [ ] Output Schema Validierung

#### Day 5: Frontend Chat UI
- [ ] Einfache Chat-Komponente
- [ ] Session Start/Resume
- [ ] Typing Indicators
- [ ] Message Persistence

### Week 2: Polish & Integration

#### Day 6-7: Output Processing
- [ ] JSON Output Parsing
- [ ] Schema Validation mit Zod
- [ ] Preview-Ansicht für Team

#### Day 8-9: Mission Control Integration
- [ ] Export-Button für validierte Outputs
- [ ] Bulk Task Import API
- [ ] Projekt-Template Generierung

#### Day 10: Testing & Dokumentation
- [ ] Unit Tests für Schema Validation
- [ ] Integration Tests für API
- [ ] Admin-Dokumentation

### Deliverables Phase 1
- ✅ Chat-basierter Onboarding-Assistent
- ✅ Strukturierter JSON Output
- ✅ Mission Control Import (manuell ausgelöst)

---

## Phase 1.5: User Testing (1-2 Wochen)

### Ziel
Feedback von 3 Pilot-Kunden sammeln und einarbeiten.

### Aktivitäten

#### Week 3: Pilot Tests
- [ ] 3 Pilot-Kunden identifizieren
- [ ] Test-Sessions durchführen (mit Feldhub-Team dabei)
- [ ] Feedback dokumentieren

#### Week 4: Iteration
- [ ] Conversation Guide anpassen
- [ ] UI/UX Verbesserungen
- [ ] Edge Cases behandeln

### Metriken
- Gesprächsdauer (Ziel: 20-30 min)
- Completion Rate (Ziel: >90%)
- Output Quality Score (Team-Bewertung)
- Kundenzufriedenheit (NPS)

### Go/No-Go Kriterien für Phase 2
- ✅ Mindestens 3 erfolgreiche Pilot-Sessions
- ✅ Durchschnittliche Bewertung ≥ 4/5
- ✅ Output-Qualität ausreichend für Task-Generierung

---

## Phase 2: Voice Integration (2-3 Wochen)

### Ziel
Vollwertige Voice-basierte Onboarding-Sessions.

### Week 5: Vapi Setup

#### Day 11-12: Account & Config
- [ ] Vapi Account erstellen
- [ ] Assistant konfigurieren (vapi-config-template.json)
- [ ] ElevenLabs Voice auswählen/erstellen

#### Day 13-14: Webhook Integration
- [ ] Webhook Endpoint erstellen (`/api/onboarding/vapi-webhook`)
- [ ] Transcript Processing
- [ ] End-of-Call Report Handling

```typescript
// /app/api/onboarding/vapi-webhook/route.ts
export async function POST(req: Request) {
  const event = await req.json()
  
  switch (event.type) {
    case 'transcript':
      await handleTranscript(event)
      break
    case 'end-of-call-report':
      await handleEndOfCall(event)
      break
  }
}
```

#### Day 15: Testing
- [ ] End-to-End Voice Test
- [ ] Latenz-Messungen
- [ ] Fallback-Szenarien

### Week 6: Voice UX

#### Day 16-17: Voice Optimierung
- [ ] Sprechgeschwindigkeit anpassen
- [ ] Pausen-Timing optimieren
- [ ] Interrupt-Handling testen

#### Day 18-19: Multi-Modal
- [ ] Chat + Voice kombinieren
- [ ] Fallback Text-to-Voice
- [ ] Session-Übergabe

#### Day 20: Quality Assurance
- [ ] 5+ Voice-Tests mit Team
- [ ] Audio-Qualität prüfen
- [ ] Transkript-Genauigkeit validieren

### Week 7: Integration

#### Day 21-22: Frontend Voice UI
- [ ] Voice-Button in Onboarding-Page
- [ ] Audio Permissions Handling
- [ ] Connection Status Anzeige

#### Day 23-24: Monitoring
- [ ] Call-Logging
- [ ] Error Tracking
- [ ] Cost Monitoring Dashboard

#### Day 25: Documentation
- [ ] Voice-spezifische Doku
- [ ] Troubleshooting Guide
- [ ] Support-Handbuch

### Deliverables Phase 2
- ✅ Voice-basierter Onboarding-Assistent
- ✅ Deutschsprachige ElevenLabs Voice
- ✅ Transcript + Structured Output
- ✅ Fallback zu Text-Chat

---

## Phase 3: Production Rollout (1 Woche)

### Week 8: Go-Live

#### Day 26-27: Soft Launch
- [ ] Onboarding-Link an neue Leads
- [ ] Team-Monitoring aller Sessions
- [ ] Quick Fixes bei Problemen

#### Day 28-29: Full Launch
- [ ] Website Integration (CTA)
- [ ] E-Mail Automation
- [ ] Marketing-Kommunikation

#### Day 30: Review
- [ ] Erste Woche auswerten
- [ ] Metriken analysieren
- [ ] Roadmap für Verbesserungen

---

## Technischer Stack

| Komponente | Technologie | Kosten |
|------------|-------------|--------|
| Frontend | Next.js + React | Vercel (inkl.) |
| API | Next.js API Routes | Vercel (inkl.) |
| LLM | Claude Sonnet | ~$0.50/Session |
| Voice | Vapi | ~$0.15/min |
| TTS | ElevenLabs | ~$0.30/min |
| Sessions | Vercel KV | ~$0.10/Session |

### Geschätzte Kosten pro Session

| Modus | Dauer | Kosten |
|-------|-------|--------|
| Text-Only | 30 min | ~$0.60 |
| Voice | 30 min | ~$14.00 |

---

## Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Voice-Latenz zu hoch | Mittel | Vapi optimierte Streaming verwenden |
| Deutsche Spracherkennung ungenau | Mittel | Deepgram Nova-2 + Nachfragen |
| Kosten zu hoch | Gering | Text-Only als Standard, Voice optional |
| Datenschutz-Bedenken | Mittel | Klare Einwilligung, DSGVO-Doku |

---

## Erfolgskriterien

| Metrik | Ziel | Messung |
|--------|------|---------|
| Session Completion Rate | >85% | Analytics |
| Output Quality | ≥4/5 | Team-Review |
| Time to Go-Live | <6 Wochen | Project Tracking |
| Customer Satisfaction | NPS >50 | Post-Session Survey |
| Cost per Lead | <€20 | Finance Dashboard |

---

## Verantwortlichkeiten

| Rolle | Verantwortung |
|-------|---------------|
| Amadeus | Architektur, API, Integration |
| Volt | Frontend, Chat UI |
| Pixel | Voice UX, Branding |
| Tomek | Go/No-Go Entscheidungen, Pilot-Kunden |

---

## Nächster Schritt

**Start Phase 1:** API Route + Claude Integration

```bash
# Ticket in Mission Control erstellen
POST /api/tasks
{
  "title": "Voice Onboarding Phase 1: API Setup",
  "priority": "high",
  "category": "development"
}
```

---

*Roadmap erstellt: März 2026 | Version 1.0*
