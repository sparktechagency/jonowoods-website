"use client"; // Next.js 13+ App Router এর জন্য

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { useGetWebPackagesQuery } from "@/redux/featured/Package/packageApi";

// Stripe publishable key - .env.local এ রাখুন
const stripePromise = loadStripe(
  "pk_test_51OHIrVB5u2A30G2QtLI2flRDD3KmQRlRafCke1GGcAl43X9IXi4Ymislp3NW7bg4NYYVcBrebbPcN17g2EyUqOH2009gKcWQo6"
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const packageId = "68ccef8b6e26dbd250723ba2";
//      const {data:packages}=useGetWebPackagesQuery();
//    console.log("packages",packages)

  useEffect(() => {
    if (!packageId) {
      setError("Package ID is required");
      setLoading(false);
      return;
    }

    // Backend API call করুন
    fetch(
      `http://10.10.7.62:7000/api/v1/subscription/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // অথবা আপনার auth method
        },
        body: JSON.stringify({ packageId }),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create checkout session");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-600 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">
          Complete Your Subscription
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
