# WatermelonDB Database Module

## Overview

This module provides a generic, extensible offline-first database schema for AppFabrik field service apps.

## Architecture

```
lib/database/
├── index.ts              # Central exports
├── schema.ts             # Core table definitions
├── schemaExtensions.ts   # Extension registry system
├── migrations.ts         # Schema migrations
├── models/               # WatermelonDB Model classes
│   ├── index.ts
│   ├── User.ts
│   ├── Task.ts
│   ├── TimeEntry.ts
│   ├── Protocol.ts
│   ├── Photo.ts
│   ├── GpsTrack.ts
│   ├── SyncQueue.ts
│   ├── SyncMeta.ts
│   ├── Document.ts
│   └── Notification.ts
└── extensions/           # Tenant-specific schema extensions
    └── forestry.ts       # Example: Forstbetriebe extension
```

## Core Tables

| Table | Description |
|-------|-------------|
| `users` | Local cache of user data |
| `tasks` | Jobs/Aufträge with flexible metadata |
| `time_entries` | Time tracking per user/task |
| `protocols` | Reports with signature support |
| `photos` | Photo references (local + remote) |
| `gps_tracks` | GPS tracking points |
| `sync_queue` | Pending sync operations |
| `sync_meta` | Sync state per entity type |
| `documents` | Document references |
| `notifications` | Push notification cache |

## Schema Extensions

Extensions allow tenant-specific tables without modifying core schema.

### Using Built-in Extensions

```typescript
import { registerExtension, forestryExtension } from './lib/database';

// Register before database init
registerExtension(forestryExtension);

// Then in _layout.tsx after login:
const { initDatabase } = useDatabaseStore();
await initDatabase();
```

### Creating Custom Extensions

```typescript
import { tableSchema, Model } from '@nozbe/watermelondb';
import { SchemaExtension, registerExtension } from './schemaExtensions';

// 1. Define table schema
const customTable = tableSchema({
  name: 'custom_items',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string' },
    // ... more columns
  ],
});

// 2. Define model class
class CustomItem extends Model {
  static table = 'custom_items';
  // ... decorators and methods
}

// 3. Create extension
const myExtension: SchemaExtension = {
  id: 'my-industry',
  version: 1,
  description: 'Custom tables for my industry',
  tables: [customTable],
  models: [CustomItem],
};

// 4. Register
registerExtension(myExtension);
```

### Available Extensions

| Extension | ID | Tables |
|-----------|-----|--------|
| Forestry | `forestry` | `planting_areas`, `seed_harvests`, `plant_stocks`, `inspections` |
| Landscaping | `landscaping` | (planned) |
| Construction | `construction` | (planned) |

## Tenant Configuration

Enable extensions based on tenant config:

```typescript
// In app initialization
import { appConfig } from './config/tenant';
import { registerExtension, forestryExtension } from './lib/database';

// Check tenant config for which modules are enabled
if (appConfig.modules.saatguternte?.enabled) {
  registerExtension(forestryExtension);
}

// Then init database
await initDatabase();
```

## Sync Strategy

The schema supports offline-first sync with:

- `sync_queue`: Stores pending create/update/delete operations
- `sync_meta`: Tracks last sync timestamp per entity type
- `is_synced` / `synced_at`: Per-record sync status

Sync endpoints should implement:
- `GET /sync/pull?since={timestamp}` — Get changed records
- `POST /sync/push` — Push local changes

## Best Practices

1. **Always register extensions before `initDatabase()`**
2. **Use `remote_id` for server-side IDs**, WatermelonDB uses its own IDs internally
3. **Store JSON data in `string` columns** with `@json` decorator
4. **Index frequently queried columns** (`isIndexed: true`)
5. **Add timestamps** (`created_at`, `updated_at`, `synced_at`) to all tables

## Version Management

- `CORE_SCHEMA_VERSION`: Increment when changing core tables
- Extension `version`: Increment when changing extension tables
- Combined version: `CORE + sum(EXTENSION_VERSIONS)`

WatermelonDB will automatically migrate the database when the version changes.
