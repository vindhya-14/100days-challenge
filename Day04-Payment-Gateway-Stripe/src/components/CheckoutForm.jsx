import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/success', 
      },
      redirect: 'if_required', 
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful!');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={loading || !stripe || !elements}>
        {loading ? 'Processing...' : 'Pay ₹100'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CheckoutForm;
