# Payment Module (Zipayo Integration)

Generisches Payment-Modul für die Integration von Zipayo in feldhub-base.

## Überblick

Das Payment-Modul ermöglicht die Einbindung von Online-Zahlungen in Rechnungs- und Auftrags-Ansichten. Es nutzt die Zipayo-Plattform (basierend auf Stripe Connect Express).

## Features

- ✅ PaymentIntent erstellen und verwalten
- ✅ Automatische und verzögerte Erfassung (Delayed Capture)
- ✅ Webhook-Handler für Statusänderungen
- ✅ React-Komponente für Frontend-Integration
- ✅ Multi-Tenant-fähig via tenant.ts

## Konfiguration

### tenant.ts

```typescript
integrations: {
  zipayo: {
    enabled: true,
    config: {
      merchantId: 'mer_xxxxxxxx',      // Deine Zipayo Merchant-ID
      baseUrl: 'https://zipayo.de',     // API Base URL
      sandbox: false,                    // Test-Modus
      delayedCapture: false,             // Autorisierung + spätere Erfassung
      webhookSecret: 'whsec_xxxxx',      // Webhook Signature Secret
    }
  }
}
```

### Environment Variables

```bash
# Pflicht
ZIPAYO_API_KEY=sk_live_xxxxxxxxxxxx
ZIPAYO_MERCHANT_ID=mer_xxxxxxxx

# Optional
ZIPAYO_BASE_URL=https://zipayo.de
ZIPAYO_SANDBOX=false
ZIPAYO_WEBHOOK_SECRET=whsec_xxxxxxxx
```

## Frontend-Integration

### ZipayoPayButton

Der einfachste Weg, Zahlungen zu integrieren:

```tsx
import { ZipayoPayButton } from '@/modules/payments';

function RechnungDetail({ rechnung }) {
  return (
    <div>
      <h2>Rechnung {rechnung.nummer}</h2>
      <p>Betrag: {formatCurrency(rechnung.betrag)}</p>
      
      {rechnung.status !== 'BEZAHLT' && (
        <ZipayoPayButton
          amount={rechnung.betrag * 100}  // Betrag in Cents!
          currency="EUR"
          referenceId={rechnung.nummer}
          referenceType="rechnung"
          description={`Rechnung ${rechnung.nummer}`}
          onSuccess={(pi) => {
            toast.success('Zahlung erfolgreich!');
            router.refresh();
          }}
          onError={(error) => {
            toast.error(`Zahlung fehlgeschlagen: ${error}`);
          }}
        />
      )}
    </div>
  );
}
```

### Props

| Prop | Typ | Pflicht | Beschreibung |
|------|-----|---------|--------------|
| `amount` | `number` | ✅ | Betrag in Cents (4999 = 49,99 €) |
| `currency` | `string` | - | Währung (default: EUR) |
| `description` | `string` | - | Beschreibung für Kontoauszug |
| `referenceId` | `string` | - | Referenz-ID (z.B. Rechnungsnummer) |
| `referenceType` | `string` | - | Typ: 'rechnung', 'auftrag', 'angebot' |
| `label` | `string` | - | Button-Text |
| `disabled` | `boolean` | - | Button deaktivieren |
| `onSuccess` | `function` | - | Callback nach erfolgreicher Zahlung |
| `onError` | `function` | - | Callback bei Fehler |
| `onCancel` | `function` | - | Callback bei Abbruch |

## Server-Side Usage

### PaymentIntent erstellen

```typescript
import { getZipayoClient } from '@/modules/payments';

const zipayo = getZipayoClient();

const result = await zipayo.createPaymentIntent({
  amount: 4999,                    // 49,99 €
  currency: 'EUR',
  description: 'Rechnung RE-2026-0001',
  referenceId: 'RE-2026-0001',
  referenceType: 'rechnung',
  captureMethod: 'automatic',      // oder 'manual' für Delayed Capture
  returnUrl: 'https://app.example.de/rechnungen/123?payment=success',
  cancelUrl: 'https://app.example.de/rechnungen/123?payment=canceled',
});

if (result.success) {
  // Redirect zu Zipayo Payment Page
  redirect(result.paymentIntent.redirectUrl);
}
```

### Delayed Capture (Vorautorisierung)

Für Services mit Check-In/Check-Out (z.B. Vermietung):

```typescript
// 1. Beim Check-In: Autorisieren
const auth = await zipayo.createPaymentIntent({
  amount: 10000,
  captureMethod: 'manual',  // Delayed Capture!
});

// 2. Beim Check-Out: Erfassen (ggf. anderen Betrag)
const capture = await zipayo.capturePayment({
  paymentIntentId: auth.paymentIntent.id,
  amount: 7500,  // Optional: anderer Betrag
});
```

## API Routes

### POST /api/payments/zipayo/create

Erstellt einen neuen PaymentIntent.

**Request:**
```json
{
  "amount": 4999,
  "currency": "EUR",
  "description": "Rechnung RE-2026-0001",
  "referenceId": "RE-2026-0001",
  "referenceType": "rechnung",
  "returnUrl": "https://...",
  "cancelUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_xxxxxxxx",
    "provider": "zipayo",
    "amount": 4999,
    "currency": "EUR",
    "status": "pending",
    "redirectUrl": "https://zipayo.de/pay/pi_xxxxxxxx",
    "createdAt": "2026-03-31T04:00:00Z"
  }
}
```

### GET /api/payments/zipayo/[id]

Ruft einen PaymentIntent ab.

### POST /api/payments/zipayo/[id]/capture

Erfasst einen autorisierten PaymentIntent.

### POST /api/payments/zipayo/[id]/cancel

Storniert einen PaymentIntent.

## Webhooks

Zipayo sendet Events an `/api/payments/zipayo/webhook`:

- `payment.authorized` - Zahlung autorisiert (Delayed Capture)
- `payment.succeeded` - Zahlung erfolgreich
- `payment.failed` - Zahlung fehlgeschlagen
- `payment.refunded` - Erstattung durchgeführt

### Webhook-Konfiguration in Zipayo

1. Öffne Zipayo Dashboard → Einstellungen → Webhooks
2. Füge hinzu: `https://deine-app.de/api/payments/zipayo/webhook`
3. Events: Alle Payment-Events aktivieren
4. Kopiere das Webhook-Secret nach `ZIPAYO_WEBHOOK_SECRET`

## Prisma Schema Erweiterungen

Das Modul erwartet folgende Felder in der `Rechnung`-Tabelle:

```prisma
model Rechnung {
  // ... bestehende Felder
  
  zahlungsart      String?   // 'ZIPAYO', 'UEBERWEISUNG', 'BAR'
  zahlungsreferenz String?   // PaymentIntent ID
  bezahltAm        DateTime?
}
```

## Sicherheit

- Webhook-Signatur wird via HMAC-SHA256 verifiziert
- API-Routes erfordern Session-Auth
- Capture/Cancel erfordern Admin-Rolle
- Sensitive Daten (API Key) nur server-side

## Troubleshooting

### "Missing merchantId"

```
ZIPAYO_MERCHANT_ID nicht gesetzt. 
→ ENV Variable setzen oder in tenant.ts config.merchantId eintragen.
```

### Webhook Signature Invalid

```
Prüfe ZIPAYO_WEBHOOK_SECRET.
In Dev-Mode wird die Signatur übersprungen wenn kein Secret gesetzt ist.
```

### Payment Page nicht erreichbar

```
Prüfe ob ZIPAYO_BASE_URL korrekt ist.
Sandbox-Mode: ZIPAYO_SANDBOX=true
```
