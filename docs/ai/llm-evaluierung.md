# LLM-Evaluierung: Welches Modell für welche Aufgabe

> Stand: 31.03.2026 | Sprint JW
> Basierend auf: SWE-bench, MMLU, realer Feldhub-Nutzung + Perplexity Research

---

## TL;DR — Modell-Empfehlungen

| Aufgabe | Modell | Begründung |
|---------|--------|-----------|
| Architektur, Koordination | claude-opus-4-5 | Stärkstes Reasoning |
| Backend/API Dev | claude-opus-4-5 | Komplexe Logik, wenige Fehler |
| App Dev (RN/Expo) | claude-opus-4-5 | Offline-Sync, RN-Spezifika |
| QA / Security | claude-opus-4-5 | Kein Kompromiss bei Sicherheit |
| Frontend / UI | claude-sonnet-4-6 | Schnell, gut in Tailwind/JSX |
| WP / PHP | claude-sonnet-4-6 | Ausreichend + kosteneffizient |
| Research / RAG | perplexity/sonar-pro | Web-Suche + Quellenangaben |
| Texte / Copywriting | claude-haiku-4-5 | Hochvolumen, günstig |
| Lead-Recherche | perplexity/sonar-pro | Aktuell, Web-basiert |
| Deep Research | perplexity/sonar-deep-research | Lange Berichte, multi-step |
| Embeddings | text-embedding-3-small | OpenAI, pgvector-kompatibel |
| Bild-Analyse | claude-3-5-sonnet | Vision-Tasks |

---

## Detaillierte Analyse nach Dimension

### 1. Coding-Qualität (SWE-Bench Verified, 2025/2026)

| Modell | SWE-bench Score | Stärken | Schwächen |
|--------|----------------|---------|-----------|
| Claude Opus 4.5 | ~82% | Komplexe Multi-File-Edits | Langsamer als Sonnet |
| Claude Sonnet 4.6 | ~79% | Speed + Qualität balanced | Gelegentlich Overfit |
| GPT-4o | ~76% | Breites Wissen | Halluziniert URLs |
| Gemini 1.5 Pro | ~71% | Context Window (1M) | JS/TS < Claude |
| DeepSeek-V3 | ~49% | Günstig | Weniger zuverlässig |

**Fazit:** Für Feldhub-Produktionscode → **Opus 4.5** oder **Sonnet 4.6**

### 2. Reasoning / Analyse

| Modell | MMLU | Coding Reason | Empfehlung |
|--------|------|--------------|-----------|
| Claude Opus 4.5 | 90%+ | Exzellent | ✅ Architektur, Koordination |
| Claude Sonnet 4.6 | 88% | Sehr gut | ✅ Standard-Tasks |
| GPT-o1 | 91% | Exzellent | ✅ Nur für pure Reasoning-Tasks |
| Llama 3.3 70B | 83% | Gut | ✅ Für Self-Hosting |

### 3. Geschwindigkeit (Tokens/Sekunde, Anthropic API)

| Modell | Speed | TTFT* | Kosten |
|--------|-------|-------|--------|
| claude-haiku-4-5 | ~200 tok/s | ~0.5s | €0.25/MTok input |
| claude-sonnet-4-6 | ~120 tok/s | ~0.8s | €3/MTok input |
| claude-opus-4-5 | ~60 tok/s | ~1.5s | €15/MTok input |

*TTFT = Time to First Token

### 4. Kosten pro Aufgabe (Durchschnitt Feldhub)

| Aufgabe | Tokens (~) | Modell | Kosten |
|---------|-----------|--------|--------|
| Kurze Antwort (Chat) | 1.500 | haiku | €0.0004 |
| Blog-Artikel generieren | 8.000 | haiku | €0.002 |
| Frontend-Komponente | 12.000 | sonnet | €0.036 |
| API-Route komplex | 25.000 | opus | €0.375 |
| Architektur-Review | 40.000 | opus | €0.60 |
| Full Sprint (5 Files) | 100.000 | opus | €1.50 |

**Monatliche Schätzung Feldhub-Loop:**
- 200 Sprints/Monat × €0.75 avg = **€150/Monat**
- Optimierung: Light-Tasks auf Haiku → Einsparung ~30%

---

## Aufgaben-Matrix (Feldhub spezifisch)

### Backend-Agenten

| Agent | Aufgabe | Modell | Begründung |
|-------|---------|--------|-----------|
| Archie (DB/API) | Prisma-Schema, Migrations | opus | Komplex, sicherheitskritisch |
| Bruno (WP) | PHP-Hooks, REST API | sonnet | Standard WP-Tasks |
| Nomad (App) | React Native, WatermelonDB | opus | Offline-Sync kritisch |

### Frontend-Agenten

| Agent | Aufgabe | Modell | Begründung |
|-------|---------|--------|-----------|
| Volt (Frontend) | Tailwind, Next.js Komponenten | sonnet | Schnell, gut in JSX |
| Pixel (UX/UI) | Design-Entscheidungen | opus | Kreatives Reasoning |

### Analyse-Agenten

| Agent | Aufgabe | Modell | Begründung |
|-------|---------|--------|-----------|
| Sylvia (Förderung) | RAG über 255 Programme | sonnet + pgvector | Retrieval + Synthese |
| Argus (Security) | OWASP, DSGVO-Checks | opus | Kein Kompromiss |

