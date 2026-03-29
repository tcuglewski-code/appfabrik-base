/**
 * Forestry Schema Extension — Tables for Forstbetriebe
 * 
 * Aktiviert für: Koch Aufforstung und andere Forstbetriebe
 * 
 * Tables:
 * - planting_areas: Pflanzflächen mit Koordinaten
 * - seed_harvests: Saatguternten
 * - plant_stocks: Pflanzgutbestände im Lager
 * - inspections: Försterabnahmen
 */

import { tableSchema } from '@nozbe/watermelondb';
import { Model } from '@nozbe/watermelondb';
import { field, text, json, readonly, date } from '@nozbe/watermelondb/decorators';
import { SchemaExtension } from '../schemaExtensions';

// =============================================================================
// TABLE SCHEMAS
// =============================================================================

const plantingAreasTable = tableSchema({
  name: 'planting_areas',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'task_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string' },
    { name: 'size_ha', type: 'number' },
    { name: 'tree_species', type: 'string' },
    { name: 'plant_count', type: 'number' },
    { name: 'plant_spacing_m', type: 'number' },
    { name: 'geojson', type: 'string', isOptional: true },  // GeoJSON polygon
    { name: 'center_lat', type: 'number', isOptional: true },
    { name: 'center_lng', type: 'number', isOptional: true },
    { name: 'forstamt', type: 'string', isOptional: true },
    { name: 'revier', type: 'string', isOptional: true },
    { name: 'abteilung', type: 'string', isOptional: true },
    { name: 'status', type: 'string' },  // planned, in_progress, completed, inspected
    { name: 'metadata', type: 'string', isOptional: true },
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

const seedHarvestsTable = tableSchema({
  name: 'seed_harvests',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'tree_species', type: 'string', isIndexed: true },
    { name: 'harvest_date', type: 'number', isIndexed: true },
    { name: 'location_name', type: 'string' },
    { name: 'location_lat', type: 'number', isOptional: true },
    { name: 'location_lng', type: 'number', isOptional: true },
    { name: 'quantity_kg', type: 'number' },
    { name: 'quality_grade', type: 'string' },  // A, B, C
    { name: 'moisture_percent', type: 'number', isOptional: true },
    { name: 'collector_id', type: 'string' },
    { name: 'certificate_id', type: 'string', isOptional: true },
    { name: 'notes', type: 'string', isOptional: true },
    { name: 'photos', type: 'string', isOptional: true },  // JSON array of photo IDs
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
  ],
});

