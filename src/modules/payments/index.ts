/**
 * Feldhub Payment Module
 * 
 * Generisches Payment-Modul für Zipayo, Stripe, Mollie etc.
 * 
 * ## Konfiguration
 * 
 * In tenant.ts:
 * ```ts
 * integrations: {
 *   zipayo: {
 *     enabled: true,
 *     config: {
 *       merchantId: 'mer_xxx',
 *       baseUrl: 'https://zipayo.de',
 *       sandbox: false,
 *       delayedCapture: false,
 *     }
 *   }
 * }
 * ```
 * 
 * ENV Variables:
 * - ZIPAYO_API_KEY (required)
 * - ZIPAYO_MERCHANT_ID (required, or in tenant.ts)
 * - ZIPAYO_WEBHOOK_SECRET (recommended)
 * - ZIPAYO_SANDBOX (optional, default: false)
 * 
 * ## Usage
 * 
 * ### Frontend
 * ```tsx
 * import { ZipayoPayButton } from '@/modules/payments';
 * 
 * <ZipayoPayButton
 *   amount={4999}  // 49,99 €
 *   referenceId="RE-2026-0001"
 *   referenceType="rechnung"
 *   onSuccess={(pi) => console.log('Bezahlt!', pi)}
 * />
 * ```
 * 
 * ### Server-Side
 * ```ts
 * import { getZipayoClient } from '@/modules/payments';
 * 
 * const zipayo = getZipayoClient();
 * const result = await zipayo.createPaymentIntent({
 *   amount: 4999,
 *   description: 'Rechnung RE-2026-0001',
 * });
 * ```
 * 
 * ## API Routes
 * 
 * - POST /api/payments/zipayo/create - Create PaymentIntent
 * - GET /api/payments/zipayo/[id] - Get PaymentIntent
 * - POST /api/payments/zipayo/[id]/capture - Capture authorized payment
 * - POST /api/payments/zipayo/[id]/cancel - Cancel payment
 * - POST /api/payments/zipayo/webhook - Webhook handler
 */

// Types
export * from './types';

// Client
export { ZipayoClient, getZipayoClient } from './zipayo-client';

// Components
export { ZipayoPayButton, ZipayoPayButtonCompact } from './components/ZipayoPayButton';
