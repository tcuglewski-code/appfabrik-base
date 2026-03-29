/**
 * TimeEntry Model — Zeiterfassung
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, relation } from '@nozbe/watermelondb/decorators';

export default class TimeEntry extends Model {
  static table = 'time_entries';
  
  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
  };

  @text('remote_id') remoteId?: string;
  @text('user_id') userId!: string;
  @text('task_id') taskId?: string;
  @field('date') date!: number;
  @field('start_time') startTime!: number;
  @field('end_time') endTime?: number;
  @field('break_minutes') breakMinutes!: number;
  @text('description') description?: string;
  @field('location_lat') locationLat?: number;
  @field('location_lng') locationLng?: number;
  @field('is_synced') isSynced!: boolean;
  @field('synced_at') syncedAt?: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Calculate duration in minutes
  get durationMinutes(): number {
    if (!this.endTime) return 0;
    const totalMinutes = (this.endTime - this.startTime) / 60000;
    return Math.max(0, totalMinutes - this.breakMinutes);
  }

  // Format duration as HH:MM
  get durationFormatted(): string {
    const mins = this.durationMinutes;
    const hours = Math.floor(mins / 60);
    const minutes = Math.round(mins % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Check if entry is active (no end time)
  get isActive(): boolean {
    return !this.endTime;
  }
}
