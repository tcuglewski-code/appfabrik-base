/**
 * Invoice Schema - Zod Validation für Rechnungsdaten
 * 
 * Alle Pflichtfelder nach deutschem Recht (§14 UStG):
 * - Vollständiger Name/Firma des Leistenden
 * - Vollständiger Name/Firma des Leistungsempfängers  
 * - Steuernummer oder USt-IdNr.
 * - Rechnungsdatum
 * - Rechnungsnummer (fortlaufend, einmalig)
 * - Leistungsbeschreibung
 * - Leistungszeitpunkt/-zeitraum
 * - Nettobetrag, Steuersatz, Steuerbetrag, Bruttobetrag
 * - Bei Steuerbefreiung: Hinweis auf Befreiungsgrund
 */

import { z } from 'zod'

// Address Schema (für Absender und Empfänger)
export const AddressSchema = z.object({
  company: z.string().min(1, 'Firmenname erforderlich'),
  name: z.string().optional(), // Ansprechpartner
  street: z.string().min(1, 'Straße erforderlich'),
  zip: z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
  city: z.string().min(1, 'Stadt erforderlich'),
  country: z.string().default('Deutschland'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  vatId: z.string().optional(), // USt-IdNr.
  taxNumber: z.string().optional(), // Steuernummer
})

export type Address = z.infer<typeof AddressSchema>

// Line Item Schema (einzelne Rechnungsposition)
export const LineItemSchema = z.object({
  position: z.number().int().positive(),
  description: z.string().min(1, 'Beschreibung erforderlich'),
  quantity: z.number().positive(),
  unit: z.string().default('Stück'), // Stück, Stunden, Monat, etc.
  unitPrice: z.number().nonnegative(), // Preis pro Einheit in EUR
  taxRate: z.number().min(0).max(100).default(19), // Steuersatz in %
  netAmount: z.number().nonnegative(), // quantity * unitPrice
  taxAmount: z.number().nonnegative(), // netAmount * (taxRate / 100)
  grossAmount: z.number().nonnegative(), // netAmount + taxAmount
})

export type LineItem = z.infer<typeof LineItemSchema>

// Payment Details Schema
export const PaymentDetailsSchema = z.object({
  method: z.enum(['sepa', 'bank_transfer', 'paypal', 'stripe']).default('sepa'),
  bankName: z.string().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  accountHolder: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  // SEPA Lastschrift
  sepaMandate: z.string().optional(),
  sepaCreditorId: z.string().optional(),
})

export type PaymentDetails = z.infer<typeof PaymentDetailsSchema>

// Vollständiges Invoice Schema
export const InvoiceSchema = z.object({
  // Meta
  invoiceNumber: z.string().min(1, 'Rechnungsnummer erforderlich'),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum im Format YYYY-MM-DD'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum im Format YYYY-MM-DD'),
  
  // Leistungszeitraum
  serviceDate: z.string().optional(), // Einzelnes Datum
  servicePeriodStart: z.string().optional(), // Zeitraum Start
  servicePeriodEnd: z.string().optional(), // Zeitraum Ende
  
  // Adressen
  sender: AddressSchema,
  recipient: AddressSchema,
  
  // Positionen
  lineItems: z.array(LineItemSchema).min(1, 'Mindestens eine Position erforderlich'),
  
  // Summen
  subtotalNet: z.number().nonnegative(), // Summe aller Netto-Beträge
  taxSummary: z.array(z.object({
    taxRate: z.number(),
    netAmount: z.number(),
    taxAmount: z.number(),
  })),
  totalTax: z.number().nonnegative(), // Summe aller Steuerbeträge
  totalGross: z.number().nonnegative(), // Bruttosumme
  
  // Zahlungsdetails
  paymentTerms: z.string().default('Zahlbar innerhalb von 14 Tagen ohne Abzug.'),
  paymentDueDays: z.number().int().positive().default(14),
  paymentDetails: PaymentDetailsSchema,
  
  // Optional
  notes: z.string().optional(), // Zusätzliche Hinweise
  footer: z.string().optional(), // Footer-Text
  
  // Status
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  
  // Steuerstatus
  reverseCharge: z.boolean().default(false), // Reverse-Charge Verfahren
  smallBusinessExemption: z.boolean().default(false), // Kleinunternehmerregelung §19 UStG
  
  // Branding
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#2D5A27'),
  
  // Tenant
  tenantId: z.string().optional(),
})

