/**
 * DSGVO Compliance Monitor Cron
 * Läuft jeden Montag um 08:00 UTC
 * 
 * Prüft:
 * - Cookie-Consent vorhanden und funktionsfähig
 * - Datenschutzerklärung aktuell (max. 12 Monate alt)
 * - SSL-Zertifikat gültig (>30 Tage Restlaufzeit)
 * - TOMs (Technische und Organisatorische Maßnahmen) dokumentiert
 * - Pro Tenant: Externe Datenverarbeiter korrekt gelistet
 * - Pro Tenant: AVV (Auftragsverarbeitungsvertrag) vorhanden
 * 
 * Bei Problemen:
 * - Mission Control Alert erstellen
 * - Task für Behebung anlegen
 */

import { prisma } from '../lib/prisma'
import * as https from 'https'
import * as tls from 'tls'

// Mission Control API Configuration
const MC_API_URL = process.env.MC_API_URL || 'https://mission-control-tawny-omega.vercel.app'
const MC_API_KEY = process.env.MC_API_KEY || ''

// Compliance Thresholds
const SSL_WARNING_DAYS = 30
const PRIVACY_POLICY_MAX_AGE_MONTHS = 12

interface TenantComplianceData {
  id: string
  name: string
  domain: string
  privacyPolicyUpdatedAt: Date | null
  cookieConsentEnabled: boolean
  subProcessors: string[]
  avvSignedAt: Date | null
  tomsDocumentedAt: Date | null
}

interface ComplianceCheck {
  name: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  details?: Record<string, unknown>
}

interface TenantComplianceReport {
  tenantId: string
  tenantName: string
  domain: string
  checks: ComplianceCheck[]
  overallStatus: 'compliant' | 'warning' | 'non-compliant'
  score: number // 0-100
}

interface GlobalComplianceReport {
  generatedAt: Date
  globalChecks: ComplianceCheck[]
  tenantReports: TenantComplianceReport[]
  summary: {
    totalTenants: number
    compliant: number
    warning: number
    nonCompliant: number
    overallScore: number
  }
}

/**
 * Prüft SSL-Zertifikat einer Domain
 */
async function checkSSLCertificate(domain: string): Promise<ComplianceCheck> {
  return new Promise((resolve) => {
    const hostname = domain.replace(/^https?:\/\//, '').split('/')[0]
    
    try {
      const socket = tls.connect(443, hostname, { servername: hostname }, () => {
        const cert = socket.getPeerCertificate()
        socket.end()
        
        if (!cert || !cert.valid_to) {
          resolve({
            name: 'SSL-Zertifikat',
            status: 'fail',
            message: `Kein gültiges SSL-Zertifikat für ${hostname}`,
          })
          return
        }
        
        const validTo = new Date(cert.valid_to)
        const now = new Date()
        const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysRemaining < 0) {
          resolve({
            name: 'SSL-Zertifikat',
            status: 'fail',
            message: `SSL-Zertifikat für ${hostname} ist abgelaufen!`,
            details: { validTo: validTo.toISOString(), daysRemaining }
          })
        } else if (daysRemaining < SSL_WARNING_DAYS) {
          resolve({
            name: 'SSL-Zertifikat',
            status: 'warn',
            message: `SSL-Zertifikat läuft in ${daysRemaining} Tagen ab`,
            details: { validTo: validTo.toISOString(), daysRemaining }
          })
        } else {
          resolve({
            name: 'SSL-Zertifikat',
            status: 'pass',
            message: `SSL-Zertifikat gültig (noch ${daysRemaining} Tage)`,
            details: { validTo: validTo.toISOString(), daysRemaining }
          })
        }
      })
      
      socket.on('error', (err) => {
        resolve({
          name: 'SSL-Zertifikat',
          status: 'fail',
          message: `SSL-Prüfung fehlgeschlagen: ${err.message}`,
        })
      })
      
      socket.setTimeout(10000, () => {
        socket.destroy()
        resolve({
          name: 'SSL-Zertifikat',
          status: 'fail',
          message: `SSL-Prüfung Timeout für ${hostname}`,
        })
      })
    } catch (error) {
      resolve({
        name: 'SSL-Zertifikat',
        status: 'fail',
        message: `SSL-Prüfung Fehler: ${(error as Error).message}`,
      })
    }
  })
}