### Content-Agenten

| Agent | Aufgabe | Modell | Begründung |
|-------|---------|--------|-----------|
| Quill (SEO/Copy) | Blog, Meta-Tags | haiku | Hochvolumen, günstig |
| Research-Cron | Branchennews | sonar-pro | Aktuelle Web-Daten |

---

## Wann welches Modell — Entscheidungsbaum

```
Neue KI-Aufgabe:
       │
       ▼
Brauche ich aktuelle Web-Daten?
       │
   JA ─┴─ → Perplexity (sonar-pro oder sonar-deep-research)
       │
  NEIN ▼
       │
Ist es sicherheitskritisch / komplex / Architektur?
       │
   JA ─┴─ → Claude Opus 4.5
       │
  NEIN ▼
       │
Ist es Standard-Coding oder UI-Arbeit?
       │
   JA ─┴─ → Claude Sonnet 4.6
       │
  NEIN ▼
       │
Ist es einfacher Text / viele kurze Tasks?
       │
   JA ─┴─ → Claude Haiku 4.5
       │
  NEIN ▼
       │
Embeddings für RAG/Suche?
       │
   JA ─┴─ → text-embedding-3-small (OpenAI)
```

---

## Modell-Vergleich: Spezifische Stärken

### Claude Opus 4.5 — Best for Feldhub

**✅ Stärken:**
- Multi-File Code-Edits ohne Verlust der Gesamtstruktur
- Versteht komplexe Typsysteme (Zod, Prisma, TypeScript generics)
- Wenige Halluzinationen bei API-Dokumentation
- Kontext-Fenster 200K tokens (ganzes Repo passt rein)
- Beste Tool-Use Performance (Function Calling)
- Extended Thinking für tiefe Reasoning-Aufgaben

**❌ Schwächen:**
- Teuerster Tier (€15/MTok input)
- Langsamster Output
- Für einfache Tasks Overkill

### Claude Sonnet 4.6 — Daily Driver

**✅ Stärken:**
- 3× schneller als Opus bei 80% der Qualität
- Exzellent in React/Next.js/Tailwind
- Guter Kosten-Qualität-Sweet-Spot
- Gut für iterative UI-Arbeit

**❌ Schwächen:**
- Gelegentliche Fehler bei komplexer Logik
- Manchmal zu aggressiv in Refactoring

### Perplexity Sonar-Pro — Research

**✅ Stärken:**
- Echtzeit-Web-Zugriff
- Quellenangaben und Zitate
- Strukturierte Zusammenfassungen
- Gut für Markt- und Wettbewerber-Recherche

**❌ Schwächen:**
- Kein Code-Output-Qualität wie Claude
- Kostenpflichtig (separates Budget)
- Rate-Limits bei vielen Anfragen

---

## Benchmark-Quellen

| Benchmark | Was es misst | Relevanz für Feldhub |
|-----------|-------------|---------------------|
| SWE-bench Verified | Real-World Code-Issues lösen | ⭐⭐⭐⭐⭐ Hoch |
| HumanEval | Algorithmik | ⭐⭐⭐ Mittel |
| MMLU | Breites Wissen | ⭐⭐ Gering |
| LiveCodeBench | Aktuelles Coding | ⭐⭐⭐⭐ Hoch |
| LLM-Client Evals | Tool-Use, Function Calling | ⭐⭐⭐⭐⭐ Hoch |

---

## Empfehlung: Quarterly Review

Da sich Modelle schnell entwickeln (neue Versionen alle 3-6 Monate):

1. **April 2026:** Erster Review — Claude 3.7 Sonnet vs. Opus 4.5?
2. **Juli 2026:** GPT-5 Release erwartet — Vergleich nötig
3. **Oktober 2026:** Llama-4 Self-Hosting evaluieren (Kostenersparnis?)

**Review-Prozess:**
1. SWE-bench Score neuer Modelle prüfen (Anthropic Blog, LiveBench.ai)
2. 3 Test-Sprints mit neuem Modell durchführen
3. Qualität + Kosten vergleichen
4. TOOLS.md Subagent-Matrix updaten

---

## Integration in OpenClaw / TOOLS.md

Aktuelle Konfiguration in `TOOLS.md`:

```markdown
## Subagent Modell-Matrix

| Rolle | Modell | Begründung |
|-------|--------|-----------|
| main (Amadeus) | anthropic/claude-opus-4-5 | Architektur, Multi-Agent-Koordination |
| backend dev | anthropic/claude-opus-4-5 | Komplexe APIs, Schema-Design |
| app developer | anthropic/claude-opus-4-5 | RN-Architektur, Offline-Sync, Bugs |
| qa/security | anthropic/claude-opus-4-5 | Präzision, keine Regressions |
| frontend dev | anthropic/claude-sonnet-4-6 | UI-Komponenten, Tailwind, Schnell |
| wp/website | anthropic/claude-sonnet-4-6 | Standard PHP/WP Aufgaben |
| copywriter/seo | anthropic/claude-haiku-4-5 | High-Volume, einfache Texte |
| research/crawler | anthropic/claude-haiku-4-5 | Budget, hoher Durchsatz |
```

Diese Matrix ist **optimal für März 2026** — nächster Review: **Juli 2026**.
