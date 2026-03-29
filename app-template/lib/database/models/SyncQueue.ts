/**
 * SyncQueue Model — Pending sync operations
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, json, readonly, date } from '@nozbe/watermelondb/decorators';

// Payload interface
export interface SyncPayload {
  [key: string]: unknown;
}

const sanitizePayload = (raw: unknown): SyncPayload => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as SyncPayload;
  }
  return {};
};

export type SyncOperation = 'create' | 'update' | 'delete';

export default class SyncQueue extends Model {
  static table = 'sync_queue';

  @text('entity_type') entityType!: string;
  @text('entity_id') entityId!: string;
  @text('operation') operation!: SyncOperation;
  @json('payload', sanitizePayload) payload!: SyncPayload;
  @field('attempts') attempts!: number;
  @text('last_error') lastError?: string;
  @readonly @date('created_at') createdAt!: Date;
  @field('next_retry_at') nextRetryAt?: number;

  // Max retry attempts before giving up
  static MAX_ATTEMPTS = 5;

  // Exponential backoff delay in ms
  get retryDelayMs(): number {
    const baseDelay = 1000;
    const maxDelay = 300000; // 5 minutes
    const delay = baseDelay * Math.pow(2, this.attempts);
    return Math.min(delay, maxDelay);
  }

  // Check if we should retry
  get shouldRetry(): boolean {
    return this.attempts < SyncQueue.MAX_ATTEMPTS;
  }

  // Check if ready to retry
  get isReadyToRetry(): boolean {
    if (!this.nextRetryAt) return true;
    return Date.now() >= this.nextRetryAt;
  }
}