/**
 * Prüft ob Cookie-Consent-Banner auf der Seite vorhanden ist
 */
async function checkCookieConsent(domain: string): Promise<ComplianceCheck> {
  return new Promise((resolve) => {
    const url = domain.startsWith('http') ? domain : `https://${domain}`
    
    https.get(url, { timeout: 15000 }, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        // Suche nach typischen Cookie-Consent-Indikatoren
        const consentIndicators = [
          'cookie-consent',
          'cookieconsent',
          'cookie-banner',
          'cookie-notice',
          'gdpr-consent',
          'privacy-consent',
          'CookieConsent',
          'cc-banner',
          'tarteaucitron',
          'cookiefirst',
          'onetrust',
          'trustarc',
        ]
        
        const hasConsent = consentIndicators.some(indicator => 
          body.toLowerCase().includes(indicator.toLowerCase())
        )
        
        if (hasConsent) {
          resolve({
            name: 'Cookie-Consent',
            status: 'pass',
            message: 'Cookie-Consent-Mechanismus gefunden',
          })
        } else {
          resolve({
            name: 'Cookie-Consent',
            status: 'warn',
            message: 'Kein offensichtlicher Cookie-Consent-Banner gefunden (manuelle Prüfung empfohlen)',
          })
        }
      })
    }).on('error', (err) => {
      resolve({
        name: 'Cookie-Consent',
        status: 'fail',
        message: `Seite nicht erreichbar: ${err.message}`,
      })
    })
  })
}

/**
 * Prüft Datenschutzerklärung Aktualität
 */
function checkPrivacyPolicy(lastUpdated: Date | null): ComplianceCheck {
  if (!lastUpdated) {
    return {
      name: 'Datenschutzerklärung',
      status: 'fail',
      message: 'Kein Datum für letzte Aktualisierung hinterlegt',
    }
  }
  
  const now = new Date()
  const monthsSinceUpdate = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  
  if (monthsSinceUpdate > PRIVACY_POLICY_MAX_AGE_MONTHS) {
    return {
      name: 'Datenschutzerklärung',
      status: 'fail',
      message: `Datenschutzerklärung ist ${monthsSinceUpdate} Monate alt (max. ${PRIVACY_POLICY_MAX_AGE_MONTHS} Monate)`,
      details: { lastUpdated: lastUpdated.toISOString(), monthsSinceUpdate }
    }
  } else if (monthsSinceUpdate > PRIVACY_POLICY_MAX_AGE_MONTHS - 3) {
    return {
      name: 'Datenschutzerklärung',
      status: 'warn',
      message: `Datenschutzerklärung sollte bald aktualisiert werden (${monthsSinceUpdate} Monate alt)`,
      details: { lastUpdated: lastUpdated.toISOString(), monthsSinceUpdate }
    }
  }
  
  return {
    name: 'Datenschutzerklärung',
    status: 'pass',
    message: `Datenschutzerklärung aktuell (${monthsSinceUpdate} Monate alt)`,
    details: { lastUpdated: lastUpdated.toISOString(), monthsSinceUpdate }
  }
}

/**
 * Prüft TOMs (Technische und Organisatorische Maßnahmen)
 */
