/**
 * POST /api/payments/zipayo/webhook
 * 
 * Handles Zipayo webhook events:
 * - payment.authorized (Delayed Capture)
 * - payment.succeeded
 * - payment.failed
 * - payment.refunded
 * 
 * Signature verification via ZIPAYO_WEBHOOK_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getZipayoClient } from '@/modules/payments/zipayo-client';
import { ZipayoWebhookEvent, PaymentStatus } from '@/modules/payments/types';

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-zipayo-signature') ?? '';
    
    // Verify signature
    const zipayo = getZipayoClient();
    const isValid = zipayo.verifyWebhookSignature(rawBody, signature);
    
    if (!isValid) {
      console.warn('[Zipayo Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse event
    const event: ZipayoWebhookEvent = JSON.parse(rawBody);
    
    console.log('[Zipayo Webhook] Event received:', {
      id: event.id,
      type: event.type,
      paymentIntentId: event.data.paymentIntentId,
    });
    
    // Handle event types
    switch (event.type) {
      case 'payment.authorized':
        await handlePaymentAuthorized(event);
        break;
        
      case 'payment.succeeded':
        await handlePaymentSucceeded(event);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
        
      case 'payment.refunded':
        await handlePaymentRefunded(event);
        break;
        
      default:
        console.log('[Zipayo Webhook] Unknown event type:', event.type);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('[Zipayo Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle payment.authorized (Delayed Capture)
 */
async function handlePaymentAuthorized(event: ZipayoWebhookEvent) {
  const { paymentIntentId, metadata } = event.data;
  
  console.log('[Zipayo] Payment authorized:', paymentIntentId);
  
  // Update invoice status if linked
  if (metadata?.reference_type === 'rechnung' && metadata?.reference_id) {
    try {
      await prisma.rechnung.updateMany({
        where: { nummer: metadata.reference_id },
        data: { 
          status: 'AUTORISIERT',
          zahlungsart: 'ZIPAYO',
          zahlungsreferenz: paymentIntentId,
        },
      });
    } catch (err) {
      console.error('[Zipayo] Failed to update Rechnung:', err);
    }
  }
}

/**
 * Handle payment.succeeded
 */
async function handlePaymentSucceeded(event: ZipayoWebhookEvent) {
  const { paymentIntentId, amount, metadata } = event.data;
  
  console.log('[Zipayo] Payment succeeded:', paymentIntentId, amount);
  
  // Update invoice status
  if (metadata?.reference_type === 'rechnung' && metadata?.reference_id) {
    try {
      await prisma.rechnung.updateMany({
        where: { nummer: metadata.reference_id },
        data: { 
          status: 'BEZAHLT',
          bezahltAm: new Date(),
          zahlungsart: 'ZIPAYO',
          zahlungsreferenz: paymentIntentId,
        },
      });
      
      console.log('[Zipayo] Rechnung updated to BEZAHLT:', metadata.reference_id);
    } catch (err) {
      console.error('[Zipayo] Failed to update Rechnung:', err);
    }
  }
  
  // TODO: Send confirmation email
  // TODO: Create activity log entry
}

/**
 * Handle payment.failed
 */
async function handlePaymentFailed(event: ZipayoWebhookEvent) {
  const { paymentIntentId, metadata } = event.data;
  
  console.log('[Zipayo] Payment failed:', paymentIntentId);
  
  // Update invoice status
  if (metadata?.reference_type === 'rechnung' && metadata?.reference_id) {
    try {
      await prisma.rechnung.updateMany({
        where: { nummer: metadata.reference_id },
        data: { 
          status: 'ZAHLUNG_FEHLGESCHLAGEN',
          zahlungsreferenz: paymentIntentId,
        },
      });
    } catch (err) {
      console.error('[Zipayo] Failed to update Rechnung:', err);
    }
  }
}

/**
 * Handle payment.refunded
 */
async function handlePaymentRefunded(event: ZipayoWebhookEvent) {
  const { paymentIntentId, amount, metadata } = event.data;
  
  console.log('[Zipayo] Payment refunded:', paymentIntentId, amount);
  
  // Update invoice status
  if (metadata?.reference_type === 'rechnung' && metadata?.reference_id) {
    try {
      await prisma.rechnung.updateMany({
        where: { nummer: metadata.reference_id },
        data: { 
          status: 'ERSTATTET',
          zahlungsreferenz: paymentIntentId,
        },
      });
    } catch (err) {
      console.error('[Zipayo] Failed to update Rechnung:', err);
    }
  }
}
