/**
 * POST /api/webhooks/mollie
 * 
 * Webhook Handler für Mollie Payment-Status-Updates
 * 
 * Mollie sendet: application/x-www-form-urlencoded
 * Body: { id: "tr_..." }
 * 
 * WICHTIG: Mollie sendet nur die Payment ID. Wir müssen den
 * Payment-Status selbst von der API abrufen (Security Best Practice).
 * 
 * @see https://docs.mollie.com/payments/webhooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMollieClient, isMollieEnabled, MolliePayment } from '@/lib/mollie';
import { prisma } from '@/lib/prisma';

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Check if Mollie is enabled
    if (!isMollieEnabled()) {
      console.warn('Mollie webhook received but Mollie is not enabled');
      return new NextResponse('OK', { status: 200 });
    }

    // Parse form data (Mollie sends application/x-www-form-urlencoded)
    const formData = await request.formData();
    const paymentId = formData.get('id')?.toString();

    if (!paymentId) {
      console.error('Mollie webhook: Missing payment ID');
      return new NextResponse('Missing payment ID', { status: 400 });
    }

    console.log(`Mollie webhook received for payment: ${paymentId}`);

    // Fetch payment details from Mollie API
    // This is the secure way - never trust webhook payload alone
    const mollie = getMollieClient();
    const payment = await mollie.getPayment(paymentId);

    // Process based on status
    await processPaymentStatus(payment);

    // Always return 200 to acknowledge receipt
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Mollie webhook error:', error);
    
    // Still return 200 to prevent Mollie from retrying forever
    // Log the error for investigation
    return new NextResponse('Error processed', { status: 200 });
  }
}

// =============================================================================
// PAYMENT STATUS PROCESSING
// =============================================================================

async function processPaymentStatus(payment: MolliePayment): Promise<void> {
  const { id, status, metadata, amount } = payment;

  console.log(`Processing Mollie payment ${id}: status=${status}`);

  // Extract metadata
  const invoiceId = (metadata as Record<string, unknown>)?.invoiceId as string | undefined;
  const tenantId = (metadata as Record<string, unknown>)?.tenantId as string | undefined;

  // Update payment transaction in database
  try {
    const transaction = await prisma.paymentTransaction.findFirst({
      where: { molliePaymentId: id },
    });

    if (transaction) {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status,
          paidAt: status === 'paid' ? new Date() : null,
          method: payment.method ?? undefined,
          updatedAt: new Date(),
        },
      });
    } else {
      console.warn(`Payment transaction not found for Mollie ID: ${id}`);
    }
  } catch (dbError) {
    console.error('Failed to update payment transaction:', dbError);
  }

  // Handle specific statuses
  switch (status) {
    case 'paid':
      await handlePaymentPaid(payment, invoiceId);
      break;
      
    case 'failed':
      await handlePaymentFailed(payment, invoiceId);
      break;
      
    case 'expired':
      await handlePaymentExpired(payment, invoiceId);
      break;
      
    case 'canceled':
      await handlePaymentCanceled(payment, invoiceId);
      break;
      
    case 'pending':
    case 'open':
    case 'authorized':
      // These are intermediate states, no action needed
      console.log(`Payment ${id} is in state: ${status}`);
      break;
  }
}

// =============================================================================
// STATUS HANDLERS
// =============================================================================

async function handlePaymentPaid(payment: MolliePayment, invoiceId?: string): Promise<void> {
  console.log(`✅ Payment ${payment.id} was successful!`);
  
  if (!invoiceId) {
    console.warn('No invoice ID in payment metadata');
    return;
  }

  try {
    // Update invoice status to paid
    await prisma.rechnung.update({
      where: { nummer: invoiceId },
      data: {
        status: 'BEZAHLT',
        bezahltAm: new Date(),
        zahlungsart: `Mollie (${payment.method ?? 'unknown'})`,
      },
    });

    console.log(`Invoice ${invoiceId} marked as paid`);

    // Create activity log entry
    await prisma.activityLog.create({
      data: {
        action: 'PAYMENT_RECEIVED',
        entityType: 'RECHNUNG',
        entityId: invoiceId,
        description: `Zahlung über ${payment.amount.value} ${payment.amount.currency} erhalten via Mollie`,
        metadata: {
          molliePaymentId: payment.id,
          method: payment.method,
          amount: payment.amount,
        },
      },
    });

    // Optional: Send confirmation email
    // await sendPaymentConfirmationEmail(invoiceId, payment);

  } catch (error) {
    console.error(`Failed to update invoice ${invoiceId}:`, error);
  }
}

async function handlePaymentFailed(payment: MolliePayment, invoiceId?: string): Promise<void> {
  console.log(`❌ Payment ${payment.id} failed`);

  if (!invoiceId) return;

  try {
    await prisma.activityLog.create({
      data: {
        action: 'PAYMENT_FAILED',
        entityType: 'RECHNUNG',
        entityId: invoiceId,
        description: `Zahlung fehlgeschlagen via Mollie`,
        metadata: {
          molliePaymentId: payment.id,
          method: payment.method,
        },
      },
    });
  } catch (error) {
    console.error(`Failed to log payment failure for ${invoiceId}:`, error);
  }
}

async function handlePaymentExpired(payment: MolliePayment, invoiceId?: string): Promise<void> {
  console.log(`⏰ Payment ${payment.id} expired`);

  if (!invoiceId) return;

  try {
    await prisma.activityLog.create({
      data: {
        action: 'PAYMENT_EXPIRED',
        entityType: 'RECHNUNG',
        entityId: invoiceId,
        description: `Zahlungslink abgelaufen`,
        metadata: {
          molliePaymentId: payment.id,
        },
      },
    });
  } catch (error) {
    console.error(`Failed to log payment expiry for ${invoiceId}:`, error);
  }
}

async function handlePaymentCanceled(payment: MolliePayment, invoiceId?: string): Promise<void> {
  console.log(`🚫 Payment ${payment.id} was canceled`);

  if (!invoiceId) return;

  try {
    await prisma.activityLog.create({
      data: {
        action: 'PAYMENT_CANCELED',
        entityType: 'RECHNUNG',
        entityId: invoiceId,
        description: `Zahlung vom Kunden abgebrochen`,
        metadata: {
          molliePaymentId: payment.id,
        },
      },
    });
  } catch (error) {
    console.error(`Failed to log payment cancellation for ${invoiceId}:`, error);
  }
}
