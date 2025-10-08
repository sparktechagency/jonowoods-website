"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Spinner from "@/app/(commonLayout)/Spinner";
import { baseUrlApi } from "@/redux/baseUrl/baseUrlApi";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51OHIrVB5u2A30G2QtLI2flRDD3KmQRlRafCke1GGcAl43X9IXi4Ymislp3NW7bg4NYYVcBrebbPcN17g2EyUqOH2009gKcWQo6"
);

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.7.62:7000/api/v1";

export default function CheckoutPage({ packageId }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!packageId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

 
    fetch(
      `${baseUrlApi}/subscription/create-checkout-session`,
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


  if (!packageId) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
     <Spinner />
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


  if (!clientSecret) {
    return null;
  }

  return (
    <div className="mt-8 border p-6 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        2. Complete Payment
      </h2>
      <div className="bg-white rounded-lg ">
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
              border: "none",
            //   borderRadius: "8px",
            },
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}