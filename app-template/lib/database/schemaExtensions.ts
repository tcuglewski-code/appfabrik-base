/**
 * AppFabrik App — Schema Extensions System
 * 
 * Allows tenants to define additional tables without modifying core schema.
 * 
 * Usage:
 * 1. Create a tenant-specific extension file (e.g., extensions/forestry.ts)
 * 2. Define tableSchemas and model classes
 * 3. Register via registerExtension() before database init
 * 
 * Example:
 * ```ts
 * import { registerExtension, SchemaExtension } from './schemaExtensions';
 * import { tableSchema, Model } from '@nozbe/watermelondb';
 * 
 * const forestryExtension: SchemaExtension = {
 *   id: 'forestry',
 *   version: 1,
 *   tables: [
 *     tableSchema({
 *       name: 'planting_areas',
 *       columns: [...],
 *     }),
 *   ],
 *   models: [PlantingArea],
 * };
 * 
 * registerExtension(forestryExtension);
 * ```
 */

import { TableSchema } from '@nozbe/watermelondb/Schema';
import { Model } from '@nozbe/watermelondb';

// =============================================================================
// TYPES
// =============================================================================

export interface SchemaExtension {
  /** Unique extension identifier */
  id: string;
  
  /** Extension version (for migrations) */
  version: number;
  
  /** Additional table schemas */
  tables: TableSchema[];
  
  /** Model classes for the tables */
  models: (typeof Model)[];
  
  /** Optional description */
  description?: string;
  
  /** Optional migrations for schema changes */
  migrations?: ExtensionMigration[];
}

export interface ExtensionMigration {
  toVersion: number;
  steps: MigrationStep[];
}

export type MigrationStep = 
  | { type: 'addColumn'; table: string; column: string; columnType: 'string' | 'number' | 'boolean'; isOptional?: boolean; isIndexed?: boolean }
  | { type: 'createTable'; schema: TableSchema }
  | { type: 'addIndex'; table: string; column: string }
  | { type: 'sql'; sql: string };

// =============================================================================
// REGISTRY
// =============================================================================

const extensionRegistry: Map<string, SchemaExtension> = new Map();

/**
 * Register a schema extension
 */
export function registerExtension(extension: SchemaExtension): void {
  if (extensionRegistry.has(extension.id)) {
    console.warn(`Schema extension "${extension.id}" already registered. Overwriting.`);
  }
  extensionRegistry.set(extension.id, extension);
  console.log(`📦 Registered schema extension: ${extension.id} (v${extension.version})`);
}

/**
 * Unregister a schema extension
 */
export function unregisterExtension(id: string): boolean {
  return extensionRegistry.delete(id);
}

/**
 * Get all registered extensions
 */
export function getExtensions(): SchemaExtension[] {
  return Array.from(extensionRegistry.values());
}

/**
 * Get extension by ID
 */
export function getExtension(id: string): SchemaExtension | undefined {
  return extensionRegistry.get(id);
}

/**
 * Check if an extension is registered
 */
export function hasExtension(id: string): boolean {
  return extensionRegistry.has(id);
}

/**
 * Get all extension table schemas
 */
export function getExtensionTables(): TableSchema[] {
  const tables: TableSchema[] = [];
  for (const ext of extensionRegistry.values()) {
    tables.push(...ext.tables);
  }
  return tables;
}

/**
 * Get all extension model classes
 */
export function getExtensionModels(): (typeof Model)[] {
  const models: (typeof Model)[] = [];
  for (const ext of extensionRegistry.values()) {
    models.push(...ext.models);
  }
  return models;
}

/**
 * Calculate combined schema version from core + extensions
 * Each extension's version is added to core version
 */
export function getCombinedSchemaVersion(coreVersion: number): number {
  let version = coreVersion;
  for (const ext of extensionRegistry.values()) {
    version += ext.version;
  }
  return version;
}

// =============================================================================
// BUILT-IN EXTENSIONS
// =============================================================================

/**
 * Forestry Extension — Tables for Forstbetriebe
 * 
 * Includes: planting_areas, seed_harvests, plant_stocks
 */
export const forestryExtensionSchema: SchemaExtension = {
  id: 'forestry',
  version: 1,
  description: 'Tables for forest planting operations',
  tables: [
    // Note: Table schemas should be imported from actual extension file
    // This is a placeholder showing the structure
  ],
  models: [],
};

/**
 * Landscaping Extension — Tables for Landschaftsbau
 * 
 * Includes: projects, measurements, materials
 */
export const landscapingExtensionSchema: SchemaExtension = {
  id: 'landscaping',
  version: 1,
  description: 'Tables for landscaping operations',
  tables: [],
  models: [],
};

/**
 * Construction Extension — Tables for Bau/Tiefbau
 * 
 * Includes: sites, safety_checks, equipment_logs
 */
export const constructionExtensionSchema: SchemaExtension = {
  id: 'construction',
  version: 1,
  description: 'Tables for construction operations',
  tables: [],
  models: [],
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  registerExtension,
  unregisterExtension,
  getExtensions,
  getExtension,
  hasExtension,
  getExtensionTables,
  getExtensionModels,
  getCombinedSchemaVersion,
};
