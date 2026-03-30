/**
 * Output Schema für Voice-Onboarding-Assistent
 * 
 * Dieses Schema definiert die Struktur des Outputs, den die
 * isolierte Claude-Instanz nach dem Onboarding-Gespräch generiert.
 * 
 * Der Output wird NIEMALS automatisch verarbeitet — er dient als
 * Vorlage für das Feldhub-Team, das den Plan prüft und anpasst.
 */

import { z } from 'zod'

// ============================================================
// Sub-Schemas
// ============================================================

/**
 * Firmendaten aus dem Gespräch
 */
export const CompanyInfoSchema = z.object({
  name: z.string().describe('Firmenname'),
  legalForm: z.string().optional().describe('Rechtsform (GmbH, UG, etc.)'),
  industry: z.string().describe('Branche/Tätigkeitsfeld'),
  
  // Standorte
  headquarters: z.string().describe('Hauptsitz'),
  additionalLocations: z.array(z.string()).default([]).describe('Weitere Standorte'),
  operatingAreas: z.array(z.string()).default([]).describe('Einsatzgebiete'),
  
  // Größe
  totalEmployees: z.number().int().positive().describe('Mitarbeiter gesamt'),
  fieldWorkers: z.number().int().nonnegative().describe('Außendienstmitarbeiter'),
  officeWorkers: z.number().int().nonnegative().describe('Büro/Verwaltung'),
  
  // Kontakt
  primaryContact: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).describe('Hauptansprechpartner'),
  
  decisionMaker: z.object({
    name: z.string(),
    role: z.string(),
    sameAsPrimary: z.boolean().default(false),
  }).optional().describe('Entscheider (falls abweichend)'),
})

export type CompanyInfo = z.infer<typeof CompanyInfoSchema>

/**
 * Nutzergruppen
 */
export const UserGroupSchema = z.object({
  name: z.string().describe('Bezeichnung der Gruppe'),
  count: z.number().int().positive().describe('Anzahl Personen'),
  
  devices: z.array(z.enum([
    'desktop',
    'laptop', 
    'tablet',
    'smartphone',
  ])).describe('Genutzte Geräte'),
  
  workLocation: z.enum([
    'office',
    'field',
    'vehicle',
    'mixed',
    'remote',
  ]).describe('Arbeitsort'),
  
  internetAccess: z.enum([
    'always',
    'mostly',
    'sometimes',
    'rarely',
  ]).describe('Internetverfügbarkeit'),
  
  requiresOffline: z.boolean().default(false).describe('Offline-Fähigkeit benötigt'),
  
  mainTasks: z.array(z.string()).describe('Hauptaufgaben'),
  
  accessLevel: z.enum([
    'admin',
    'manager',
    'user',
    'readonly',
  ]).default('user').describe('Zugriffsebene'),
})

export type UserGroup = z.infer<typeof UserGroupSchema>

/**
 * Bestehende Software/Tools
 */
export const ExistingToolSchema = z.object({
  name: z.string().describe('Tool-Name'),
  category: z.enum([
    'office',
    'erp',
    'crm',
    'industry_specific',
    'accounting',
    'communication',
    'other',
  ]).describe('Kategorie'),
  usage: z.enum(['daily', 'weekly', 'occasionally', 'rarely']).describe('Nutzungshäufigkeit'),
  satisfaction: z.enum(['good', 'neutral', 'poor']).describe('Zufriedenheit'),
  painPoints: z.array(z.string()).default([]).describe('Probleme damit'),
  keepOrReplace: z.enum(['keep', 'replace', 'integrate', 'undecided']).describe('Behalten oder ersetzen'),
})

export type ExistingTool = z.infer<typeof ExistingToolSchema>

/**
 * Kernprozess
 */
export const CoreProcessSchema = z.object({
  name: z.string().describe('Prozessname'),
  description: z.string().describe('Kurzbeschreibung'),
  
  trigger: z.string().describe('Was löst den Prozess aus?'),
  steps: z.array(z.string()).describe('Hauptschritte'),
  outcome: z.string().describe('Ergebnis/Output'),
  
  involvedRoles: z.array(z.string()).describe('Beteiligte Rollen'),
  frequency: z.enum([
    'multiple_daily',
    'daily',
    'weekly',
    'monthly',
    'occasionally',
  ]).describe('Häufigkeit'),
  
  currentPainPoints: z.array(z.string()).default([]).describe('Aktuelle Probleme'),
  desiredImprovements: z.array(z.string()).default([]).describe('Gewünschte Verbesserungen'),
  
  priority: z.enum(['high', 'medium', 'low']).default('medium').describe('Priorität'),
})

export type CoreProcess = z.infer<typeof CoreProcessSchema>

/**
 * Anforderung/Feature
 */
