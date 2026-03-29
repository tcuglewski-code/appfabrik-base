/**
 * SyncMeta Model — Sync state per entity type
 */

import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class SyncMeta extends Model {
  static table = 'sync_meta';

  @text('entity_type') entityType!: string;
  @field('last_pull_at') lastPullAt!: number;
  @field('last_push_at') lastPushAt!: number;
  @text('cursor') cursor?: string;

  // Check if entity type needs sync (older than threshold)
  needsSync(thresholdMs: number = 300000): boolean {
    const lastSync = Math.max(this.lastPullAt, this.lastPushAt);
    return Date.now() - lastSync > thresholdMs;
  }

  // Format last sync as relative time
  get lastSyncFormatted(): string {
    const lastSync = Math.max(this.lastPullAt, this.lastPushAt);
    if (!lastSync) return 'Nie';
    
    const seconds = Math.floor((Date.now() - lastSync) / 1000);
    
    if (seconds < 60) return 'Gerade eben';
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min`;
    if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std`;
    return `vor ${Math.floor(seconds / 86400)} Tagen`;
  }
}
