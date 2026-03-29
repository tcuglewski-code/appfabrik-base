/**
 * Database Store — WatermelonDB Instance Management
 * 
 * Lazy initialization to avoid crash before auth.
 */

import { create } from 'zustand';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from '../lib/database/schema';

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
      const adapter = new SQLiteAdapter({
        schema,
        jsi: true,          // Enable JSI for better performance
        onSetUpError: (error) => {
          console.error('WatermelonDB setup error:', error);
        },
      });
      
      const database = new Database({
        adapter,
        modelClasses: [
          // Import model classes here
          // User, Task, TimeEntry, Protocol, Photo, etc.
        ],
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