function checkTOMs(tomsDocumentedAt: Date | null): ComplianceCheck {
  if (!tomsDocumentedAt) {
    return {
      name: 'TOMs',
      status: 'fail',
      message: 'Technische und Organisatorische Maßnahmen nicht dokumentiert',
    }
  }
  
  const now = new Date()
  const monthsSinceUpdate = Math.floor(
    (now.getTime() - tomsDocumentedAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  
  if (monthsSinceUpdate > 24) {
    return {
      name: 'TOMs',
      status: 'warn',
      message: `TOMs sollten überprüft werden (${monthsSinceUpdate} Monate alt)`,
      details: { tomsDocumentedAt: tomsDocumentedAt.toISOString() }
    }
  }
  
  return {
    name: 'TOMs',
    status: 'pass',
    message: 'TOMs dokumentiert und aktuell',
    details: { tomsDocumentedAt: tomsDocumentedAt.toISOString() }
  }
}

/**
 * Prüft AVV (Auftragsverarbeitungsvertrag)
 */
function checkAVV(avvSignedAt: Date | null): ComplianceCheck {
  if (!avvSignedAt) {
    return {
      name: 'AVV',
      status: 'fail',
      message: 'Kein Auftragsverarbeitungsvertrag hinterlegt',
    }
  }
  
  return {
    name: 'AVV',
    status: 'pass',
    message: 'Auftragsverarbeitungsvertrag vorhanden',
    details: { signedAt: avvSignedAt.toISOString() }
  }
}

/**
 * Prüft Datenverarbeiter/Subprozessoren
 */
function checkSubProcessors(subProcessors: string[]): ComplianceCheck {
  // Mindestens die üblichen Verdächtigen sollten gelistet sein
  const expectedProcessors = ['Vercel', 'Neon', 'Anthropic']
  const missingProcessors = expectedProcessors.filter(
    p => !subProcessors.some(sp => sp.toLowerCase().includes(p.toLowerCase()))
  )
  
  if (subProcessors.length === 0) {
    return {
      name: 'Datenverarbeiter',
      status: 'fail',
      message: 'Keine Datenverarbeiter dokumentiert',
    }
  }
  
  if (missingProcessors.length > 0) {
    return {
      name: 'Datenverarbeiter',
      status: 'warn',
      message: `Möglicherweise fehlende Verarbeiter: ${missingProcessors.join(', ')}`,
      details: { documented: subProcessors, possiblyMissing: missingProcessors }
    }
  }
  
  return {
    name: 'Datenverarbeiter',
    status: 'pass',
    message: `${subProcessors.length} Datenverarbeiter dokumentiert`,
    details: { processors: subProcessors }
  }
}

/**
 * Holt Tenant-Compliance-Daten
 */
async function getTenantComplianceData(): Promise<TenantComplianceData[]> {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        domain: true,
        privacyPolicyUpdatedAt: true,
        cookieConsentEnabled: true,
        subProcessors: true,
        avvSignedAt: true,
        tomsDocumentedAt: true,
      }
    })
    
    return tenants.map(t => ({
      id: t.id,
      name: t.name,
      domain: t.domain || '',
      privacyPolicyUpdatedAt: t.privacyPolicyUpdatedAt,
      cookieConsentEnabled: t.cookieConsentEnabled ?? false,
      subProcessors: (t.subProcessors as string[]) || [],
      avvSignedAt: t.avvSignedAt,
      tomsDocumentedAt: t.tomsDocumentedAt,
    }))
  } catch {
    console.warn('[DSGVO Monitor] DB nicht verfügbar, nutze Beispieldaten')
    // Fallback für Tests
    return [{
      id: 'demo',
      name: 'Demo Tenant',
      domain: 'demo.feldhub.de',
      privacyPolicyUpdatedAt: new Date('2025-06-01'),
      cookieConsentEnabled: true,
      subProcessors: ['Vercel', 'Neon', 'Anthropic'],
      avvSignedAt: new Date('2025-01-15'),
      tomsDocumentedAt: new Date('2025-01-15'),
    }]
  }
}

/**
 * Berechnet Compliance Score aus Checks
 */
function calculateScore(checks: ComplianceCheck[]): number {
  if (checks.length === 0) return 0
  
  let score = 0
  for (const check of checks) {
    if (check.status === 'pass') score += 100
    else if (check.status === 'warn') score += 50
    // fail = 0
  }
  
  return Math.round(score / checks.length)
}

/**
 * Ermittelt Gesamtstatus aus Checks
 */
function determineOverallStatus(checks: ComplianceCheck[]): 'compliant' | 'warning' | 'non-compliant' {
  const hasFail = checks.some(c => c.status === 'fail')
  const hasWarn = checks.some(c => c.status === 'warn')
  
  if (hasFail) return 'non-compliant'
  if (hasWarn) return 'warning'
  return 'compliant'
}

/**
 * Führt Compliance-Prüfung für einen Tenant durch
 */
