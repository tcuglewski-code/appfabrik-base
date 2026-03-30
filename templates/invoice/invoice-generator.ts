/**
 * Invoice Generator - HTML → PDF via Puppeteer
 * 
 * Features:
 * - Handlebars Template Rendering
 * - PDF Generation mit Puppeteer
 * - A4 Format, druckoptimiert
 * - Währungsformatierung (EUR)
 * - Datumsformatierung (deutsch)
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import Handlebars from 'handlebars'
import puppeteer, { Browser, Page } from 'puppeteer'
import { Invoice, InvoiceSchema } from './invoice-schema'

// Template-Pfad
const TEMPLATE_PATH = path.join(__dirname, 'invoice-template.html')

// Handlebars Helpers registrieren
Handlebars.registerHelper('formatCurrency', (value: number) => {
  if (typeof value !== 'number') return '0,00 €'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
})

Handlebars.registerHelper('formatDate', (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

Handlebars.registerHelper('if', function(this: unknown, conditional: unknown, options: Handlebars.HelperOptions) {
  if (conditional) {
    return options.fn(this)
  }
  return options.inverse(this)
})

/**
 * Singleton Browser Instance für Performance
 */
let browserInstance: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })
  }
  return browserInstance
}

async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close()
    browserInstance = null
  }
}

/**
 * Rendert Invoice-Daten in HTML Template
 */
async function renderInvoiceHTML(invoice: Invoice): Promise<string> {
  // Template laden
  const templateSource = await fs.readFile(TEMPLATE_PATH, 'utf-8')
  
  // Template kompilieren
  const template = Handlebars.compile(templateSource)
  
  // Daten für Template aufbereiten
  const templateData = {
    ...invoice,
    // Formatierte Datumswerte
    invoiceDate: formatDateDE(invoice.invoiceDate),
    dueDate: formatDateDE(invoice.dueDate),
    serviceDate: invoice.serviceDate ? formatDateDE(invoice.serviceDate) : null,
    servicePeriodStart: invoice.servicePeriodStart ? formatDateDE(invoice.servicePeriodStart) : null,
    servicePeriodEnd: invoice.servicePeriodEnd ? formatDateDE(invoice.servicePeriodEnd) : null,
  }
  
  // Template rendern
  return template(templateData)
}

/**
 * Formatiert Datum im deutschen Format
 */
function formatDateDE(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

/**
 * Generiert PDF aus HTML
 */
async function generatePDFFromHTML(html: string): Promise<Buffer> {
  const browser = await getBrowser()
  let page: Page | null = null
  
  try {
    page = await browser.newPage()
    
    // HTML laden
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000,
    })
    
    // PDF generieren
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
    })
    
    return Buffer.from(pdfBuffer)
  } finally {
    if (page) {
      await page.close()
    }
  }
}

/**
 * Hauptfunktion: Generiert Invoice PDF
 */
export async function generateInvoicePDF(
  invoiceData: Invoice | Record<string, unknown>,
  options: {
    outputPath?: string
    returnBuffer?: boolean
    validateSchema?: boolean
  } = {}
): Promise<Buffer | string> {
  const {
    outputPath,
    returnBuffer = false,
    validateSchema = true,
  } = options
  
  // Optional: Schema validieren
  let invoice: Invoice
  if (validateSchema) {
    invoice = InvoiceSchema.parse(invoiceData)
  } else {
    invoice = invoiceData as Invoice
  }
  
  console.log(`[Invoice Generator] Generiere Rechnung ${invoice.invoiceNumber}...`)
  
  // HTML rendern
  const html = await renderInvoiceHTML(invoice)
  
  // PDF generieren
  const pdfBuffer = await generatePDFFromHTML(html)
  
  // Speichern falls outputPath angegeben
  if (outputPath) {
    const dir = path.dirname(outputPath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(outputPath, pdfBuffer)
    console.log(`[Invoice Generator] PDF gespeichert: ${outputPath}`)
    
    if (!returnBuffer) {
      return outputPath
    }
  }
  
  return pdfBuffer
}

/**
 * Generiert HTML Preview (ohne PDF)
 */
export async function generateInvoicePreview(
  invoiceData: Invoice | Record<string, unknown>,
  options: {
    outputPath?: string
    validateSchema?: boolean
  } = {}
): Promise<string> {
  const { outputPath, validateSchema = true } = options
  
  let invoice: Invoice
  if (validateSchema) {
    invoice = InvoiceSchema.parse(invoiceData)
  } else {
    invoice = invoiceData as Invoice
  }
  
  const html = await renderInvoiceHTML(invoice)
  
  if (outputPath) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, html)
    console.log(`[Invoice Generator] HTML Preview gespeichert: ${outputPath}`)
  }
  
  return html
}

/**
 * Batch-Generierung mehrerer Rechnungen
 */
export async function generateInvoiceBatch(
  invoices: Invoice[],
  outputDir: string
): Promise<string[]> {
  await fs.mkdir(outputDir, { recursive: true })
  
  const results: string[] = []
  
  for (const invoice of invoices) {
    const filename = `${invoice.invoiceNumber.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`
    const outputPath = path.join(outputDir, filename)
    
    await generateInvoicePDF(invoice, { outputPath })
    results.push(outputPath)
  }
  
  return results
}

/**
 * Cleanup: Browser schließen
 */
export async function cleanup(): Promise<void> {
  await closeBrowser()
}

// CLI Entry
if (require.main === module) {
  const examplePath = path.join(__dirname, 'examples', 'invoice-example.json')
  
  fs.readFile(examplePath, 'utf-8')
    .then(async (content) => {
      const invoiceData = JSON.parse(content)
      const outputPath = path.join(__dirname, 'examples', 'invoice-example.pdf')
      
      await generateInvoicePDF(invoiceData, { outputPath })
      await cleanup()
      
      console.log('[Invoice Generator] ✅ Beispiel-Rechnung generiert')
    })
    .catch((err) => {
      console.error('[Invoice Generator] Fehler:', err)
      process.exit(1)
    })
}

export { renderInvoiceHTML, generatePDFFromHTML, getBrowser, closeBrowser }
