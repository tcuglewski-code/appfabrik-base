'use client';

/**
 * Mollie Payment Button Komponente für Feldhub
 * 
 * Verwendung:
 * ```tsx
 * <MolliePaymentButton
 *   invoiceId="RE-2026-0001"
 *   amount={15000} // in Cents
 *   customerName="Max Mustermann"
 *   customerEmail="max@example.com"
 *   onSuccess={(paymentId) => console.log('Zahlung eingeleitet:', paymentId)}
 *   onError={(error) => console.error('Fehler:', error)}
 * />
 * ```
 */

import { useState } from 'react';
import { CreditCard, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { MolliePaymentMethod } from '@/lib/mollie';

// =============================================================================
// TYPES
// =============================================================================

export interface MolliePaymentButtonProps {
  /** Rechnungsnummer oder -ID */
  invoiceId: string;
  /** Betrag in Cents (z.B. 15000 = €150.00) */
  amount: number;
  /** Währung (default: EUR) */
  currency?: string;
  /** Name des Kunden */
  customerName?: string;
  /** E-Mail des Kunden */
  customerEmail?: string;
  /** Bevorzugte Zahlungsmethode(n) */
  preferredMethods?: MolliePaymentMethod[];
  /** Zusätzliche Metadata für die Zahlung */
  metadata?: Record<string, unknown>;
  /** Button-Text */
  buttonText?: string;
  /** Button-Variante */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button-Größe */
  size?: 'sm' | 'md' | 'lg';
  /** Vollbreite */
  fullWidth?: boolean;
  /** Deaktiviert */
  disabled?: boolean;
  /** Callback bei erfolgreicher Zahlungsinitiierung */
  onSuccess?: (paymentId: string, checkoutUrl: string) => void;
  /** Callback bei Fehler */
  onError?: (error: Error) => void;
  /** Callback wenn Weiterleitung startet */
  onRedirect?: () => void;
  /** Redirect nach Zahlung (default: aktuelle Seite) */
  redirectUrl?: string;
  /** Klasse für Custom Styling */
  className?: string;
}

interface PaymentInitResponse {
  paymentId: string;
  checkoutUrl: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MolliePaymentButton({
  invoiceId,
  amount,
  currency = 'EUR',
  customerName,
  customerEmail,
  preferredMethods,
  metadata,
  buttonText = 'Jetzt bezahlen',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onSuccess,
  onError,
  onRedirect,
  redirectUrl,
  className = '',
}: MolliePaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format amount for display
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount / 100);

  // Button styles based on variant and size
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary disabled:bg-gray-400',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary disabled:bg-gray-400',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary disabled:border-gray-400 disabled:text-gray-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/mollie/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId,
          amount,
          currency,
          customerName,
          customerEmail,
          preferredMethods,
          metadata,
          redirectUrl: redirectUrl ?? window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Fehler beim Erstellen der Zahlung: ${response.status}`);
      }

      const data: PaymentInitResponse = await response.json();
      
      // Callback
      onSuccess?.(data.paymentId, data.checkoutUrl);
      
      // Redirect to Mollie checkout
      onRedirect?.();
      window.location.href = data.checkoutUrl;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unbekannter Fehler');
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`mollie-payment-button-wrapper ${fullWidth ? 'w-full' : 'inline-block'}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            <span>Wird verarbeitet...</span>
          </>
        ) : (
          <>
            <CreditCard size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
            <span>{buttonText}</span>
            {amount > 0 && (
              <span className="opacity-75">({formattedAmount})</span>
            )}
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-start gap-2 text-sm text-error" role="alert">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PAYMENT METHODS SELECTOR
// =============================================================================

interface PaymentMethodOption {
  id: MolliePaymentMethod;
  label: string;
  icon: string;
  description?: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'sepa', label: 'SEPA-Lastschrift', icon: '🏦', description: 'Direkt von Ihrem Bankkonto' },
  { id: 'creditcard', label: 'Kreditkarte', icon: '💳', description: 'Visa, Mastercard' },
  { id: 'giropay', label: 'giropay', icon: '🇩🇪', description: 'Online-Banking (DE)' },
  { id: 'ideal', label: 'iDEAL', icon: '🇳🇱', description: 'Online-Banking (NL)' },
  { id: 'eps', label: 'eps', icon: '🇦🇹', description: 'Online-Banking (AT)' },
  { id: 'bancontact', label: 'Bancontact', icon: '🇧🇪', description: 'Online-Banking (BE)' },
  { id: 'paypal', label: 'PayPal', icon: '💰' },
];

export interface MolliePaymentMethodSelectorProps {
  /** Erlaubte Methoden (default: alle) */
  allowedMethods?: MolliePaymentMethod[];
  /** Ausgewählte Methode */
  selected?: MolliePaymentMethod;
  /** Callback bei Auswahl */
  onChange: (method: MolliePaymentMethod) => void;
  /** Deaktiviert */
  disabled?: boolean;
}

export function MolliePaymentMethodSelector({
  allowedMethods,
  selected,
  onChange,
  disabled = false,
}: MolliePaymentMethodSelectorProps) {
  const methods = allowedMethods
    ? PAYMENT_METHODS.filter(m => allowedMethods.includes(m.id))
    : PAYMENT_METHODS;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">
        Zahlungsmethode wählen
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            disabled={disabled}
            className={`
              flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left
              ${selected === method.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 bg-background'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-2xl">{method.icon}</span>
            <div>
              <div className="font-medium text-text">{method.label}</div>
              {method.description && (
                <div className="text-xs text-text-muted">{method.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// PAYMENT STATUS BADGE
// =============================================================================

export type PaymentStatus = 'open' | 'pending' | 'paid' | 'expired' | 'failed' | 'canceled';

export interface MolliePaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  open: { label: 'Offen', color: 'bg-info/10 text-info' },
  pending: { label: 'Ausstehend', color: 'bg-warning/10 text-warning' },
  paid: { label: 'Bezahlt', color: 'bg-success/10 text-success' },
  expired: { label: 'Abgelaufen', color: 'bg-text-muted/10 text-text-muted' },
  failed: { label: 'Fehlgeschlagen', color: 'bg-error/10 text-error' },
  canceled: { label: 'Abgebrochen', color: 'bg-text-muted/10 text-text-muted' },
};

export function MolliePaymentStatusBadge({ status, size = 'md' }: MolliePaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.color}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      `}
    >
      {config.label}
    </span>
  );
}

// =============================================================================
// INVOICE PAYMENT LINK
// =============================================================================

export interface MollieInvoicePaymentLinkProps {
  /** Checkout URL von Mollie */
  checkoutUrl: string;
  /** Link-Text */
  text?: string;
  /** Expired */
  expired?: boolean;
}

export function MollieInvoicePaymentLink({
  checkoutUrl,
  text = 'Online bezahlen',
  expired = false,
}: MollieInvoicePaymentLinkProps) {
  if (expired) {
    return (
      <span className="text-text-muted text-sm">
        Zahlungslink abgelaufen
      </span>
    );
  }

  return (
    <a
      href={checkoutUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-medium"
    >
      <CreditCard size={16} />
      <span>{text}</span>
      <ExternalLink size={14} />
    </a>
  );
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default MolliePaymentButton;