export const RequirementSchema = z.object({
  title: z.string().describe('Kurztitel'),
  description: z.string().describe('Beschreibung'),
  
  category: z.enum([
    'core_workflow',
    'mobile_app',
    'customer_portal',
    'reporting',
    'integration',
    'automation',
    'documentation',
    'compliance',
    'other',
  ]).describe('Kategorie'),
  
  priority: z.enum(['must_have', 'should_have', 'nice_to_have', 'future']).describe('Priorität'),
  
  relatedProcess: z.string().optional().describe('Zugehöriger Prozess'),
  relatedUserGroups: z.array(z.string()).default([]).describe('Betroffene Nutzergruppen'),
  
  estimatedEffort: z.enum([
    'small',    // < 1 Tag
    'medium',   // 1-3 Tage
    'large',    // 1-2 Wochen
    'xlarge',   // > 2 Wochen
    'unknown',
  ]).default('unknown').describe('Geschätzter Aufwand'),
})

export type Requirement = z.infer<typeof RequirementSchema>

/**
 * Task für Mission Control
 */
export const SuggestedTaskSchema = z.object({
  title: z.string().describe('Task-Titel'),
  description: z.string().describe('Beschreibung'),
  
  phase: z.enum(['setup', 'phase1', 'phase2', 'phase3', 'future']).describe('Projektphase'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  
  category: z.enum([
    'configuration',
    'development',
    'data_migration',
    'training',
    'testing',
    'documentation',
    'integration',
  ]).describe('Task-Typ'),
  
  estimatedHours: z.number().optional().describe('Geschätzte Stunden'),
  
  dependencies: z.array(z.string()).default([]).describe('Abhängigkeiten (Task-Titel)'),
  
  // Diese Felder werden vom Feldhub-Team ausgefüllt
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
})

export type SuggestedTask = z.infer<typeof SuggestedTaskSchema>

// ============================================================
// Main Schema: Onboarding Output
// ============================================================

export const OnboardingOutputSchema = z.object({
  // Meta
  sessionId: z.string().describe('Session-ID'),
  generatedAt: z.string().datetime().describe('Erstellungszeitpunkt'),
  assistantVersion: z.string().default('1.0.0'),
  
  // Company
  company: CompanyInfoSchema,
  
  // Users
  userGroups: z.array(UserGroupSchema).min(1).describe('Nutzergruppen'),
  totalUsers: z.number().int().positive().describe('Gesamtzahl Nutzer'),
  requiresOfflineSupport: z.boolean().describe('Offline-Anforderung'),
  
  // Current State
  existingTools: z.array(ExistingToolSchema).describe('Bestehende Tools'),
  
  // Processes
  coreProcesses: z.array(CoreProcessSchema).min(1).describe('Kernprozesse'),
  
  // Requirements
  requirements: z.array(RequirementSchema).describe('Anforderungen'),
  
  // Suggested Tasks
  suggestedTasks: z.array(SuggestedTaskSchema).describe('Vorgeschlagene Tasks'),
  
  // Timeline
  timeline: z.object({
    desiredGoLive: z.string().optional().describe('Gewünschtes Go-Live Datum'),
    hardDeadline: z.string().optional().describe('Hartes Deadline'),
    constraints: z.array(z.string()).default([]).describe('Zeitliche Einschränkungen'),
  }),
  
  // Summary
  summary: z.object({
    topPriority: z.string().describe('Höchste Priorität (1 Satz)'),
    keyPainPoints: z.array(z.string()).max(5).describe('Wichtigste Schmerzpunkte'),
    successCriteria: z.array(z.string()).describe('Erfolgskriterien'),
    risks: z.array(z.string()).default([]).describe('Identifizierte Risiken'),
    notes: z.string().optional().describe('Zusätzliche Notizen'),
  }),
  
  // Validation (vom Team auszufüllen)
  validation: z.object({
    reviewedBy: z.string().optional(),
    reviewedAt: z.string().datetime().optional(),
    approved: z.boolean().default(false),
    adjustments: z.array(z.string()).default([]),
  }).default({}),
})

export type OnboardingOutput = z.infer<typeof OnboardingOutputSchema>

// ============================================================
// Helper Functions
// ============================================================

/**
 * Validiert Onboarding-Output
 */
export function validateOnboardingOutput(data: unknown): OnboardingOutput {
  return OnboardingOutputSchema.parse(data)
}

/**
 * Konvertiert Onboarding-Output zu Mission Control Tasks
 */
export function toMissionControlTasks(output: OnboardingOutput): Array<{
  title: string
  description: string
  priority: string
  category: string
  tags: string[]
}> {
  return output.suggestedTasks.map(task => ({
    title: task.title,
    description: `**Phase:** ${task.phase}\n\n${task.description}\n\n**Geschätzter Aufwand:** ${task.estimatedHours || 'TBD'} Stunden`,
    priority: task.priority,
    category: task.category,
    tags: [
      `phase:${task.phase}`,
      `onboarding:${output.company.name}`,
      task.category,
    ],
  }))
}

/**
 * Generiert Projektname für neuen Tenant
 */
export function generateProjectName(company: CompanyInfo): string {
  const slug = company.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
  
  return slug
}

export default OnboardingOutputSchema
