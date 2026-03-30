# Contributing to Feldhub Base

> Vielen Dank für dein Interesse an Feldhub Base! Dieses Dokument beschreibt unsere Entwicklungsstandards.

---

## 🚀 Quick Start

```bash
# Repo klonen
git clone https://github.com/tcuglewski-code/feldhub-base.git
cd feldhub-base

# Dependencies installieren
npm install

# Umgebungsvariablen kopieren
cp .env.example .env.local

# Entwicklungsserver starten
npm run dev
```

Detaillierte Setup-Anleitung: [DEVELOPER.md](./docs/DEVELOPER.md)

---

## 🌿 Branch-Naming-Konvention

| Typ | Präfix | Beispiel | Beschreibung |
|-----|--------|----------|--------------|
| Feature | `feature/` | `feature/dark-mode` | Neue Funktionalität |
| Bug Fix | `fix/` | `fix/login-error` | Fehlerbehebung |
| Hotfix | `hotfix/` | `hotfix/crash-prod` | Kritische Production-Fixes |
| Refactor | `refactor/` | `refactor/auth-flow` | Code-Verbesserung ohne Funktionsänderung |
| Docs | `docs/` | `docs/api-examples` | Nur Dokumentation |
| Chore | `chore/` | `chore/deps-update` | Build, Dependencies, CI |

### Branch erstellen

```bash
# Feature
git checkout -b feature/mein-feature

# Bug Fix
git checkout -b fix/issue-123

# Vom main-Branch aus starten
git checkout main && git pull && git checkout -b feature/xyz
```

---

## 📝 Commit-Konvention

Wir nutzen **Conventional Commits** für eine saubere Git-History.

### Format

```
<type>(<scope>): <kurze beschreibung>

[optionaler body mit mehr details]

[optionaler footer]
```

### Types

| Type | Bedeutung |
|------|-----------|
| `feat` | Neues Feature |
| `fix` | Bug Fix |
| `docs` | Dokumentation |
| `style` | Formatierung (kein Logik-Change) |
| `refactor` | Code-Umbau (keine neuen Features/Fixes) |
| `test` | Tests hinzufügen/ändern |
| `chore` | Build, CI, Dependencies |
| `perf` | Performance-Verbesserung |
| `ci` | CI/CD Änderungen |

### Scopes

| Scope | Bereich |
|-------|---------|
| `auth` | Authentifizierung, Login, Rollen |
| `api` | API-Routen |
| `ui` | UI-Komponenten, Styling |
| `db` | Prisma, Migrationen |
| `app` | Mobile App (app-template) |
| `ci` | GitHub Actions |
| `docs` | Dokumentation |

### Beispiele

```bash
# Feature
feat(api): add POST /projects endpoint with tenant isolation

# Bug Fix
fix(auth): handle expired session tokens correctly

# Dokumentation
docs(readme): add deployment guide for new tenants

# Breaking Change (Footer!)
feat(api)!: change /users response format to include roles

BREAKING CHANGE: Users endpoint now returns roles array instead of single role string
```

---

## 🔄 Pull Request Workflow

### 1. Branch erstellen & entwickeln

```bash
git checkout main
git pull origin main
git checkout -b feature/mein-feature
# ... entwickeln, committen ...
git push -u origin feature/mein-feature
```

### 2. Pull Request erstellen

- Titel: Kurz und prägnant (z.B. "feat: Add 2FA authentication")
- Beschreibung: Nutze das PR-Template vollständig
- Labels: Passend setzen (feature, bug, docs, etc.)
- Assignees: Dich selbst zuweisen

### 3. CI-Checks abwarten

Der PR muss folgende Checks bestehen:
- ✅ Lint (`npm run lint`)
- ✅ TypeScript Compilation (`npm run build`)
- ✅ Unit Tests (`npm test`)
- ✅ E2E Tests (`npm run test:e2e`) — sofern konfiguriert

### 4. Review erhalten

- **Standard-PRs:** 1 Approval erforderlich
- **Security/Auth-Änderungen:** Tomek muss reviewen
- **DB-Schema-Änderungen:** Explizit testen und dokumentieren

### 5. Merge

Nach Approval und grünen CI-Checks:
- **Merge-Strategie:** Squash & Merge (bevorzugt)
- **Branch löschen:** Nach Merge den Feature-Branch löschen

---

## ✅ Code Review Kriterien

Reviewer prüfen auf:

### Funktionalität
- [ ] Code macht was die Beschreibung sagt
- [ ] Edge Cases behandelt
- [ ] Fehlerbehandlung vollständig

### Code-Qualität
- [ ] Lesbar und verständlich
- [ ] Keine Duplikation
- [ ] Konsistente Benennung

### Security
- [ ] Auth-Check auf API-Routen
- [ ] Tenant-Isolation (Queries filtern auf `tenantId`)
- [ ] Keine Secrets im Code

### Performance
- [ ] Effiziente DB-Queries
- [ ] Pagination bei Listen
- [ ] Keine teuren Render-Operationen

Detaillierte Checkliste: [PR Template](.github/pull_request_template.md)

---

## 🔒 Geschützte Branches

| Branch | Schutz | Direkter Push |
|--------|--------|---------------|
| `main` | ✅ Geschützt | ❌ Nur via PR |
| Feature-Branches | — | ✅ Erlaubt |

### Ausnahme: Agent-Commits

Die Feldhub-Agenten (Amadeus-Loop) können direkt auf `main` committen, wenn:
- Sprint-Code im Commit-Message (z.B. `feat(AF045):`)
- Alle Tests bestehen
- Keine breaking Changes ohne Dokumentation

---

## 🛠️ Lokale Entwicklung

### Tests ausführen

```bash
# Unit Tests
npm test

# Unit Tests mit Watch-Mode
npm run test:watch

# E2E Tests
npm run test:e2e

# Lint
npm run lint

# Lint mit Auto-Fix
npm run lint:fix

# TypeScript Check
npm run build
```

### Prisma/Datenbank

```bash
# Migration erstellen
npx prisma migrate dev --name beschreibung

# Schema-Änderungen anwenden
npx prisma db push

# Prisma Studio (DB-GUI)
npx prisma studio
```

---

## 📚 Wichtige Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [DEVELOPER.md](./docs/DEVELOPER.md) | Detaillierte Setup-Anleitung |
| [API-CONVENTIONS.md](./docs/API-CONVENTIONS.md) | REST-API-Standards |
| [SECURITY-CHECKLIST.md](./docs/SECURITY-CHECKLIST.md) | Security-Anforderungen |
| [BRANCH-PROTECTION.md](./docs/BRANCH-PROTECTION.md) | Branch-Regeln + CI/CD |

---

## ❓ Fragen?

- **Technisch:** Issue erstellen oder PR-Kommentar
- **Organisatorisch:** Kontakt via Mission Control

---

*Stand: März 2026 | Feldhub UG*
