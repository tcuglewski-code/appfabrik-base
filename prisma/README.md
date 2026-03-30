# AppFabrik Base — Prisma Schema

## Übersicht

Dieses Schema ist das **generische Basis-Schema** für alle AppFabrik-Tenants. Es enthält nur Models, die für alle Branchen relevant sind.

## Core-Models

| Model | Beschreibung |
|-------|-------------|
| `Tenant` | Multi-Tenant Konfiguration |
| `User` | Benutzer mit Auth & 2FA |
| `Session` | Login-Sessions |
| `Role` | Konfigurierbares Rollen-System |
| `Permission` | Feingranulare Berechtigungen |
| `MagicToken` | Passwortloser Login, Einladungen |
| `TeamMember` | Mitarbeiter (mit oder ohne User-Account) |
| `TeamGroup` | Teams/Gruppen |
| `Project` | Aufträge, Projekte, Jobs |
| `Task` | Aufgaben |
| `TimeEntry` | Zeiterfassung |
| `Invoice` | Rechnungen |
| `Document` | Dokumente |
| `File` | Dateien (generisch) |
| `DailyReport` | Tagesprotokolle |
| `Season` | Saisons (optional) |
| `InventoryItem` | Lagerbestand |
| `Equipment` | Fuhrpark & Geräte |
| `Contact` | Kontakte |
| `Notification` | Benachrichtigungen |
| `AuditLog` | DSGVO-konforme Audit-Logs |
| `ActivityLog` | Aktivitätsprotokoll |
| `Webhook` | Integrationen |
| `SystemConfig` | Systemkonfiguration |
| `TenantConfig` | Tenant-spezifische Runtime-Config |

## Multi-Tenant Architektur

Jedes Model (außer `Tenant` und globale Configs) hat ein `tenantId` Feld:

```prisma
model Project {
  id       String @id @default(cuid())
  tenantId String // PFLICHT
  // ...
  
  @@index([tenantId])
}
```

### Queries immer mit tenantId filtern

```typescript
// ✅ Richtig
const projects = await prisma.project.findMany({
  where: { tenantId: currentTenant.id }
});

// ❌ Falsch — zeigt Daten aller Tenants!
const projects = await prisma.project.findMany();
```

## Tenant-Extensions (Branchenspezifische Models)

Das Base-Schema ist generisch. Branchenspezifische Models werden in separaten Schemas definiert und per Prisma Multi-Schema Feature zusammengeführt.

### Beispiel: Forstwirtschaft-Extension

Erstelle `prisma/extensions/forestry.prisma`:

```prisma
// Forstwirtschafts-spezifische Models

model PlantingRecord {
  id        String @id @default(cuid())
  tenantId  String
  projectId String
  
  treeSpecies String
  quantity    Int
  plantingMethod String
  spacing     String?
  depth       String?
  
  project   Project @relation(fields: [projectId], references: [id])
  
  @@index([tenantId])
}

model ForestArea {
  id        String @id @default(cuid())
  tenantId  String
  name      String
  hectares  Float
  geojson   Json?
  
  @@index([tenantId])
}

model GrantApplication {
  id        String @id @default(cuid())
  tenantId  String
  projectId String
  program   String
  status    String
  amount    Float?
  
  @@index([tenantId])
}
```

### Schema zusammenführen

In `prisma/schema.prisma` am Ende:

```prisma
// Extension: Forstwirtschaft
// import "./extensions/forestry.prisma"
```

### Alternative: metadata JSON-Feld

Für einfachere Fälle kann das `metadata` JSON-Feld in den Core-Models verwendet werden:

```typescript
// Project mit Forst-spezifischen Daten
await prisma.project.create({
  data: {
    tenantId: 'koch-aufforstung',
    title: 'Aufforstung Waldstück 7',
    type: 'planting',
    metadata: {
      // Forst-spezifisch
      treeSpecies: ['Eiche', 'Buche'],
      plantingMethod: 'Handpflanzung',
      spacing: '2x1.5m',
      grantProgram: 'GAK-A',
    }
  }
});
```

## Migrationen

### Entwicklung

```bash
# Schema-Änderungen in die DB pushen (ohne Migration)
npx prisma db push

# Prisma Client generieren
npx prisma generate
```

### Produktion

```bash
# Migration erstellen
npx prisma migrate dev --name add_new_feature

# Migration in Produktion ausführen
npx prisma migrate deploy
```

## Neon-Konfiguration

Für Neon Serverless PostgreSQL:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

In `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Seed-Daten

```bash
# Seed ausführen
npx prisma db seed
```

Siehe `prisma/seed.ts` für Demo-Daten.

## Backup & DSGVO

- `AuditLog` speichert alle relevanten Änderungen
- `oldData` / `newData` ermöglicht vollständige Rekonstruktion
- Bei User-Löschung: Daten anonymisieren, nicht löschen (DSGVO Art. 17)

## Performance-Tipps

1. **Indizes**: Alle `tenantId` Felder sind indexiert
2. **Composite-Indizes**: Bei häufigen Queries
3. **Pagination**: Immer `take` + `skip` verwenden
4. **Select**: Nur benötigte Felder laden

```typescript
// ✅ Optimiert
const projects = await prisma.project.findMany({
  where: { tenantId, status: 'active' },
  select: { id: true, title: true, status: true },
  take: 50,
  skip: 0,
});
```
