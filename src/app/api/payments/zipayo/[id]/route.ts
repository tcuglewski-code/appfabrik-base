/**
 * GET /api/payments/zipayo/[id]
 * 
 * Retrieves a PaymentIntent by ID.
 * 
 * POST /api/payments/zipayo/[id]/capture
 * Captures an authorized PaymentIntent (Delayed Capture).
 * 
 * POST /api/payments/zipayo/[id]/cancel
 * Cancels a PaymentIntent.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getZipayoClient } from '@/modules/payments/zipayo-client';
import { isAdmin } from '@/lib/permissions';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { id } = await params;
  
  try {
    const zipayo = getZipayoClient();
    const result = await zipayo.getPaymentIntent(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('[Zipayo API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Abrufen der Zahlung' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { id } = await params;
  const url = new URL(req.url);
  const action = url.pathname.split('/').pop();
  
  // Capture and cancel require admin
  if (!isAdmin(session)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden - Admin required' },
      { status: 403 }
    );
  }
  
  try {
    const zipayo = getZipayoClient();
    let result;
    
    if (action === 'capture') {
      const body = await req.json().catch(() => ({}));
      result = await zipayo.capturePayment({
        paymentIntentId: id,
        amount: body.amount,
      });
    } else if (action === 'cancel') {
      result = await zipayo.cancelPayment(id);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    console.log(`[Zipayo API] ${action} successful:`, {
      id,
      userId: session.user?.id,
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error(`[Zipayo API] ${action ?? 'POST'} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Fehler bei der Verarbeitung' },
      { status: 500 }
    );
  }
}
