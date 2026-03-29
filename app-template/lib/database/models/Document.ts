/**
 * Document Model — Local document references
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators';

export default class Document extends Model {
  static table = 'documents';
  
  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @text('remote_id') remoteId?: string;
  @text('task_id') taskId?: string;
  @text('user_id') userId?: string;
  @text('title') title!: string;
  @text('file_type') fileType!: string;
  @text('local_uri') localUri?: string;
  @text('remote_url') remoteUrl?: string;
  @field('file_size') fileSize?: number;
  @field('is_cached') isCached!: boolean;
  @field('cached_at') cachedAt?: number;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;

  // Check if document is available offline
  get isAvailableOffline(): boolean {
    return this.isCached && !!this.localUri;
  }

  // Get display URI (local if cached, else remote)
  get displayUri(): string | undefined {
    return this.isCached ? this.localUri : this.remoteUrl;
  }

  // Format file size
  get fileSizeFormatted(): string {
    if (!this.fileSize) return '';
    
    const kb = this.fileSize / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  // Get file extension
  get extension(): string {
    if (this.fileType) return this.fileType;
    
    const url = this.remoteUrl || this.localUri || '';
    const match = url.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : '';
  }
}