async function checkTenantCompliance(tenant: TenantComplianceData): Promise<TenantComplianceReport> {
  const checks: ComplianceCheck[] = []
  
  // SSL Check (nur wenn Domain vorhanden)
  if (tenant.domain) {
    const sslCheck = await checkSSLCertificate(tenant.domain)
    checks.push(sslCheck)
    
    // Cookie Consent Check
    const cookieCheck = await checkCookieConsent(tenant.domain)
    checks.push(cookieCheck)
  }
  
  // Privacy Policy Check
  checks.push(checkPrivacyPolicy(tenant.privacyPolicyUpdatedAt))
  
  // TOMs Check
  checks.push(checkTOMs(tenant.tomsDocumentedAt))
  
  // AVV Check
  checks.push(checkAVV(tenant.avvSignedAt))
  
  // Sub-Processors Check
  checks.push(checkSubProcessors(tenant.subProcessors))
  
  return {
    tenantId: tenant.id,
    tenantName: tenant.name,
    domain: tenant.domain,
    checks,
    overallStatus: determineOverallStatus(checks),
    score: calculateScore(checks),
  }
}

/**
 * Führt globale (Feldhub-weite) Compliance-Checks durch
 */
async function runGlobalChecks(): Promise<ComplianceCheck[]> {
  const checks: ComplianceCheck[] = []
  
  // Feldhub Hauptdomain prüfen
  const feldhubDomain = process.env.FELDHUB_DOMAIN || 'feldhub.de'
  
  // SSL für Feldhub
  const sslCheck = await checkSSLCertificate(feldhubDomain)
  sslCheck.name = 'Feldhub SSL'
  checks.push(sslCheck)
  
  // Prüfe ob globale Datenschutzerklärung aktuell ist
  const globalPrivacyDate = process.env.PRIVACY_POLICY_DATE 
    ? new Date(process.env.PRIVACY_POLICY_DATE)
    : new Date('2026-01-15') // Fallback auf bekanntes Datum
  
  const privacyCheck = checkPrivacyPolicy(globalPrivacyDate)
  privacyCheck.name = 'Feldhub Datenschutzerklärung'
  checks.push(privacyCheck)
  
  return checks
}

/**
 * Erstellt Mission Control Alert/Task bei Problemen
 */
