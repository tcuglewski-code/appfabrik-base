/**
 * Protocol Model — Protokolle / Reports
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, json } from '@nozbe/watermelondb/decorators';

// Protocol content interface (stored as JSON)
export interface ProtocolContent {
  [key: string]: unknown;
}

const sanitizeContent = (raw: unknown): ProtocolContent => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as ProtocolContent;
  }
  return {};
};

export default class Protocol extends Model {
  static table = 'protocols';
  
  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
    users: { type: 'belongs_to' as const, key: 'user_id' },
    photos: { type: 'has_many' as const, foreignKey: 'protocol_id' },
  };

  @text('remote_id') remoteId?: string;
  @text('task_id') taskId!: string;
  @text('user_id') userId!: string;
  @field('date') date!: number;
  @text('protocol_type') protocolType!: string;
  @text('status') status!: string;
  @json('content', sanitizeContent) content!: ProtocolContent;
  @text('notes') notes?: string;
  @text('signature_data') signatureData?: string;
  @text('signature_name') signatureName?: string;
  @field('signature_date') signatureDate?: number;
  @field('is_synced') isSynced!: boolean;
  @field('synced_at') syncedAt?: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Check if protocol is signed
  get isSigned(): boolean {
    return !!this.signatureData;
  }

  // Check if protocol is submitted
  get isSubmitted(): boolean {
    return this.status === 'submitted' || this.status === 'approved';
  }

  // Check if protocol can be edited
  get isEditable(): boolean {
    return this.status === 'draft';
  }
}
