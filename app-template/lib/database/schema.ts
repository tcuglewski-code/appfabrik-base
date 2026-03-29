/**
 * AppFabrik App — WatermelonDB Schema
 * 
 * Generisches Offline-First Schema für Field Service Apps.
 * Branchenspezifische Erweiterungen via Schema-Extensions.
 * 
 * Core Tables (immer vorhanden):
 * - users: Lokale Benutzer-Kopie
 * - tasks: Aufträge / Jobs
 * - time_entries: Zeiterfassung
 * - protocols: Protokolle / Reports
 * - photos: Fotos
 * - gps_tracks: GPS-Tracking-Punkte
 * - sync_queue: Ausstehende Sync-Operationen
 * - sync_meta: Sync-Status pro Entity-Typ
 * - documents: Dokument-Referenzen
 * - notifications: Push-Benachrichtigungen
 * 
 * Extensions (per Tenant aktivierbar):
 * - forestry: Pflanzflächen, Saatguternten, Pflanzgut, Abnahmen
 * - landscaping: Projekte, Messungen, Materialien
 * - construction: Baustellen, Sicherheitschecks, Gerätelogs
 */

import { appSchema, tableSchema, TableSchema } from '@nozbe/watermelondb';
import { getExtensionTables, getCombinedSchemaVersion } from './schemaExtensions';

// =============================================================================
// SCHEMA VERSION
// =============================================================================

export const CORE_SCHEMA_VERSION = 1;

// =============================================================================
// CORE TABLES (always present)
// =============================================================================

/**
 * Users — lokale Kopie der Benutzer
 */
