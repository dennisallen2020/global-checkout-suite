
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getTranslation } from '../i18n/translations';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CheckoutFormProps {
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
  amount: number;
  currency: string;
  language: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerData,
  amount,
  currency,
  language
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const t = (key: string) => getTranslation(language, key);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Create payment intent
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          payment_method_id: paymentMethod.id,
          customer_data: customerData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(client_secret);

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      setPaymentStatus('success');
      
      // Send notification email
      await fetch(`${apiUrl}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_data: customerData,
          amount,
          currency,
          payment_method_id: paymentMethod.id,
        }),
      });

    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : t('paymentError'));
      setPaymentStatus('error');
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-2xl font-bold text-green-600">
          {t('paymentSuccess')}
        </h3>
        <p className="text-gray-600">
          {language === 'pt' 
            ? 'Obrigado pela sua compra! Você receberá as instruções por email.'
            : 'Thank you for your purchase! You will receive instructions by email.'
          }
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('paymentMethod')}
        </label>
        <div className="border rounded-lg p-4 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">{t('processing')}</span>
          </div>
        ) : (
          `${t('processPayment')} - ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`
        )}
      </Button>

      <div className="flex items-center justify-center text-sm text-gray-500">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        {t('securePayment')}
      </div>
    </form>
  );
};