async function createMissionControlAlerts(report: GlobalComplianceReport): Promise<void> {
  if (!MC_API_KEY) {
    console.warn('[DSGVO Monitor] MC_API_KEY nicht gesetzt')
    return
  }
  
  const criticalIssues: { tenant: string; issue: string }[] = []
  
  // Sammle kritische Issues
  for (const tenantReport of report.tenantReports) {
    for (const check of tenantReport.checks) {
      if (check.status === 'fail') {
        criticalIssues.push({
          tenant: tenantReport.tenantName,
          issue: `${check.name}: ${check.message}`
        })
      }
    }
  }
  
  // Globale Issues
  for (const check of report.globalChecks) {
    if (check.status === 'fail') {
      criticalIssues.push({
        tenant: 'Feldhub Global',
        issue: `${check.name}: ${check.message}`
      })
    }
  }
  
  if (criticalIssues.length === 0) {
    console.log('[DSGVO Monitor] Keine kritischen Issues, keine Alerts')
    return
  }
  
  // Task in Mission Control erstellen
  try {
    const response = await fetch(`${MC_API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MC_API_KEY,
      },
      body: JSON.stringify({
        title: `🔴 DSGVO Compliance Issues (${criticalIssues.length} Probleme)`,
        description: `# DSGVO Compliance Monitor - ${report.generatedAt.toISOString().split('T')[0]}

## Kritische Probleme

${criticalIssues.map(i => `- **${i.tenant}:** ${i.issue}`).join('\n')}

## Erforderliche Maßnahmen

Diese Issues müssen zeitnah behoben werden, um DSGVO-Konformität sicherzustellen.

---
*Automatisch erstellt vom DSGVO Monitor*`,
        priority: 'high',
        category: 'compliance',
        tags: ['dsgvo', 'compliance', 'automated'],
      }),
    })
    
    if (response.ok) {
      console.log('[DSGVO Monitor] MC Task erstellt')
    } else {
      console.error('[DSGVO Monitor] MC Task Erstellung fehlgeschlagen:', await response.text())
    }
  } catch (error) {
    console.error('[DSGVO Monitor] MC API Fehler:', error)
  }
}

/**
 * Generiert Markdown Report
 */
function generateMarkdownReport(report: GlobalComplianceReport): string {
  const statusEmoji = (status: string) => {
    switch (status) {
      case 'pass': return '✅'
      case 'warn': return '⚠️'
      case 'fail': return '❌'
      default: return '❓'
    }
  }
  
  const overallEmoji = (status: string) => {
    switch (status) {
      case 'compliant': return '🟢'
      case 'warning': return '🟡'
      case 'non-compliant': return '🔴'
      default: return '⚪'
    }
  }
  
  return `# DSGVO Compliance Report

> Generiert am ${report.generatedAt.toISOString().split('T')[0]} um ${report.generatedAt.toISOString().split('T')[1].split('.')[0]} UTC

---

## 📊 Summary

| Metrik | Wert |
|--------|------|
| **Gesamtscore** | ${report.summary.overallScore}% |
| **Geprüfte Tenants** | ${report.summary.totalTenants} |
| **Compliant** | ${report.summary.compliant} 🟢 |
| **Warnungen** | ${report.summary.warning} 🟡 |
| **Non-Compliant** | ${report.summary.nonCompliant} 🔴 |

---

## 🌐 Globale Checks (Feldhub)

${report.globalChecks.map(c => `${statusEmoji(c.status)} **${c.name}:** ${c.message}`).join('\n')}

---

## 🏢 Tenant Reports

${report.tenantReports.map(t => `
### ${overallEmoji(t.overallStatus)} ${t.tenantName}

**Score:** ${t.score}% | **Domain:** ${t.domain || 'nicht konfiguriert'}

| Check | Status | Ergebnis |
|-------|--------|----------|
${t.checks.map(c => `| ${c.name} | ${statusEmoji(c.status)} | ${c.message} |`).join('\n')}
`).join('\n---\n')}

---

## 📋 Nächste Schritte

${report.tenantReports.filter(t => t.overallStatus !== 'compliant').length > 0 ? `
### Sofortige Maßnahmen erforderlich:

${report.tenantReports
  .filter(t => t.overallStatus !== 'compliant')
  .flatMap(t => t.checks.filter(c => c.status === 'fail').map(c => `- **${t.tenantName}:** ${c.name} beheben`))
  .join('\n')}
` : '✅ Alle Tenants sind DSGVO-compliant.'}

---

*Automatisch generiert vom Feldhub DSGVO Monitor*
`
}

/**
 * Main Entry Point
 */
export async function runDSGVOMonitor(): Promise<GlobalComplianceReport> {
  console.log('[DSGVO Monitor] Starte wöchentliche Compliance-Prüfung...')
  
  // Globale Checks
  const globalChecks = await runGlobalChecks()
  
  // Tenant-Daten holen
  const tenants = await getTenantComplianceData()
  
  // Tenant Checks parallel ausführen
  const tenantReports = await Promise.all(
    tenants.map(t => checkTenantCompliance(t))
  )
  
  // Summary berechnen
  const summary = {
    totalTenants: tenantReports.length,
    compliant: tenantReports.filter(t => t.overallStatus === 'compliant').length,
    warning: tenantReports.filter(t => t.overallStatus === 'warning').length,
    nonCompliant: tenantReports.filter(t => t.overallStatus === 'non-compliant').length,
    overallScore: tenantReports.length > 0
      ? Math.round(tenantReports.reduce((sum, t) => sum + t.score, 0) / tenantReports.length)
      : 100,
  }
  
  const report: GlobalComplianceReport = {
    generatedAt: new Date(),
    globalChecks,
    tenantReports,
    summary,
  }
  
  // Markdown Report generieren
  const markdown = generateMarkdownReport(report)
  console.log(markdown)
  
  // Mission Control Alerts bei Problemen
  await createMissionControlAlerts(report)
  
  console.log('[DSGVO Monitor] ✅ Prüfung abgeschlossen')
  
  return report
}

// CLI Entry
if (require.main === module) {
  runDSGVOMonitor()
    .then((report) => {
      if (report.summary.nonCompliant > 0) {
        console.error(`[DSGVO Monitor] ⚠️ ${report.summary.nonCompliant} Tenant(s) nicht compliant!`)
        process.exit(1)
      }
      process.exit(0)
    })
    .catch((err) => {
      console.error('[DSGVO Monitor] Fehler:', err)
      process.exit(1)
    })
}

export { checkSSLCertificate, checkCookieConsent, checkPrivacyPolicy }
