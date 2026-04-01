/**
 * Mollie Payment Integration für Feldhub
 * 
 * Unterstützt:
 * - SEPA-Lastschrift (B2B-Rechnungen)
 * - Kreditkarte (Visa, Mastercard)
 * - iDEAL (NL)
 * - Bancontact (BE)
 * - giropay (DE)
 * 
 * Docs: https://docs.mollie.com
 */

import { getCurrentTenant } from '@/config/tenant';

// =============================================================================
// TYPES
// =============================================================================

export interface MollieConfig {
  apiKey: string;
  testMode?: boolean;
  webhookUrl?: string;
}

export type MolliePaymentMethod =
  | 'ideal'
  | 'creditcard'
  | 'bancontact'
  | 'sepa'
  | 'giropay'
  | 'eps'
  | 'przelewy24'
  | 'paypal';

export type MolliePaymentStatus =
  | 'open'
  | 'canceled'
  | 'pending'
  | 'authorized'
  | 'expired'
  | 'failed'
  | 'paid';

export interface MolliePayment {
  id: string;
  mode: 'test' | 'live';
  createdAt: string;
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  method: MolliePaymentMethod | null;
  status: MolliePaymentStatus;
  metadata?: Record<string, unknown>;
  profileId: string;
  redirectUrl: string;
  webhookUrl?: string;
  _links: {
    self: { href: string };
    checkout?: { href: string };
    dashboard: { href: string };
  };
}

export interface MolliePaymentCreateParams {
  amount: {
    currency: string;
    value: string; // "10.00" format
  };
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  method?: MolliePaymentMethod | MolliePaymentMethod[];
  metadata?: Record<string, unknown>;
  locale?: string;
  billingEmail?: string;
  // SEPA specific
  sequenceType?: 'oneoff' | 'first' | 'recurring';
  customerId?: string;
  consumerName?: string;
  consumerAccount?: string; // IBAN
}

export interface MollieRefund {
  id: string;
  paymentId: string;
  amount: {
    value: string;
    currency: string;
  };
  status: 'queued' | 'pending' | 'processing' | 'refunded' | 'failed';
  createdAt: string;
  description?: string;
}

export interface MollieRefundParams {
  amount?: {
    currency: string;
    value: string;
  };
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface MollieCustomer {
  id: string;
  name: string;
  email: string;
  locale?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface MollieCustomerCreateParams {
  name: string;
  email: string;
  locale?: string;
  metadata?: Record<string, unknown>;
}

export interface MollieMandate {
  id: string;
  status: 'valid' | 'pending' | 'invalid';
  method: 'directdebit' | 'creditcard';
  details: {
    consumerName?: string;
    consumerAccount?: string;
    consumerBic?: string;
  };
  createdAt: string;
}

// =============================================================================
// MOLLIE CLIENT
// =============================================================================

const MOLLIE_API_BASE = 'https://api.mollie.com/v2';

/**
 * Mollie API Client für Feldhub
 */
export class MollieClient {
  private apiKey: string;
  private testMode: boolean;
  private defaultWebhookUrl?: string;

  constructor(config: MollieConfig) {
    this.apiKey = config.apiKey;
    this.testMode = config.testMode ?? config.apiKey.startsWith('test_');
    this.defaultWebhookUrl = config.webhookUrl;
  }

  /**
   * Generischer API Request
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${MOLLIE_API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new MollieError(
        error.detail || `Mollie API error: ${response.status}`,
        response.status,
        error
      );
    }

    return response.json();
  }

  // =========================================================================
  // PAYMENTS
  // =========================================================================

  /**
   * Erstellt eine neue Zahlung
   */
  async createPayment(params: MolliePaymentCreateParams): Promise<MolliePayment> {
    const payload = {
      ...params,
      webhookUrl: params.webhookUrl ?? this.defaultWebhookUrl,
    };
    
    return this.request<MolliePayment>('POST', '/payments', payload);
  }

  /**
   * Ruft eine Zahlung ab
   */
  async getPayment(paymentId: string): Promise<MolliePayment> {
    return this.request<MolliePayment>('GET', `/payments/${paymentId}`);
  }

  /**
   * Listet alle Zahlungen
   */
  async listPayments(params?: { limit?: number; from?: string }): Promise<{
    count: number;
    _embedded: { payments: MolliePayment[] };
  }> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.from) query.set('from', params.from);
    
    const endpoint = `/payments${query.toString() ? `?${query}` : ''}`;
    return this.request('GET', endpoint);
  }

  /**
   * Bricht eine Zahlung ab
   */
  async cancelPayment(paymentId: string): Promise<MolliePayment> {
    return this.request<MolliePayment>('DELETE', `/payments/${paymentId}`);
  }

  // =========================================================================
  // REFUNDS
  // =========================================================================

  /**
   * Erstellt eine Rückerstattung
   */
  async createRefund(paymentId: string, params?: MollieRefundParams): Promise<MollieRefund> {
    return this.request<MollieRefund>('POST', `/payments/${paymentId}/refunds`, params);
  }

  /**
   * Ruft eine Rückerstattung ab
   */
  async getRefund(paymentId: string, refundId: string): Promise<MollieRefund> {
    return this.request<MollieRefund>('GET', `/payments/${paymentId}/refunds/${refundId}`);
  }

  /**
   * Listet Rückerstattungen für eine Zahlung
   */
  async listRefunds(paymentId: string): Promise<{
    count: number;
    _embedded: { refunds: MollieRefund[] };
  }> {
    return this.request('GET', `/payments/${paymentId}/refunds`);
  }

