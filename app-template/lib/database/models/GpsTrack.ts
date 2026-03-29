/**
 * GpsTrack Model — GPS Tracking Points
 */

import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class GpsTrack extends Model {
  static table = 'gps_tracks';
  
  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @text('remote_id') remoteId?: string;
  @text('user_id') userId!: string;
  @text('task_id') taskId?: string;
  @field('date') date!: number;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('accuracy') accuracy?: number;
  @field('altitude') altitude?: number;
  @field('speed') speed?: number;
  @field('recorded_at') recordedAt!: number;
  @field('is_synced') isSynced!: boolean;
  @field('synced_at') syncedAt?: number;

  // Check if point is accurate enough
  isAccurateEnough(thresholdMeters: number = 50): boolean {
    return this.accuracy !== null && this.accuracy <= thresholdMeters;
  }

  // Format as GeoJSON Point
  toGeoJSON(): { type: 'Point'; coordinates: [number, number, number?] } {
    return {
      type: 'Point',
      coordinates: this.altitude 
        ? [this.longitude, this.latitude, this.altitude]
        : [this.longitude, this.latitude],
    };
  }
}
