## 📋 Was ändert dieser PR?

<!-- Kurze Beschreibung der Änderung (1-3 Sätze) -->

## 🔗 Verknüpfte Tasks

- Task-ID: <!-- MC-XXX oder Sprint-Code z.B. IL -->
- Closes: <!-- #issue-number falls vorhanden -->

## 🧪 Wie wurde getestet?

- [ ] Lokal getestet (npm run dev)
- [ ] Unit Tests laufen durch (`npm test`)
- [ ] E2E Tests laufen durch (`npm run test:e2e`)
- [ ] Manuell in Browser getestet
- [ ] Auf Mobile getestet (falls App-Änderung)

## 📸 Screenshots / Demo

<!-- Bei UI-Änderungen: Vorher/Nachher Screenshots oder kurze Demo -->

## ✅ Checkliste vor Merge

### Allgemein
- [ ] Code folgt den [API-Standards](../docs/api-standards.md)
- [ ] Keine `console.log` / Debug-Code in Production-Pfaden
- [ ] Keine hardcodierten Credentials oder Secrets
- [ ] Typescript-Fehler behoben (`npm run build`)
- [ ] Lint-Fehler behoben (`npm run lint`)

### Datenbank (falls Schema-Änderung)
- [ ] Prisma Migration erstellt (`npx prisma migrate dev`)
- [ ] Migration ist reversibel (kein Datenverlust)
- [ ] Seed-Daten angepasst falls nötig

### Security
- [ ] Keine ungeschützten API-Routen (Auth-Check vorhanden)
- [ ] Tenant-Isolation geprüft (Queries filtern auf `tenantId`)
- [ ] Input-Validierung mit Zod vorhanden

### Performance
- [ ] Keine N+1 Queries (Prisma includes prüfen)
- [ ] Große Datenmengen paginiert

### Dokumentation
- [ ] Neue Features in README / DEVELOPER.md dokumentiert
- [ ] OpenAPI Spec aktualisiert falls neue API-Routen

## 📝 Notizen für Reviewer

<!-- Besondere Hinweise, offene Fragen, bekannte Schwächen -->
