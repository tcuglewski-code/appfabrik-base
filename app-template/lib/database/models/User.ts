/**
 * User Model — Local cache of users
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, json, text } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';
  
  static associations = {
    time_entries: { type: 'has_many' as const, foreignKey: 'user_id' },
    protocols: { type: 'has_many' as const, foreignKey: 'user_id' },
    photos: { type: 'has_many' as const, foreignKey: 'user_id' },
    gps_tracks: { type: 'has_many' as const, foreignKey: 'user_id' },
  };

  @text('remote_id') remoteId!: string;
  @text('email') email!: string;
  @text('name') name!: string;
  @text('role') role!: string;
  @text('avatar_url') avatarUrl?: string;
  @text('phone') phone?: string;
  @field('is_active') isActive!: boolean;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
