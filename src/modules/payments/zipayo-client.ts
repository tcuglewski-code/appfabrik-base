/**
 * Zipayo Payment Client
 * 
 * Server-side client für Zipayo Payment API.
 * Nutzt Stripe Connect Express unter der Haube.
 * 
 * Konfiguration via tenant.ts:
 * - integrations.zipayo.enabled: true
 * - integrations.zipayo.config.merchantId: "mer_xxx"
 * - ENV: ZIPAYO_API_KEY
 */

import { 
  CreatePaymentIntentRequest, 
  CreatePaymentIntentResponse,
  PaymentIntent,
  CapturePaymentRequest,
  PaymentStatus 
} from './types';

interface ZipayoConfig {
  merchantId: string;
  apiKey: string;
  baseUrl: string;
  sandbox: boolean;
}

/**
 * Zipayo API Client für Server-Side Calls
 */
export class ZipayoClient {
  private config: ZipayoConfig;
  
  constructor(config: Partial<ZipayoConfig> = {}) {
    this.config = {
      merchantId: config.merchantId ?? process.env.ZIPAYO_MERCHANT_ID ?? '',
      apiKey: config.apiKey ?? process.env.ZIPAYO_API_KEY ?? '',
      baseUrl: config.baseUrl ?? process.env.ZIPAYO_BASE_URL ?? 'https://zipayo.de',
      sandbox: config.sandbox ?? process.env.ZIPAYO_SANDBOX === 'true',
    };
    
    if (!this.config.merchantId) {
      console.warn('[Zipayo] Missing merchantId - payment requests will fail');
    }
    if (!this.config.apiKey) {
      console.warn('[Zipayo] Missing apiKey - payment requests will fail');
    }
  }
  
  /**
   * API URL Builder
   */
  private apiUrl(path: string): string {
    const base = this.config.baseUrl.replace(/\/$/, '');
    return `${base}/api/v1${path}`;
  }
  
  /**
   * API Headers
   */
  private headers(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Merchant-ID': this.config.merchantId,
      'X-Sandbox-Mode': this.config.sandbox ? 'true' : 'false',
    };
  }
  
  /**
   * Creates a PaymentIntent
   * 
   * @param request - Payment details
   * @returns PaymentIntent with clientSecret for frontend
   */
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
    try {
      const payload = {
        amount: request.amount,
        currency: request.currency ?? 'EUR',
        description: request.description,
        capture_method: request.captureMethod ?? 'automatic',
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        metadata: {
          ...request.metadata,
          reference_id: request.referenceId,
          reference_type: request.referenceType,
          tenant_merchant_id: this.config.merchantId,
        },
      };
      
      const response = await fetch(this.apiUrl('/payment-intents'), {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        return {
          success: false,
          error: error.message ?? `HTTP ${response.status}`,
        };
      }
      
      const data = await response.json();
      
      return {
        success: true,
        paymentIntent: this.mapPaymentIntent(data),
      };
    } catch (error) {
      console.error('[Zipayo] createPaymentIntent error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
  
  /**
   * Retrieves a PaymentIntent by ID
   */
  async getPaymentIntent(paymentIntentId: string): Promise<CreatePaymentIntentResponse> {
    try {
      const response = await fetch(this.apiUrl(`/payment-intents/${paymentIntentId}`), {
        method: 'GET',
        headers: this.headers(),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        return {
          success: false,
          error: error.message ?? `HTTP ${response.status}`,
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        paymentIntent: this.mapPaymentIntent(data),
      };
    } catch (error) {
      console.error('[Zipayo] getPaymentIntent error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
  
  /**
   * Captures an authorized PaymentIntent (Delayed Capture)
   */
  async capturePayment(request: CapturePaymentRequest): Promise<CreatePaymentIntentResponse> {
    try {
      const payload: Record<string, unknown> = {};
      if (request.amount !== undefined) {
        payload.amount = request.amount;
      }
      
      const response = await fetch(
        this.apiUrl(`/payment-intents/${request.paymentIntentId}/capture`),
        {
          method: 'POST',
          headers: this.headers(),
          body: JSON.stringify(payload),
        }
      );
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        return {
          success: false,
          error: error.message ?? `HTTP ${response.status}`,
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        paymentIntent: this.mapPaymentIntent(data),
      };
    } catch (error) {
      console.error('[Zipayo] capturePayment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
  
  /**
   * Cancels a PaymentIntent
   */
  async cancelPayment(paymentIntentId: string): Promise<CreatePaymentIntentResponse> {
    try {
      const response = await fetch(
        this.apiUrl(`/payment-intents/${paymentIntentId}/cancel`),
        {
          method: 'POST',
          headers: this.headers(),
        }
      );
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        return {
          success: false,
          error: error.message ?? `HTTP ${response.status}`,
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        paymentIntent: this.mapPaymentIntent(data),
      };
    } catch (error) {
      console.error('[Zipayo] cancelPayment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
  
  /**
   * Verifies webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, secret?: string): boolean {
    const webhookSecret = secret ?? process.env.ZIPAYO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn('[Zipayo] No webhook secret configured - skipping verification');
      return true; // In dev mode, skip verification
    }
    
    // HMAC-SHA256 verification
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }
  
  /**
   * Maps Zipayo API response to PaymentIntent type
   */
  private mapPaymentIntent(data: Record<string, unknown>): PaymentIntent {
    return {
      id: data.id as string,
      provider: 'zipayo',
      amount: data.amount as number,
      currency: (data.currency as string)?.toUpperCase() ?? 'EUR',
      status: this.mapStatus(data.status as string),
      description: data.description as string | undefined,
      clientSecret: data.client_secret as string | undefined,
      redirectUrl: data.redirect_url as string | undefined,
      createdAt: new Date(data.created_at as string),
      metadata: data.metadata as Record<string, string> | undefined,
    };
  }
  
  /**
   * Maps Zipayo status to PaymentStatus
   */
  private mapStatus(status: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'requires_payment_method': 'pending',
      'requires_confirmation': 'pending',
      'requires_action': 'pending',
      'requires_capture': 'authorized',
      'processing': 'processing',
      'succeeded': 'succeeded',
      'canceled': 'canceled',
      'failed': 'failed',
    };
    return statusMap[status] ?? 'pending';
  }
}

/**
 * Singleton instance (uses ENV vars)
 */
let zipayoInstance: ZipayoClient | null = null;

export function getZipayoClient(config?: Partial<ZipayoConfig>): ZipayoClient {
  if (config) {
    // Return new instance with custom config
    return new ZipayoClient(config);
  }
  
  // Return singleton with ENV config
  if (!zipayoInstance) {
    zipayoInstance = new ZipayoClient();
  }
  return zipayoInstance;
}
