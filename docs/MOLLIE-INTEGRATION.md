# Mollie Payment Integration für Feldhub

> Generisches Payment-Modul für B2B-Rechnungszahlungen via Mollie API

## Übersicht

Die Mollie-Integration ermöglicht es Feldhub-Tenants, Online-Zahlungen für Rechnungen zu akzeptieren.

**Unterstützte Zahlungsmethoden:**
- 🏦 SEPA-Lastschrift (B2B-Standard)
- 💳 Kreditkarte (Visa, Mastercard)
- 🇩🇪 giropay (Online-Banking DE)
- 🇦🇹 eps (Online-Banking AT)
- 🇳🇱 iDEAL (Online-Banking NL)
- 🇧🇪 Bancontact (Online-Banking BE)
- 💰 PayPal

## Setup

### 1. Mollie Account erstellen

1. Registriere dich auf [mollie.com](https://www.mollie.com)
2. Verifiziere dein Unternehmen (KYC)
3. Kopiere den API Key aus dem Dashboard

### 2. Environment Variables

```env
# .env.local / Vercel ENV

# Mollie API Key (test_ oder live_)
MOLLIE_API_KEY=live_xxxxxxxxxxxxx

# App URL für Webhooks
NEXT_PUBLIC_APP_URL=https://dein-tenant.feldhub.de
```

### 3. Tenant-Konfiguration

In `src/config/tenants/[tenant].ts`:

```typescript
const config: TenantConfig = {
  // ... andere Konfiguration
  
  integrations: {
    // ... andere Integrationen
    
    mollie: {
      enabled: true,
      config: {
        // Optional: Webhook URL überschreiben
        webhookUrl: 'https://dein-tenant.feldhub.de/api/webhooks/mollie',
        
        // Optional: Erlaubte Methoden einschränken
        allowedMethods: ['sepa', 'creditcard', 'giropay'],
        
        // Optional: Checkout-Sprache
        locale: 'de_DE',
      },
    },
  },
};
```

### 4. Prisma Schema erweitern

Füge das PaymentTransaction-Modell hinzu:

```prisma
// prisma/schema.prisma

model PaymentTransaction {
  id              String   @id @default(cuid())
  molliePaymentId String   @unique
  invoiceId       String
  amount          Int      // in Cents
  currency        String   @default("EUR")
  status          String   // open, paid, failed, expired, canceled
  provider        String   @default("mollie")
  method          String?  // creditcard, sepa, etc.
  paidAt          DateTime?
  metadata        Json     @default("{}")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

Dann Migration ausführen:
```bash
npx prisma migrate dev --name add_payment_transactions
```

## Verwendung

### Payment Button Komponente

```tsx
import { MolliePaymentButton } from '@/components/payments/MolliePaymentButton';

// In deiner Rechnungs-Ansicht:
<MolliePaymentButton
  invoiceId="RE-2026-0001"
  amount={15000} // €150.00 in Cents
  customerName="Max Mustermann"
  customerEmail="max@example.com"
  onSuccess={(paymentId, checkoutUrl) => {
    console.log('Zahlung erstellt:', paymentId);
  }}
  onError={(error) => {
    console.error('Fehler:', error);
  }}
/>
```

### Zahlungsmethoden-Auswahl

```tsx
import { 
  MolliePaymentMethodSelector,
  MolliePaymentMethod 
} from '@/components/payments/MolliePaymentButton';

const [method, setMethod] = useState<MolliePaymentMethod>('sepa');

<MolliePaymentMethodSelector
  allowedMethods={['sepa', 'creditcard', 'giropay']}
  selected={method}
  onChange={setMethod}
/>
```

### Status Badge

```tsx
import { MolliePaymentStatusBadge } from '@/components/payments/MolliePaymentButton';

<MolliePaymentStatusBadge status="paid" />
<MolliePaymentStatusBadge status="pending" size="sm" />
```

### API direkt nutzen

```typescript
import { getMollieClient, MollieClient } from '@/lib/mollie';

// Payment erstellen
const mollie = getMollieClient();
const payment = await mollie.createPayment({
  amount: MollieClient.formatAmount(5000), // €50.00
  description: 'Rechnung RE-2026-0001',
  redirectUrl: 'https://app.example.com/zahlungen/success',
  metadata: {
    invoiceId: 'RE-2026-0001',
    customerId: 'cust_123',
  },
});

// Payment abrufen
const status = await mollie.getPayment(payment.id);

// Rückerstattung
const refund = await mollie.createRefund(payment.id, {
  amount: MollieClient.formatAmount(2000), // Teilerstattung €20.00
  description: 'Gutschrift für Position X',
});
```

## Webhook-Verarbeitung

Mollie sendet Webhooks bei Status-Änderungen:

1. **Endpoint:** `POST /api/webhooks/mollie`
2. **Format:** `application/x-www-form-urlencoded`
3. **Body:** `id=tr_xxxxx`

Der Webhook-Handler:
- Ruft den aktuellen Status von der Mollie API ab (Security)
- Aktualisiert die PaymentTransaction in der Datenbank
- Markiert die Rechnung als bezahlt (bei status=paid)
- Erstellt ActivityLog-Einträge

## Sicherheit

### Webhook-Verifizierung

Mollie empfiehlt, den Payment-Status immer von der API abzurufen anstatt dem Webhook-Body zu vertrauen. Unser Handler macht genau das:

```typescript
// In /api/webhooks/mollie/route.ts
const paymentId = formData.get('id');
const payment = await mollie.getPayment(paymentId); // Sicherer API-Call
```

### IP-Whitelisting (optional)

Mollie-Webhooks kommen von diesen IPs (Stand 2026):
```
91.229.46.0/24
```

### Test vs. Live

- `test_xxx` API Keys → Test-Modus (keine echten Zahlungen)
- `live_xxx` API Keys → Live-Modus

Der Client erkennt automatisch den Modus anhand des Key-Präfix.

## DSGVO-Hinweise

Mollie ist ein EU-Unternehmen (Niederlande) und DSGVO-konform.

### Datenschutzerklärung ergänzen

```markdown
**Zahlungsabwicklung**

Für die Abwicklung von Online-Zahlungen nutzen wir den Zahlungsdienstleister Mollie B.V. (Keizersgracht 126, 1015 CW Amsterdam, Niederlande). Bei der Zahlung werden folgende Daten an Mollie übermittelt:

- Rechnungsbetrag und -nummer
- Ihre E-Mail-Adresse (für Zahlungsbestätigungen)
- Zahlungsmethode und Transaktionsdaten

Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

Weitere Informationen: [Mollie Privacy Policy](https://www.mollie.com/privacy)
```

### AVV (Auftragsverarbeitungsvertrag)

Mollie bietet ein DPA (Data Processing Agreement) an:
- Im Mollie Dashboard unter Settings → Legal → Data Processing Agreement

## Fehlerbehebung

### "MOLLIE_API_KEY is not set"

→ API Key in Vercel ENV oder .env.local setzen

### "Mollie payments are not enabled"

→ `integrations.mollie.enabled: true` in tenant.ts setzen

### Webhook kommt nicht an

1. Prüfe ob `NEXT_PUBLIC_APP_URL` korrekt ist
2. Prüfe Vercel-Logs auf Fehler
3. Mollie Dashboard → Payments → Payment Details → Webhooks

### Test-Zahlungen

Mit `test_` API Key:
- Kreditkarte: `4242 4242 4242 4242`
- SEPA IBAN: `NL91ABNA0417164300`
- iDEAL: Wähle "Test Bank"

## Pricing

Mollie-Gebühren (Stand 2026):

| Methode | Gebühr |
|---------|--------|
| iDEAL | €0.29 |
| SEPA-Lastschrift | €0.25 + 0.5% |
| Kreditkarte | €0.25 + 1.8% |
| giropay | €0.25 + 0.9% |
| PayPal | €0.35 + 1.8% |

Keine monatlichen Grundgebühren. Keine Vertragsbindung.

## Weiterführende Links

- [Mollie API Docs](https://docs.mollie.com)
- [Mollie Dashboard](https://www.mollie.com/dashboard)
- [Mollie Status Page](https://status.mollie.com)
- [Feldhub Payment Module Architektur](/docs/PAYMENT-ARCHITECTURE.md)
