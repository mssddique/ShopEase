import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCardForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    setProcessing(false);

    if (error) {
      onError(error.message || 'Payment failed. Please check your card details.');
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      onError('Payment was not completed.');
    }
  };

  return (
    <div>
      <PaymentElement />
      <button
        type="button"
        className="btn btn-success w-100 mt-3"
        onClick={handleConfirm}
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Processing Payment...
          </>
        ) : (
          'Pay Now'
        )}
      </button>
    </div>
  );
};

export default StripeCardForm;