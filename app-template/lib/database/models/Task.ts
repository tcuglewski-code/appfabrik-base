/**
 * Task Model — Aufträge / Jobs
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, json } from '@nozbe/watermelondb/decorators';

// Metadata interface (stored as JSON)
export interface TaskMetadata {
  [key: string]: unknown;
}

const sanitizeMetadata = (raw: unknown): TaskMetadata => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as TaskMetadata;
  }
  return {};
};

export default class Task extends Model {
  static table = 'tasks';
  
  static associations = {
    time_entries: { type: 'has_many' as const, foreignKey: 'task_id' },
    protocols: { type: 'has_many' as const, foreignKey: 'task_id' },
    photos: { type: 'has_many' as const, foreignKey: 'task_id' },
    gps_tracks: { type: 'has_many' as const, foreignKey: 'task_id' },
    documents: { type: 'has_many' as const, foreignKey: 'task_id' },
  };

  @text('remote_id') remoteId!: string;
  @text('title') title!: string;
  @text('description') description?: string;
  @text('status') status!: string;
  @text('priority') priority!: string;
  @text('task_type') taskType!: string;
  @text('assigned_to') assignedTo?: string;
  @text('assigned_team') assignedTeam?: string;
  @text('customer_id') customerId?: string;
  @text('location_name') locationName?: string;
  @field('location_lat') locationLat?: number;
  @field('location_lng') locationLng?: number;
  @field('start_date') startDate?: number;
  @field('end_date') endDate?: number;
  @json('metadata', sanitizeMetadata) metadata!: TaskMetadata;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Helper to check if task is open
  get isOpen(): boolean {
    return this.status === 'open';
  }

  // Helper to check if task is completed
  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  // Helper to check if task has location
  get hasLocation(): boolean {
    return this.locationLat !== null && this.locationLng !== null;
  }
}
