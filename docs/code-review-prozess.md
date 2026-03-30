# Code Review Prozess — AppFabrik / Feldhub Base

> Stand: März 2026 | Für alle AppFabrik-Repos

---

## Branching-Strategie

```
main          → Production (geschützt, kein direkter Push)
develop       → Integration Branch (optional, für größere Features)
feature/XYZ   → Neue Features (von main, Merge via PR)
fix/XYZ       → Bug Fixes
hotfix/XYZ    → Kritische Fixes (direkt nach main)
```

**Für Agenten-getriebene Entwicklung:** Direkte Commits auf `main` sind erlaubt, sofern:
- Sprint-Code im Commit-Message vorhanden
- Tests bestehen
- Keine breaking Changes ohne Abstimmung

---

## Commit-Konvention

```
<type>(<scope>): <beschreibung>

[optionaler body]

[optionaler footer: BREAKING CHANGE, Closes #issue]
```

### Types

| Type | Bedeutung |
|------|-----------|
| `feat` | Neues Feature |
| `fix` | Bug Fix |
| `docs` | Nur Dokumentation |
| `style` | Formatierung, kein Logik-Change |
| `refactor` | Code-Refactoring |
| `test` | Tests hinzufügen/ändern |
| `chore` | Build-System, Dependencies |
| `perf` | Performance-Verbesserung |
| `ci` | CI/CD-Änderungen |

### Scopes (AppFabrik-spezifisch)

| Scope | Bedeutung |
|-------|-----------|
| `auth` | Authentifizierung |
| `api` | API-Routen |
| `ui` | UI-Komponenten |
| `db` | Datenbank/Prisma |
| `app` | Mobile App |
| `ci` | GitHub Actions |
| `docs` | Dokumentation |
| Sprint-Code (IL, IM...) | Sprint-gebundene Änderungen |

### Beispiele

```bash
feat(api): POST /auftraege Endpoint mit Zod-Validierung
fix(auth): Session-Token Expiry korrekt behandeln
docs(IS): Code Review Prozess + PR Templates
feat(IL): Preismodell v1.0 — Setup-Fee + SaaS-Pakete
chore: rename AppFabrik → Feldhub
```

---

## PR Review Standards

### Wer reviewed?
- **Standard:** Tomek oder Amadeus (Orchestrator)
- **Security-kritisch:** Zusätzlich Argus (Security Agent)
- **DB-Schema:** Zusätzlich Archie (DB Architekt)
- **Hotfixes:** Können ohne Review gemergt werden wenn kritisch (sofort Nachreview)

### Review-Kriterien (Checkliste für Reviewer)

**Funktionalität**
- [ ] Macht der Code was der PR beschreibt?
- [ ] Sind Edge Cases behandelt?
- [ ] Fehlerbehandlung vollständig?

**Code-Qualität**
- [ ] Verständlich und lesbar?
- [ ] Keine Code-Duplizierung?
- [ ] Benennungen klar und konsistent?

**Security**
- [ ] Auth-Check auf allen API-Routen?
- [ ] Tenant-Isolation (kein Cross-Tenant Datenleck)?
- [ ] Keine SQL-Injection / IDOR Risiken?
- [ ] Keine Secrets im Code?

**Performance**
- [ ] Datenbankabfragen effizient?
- [ ] Pagination bei großen Listen?
- [ ] Keine teuren Operationen im Render-Pfad?

---

## Review-Zeitfenster

| Typ | Erwartete Reaktion |
|-----|--------------------|
| Hotfix | Sofort (< 1h) |
| Bug Fix | < 4h |
| Feature | < 24h |
| Refactoring | < 48h |

---

## Merge-Regeln

1. **Minimum 1 Approval** (außer Hotfixes)
2. **Alle CI-Checks grün** (lint, typecheck, tests)
3. **Keine offenen Review-Kommentare** (alle resolved)
4. **Branch ist aktuell** (kein Merge-Konflikt)

**Merge-Strategie:** Squash & Merge (saubere History auf `main`)

---

## CODEOWNERS (Empfehlung)

```
# .github/CODEOWNERS
*                   @tcuglewski-code
/prisma/            @tcuglewski-code  # DB-Änderungen immer zu Tomek
/src/lib/auth.ts    @tcuglewski-code  # Auth-Config
/legal/             @tcuglewski-code  # Rechtliche Dokumente
```

---

## Agent-Entwicklung (Besonderheiten)

Da AppFabrik-Repos auch von Agenten (Amadeus-Loop) entwickelt werden:

1. **Sprint-Commits sind direkt auf main** — kein PR nötig
2. **Commit-Message enthält Sprint-Code** (IL, IM, etc.)
3. **Agent dokumentiert im LOOP-STATE.md** was erledigt wurde
4. **Tomek reviewt async** bei nächstem Check-in

**Golden Rule:** Ein Agent-Commit muss so klar dokumentiert sein, dass Tomek in 30 Sekunden versteht, was geändert wurde und warum.

---

## Tools

| Tool | Zweck |
|------|-------|
| GitHub PR Templates | Einheitliche PR-Struktur (`.github/pull_request_template.md`) |
| GitHub Actions | Automatischer Lint + Test + TypeCheck auf PR |
| Conventional Commits | Lesbare Git History |
| Semantic Release | Automatisches Versioning (optional für Zukunft) |

---

*Erstellt: 30.03.2026 | Sprint IS*