export type Invoice = z.infer<typeof InvoiceSchema>

/**
 * Berechnet Line Item Summen
 */
export function calculateLineItem(
  description: string,
  quantity: number,
  unitPrice: number,
  taxRate: number = 19,
  position: number = 1,
  unit: string = 'Stück'
): LineItem {
  const netAmount = Math.round(quantity * unitPrice * 100) / 100
  const taxAmount = Math.round(netAmount * (taxRate / 100) * 100) / 100
  const grossAmount = Math.round((netAmount + taxAmount) * 100) / 100
  
  return {
    position,
    description,
    quantity,
    unit,
    unitPrice,
    taxRate,
    netAmount,
    taxAmount,
    grossAmount,
  }
}

/**
 * Berechnet Invoice Summen aus Line Items
 */
export function calculateInvoiceTotals(lineItems: LineItem[]): {
  subtotalNet: number
  taxSummary: { taxRate: number; netAmount: number; taxAmount: number }[]
  totalTax: number
  totalGross: number
} {
  const subtotalNet = lineItems.reduce((sum, item) => sum + item.netAmount, 0)
  
  // Gruppiere nach Steuersatz
  const taxGroups = new Map<number, { netAmount: number; taxAmount: number }>()
  
  for (const item of lineItems) {
    const existing = taxGroups.get(item.taxRate) || { netAmount: 0, taxAmount: 0 }
    taxGroups.set(item.taxRate, {
      netAmount: existing.netAmount + item.netAmount,
      taxAmount: existing.taxAmount + item.taxAmount,
    })
  }
  
  const taxSummary = Array.from(taxGroups.entries())
    .map(([taxRate, amounts]) => ({
      taxRate,
      netAmount: Math.round(amounts.netAmount * 100) / 100,
      taxAmount: Math.round(amounts.taxAmount * 100) / 100,
    }))
    .sort((a, b) => b.taxRate - a.taxRate)
  
  const totalTax = Math.round(
    taxSummary.reduce((sum, t) => sum + t.taxAmount, 0) * 100
  ) / 100
  
  const totalGross = Math.round((subtotalNet + totalTax) * 100) / 100
  
  return {
    subtotalNet: Math.round(subtotalNet * 100) / 100,
    taxSummary,
    totalTax,
    totalGross,
  }
}

/**
 * Generiert nächste Rechnungsnummer
 */
export function generateInvoiceNumber(
  prefix: string = 'FH',
  year: number = new Date().getFullYear(),
  sequence: number = 1
): string {
  return `${prefix}-${year}-${String(sequence).padStart(5, '0')}`
}

/**
 * Berechnet Fälligkeitsdatum
 */
export function calculateDueDate(invoiceDate: string, dueDays: number = 14): string {
  const date = new Date(invoiceDate)
  date.setDate(date.getDate() + dueDays)
  return date.toISOString().split('T')[0]
}

/**
 * Validiert und erstellt vollständiges Invoice
 */
export function createInvoice(data: z.input<typeof InvoiceSchema>): Invoice {
  return InvoiceSchema.parse(data)
}

/**
 * Feldhub Standard-Absender (Platzhalter)
 */
export const FELDHUB_SENDER: Address = {
  company: '{{FELDHUB_COMPANY_NAME}}',
  name: '{{FELDHUB_CONTACT_NAME}}',
  street: '{{FELDHUB_STREET}}',
  zip: '{{FELDHUB_ZIP}}',
  city: '{{FELDHUB_CITY}}',
  country: 'Deutschland',
  email: '{{FELDHUB_EMAIL}}',
  phone: '{{FELDHUB_PHONE}}',
  vatId: '{{FELDHUB_VAT_ID}}',
}

/**
 * Feldhub Standard-Zahlungsdetails (Platzhalter)
 */
export const FELDHUB_PAYMENT: PaymentDetails = {
  method: 'sepa',
  bankName: '{{FELDHUB_BANK_NAME}}',
  iban: '{{FELDHUB_IBAN}}',
  bic: '{{FELDHUB_BIC}}',
  accountHolder: '{{FELDHUB_ACCOUNT_HOLDER}}',
}

export default InvoiceSchema