const plantStocksTable = tableSchema({
  name: 'plant_stocks',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'tree_species', type: 'string', isIndexed: true },
    { name: 'age_years', type: 'number' },
    { name: 'height_cm', type: 'string' },  // Range e.g. "30-50"
    { name: 'root_type', type: 'string' },  // bare_root, container
    { name: 'quantity', type: 'number' },
    { name: 'reserved_quantity', type: 'number' },
    { name: 'supplier', type: 'string', isOptional: true },
    { name: 'delivery_date', type: 'number', isOptional: true },
    { name: 'storage_location', type: 'string', isOptional: true },
    { name: 'price_per_unit', type: 'number', isOptional: true },
    { name: 'certificate_id', type: 'string', isOptional: true },
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

const inspectionsTable = tableSchema({
  name: 'inspections',
  columns: [
    { name: 'remote_id', type: 'string', isIndexed: true },
    { name: 'planting_area_id', type: 'string', isIndexed: true },
    { name: 'task_id', type: 'string', isIndexed: true },
    { name: 'inspector_id', type: 'string' },
    { name: 'inspector_name', type: 'string' },
    { name: 'inspection_date', type: 'number', isIndexed: true },
    { name: 'quality_rating', type: 'number' },  // 1-5
    { name: 'completeness_percent', type: 'number' },
    { name: 'rework_required', type: 'boolean' },
    { name: 'rework_notes', type: 'string', isOptional: true },
    { name: 'signature_data', type: 'string', isOptional: true },
    { name: 'signature_date', type: 'number', isOptional: true },
    { name: 'photos', type: 'string', isOptional: true },
    { name: 'notes', type: 'string', isOptional: true },
    { name: 'synced_at', type: 'number' },
    { name: 'created_at', type: 'number' },
  ],
});

// =============================================================================
// MODEL CLASSES
// =============================================================================

interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

const sanitizeGeoJSON = (raw: unknown): GeoJSONPolygon | null => {
  if (typeof raw === 'object' && raw !== null) {
    return raw as GeoJSONPolygon;
  }
  return null;
};

export class PlantingArea extends Model {
  static table = 'planting_areas';
  
  static associations = {
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
    inspections: { type: 'has_many' as const, foreignKey: 'planting_area_id' },
  };

  @text('remote_id') remoteId!: string;
  @text('task_id') taskId!: string;
  @text('name') name!: string;
  @field('size_ha') sizeHa!: number;
  @text('tree_species') treeSpecies!: string;
  @field('plant_count') plantCount!: number;
  @field('plant_spacing_m') plantSpacingM!: number;
  @json('geojson', sanitizeGeoJSON) geojson?: GeoJSONPolygon | null;
  @field('center_lat') centerLat?: number;
  @field('center_lng') centerLng?: number;
  @text('forstamt') forstamt?: string;
  @text('revier') revier?: string;
  @text('abteilung') abteilung?: string;
  @text('status') status!: string;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  get isCompleted(): boolean {
    return this.status === 'completed' || this.status === 'inspected';
  }

  get plantsPerHa(): number {
    if (this.sizeHa === 0) return 0;
    return Math.round(this.plantCount / this.sizeHa);
  }
}

export class SeedHarvest extends Model {
  static table = 'seed_harvests';

  @text('remote_id') remoteId!: string;
  @text('tree_species') treeSpecies!: string;
  @field('harvest_date') harvestDate!: number;
  @text('location_name') locationName!: string;
  @field('location_lat') locationLat?: number;
  @field('location_lng') locationLng?: number;
  @field('quantity_kg') quantityKg!: number;
  @text('quality_grade') qualityGrade!: string;
  @field('moisture_percent') moisturePercent?: number;
  @text('collector_id') collectorId!: string;
  @text('certificate_id') certificateId?: string;
  @text('notes') notes?: string;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;
}

export class PlantStock extends Model {
  static table = 'plant_stocks';

  @text('remote_id') remoteId!: string;
  @text('tree_species') treeSpecies!: string;
  @field('age_years') ageYears!: number;
  @text('height_cm') heightCm!: string;
  @text('root_type') rootType!: string;
  @field('quantity') quantity!: number;
  @field('reserved_quantity') reservedQuantity!: number;
  @text('supplier') supplier?: string;
  @field('delivery_date') deliveryDate?: number;
  @text('storage_location') storageLocation?: string;
  @field('price_per_unit') pricePerUnit?: number;
  @text('certificate_id') certificateId?: string;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  get availableQuantity(): number {
    return this.quantity - this.reservedQuantity;
  }

  get isLowStock(): boolean {
    return this.availableQuantity < 100;
  }
}

export class Inspection extends Model {
  static table = 'inspections';
  
  static associations = {
    planting_areas: { type: 'belongs_to' as const, key: 'planting_area_id' },
    tasks: { type: 'belongs_to' as const, key: 'task_id' },
  };

  @text('remote_id') remoteId!: string;
  @text('planting_area_id') plantingAreaId!: string;
  @text('task_id') taskId!: string;
  @text('inspector_id') inspectorId!: string;
  @text('inspector_name') inspectorName!: string;
  @field('inspection_date') inspectionDate!: number;
  @field('quality_rating') qualityRating!: number;
  @field('completeness_percent') completenessPercent!: number;
  @field('rework_required') reworkRequired!: boolean;
  @text('rework_notes') reworkNotes?: string;
  @text('signature_data') signatureData?: string;
  @field('signature_date') signatureDate?: number;
  @text('notes') notes?: string;
  @field('synced_at') syncedAt!: number;
  @readonly @date('created_at') createdAt!: Date;

  get isSigned(): boolean {
    return !!this.signatureData;
  }

  get isPassed(): boolean {
    return this.qualityRating >= 3 && !this.reworkRequired;
  }
}

// =============================================================================
// EXTENSION EXPORT
// =============================================================================

export const forestryExtension: SchemaExtension = {
  id: 'forestry',
  version: 1,
  description: 'Tables for forest planting operations (Forstbetriebe)',
  tables: [
    plantingAreasTable,
    seedHarvestsTable,
    plantStocksTable,
    inspectionsTable,
  ],
  models: [
    PlantingArea,
    SeedHarvest,
    PlantStock,
    Inspection,
  ],
};

export default forestryExtension;
