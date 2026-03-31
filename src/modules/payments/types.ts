/**
 * Feldhub Payment Module - Type Definitions
 * 
 * Generische Payment-Types für Zipayo, Stripe, Mollie etc.
 */

export type PaymentStatus = 
  | 'pending'           // Zahlung erstellt, noch nicht begonnen
  | 'authorized'        // Delayed Capture: autorisiert, nicht erfasst
  | 'processing'        // In Bearbeitung
  | 'succeeded'         // Erfolgreich
  | 'failed'            // Fehlgeschlagen
  | 'canceled'          // Abgebrochen
  | 'refunded'          // Erstattet
  | 'partially_refunded'; // Teilweise erstattet

export type PaymentMethod = 
  | 'card'              // Debit/Credit Card
  | 'sepa_debit'        // SEPA Lastschrift
  | 'ideal'             // iDEAL (NL)
  | 'giropay'           // Giropay (DE)
  | 'sofort'            // Sofortüberweisung
  | 'paypal'            // PayPal
  | 'klarna'            // Klarna
  | 'apple_pay'         // Apple Pay
  | 'google_pay'        // Google Pay
  | 'bank_transfer';    // Banküberweisung

/**
 * PaymentIntent - Repräsentiert eine Zahlungsabsicht
 */
export interface PaymentIntent {
  /** Unique ID vom Payment Provider */
  id: string;
  /** Provider (zipayo, stripe, mollie) */
  provider: 'zipayo' | 'stripe' | 'mollie';
  /** Betrag in Cents */
  amount: number;
  /** Währung (ISO 4217) */
  currency: string;
  /** Status */
  status: PaymentStatus;
  /** Beschreibung */
  description?: string;
  /** Client Secret für Frontend */
  clientSecret?: string;
  /** Redirect URL für Payment Flow */
  redirectUrl?: string;
  /** Erstellt am */
  createdAt: Date;
  /** Metadata */
  metadata?: Record<string, string>;
}

/**
 * CreatePaymentIntent Request
 */
export interface CreatePaymentIntentRequest {
  /** Betrag in der kleinsten Währungseinheit (Cents) */
  amount: number;
  /** Währung (default: EUR) */
  currency?: string;
  /** Beschreibung (erscheint auf Kontoauszug) */
  description?: string;
  /** Referenz-ID (z.B. Rechnungsnummer) */
  referenceId?: string;
  /** Referenz-Typ (z.B. 'rechnung', 'auftrag') */
  referenceType?: string;
  /** Delayed Capture aktivieren */
  captureMethod?: 'automatic' | 'manual';
  /** Return URL nach Zahlung */
  returnUrl?: string;
  /** Cancel URL bei Abbruch */
  cancelUrl?: string;
  /** Metadata */
  metadata?: Record<string, string>;
}

/**
 * CreatePaymentIntent Response
 */
export interface CreatePaymentIntentResponse {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: string;
}

/**
 * CapturePayment Request (für Delayed Capture)
 */
export interface CapturePaymentRequest {
  /** PaymentIntent ID */
  paymentIntentId: string;
  /** Zu erfassender Betrag (optional, für Partial Capture) */
  amount?: number;
}

/**
 * Webhook Event von Zipayo
 */
export interface ZipayoWebhookEvent {
  id: string;
  type: 'payment.authorized' | 'payment.succeeded' | 'payment.failed' | 'payment.refunded';
  createdAt: string;
  data: {
    paymentIntentId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  };
}

/**
 * Payment Button Props
 */
export interface PaymentButtonProps {
  /** Betrag in Cents */
  amount: number;
  /** Währung */
  currency?: string;
  /** Beschreibung */
  description?: string;
  /** Referenz-ID (z.B. Rechnungsnummer) */
  referenceId?: string;
  /** Referenz-Typ */
  referenceType?: 'rechnung' | 'auftrag' | 'angebot';
  /** Button Label */
  label?: string;
  /** Disabled */
  disabled?: boolean;
  /** Callback nach erfolgreicher Zahlung */
  onSuccess?: (paymentIntent: PaymentIntent) => void;
  /** Callback bei Fehler */
  onError?: (error: string) => void;
  /** Callback bei Abbruch */
  onCancel?: () => void;
  /** Custom className */
  className?: string;
}
