/**
 * AppFabrik App — Database Module
 * 
 * Central export for all database-related functionality.
 * 
 * Usage:
 * ```ts
 * import { 
 *   schema, 
 *   createSchema, 
 *   coreModelClasses,
 *   registerExtension,
 *   forestryExtension,
 * } from './lib/database';
 * 
 * // Register extensions before database init
 * registerExtension(forestryExtension);
 * 
 * // Then initialize database via useDatabaseStore
 * ```
 */

// Schema
export {
  schema,
  createSchema,
  coreTables,
  getTableNames,
  hasTable,
  CORE_SCHEMA_VERSION,
} from './schema';

// Models
export {
  coreModelClasses,
  User,
  Task,
  TimeEntry,
  Protocol,
  Photo,
  GpsTrack,
  SyncQueue,
  SyncMeta,
  Document,
  Notification,
} from './models';

// Schema Extensions
export {
  registerExtension,
  unregisterExtension,
  getExtensions,
  getExtension,
  hasExtension,
  getExtensionTables,
  getExtensionModels,
  getCombinedSchemaVersion,
} from './schemaExtensions';
export type { SchemaExtension, ExtensionMigration, MigrationStep } from './schemaExtensions';

// Migrations
export { migrations, createMigrations } from './migrations';

// Built-in Extensions
export { forestryExtension, PlantingArea, SeedHarvest, PlantStock, Inspection } from './extensions/forestry';
