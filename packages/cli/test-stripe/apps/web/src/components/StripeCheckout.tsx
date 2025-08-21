/**
 * Stripe Checkout Components
 * @module stripe-checkout
 * @description React components for Stripe payment processing
 */

import React, { useState, FormEvent } from "react";
import { PaymentElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormProps {
  amount: number;
  currency?: string;
}

/**
 * Internal checkout form component with Stripe Elements
 * @param {CheckoutFormProps} props - Component props
 * @returns {JSX.Element} Checkout form element
 */
function CheckoutFormContent({ amount, currency = "usd" }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const response = await fetch("/api/payment/create-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency }),
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message || "An error occurred");
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <PaymentElement />
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <button disabled={!stripe || processing || succeeded} className="submit-button">
        {processing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
      {succeeded && (
        <div className="success-message">Payment successful! Thank you for your purchase.</div>
      )}
    </form>
  );
}

/**
 * Main checkout form component with Stripe Elements provider
 * @param {CheckoutFormProps} props - Component props
 * @returns {JSX.Element} Complete checkout form with Elements wrapper
 */
export function CheckoutForm({ amount, currency = "usd" }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState("");

  React.useEffect(() => {
    fetch("/api/payment/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, currency]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "4px",
      },
    },
  };

  return (
    <div className="checkout-container">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormContent amount={amount} currency={currency} />
        </Elements>
      )}
    </div>
  );
}
