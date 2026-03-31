'use client';

/**
 * Zipayo Payment Button Component
 * 
 * Generisches Payment-Button für Rechnungs- und Auftrags-Ansichten.
 * Erstellt einen PaymentIntent und leitet zum Zipayo Payment Flow weiter.
 * 
 * Usage:
 * ```tsx
 * <ZipayoPayButton
 *   amount={4999}  // 49,99 €
 *   referenceId="RE-2026-0001"
 *   referenceType="rechnung"
 *   onSuccess={(pi) => console.log('Bezahlt!', pi)}
 * />
 * ```
 */

import { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentButtonProps, PaymentIntent, CreatePaymentIntentResponse } from '../types';
import { cn } from '@/lib/utils';

export function ZipayoPayButton({
  amount,
  currency = 'EUR',
  description,
  referenceId,
  referenceType = 'rechnung',
  label,
  disabled = false,
  onSuccess,
  onError,
  onCancel,
  className,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Format amount for display
  const formatAmount = (cents: number, curr: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: curr,
    }).format(cents / 100);
  };
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setStatus('loading');
    
    try {
      // 1. Create PaymentIntent via API
      const response = await fetch('/api/payments/zipayo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description: description ?? `Zahlung ${referenceId ?? ''}`.trim(),
          referenceId,
          referenceType,
          returnUrl: window.location.href + '?payment=success',
          cancelUrl: window.location.href + '?payment=canceled',
        }),
      });
      
      const data: CreatePaymentIntentResponse = await response.json();
      
      if (!data.success || !data.paymentIntent) {
        throw new Error(data.error ?? 'Zahlung konnte nicht initiiert werden');
      }
      
      // 2. Redirect to payment page or open modal
      const paymentIntent = data.paymentIntent;
      
      if (paymentIntent.redirectUrl) {
        // Redirect to Zipayo hosted payment page
        window.location.href = paymentIntent.redirectUrl;
      } else if (paymentIntent.clientSecret) {
        // Future: Handle inline payment modal with Stripe Elements
        console.log('[Zipayo] Client secret received, inline payment not yet implemented');
        throw new Error('Inline-Zahlung noch nicht implementiert');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(errorMessage);
      setStatus('error');
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle URL params for return from payment
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success' && status !== 'success') {
      setStatus('success');
      // Clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      
      // Fetch payment status (optional)
      const paymentIntentId = urlParams.get('payment_intent');
      if (paymentIntentId) {
        fetch(`/api/payments/zipayo/${paymentIntentId}`)
          .then(res => res.json())
          .then((data: CreatePaymentIntentResponse) => {
            if (data.success && data.paymentIntent) {
              onSuccess?.(data.paymentIntent);
            }
          })
          .catch(console.error);
      }
    }
    
    if (paymentStatus === 'canceled' && status !== 'error') {
      setStatus('idle');
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      onCancel?.();
    }
  }
  
  // Render different states
  if (status === 'success') {
    return (
      <div className={cn('flex items-center gap-2 text-green-600', className)}>
        <CheckCircle className="h-5 w-5" />
        <span>Zahlung erfolgreich</span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handlePayment}
        disabled={disabled || loading || amount <= 0}
        className={cn(
          'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
          'text-white font-medium',
          className
        )}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird verarbeitet...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {label ?? `Jetzt bezahlen (${formatAmount(amount, currency)})`}
          </>
        )}
      </Button>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Sichere Zahlung via Zipayo
      </p>
    </div>
  );
}

/**
 * Compact variant for inline use
 */
export function ZipayoPayButtonCompact(props: PaymentButtonProps) {
  return (
    <ZipayoPayButton
      {...props}
      label={props.label ?? 'Bezahlen'}
      className={cn('h-8 px-3 text-sm', props.className)}
    />
  );
}
