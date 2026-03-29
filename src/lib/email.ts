// Sprint FQ (B4): SMTP Email-Lib
// Sendet Emails nur wenn SMTP_PASS konfiguriert ist

import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content?: string | Buffer
    path?: string
    contentType?: string
  }>
}

interface EmailResult {
  skipped?: boolean
  messageId?: string
  error?: string
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions): Promise<EmailResult> {
  // Ohne SMTP_PASS keine Emails senden
  if (!process.env.SMTP_PASS) {
    console.warn('[email] SMTP_PASS nicht gesetzt — Email übersprungen')
    return { skipped: true }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'w01a09f3.kasserver.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      attachments,
    })

    console.log('[email] Gesendet:', info.messageId)
    return { messageId: info.messageId }
  } catch (error) {
    console.error('[email] Fehler:', error)
    return { error: String(error) }
  }
}

// ─── Email-Vorlagen ───────────────────────────────────────────────────────────

export function rechnungEmailHtml(daten: {
  rechnungNummer: string
  kundenName: string
  betrag: number
  faelligAm?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #2C3A1C; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2C3A1C; }
        .betrag { font-size: 28px; font-weight: bold; color: #2C3A1C; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Koch Aufforstung GmbH</div>
        </div>
        
        <p>Sehr geehrte/r ${daten.kundenName},</p>
        
        <p>anbei erhalten Sie Ihre Rechnung <strong>${daten.rechnungNummer}</strong>.</p>
        
        <p class="betrag">${daten.betrag.toFixed(2)} €</p>
        
        ${daten.faelligAm ? `<p>Zahlbar bis: <strong>${new Date(daten.faelligAm).toLocaleDateString('de-DE')}</strong></p>` : ''}
        
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
        
        <p>Mit freundlichen Grüßen<br>
        Ihr Team der Koch Aufforstung GmbH</p>
        
        <div class="footer">
          <p>
            Koch Aufforstung GmbH<br>
            Diese E-Mail wurde automatisch generiert.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ─── Legacy Email Service API ────────────────────────────────────────────────
// Abwärtskompatibilität für alte Aufrufe (emailService.xxx)

export const emailService = {
  async auftragErstellt(daten: {
    auftragId: string
    auftragNummer: string
    auftragTitel: string
    waldbesitzerName?: string
    waldbesitzerEmail?: string
    flaeche_ha?: number
    standort?: string
  }) {
    // Nur an Admin/Büro benachrichtigen, nicht an Waldbesitzer
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER
    if (!adminEmail) return { skipped: true }

    return sendEmail({
      to: adminEmail,
      subject: `Neuer Auftrag: ${daten.auftragNummer} - ${daten.auftragTitel}`,
      html: `
        <h2>Neuer Auftrag erstellt</h2>
        <p><strong>Nummer:</strong> ${daten.auftragNummer}</p>
        <p><strong>Titel:</strong> ${daten.auftragTitel}</p>
        ${daten.waldbesitzerName ? `<p><strong>Waldbesitzer:</strong> ${daten.waldbesitzerName}</p>` : ''}
        ${daten.standort ? `<p><strong>Standort:</strong> ${daten.standort}</p>` : ''}
        ${daten.flaeche_ha ? `<p><strong>Fläche:</strong> ${daten.flaeche_ha} ha</p>` : ''}
      `,
    })
  },

  async auftragStatusUpdate(daten: {
    auftragNummer: string
    auftragTitel: string
    neuerStatus: string
    waldbesitzerEmail?: string
    kundenName?: string
  }) {
    if (!daten.waldbesitzerEmail) return { skipped: true }

    return sendEmail({
      to: daten.waldbesitzerEmail,
      subject: `Auftrag ${daten.auftragNummer}: Status aktualisiert`,
      html: auftragStatusEmailHtml({
        auftragNummer: daten.auftragNummer,
        auftragTitel: daten.auftragTitel,
        neuerStatus: daten.neuerStatus,
        kundenName: daten.kundenName,
      }),
    })
  },

  async lohnabrechnungFreigegeben(daten: {
    mitarbeiterEmail: string
    mitarbeiterName: string
    monat: string
    nettoLohn: number
  }) {
    return sendEmail({
      to: daten.mitarbeiterEmail,
      subject: `Lohnabrechnung ${daten.monat} freigegeben`,
      html: `
        <h2>Lohnabrechnung freigegeben</h2>
        <p>Hallo ${daten.mitarbeiterName},</p>
        <p>Ihre Lohnabrechnung für <strong>${daten.monat}</strong> wurde freigegeben.</p>
        <p><strong>Nettolohn:</strong> ${daten.nettoLohn.toFixed(2)} €</p>
        <p>Sie können die Details im ForstManager einsehen.</p>
      `,
    })
  },
}

export function auftragStatusEmailHtml(daten: {
  auftragNummer: string
  auftragTitel: string
  neuerStatus: string
  kundenName?: string
}): string {
  const statusLabels: Record<string, string> = {
    angenommen: 'Angenommen',
    in_ausfuehrung: 'In Ausführung',
    abgeschlossen: 'Abgeschlossen',
    laufend: 'Laufend',
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #2C3A1C; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2C3A1C; }
        .status { display: inline-block; padding: 8px 16px; background: #2C3A1C; color: white; border-radius: 4px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Koch Aufforstung GmbH</div>
        </div>
        
        ${daten.kundenName ? `<p>Sehr geehrte/r ${daten.kundenName},</p>` : '<p>Sehr geehrte Damen und Herren,</p>'}
        
        <p>Ihr Auftrag <strong>${daten.auftragNummer}</strong> "${daten.auftragTitel}" hat einen neuen Status:</p>
        
        <p><span class="status">${statusLabels[daten.neuerStatus] || daten.neuerStatus}</span></p>
        
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
        
        <p>Mit freundlichen Grüßen<br>
        Ihr Team der Koch Aufforstung GmbH</p>
        
        <div class="footer">
          <p>
            Koch Aufforstung GmbH<br>
            Diese E-Mail wurde automatisch generiert.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
