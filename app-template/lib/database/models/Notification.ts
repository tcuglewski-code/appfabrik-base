/**
 * Notification Model — Local notification cache
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, json } from '@nozbe/watermelondb/decorators';

// Notification data interface
export interface NotificationData {
  route?: string;
  params?: Record<string, unknown>;
  [key: string]: unknown;
}

const sanitizeData = (raw: unknown): NotificationData => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as NotificationData;
  }
  return {};
};

export default class Notification extends Model {
  static table = 'notifications';

  @text('remote_id') remoteId?: string;
  @text('title') title!: string;
  @text('body') body!: string;
  @json('data', sanitizeData) data!: NotificationData;
  @text('notification_type') notificationType!: string;
  @field('is_read') isRead!: boolean;
  @field('received_at') receivedAt!: number;
  @field('read_at') readAt?: number;

  // Mark as read (returns update function for batch)
  prepareMarkAsRead() {
    return this.prepareUpdate((notification) => {
      notification.isRead = true;
      notification.readAt = Date.now();
    });
  }

  // Format received time
  get receivedFormatted(): string {
    const seconds = Math.floor((Date.now() - this.receivedAt) / 1000);
    
    if (seconds < 60) return 'Gerade eben';
    if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min`;
    if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std`;
    return new Date(this.receivedAt).toLocaleDateString('de-DE');
  }

  // Check if notification has navigation data
  get hasNavigation(): boolean {
    return !!this.data?.route;
  }
}
