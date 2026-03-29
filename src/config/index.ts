/**
 * AppFabrik Config Module
 * 
 * Exportiert alle Konfigurationsfunktionen und -typen.
 */

// Tenant Configuration
export {
  default as tenantConfig,
  kochAufforstungConfig,
  generateCssVariables,
  hasPermission,
  getEnabledModules,
  formatNumber,
  type TenantConfig,
  type TenantColors,
  type TenantModule,
  type TenantRole,
  type TenantBrancheConfig,
  type TenantIntegration,
} from './tenant';

// Theme Provider & Hooks
export {
  TenantProvider,
  TenantContext,
  useTenant,
  useConfig,
  useColors,
  useLabels,
  useModules,
  useFeatures,
  useBranche,
  useModuleEnabled,
  useFeatureEnabled,
  useLabel,
} from './theme-provider';
