/**
 * AppFabrik App — WatermelonDB Migrations
 * 
 * Handles schema migrations for both core and extension tables.
 * 
 * Migration Strategy:
 * - Core migrations: defined here
 * - Extension migrations: defined in each extension file
 * - Combined version: CORE_VERSION + sum(EXTENSION_VERSIONS)
 */

import {
  schemaMigrations,
  createTable,
  addColumns,
  MigrationStep,
} from '@nozbe/watermelondb/Schema/migrations';
import { CORE_SCHEMA_VERSION, coreTables } from './schema';
import { getExtensions, getCombinedSchemaVersion } from './schemaExtensions';

// =============================================================================
// CORE MIGRATIONS
// =============================================================================

/**
 * Core schema migrations
 * Add new migration steps when updating CORE_SCHEMA_VERSION
 */
const coreMigrations: MigrationStep[] = [
  // Version 1 -> 2 (example)
  // {
  //   toVersion: 2,
  //   steps: [
  //     addColumns({
  //       table: 'tasks',
  //       columns: [
  //         { name: 'estimated_hours', type: 'number', isOptional: true },
  //       ],
  //     }),
  //   ],
  // },
];

// =============================================================================
// MIGRATION FACTORY
// =============================================================================

/**
 * Create migrations with extension support
 * Call this AFTER registering extensions
 */
export function createMigrations() {
  const allSteps: MigrationStep[] = [...coreMigrations];
  
  // Add extension migrations
  const extensions = getExtensions();
  for (const ext of extensions) {
    if (ext.migrations) {
      for (const migration of ext.migrations) {
        // Transform extension migration to WatermelonDB format
        // Note: This is simplified - real implementation would need version mapping
        allSteps.push(...transformExtensionMigration(migration));
      }
    }
  }
  
  const version = getCombinedSchemaVersion(CORE_SCHEMA_VERSION);
  
  return schemaMigrations({
    migrations: allSteps,
  });
}

/**
 * Transform extension migration format to WatermelonDB format
 */
function transformExtensionMigration(migration: {
  toVersion: number;
  steps: unknown[];
}): MigrationStep[] {
  // Simplified transformation - extend as needed
  return migration.steps.map(step => {
    const s = step as {
      type: string;
      table?: string;
      column?: string;
      columnType?: 'string' | 'number' | 'boolean';
      isOptional?: boolean;
      isIndexed?: boolean;
      schema?: { name: string };
    };
    
    if (s.type === 'addColumn' && s.table && s.column && s.columnType) {
      return addColumns({
        table: s.table,
        columns: [{
          name: s.column,
          type: s.columnType,
          isOptional: s.isOptional,
          isIndexed: s.isIndexed,
        }],
      });
    }
    
    if (s.type === 'createTable' && s.schema) {
      return createTable(s.schema as ReturnType<typeof createTable>);
    }
    
    // Fallback for unknown types
    return step as MigrationStep;
  });
}

// =============================================================================
// DEFAULT MIGRATIONS (core only)
// =============================================================================

export const migrations = schemaMigrations({
  migrations: coreMigrations,
});

export default migrations;
