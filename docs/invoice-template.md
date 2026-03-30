# Rechnungsvorlage mit Feldhub Branding

Vollständige Lösung zur automatisierten Rechnungserstellung für Feldhub Tenants.

## Überblick

Das Invoice-System besteht aus:

| Datei | Beschreibung |
|-------|--------------|
| `invoice-schema.ts` | Zod Schema für Rechnungsdaten |
| `invoice-template.html` | Handlebars HTML-Template |
| `invoice-generator.ts` | TypeScript Service (HTML → PDF) |
| `examples/invoice-example.json` | Beispiel-Rechnung |

## Features

- ✅ DSGVO/UStG-konforme Pflichtangaben
- ✅ Feldhub Branding (Forest Green #2D5A27)
- ✅ PDF-Generierung via Puppeteer
- ✅ A4 Format, druckoptimiert
- ✅ Mehrere Steuersätze (19%, 7%, 0%)
- ✅ Kleinunternehmerregelung (§19 UStG)
- ✅ Reverse-Charge Verfahren
- ✅ SEPA/Banküberweisung

## Installation

```bash
# Dependencies
npm install puppeteer handlebars zod

# Für Node.js ohne GUI
npm install puppeteer --save
```

## Verwendung

### Basis-Beispiel

```typescript
import { generateInvoicePDF } from '@/templates/invoice/invoice-generator'
import { createInvoice, calculateLineItem, calculateInvoiceTotals } from '@/templates/invoice/invoice-schema'

// Line Items erstellen
const items = [
  calculateLineItem('ForstManager Pro - Monatslizenz', 1, 599, 19, 1, 'Monat'),
  calculateLineItem('Mobile App Lizenzen', 5, 29, 19, 2, 'Lizenz'),
]

// Totals berechnen
const totals = calculateInvoiceTotals(items)

// Invoice erstellen
const invoice = createInvoice({
  invoiceNumber: 'FH-2026-00001',
  invoiceDate: '2026-03-31',
  dueDate: '2026-04-14',
  servicePeriodStart: '2026-03-01',
  servicePeriodEnd: '2026-03-31',
  
  sender: {
    company: 'Feldhub UG (haftungsbeschränkt)',
    street: 'Musterstraße 123',
    zip: '12345',
    city: 'Berlin',
    vatId: 'DE123456789',
  },
  
  recipient: {
    company: 'Koch Aufforstung GmbH',
    street: 'Waldweg 42',
    zip: '54321',
    city: 'Trier',
  },
  
  lineItems: items,
  ...totals,
  
  paymentDetails: {
    method: 'sepa',
    bankName: 'Deutsche Bank',
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    accountHolder: 'Feldhub UG',
  },
})

// PDF generieren
const pdfPath = await generateInvoicePDF(invoice, {
  outputPath: './invoices/FH-2026-00001.pdf',
})
```

### HTML Preview

```typescript
import { generateInvoicePreview } from '@/templates/invoice/invoice-generator'

const html = await generateInvoicePreview(invoice, {
  outputPath: './preview/invoice-preview.html',
})
```

### Batch-Generierung

```typescript
import { generateInvoiceBatch, cleanup } from '@/templates/invoice/invoice-generator'

const invoices = [invoice1, invoice2, invoice3]
const paths = await generateInvoiceBatch(invoices, './invoices/')

// Browser cleanup
await cleanup()
```

## Schema

### Pflichtfelder (§14 UStG)

| Feld | Beschreibung |
|------|--------------|
| `invoiceNumber` | Fortlaufende Rechnungsnummer |
| `invoiceDate` | Rechnungsdatum (YYYY-MM-DD) |
| `dueDate` | Fälligkeitsdatum |
| `sender` | Absender mit Firma, Adresse, USt-IdNr. |
| `recipient` | Empfänger mit Firma, Adresse |
| `lineItems` | Rechnungspositionen |
| `subtotalNet` | Nettosumme |
| `totalTax` | Steuersumme |
| `totalGross` | Bruttosumme |

### Line Item

```typescript
{
  position: 1,           // Position
  description: "...",    // Leistungsbeschreibung
  quantity: 1,           // Menge
  unit: "Monat",         // Einheit
  unitPrice: 599.00,     // Einzelpreis (netto)
  taxRate: 19,           // Steuersatz (%)
  netAmount: 599.00,     // Nettobetrag
  taxAmount: 113.81,     // Steuerbetrag
  grossAmount: 712.81,   // Bruttobetrag
}
```

### Steuersätze

| Satz | Verwendung |
|------|------------|
| 19% | Standard (Software, Services) |
| 7% | Ermäßigt (Bücher, bestimmte Leistungen) |
| 0% | Steuerbefreit (Export, Reverse-Charge) |

### Sonderfälle

**Kleinunternehmerregelung (§19 UStG):**

```typescript
{
  smallBusinessExemption: true,
  // → "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
}
```

**Reverse-Charge (§13b UStG):**

```typescript
{
  reverseCharge: true,
  // → "Steuerschuldnerschaft des Leistungsempfängers."
}
```

## Branding

### Farben

| Variable | Wert | Verwendung |
|----------|------|------------|
| `--primary` | #2D5A27 | Feldhub Forest Green |
| `--primary-dark` | #1E3D1A | Header, Buttons |
| `--white` | #FFFFFF | Hintergrund |

### Anpassung

```typescript
{
  primaryColor: '#2D5A27',  // Feldhub Standard
  logoUrl: 'https://...',   // Optional: Custom Logo
}
```

## API Integration

### Rechnung nach Generierung in DB speichern

```typescript
import { prisma } from '@/lib/prisma'

const dbInvoice = await prisma.invoice.create({
  data: {
    number: invoice.invoiceNumber,
    tenantId: invoice.tenantId,
    amount: invoice.totalGross * 100, // Cent
    status: 'sent',
    dueDate: new Date(invoice.dueDate),
    pdfPath: pdfPath,
  },
})
```

### Automatische Rechnungsnummer

```typescript
import { generateInvoiceNumber } from '@/templates/invoice/invoice-schema'

// Nächste freie Nummer aus DB holen
const lastInvoice = await prisma.invoice.findFirst({
  where: { number: { startsWith: 'FH-2026-' } },
  orderBy: { number: 'desc' },
})

const nextSeq = lastInvoice 
  ? parseInt(lastInvoice.number.split('-')[2]) + 1 
  : 1

const number = generateInvoiceNumber('FH', 2026, nextSeq)
// → "FH-2026-00001"
```

## CLI

```bash
# Beispiel-Rechnung generieren
npx ts-node templates/invoice/invoice-generator.ts

# Output: templates/invoice/examples/invoice-example.pdf
```

## Troubleshooting

### Puppeteer Sandbox Error

```bash
# Linux ohne GUI
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
npm install puppeteer
```

### Fonts fehlen

```bash
# Debian/Ubuntu
apt-get install fonts-liberation fonts-noto
```

### PDF leer/weiß

- CSS `print-color-adjust: exact` ist gesetzt
- Bilder müssen erreichbar sein (absolute URLs)

## Erweiterungen (geplant)

- [ ] QR-Code mit Zahlungsinformationen
- [ ] ZUGFeRD XML einbetten (E-Rechnung)
- [ ] E-Mail Versand Integration
- [ ] Automatische Mahnungen