const usersTable = tableSchema({
  name: 'users',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'email', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'avatar_url', type: 'string', isOptional: true },
    { name: 'phone', type: 'string', isOptional: true },
    { name: 'is_active', type: 'boolean' },
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

/**
 * Aufträge / Tasks
 */
const tasksTable = tableSchema({
  name: 'tasks',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string', isOptional: true },
    { name: 'status', type: 'string' },       // open, in_progress, completed
    { name: 'priority', type: 'string' },     // low, medium, high
    { name: 'task_type', type: 'string' },    // configurable per tenant
    { name: 'assigned_to', type: 'string', isOptional: true },
    { name: 'assigned_team', type: 'string', isOptional: true },
    { name: 'customer_id', type: 'string', isOptional: true },
    { name: 'location_name', type: 'string', isOptional: true },
    { name: 'location_lat', type: 'number', isOptional: true },
    { name: 'location_lng', type: 'number', isOptional: true },
    { name: 'start_date', type: 'number', isOptional: true },
    { name: 'end_date', type: 'number', isOptional: true },
    { name: 'metadata', type: 'string', isOptional: true },  // JSON string
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

/**
 * Zeiterfassung / Time Entries
 */
const timeEntriesTable = tableSchema({
  name: 'time_entries',
  columns: [
    { name: 'remote_id', type: 'string', isOptional: true },
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'task_id', type: 'string', isOptional: true, isIndexed: true },
    { name: 'date', type: 'number', isIndexed: true },
    { name: 'start_time', type: 'number' },
    { name: 'end_time', type: 'number', isOptional: true },
    { name: 'break_minutes', type: 'number' },
    { name: 'description', type: 'string', isOptional: true },
    { name: 'location_lat', type: 'number', isOptional: true },
    { name: 'location_lng', type: 'number', isOptional: true },
    { name: 'is_synced', type: 'boolean' },
    { name: 'synced_at', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

/**
 * Protokolle / Reports
 */
const protocolsTable = tableSchema({
  name: 'protocols',
  columns: [
    { name: 'remote_id', type: 'string', isOptional: true },
    { name: 'task_id', type: 'string', isIndexed: true },
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'date', type: 'number', isIndexed: true },
    { name: 'protocol_type', type: 'string' },
    { name: 'status', type: 'string' },       // draft, submitted, approved
    { name: 'content', type: 'string' },      // JSON string with fields
    { name: 'notes', type: 'string', isOptional: true },
    { name: 'signature_data', type: 'string', isOptional: true },
    { name: 'signature_name', type: 'string', isOptional: true },
    { name: 'signature_date', type: 'number', isOptional: true },
    { name: 'is_synced', type: 'boolean' },
    { name: 'synced_at', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

/**
 * Fotos / Photos
 */
const photosTable = tableSchema({
  name: 'photos',
  columns: [
    { name: 'remote_id', type: 'string', isOptional: true },
    { name: 'task_id', type: 'string', isOptional: true, isIndexed: true },
    { name: 'protocol_id', type: 'string', isOptional: true, isIndexed: true },
    { name: 'user_id', type: 'string' },
    { name: 'local_uri', type: 'string' },
    { name: 'remote_url', type: 'string', isOptional: true },
    { name: 'caption', type: 'string', isOptional: true },
    { name: 'photo_type', type: 'string' },   // before, after, damage, etc.
    { name: 'location_lat', type: 'number', isOptional: true },
    { name: 'location_lng', type: 'number', isOptional: true },
    { name: 'taken_at', type: 'number' },
    { name: 'is_synced', type: 'boolean' },
    { name: 'synced_at', type: 'number', isOptional: true },
    { name: 'created_at', type: 'number' },
  ],
});

/**
 * GPS Tracks
 */
const gpsTracksTable = tableSchema({
  name: 'gps_tracks',
  columns: [
    { name: 'remote_id', type: 'string', isOptional: true },
    { name: 'user_id', type: 'string', isIndexed: true },
    { name: 'task_id', type: 'string', isOptional: true, isIndexed: true },
    { name: 'date', type: 'number', isIndexed: true },
    { name: 'latitude', type: 'number' },
    { name: 'longitude', type: 'number' },
    { name: 'accuracy', type: 'number', isOptional: true },
    { name: 'altitude', type: 'number', isOptional: true },
    { name: 'speed', type: 'number', isOptional: true },
    { name: 'recorded_at', type: 'number' },
    { name: 'is_synced', type: 'boolean' },
    { name: 'synced_at', type: 'number', isOptional: true },
  ],
});

/**
 * Sync Queue — pending operations to sync
 */
const syncQueueTable = tableSchema({
  name: 'sync_queue',
  columns: [
    { name: 'entity_type', type: 'string', isIndexed: true },
    { name: 'entity_id', type: 'string' },
    { name: 'operation', type: 'string' },    // create, update, delete
    { name: 'payload', type: 'string' },      // JSON
    { name: 'attempts', type: 'number' },
    { name: 'last_error', type: 'string', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'next_retry_at', type: 'number', isOptional: true },
  ],
});

/**
 * Sync Metadata — last sync timestamps per entity
 */
const syncMetaTable = tableSchema({
  name: 'sync_meta',
  columns: [
    { name: 'entity_type', type: 'string', isIndexed: true },
    { name: 'last_pull_at', type: 'number' },
    { name: 'last_push_at', type: 'number' },
    { name: 'cursor', type: 'string', isOptional: true },
  ],
});

/**
 * Documents — local document references
 */
const documentsTable = tableSchema({
  name: 'documents',
  columns: [
    { name: 'remote_id', type: 'string', isOptional: true },
    { name: 'task_id', type: 'string', isOptional: true, isIndexed: true },
    { name: 'user_id', type: 'string', isOptional: true },
    { name: 'title', type: 'string' },
    { name: 'file_type', type: 'string' },
    { name: 'local_uri', type: 'string', isOptional: true },
    { name: 'remote_url', type: 'string', isOptional: true },
    { name: 'file_size', type: 'number', isOptional: true },
    { name: 'is_cached', type: 'boolean' },
    { name: 'cached_at', type: 'number', isOptional: true },
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
  ],
});

/**
 * Notifications — local notification cache
 */
const notificationsTable = tableSchema({
  name: 'notifications',
  columns: [
    { name: 'remote_id', type: 'string', isOptional: true },
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string' },
    { name: 'data', type: 'string', isOptional: true },  // JSON
    { name: 'notification_type', type: 'string' },
    { name: 'is_read', type: 'boolean' },
    { name: 'received_at', type: 'number' },
    { name: 'read_at', type: 'number', isOptional: true },
  ],
});

// =============================================================================
// CORE TABLES ARRAY
// =============================================================================

export const coreTables: TableSchema[] = [
  usersTable,
  tasksTable,
  timeEntriesTable,
  protocolsTable,
  photosTable,
  gpsTracksTable,
  syncQueueTable,
  syncMetaTable,
  documentsTable,
  notificationsTable,
];

// =============================================================================
// SCHEMA FACTORY
// =============================================================================

/**
 * Create schema with optional extensions
 * Call this AFTER registering any extensions
 */
export function createSchema(): ReturnType<typeof appSchema> {
  const extensionTables = getExtensionTables();
  const allTables = [...coreTables, ...extensionTables];
  const version = getCombinedSchemaVersion(CORE_SCHEMA_VERSION);
  
  console.log(`📊 Creating schema v${version} with ${allTables.length} tables`);
  console.log(`   Core: ${coreTables.length} | Extensions: ${extensionTables.length}`);
  
  return appSchema({
    version,
    tables: allTables,
  });
}

// =============================================================================
// DEFAULT SCHEMA (core only)
// =============================================================================

export const schema = appSchema({
  version: CORE_SCHEMA_VERSION,
  tables: coreTables,
});

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get table names from current schema
 */
export function getTableNames(): string[] {
  return coreTables.map(t => t.name);
}

/**
 * Check if a table exists in core schema
 */
export function hasTable(name: string): boolean {
  return coreTables.some(t => t.name === name);
}

export default schema;
