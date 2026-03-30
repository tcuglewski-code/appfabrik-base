/**
 * Tenant Registry
 * 
 * Importiert alle Tenant-Konfigurationen und registriert sie.
 * Neue Tenants hier hinzufügen.
 */

// Import all tenants (registration happens on import)
import './demo';
import './koch-aufforstung';

// Re-export for convenience
export { demoTenant } from './demo';
export { kochAufforstungTenant } from './koch-aufforstung';

// Re-export main tenant functions
export {
  getCurrentTenant,
  getTenant,
  getRegisteredTenants,
  registerTenant,
  validateTenantConfig,
  safeParseTenantConfig,
  tenantConfig,
} from '../tenant';
