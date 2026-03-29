'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import tenantConfig, { generateCssVariables, type TenantConfig } from './tenant';

// =============================================================================
// CONTEXT
// =============================================================================

interface TenantContextValue {
  config: TenantConfig;
  colors: TenantConfig['colors'];
  labels: TenantConfig['labels'];
  modules: TenantConfig['modules'];
  features: TenantConfig['features'];
  branche: TenantConfig['branche'];
}

const TenantContext = createContext<TenantContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface TenantProviderProps {
  children: ReactNode;
  config?: TenantConfig;
}

export function TenantProvider({ children, config = tenantConfig }: TenantProviderProps) {
  // Inject CSS variables into :root
  useEffect(() => {
    const cssVars = generateCssVariables(config);
    const root = document.documentElement;
    
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Set favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = config.branding.favicon;
    }
    
    // Set document title
    document.title = `${config.shortName} | ${config.tagline}`;
  }, [config]);
  
  const value = useMemo<TenantContextValue>(() => ({
    config,
    colors: config.colors,
    labels: config.labels,
    modules: config.modules,
    features: config.features,
    branche: config.branche,
  }), [config]);
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export function useConfig(): TenantConfig {
  return useTenant().config;
}

export function useColors(): TenantConfig['colors'] {
  return useTenant().colors;
}

export function useLabels(): TenantConfig['labels'] {
  return useTenant().labels;
}

export function useModules(): TenantConfig['modules'] {
  return useTenant().modules;
}

export function useFeatures(): TenantConfig['features'] {
  return useTenant().features;
}

export function useBranche(): TenantConfig['branche'] {
  return useTenant().branche;
}

/**
 * Prüft ob ein Modul aktiviert ist
 */
export function useModuleEnabled(moduleId: keyof TenantConfig['modules']): boolean {
  const modules = useModules();
  return modules[moduleId]?.enabled ?? false;
}

/**
 * Prüft ob ein Feature aktiviert ist
 */
export function useFeatureEnabled(featureId: keyof TenantConfig['features']): boolean {
  const features = useFeatures();
  return features[featureId] ?? false;
}

/**
 * Gibt ein Label zurück (mit Fallback)
 */
export function useLabel(labelId: keyof TenantConfig['labels']): string {
  const labels = useLabels();
  return labels[labelId] ?? labelId;
}

// =============================================================================
// EXPORTS
// =============================================================================

export { TenantContext };
