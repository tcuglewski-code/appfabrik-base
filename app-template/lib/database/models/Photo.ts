/**
 * Photo Model — Fotos / Images
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators';

export default class Photo extends Model {
  static table = 'photos';
  
  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
    protocols: { type: 'belongs_to' as const, key: 'protocol_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @text('remote_id') remoteId?: string;
  @text('task_id') taskId?: string;
  @text('protocol_id') protocolId?: string;
  @text('user_id') userId!: string;
  @text('local_uri') localUri!: string;
  @text('remote_url') remoteUrl?: string;
  @text('caption') caption?: string;
  @text('photo_type') photoType!: string;
  @field('location_lat') locationLat?: number;
  @field('location_lng') locationLng?: number;
  @field('taken_at') takenAt!: number;
  @field('is_synced') isSynced!: boolean;
  @field('synced_at') syncedAt?: number;
  @readonly @date('created_at') createdAt!: Date;

  // Check if photo is uploaded
  get isUploaded(): boolean {
    return !!this.remoteUrl;
  }

  // Check if photo has location
  get hasLocation(): boolean {
    return this.locationLat !== null && this.locationLng !== null;
  }

  // Get display URI (remote if available, else local)
  get displayUri(): string {
    return this.remoteUrl || this.localUri;
  }
}
