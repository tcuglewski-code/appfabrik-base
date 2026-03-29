/**
 * AppFabrik App — WatermelonDB Model Classes
 * 
 * Core models for all field service apps.
 * Export all models from this file for easy import.
 */

export { default as User } from './User';
export { default as Task } from './Task';
export { default as TimeEntry } from './TimeEntry';
export { default as Protocol } from './Protocol';
export { default as Photo } from './Photo';
export { default as GpsTrack } from './GpsTrack';
export { default as SyncQueue } from './SyncQueue';
export { default as SyncMeta } from './SyncMeta';
export { default as Document } from './Document';
export { default as Notification } from './Notification';

// Re-export model array for Database initialization
import User from './User';
import Task from './Task';
import TimeEntry from './TimeEntry';
import Protocol from './Protocol';
import Photo from './Photo';
import GpsTrack from './GpsTrack';
import SyncQueue from './SyncQueue';
import SyncMeta from './SyncMeta';
import Document from './Document';
import Notification from './Notification';

/**
 * All core model classes for WatermelonDB initialization
 */
export const coreModelClasses = [
  User,
  Task,
  TimeEntry,
  Protocol,
  Photo,
  GpsTrack,
  SyncQueue,
  SyncMeta,
  Document,
  Notification,
];

export default coreModelClasses;
