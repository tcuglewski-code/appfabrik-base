/**
 * POST /api/payments/zipayo/create
 * 
 * Creates a Zipayo PaymentIntent for invoices, orders, etc.
 * Requires authenticated session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getZipayoClient } from '@/modules/payments/zipayo-client';
import { CreatePaymentIntentRequest } from '@/modules/payments/types';

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await req.json() as CreatePaymentIntentRequest;
    
    // Validation
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Betrag muss größer als 0 sein' },
        { status: 400 }
      );
    }
    
    if (body.amount > 99999999) { // Max 999.999,99 €
      return NextResponse.json(
        { success: false, error: 'Betrag zu hoch' },
        { status: 400 }
      );
    }
    
    // Get Zipayo client
    const zipayo = getZipayoClient();
    
    // Add user info to metadata
    const metadata: Record<string, string> = {
      ...body.metadata,
      user_id: session.user?.id ?? 'unknown',
      user_email: session.user?.email ?? 'unknown',
      created_via: 'feldhub-api',
    };
    
    // Create PaymentIntent
    const result = await zipayo.createPaymentIntent({
      amount: body.amount,
      currency: body.currency ?? 'EUR',
      description: body.description,
      referenceId: body.referenceId,
      referenceType: body.referenceType,
      captureMethod: body.captureMethod ?? 'automatic',
      returnUrl: body.returnUrl,
      cancelUrl: body.cancelUrl,
      metadata,
    });
    
    if (!result.success) {
      console.error('[Zipayo API] PaymentIntent creation failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error ?? 'Zahlung konnte nicht erstellt werden' },
        { status: 500 }
      );
    }
    
    // Log payment creation (for audit)
    console.log('[Zipayo API] PaymentIntent created:', {
      id: result.paymentIntent?.id,
      amount: body.amount,
      referenceId: body.referenceId,
      userId: session.user?.id,
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('[Zipayo API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Interner Fehler' 
      },
      { status: 500 }
    );
  }
}