  // =========================================================================
  // CUSTOMERS (für wiederkehrende Zahlungen)
  // =========================================================================

  /**
   * Erstellt einen Kunden
   */
  async createCustomer(params: MollieCustomerCreateParams): Promise<MollieCustomer> {
    return this.request<MollieCustomer>('POST', '/customers', params);
  }

  /**
   * Ruft einen Kunden ab
   */
  async getCustomer(customerId: string): Promise<MollieCustomer> {
    return this.request<MollieCustomer>('GET', `/customers/${customerId}`);
  }

  /**
   * Listet alle Kunden
   */
  async listCustomers(params?: { limit?: number }): Promise<{
    count: number;
    _embedded: { customers: MollieCustomer[] };
  }> {
    const endpoint = params?.limit ? `/customers?limit=${params.limit}` : '/customers';
    return this.request('GET', endpoint);
  }

  /**
   * Aktualisiert einen Kunden
   */
  async updateCustomer(customerId: string, params: Partial<MollieCustomerCreateParams>): Promise<MollieCustomer> {
    return this.request<MollieCustomer>('PATCH', `/customers/${customerId}`, params);
  }

  // =========================================================================
  // MANDATES (SEPA-Lastschriftmandate)
  // =========================================================================

  /**
   * Listet Mandate eines Kunden
   */
  async listMandates(customerId: string): Promise<{
    count: number;
    _embedded: { mandates: MollieMandate[] };
  }> {
    return this.request('GET', `/customers/${customerId}/mandates`);
  }

  /**
   * Ruft ein Mandat ab
   */
  async getMandate(customerId: string, mandateId: string): Promise<MollieMandate> {
    return this.request<MollieMandate>('GET', `/customers/${customerId}/mandates/${mandateId}`);
  }

  /**
   * Widerruft ein Mandat
   */
  async revokeMandate(customerId: string, mandateId: string): Promise<void> {
    await this.request('DELETE', `/customers/${customerId}/mandates/${mandateId}`);
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  /**
   * Prüft ob der Client im Test-Modus läuft
   */
  isTestMode(): boolean {
    return this.testMode;
  }

  /**
   * Formatiert einen Betrag für Mollie (2 Dezimalstellen)
   */
  static formatAmount(cents: number, currency = 'EUR'): { currency: string; value: string } {
    return {
      currency,
      value: (cents / 100).toFixed(2),
    };
  }

  /**
   * Parst einen Mollie-Betrag in Cents
   */
  static parseAmount(amount: { value: string; currency: string }): number {
    return Math.round(parseFloat(amount.value) * 100);
  }

  /**
   * Validiert eine IBAN
   */
  static isValidIBAN(iban: string): boolean {
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    // Basis-Validierung: 15-34 Zeichen, beginnt mit 2 Buchstaben
    return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(cleaned);
  }
}

// =============================================================================
// ERROR CLASS
// =============================================================================

export class MollieError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response: unknown
  ) {
    super(message);
    this.name = 'MollieError';
  }
}

// =============================================================================
// SINGLETON FACTORY
// =============================================================================

let mollieInstance: MollieClient | null = null;

/**
 * Erstellt oder gibt bestehende Mollie-Client-Instanz zurück
 */
export function getMollieClient(): MollieClient {
  if (mollieInstance) return mollieInstance;

  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error('MOLLIE_API_KEY environment variable is not set');
  }

  const tenant = getCurrentTenant();
  const webhookUrl = tenant.integrations?.mollie?.config?.webhookUrl;

  mollieInstance = new MollieClient({
    apiKey,
    webhookUrl,
  });

  return mollieInstance;
}

/**
 * Prüft ob Mollie für den aktuellen Tenant aktiviert ist
 */
export function isMollieEnabled(): boolean {
  try {
    const tenant = getCurrentTenant();
    return tenant.integrations?.mollie?.enabled ?? false;
  } catch {
    return false;
  }
}

// =============================================================================
// WEBHOOK VERIFICATION
// =============================================================================

/**
 * Verifiziert und verarbeitet einen Mollie Webhook
 * 
 * Mollie sendet nur die Payment ID - wir müssen die Details selbst abrufen
 */
export async function verifyMollieWebhook(paymentId: string): Promise<MolliePayment> {
  const client = getMollieClient();
  return client.getPayment(paymentId);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generiert eine Payment Description aus Invoice-Daten
 */
export function generatePaymentDescription(
  invoiceNumber: string,
  customerName?: string
): string {
  if (customerName) {
    return `Rechnung ${invoiceNumber} - ${customerName}`;
  }
  return `Rechnung ${invoiceNumber}`;
}

/**
 * Bestimmt verfügbare Zahlungsmethoden für Deutschland
 */
export function getAvailableMethodsDE(): MolliePaymentMethod[] {
  return ['sepa', 'creditcard', 'giropay', 'paypal'];
}

/**
 * Bestimmt verfügbare Zahlungsmethoden für Österreich
 */
export function getAvailableMethodsAT(): MolliePaymentMethod[] {
  return ['sepa', 'creditcard', 'eps', 'paypal'];
}

/**
 * Bestimmt verfügbare Zahlungsmethoden für die Schweiz
 */
export function getAvailableMethodsCH(): MolliePaymentMethod[] {
  return ['creditcard', 'paypal'];
}
