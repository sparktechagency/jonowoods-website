"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51OHIrVB5u2A30G2QtLI2flRDD3KmQRlRafCke1GGcAl43X9IXi4Ymislp3NW7bg4NYYVcBrebbPcN17g2EyUqOH2009gKcWQo6"
);

export default function CheckoutPage({ packageId }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // যদি packageId না থাকে তাহলে return করুন
    if (!packageId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    // Backend API call করুন
    fetch(
      `http://10.10.7.62:7000/api/v1/subscription/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId: packageId }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create checkout session");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
        } else {
          setError(data.message || "Something went wrong");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [packageId]);

  // যদি packageId না থাকে
  if (!packageId) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
        <h2 className="text-red-600 font-semibold text-lg mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  // যদি clientSecret না থাকে
  if (!clientSecret) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        2. Complete Payment
      </h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
          appearance={{
            theme: "stripe",
            variables: {
              colorPrimary: "#ec4899",
              colorBackground: "#ffffff",
              colorText: "#1f2937",
              fontFamily: "system-ui, sans-serif",
              borderRadius: "8px",
            },
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}