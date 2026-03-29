/**
 * Database Store — WatermelonDB Instance Management
 * 
 * Lazy initialization to avoid crash before auth.
 * Supports schema extensions for tenant-specific tables.
 * 
 * Usage:
 * 1. Register extensions before calling initDatabase()
 * 2. Call initDatabase() after user login
 * 3. Use getDb() to access the database instance
 */

import { create } from 'zustand';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { createSchema } from '../lib/database/schema';
import { coreModelClasses } from '../lib/database/models';
import { getExtensionModels } from '../lib/database/schemaExtensions';

// =============================================================================
// TYPES
// =============================================================================

interface DatabaseState {
  db: Database | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  
  initDatabase: () => Promise<void>;
  resetDatabase: () => Promise<void>;
}

// =============================================================================
// STORE
// =============================================================================

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  db: null,
  isInitialized: false,
  isInitializing: false,
  error: null,
  
  initDatabase: async () => {
    const { isInitialized, isInitializing } = get();
    
    if (isInitialized || isInitializing) {
      return;
    }
    
    set({ isInitializing: true, error: null });
    
    try {
      // Create schema with any registered extensions
      const schema = createSchema();
      
      // Combine core + extension models
      const extensionModels = getExtensionModels();
      const allModelClasses = [...coreModelClasses, ...extensionModels];
      
      console.log(`🗄️ Initializing WatermelonDB with ${allModelClasses.length} models`);
      
      const adapter = new SQLiteAdapter({
        schema,
        jsi: true,          // Enable JSI for better performance
        onSetUpError: (error) => {
          console.error('WatermelonDB setup error:', error);
        },
      });
      
      const database = new Database({
        adapter,
        modelClasses: allModelClasses,
      });
      
      set({
        db: database,
        isInitialized: true,
        isInitializing: false,
      });
      
      console.log('✅ WatermelonDB initialized');
    } catch (error) {
      console.error('❌ WatermelonDB initialization failed:', error);
      set({
        error: error instanceof Error ? error.message : 'Database init failed',
        isInitializing: false,
      });
    }
  },
  
  resetDatabase: async () => {
    const { db } = get();
    
    if (db) {
      try {
        await db.write(async () => {
          await db.unsafeResetDatabase();
        });
        console.log('🗑️ Database reset');
      } catch (error) {
        console.error('Database reset failed:', error);
      }
    }
    
    set({
      db: null,
      isInitialized: false,
    });
  },
}));

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get the database instance (throws if not initialized)
 */
export function getDb(): Database {
  const db = useDatabaseStore.getState().db;
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Get the database instance or null
 */
export function getDbOrNull(): Database | null {
  return useDatabaseStore.getState().db;
}

export default useDatabaseStore;
