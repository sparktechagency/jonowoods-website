"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { X, Check, Lock } from "lucide-react";
import { useGetWebPackagesQuery } from "@/redux/featured/Package/packageApi";
import CheckoutPage from "./TestStripe";

const stripePromise = loadStripe(
  "pk_test_51OHIrVB5u2A30G2QtLI2flRDD3KmQRlRafCke1GGcAl43X9IXi4Ymislp3NW7bg4NYYVcBrebbPcN17g2EyUqOH2009gKcWQo6"
);

// Mock data - replace with your API
const mockPackages = [
  {
    _id: "1",
    title: "Lifetime",
    description: "One-time payment",
    price: 6852.1,
    originalPrice: 6852.1,
    duration: "One time",
    paymentType: "one-time",
  },
  {
    _id: "2",
    title: "Yearly",
    description: "Best value",
    price: 2250.64,
    originalPrice: 2782.78,
    duration: "1 Year",
    paymentType: "year",
  },
  {
    _id: "3",
    title: "Monthly",
    description: "Flexible plan",
    price: 2699.08,
    originalPrice: 2699.08,
    duration: "1 Month",
    paymentType: "month",
  },
];

// Payment Form Component
const CheckoutForm = ({ selectedPackage, onBack, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          2. Choose Your Payment Method
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Plan Summary */}
      <div className="bg-pink-50 rounded-xl p-4 mb-6 border border-pink-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">
              {selectedPackage.title}
            </div>
            <div className="text-sm text-gray-600">
              {selectedPackage.duration}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">
              BDT{selectedPackage.price}
            </div>
            <div className="text-xs text-pink-600">7-day free trial</div>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Promo code?
        </label>
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter code here"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
        <div>
          <div className="font-semibold text-gray-900">Total due today</div>
          <div className="text-xs text-gray-600">
            7 days free, then BDT{selectedPackage.price}/month + applicable
            taxes
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">BDT0.00</div>
      </div>

      {/* Payment Element */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            Secure, fast checkout with Link
          </span>
        </div>
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Terms */}
      <p className="text-xs text-gray-600 mb-6">
        By providing your card information, you allow Jess Yoga to charge your
        card for future payments in accordance with their terms.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          "Start Your Free Trial"
        )}
      </button>
    </form>
  );
};

// Main Component
const SubscriptionBeforeLogin = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
     const {data:packages,loading}=useGetWebPackagesQuery();
   console.log("packages",packages)
 

  const handleSelectPackage = async (pkg) => {
    setSelectedPackage(pkg);

    try {
      // Your API call to create payment intent
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://10.10.7.62:7000/api/v1/subscription/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ packageId: pkg._id }),
        }
      );
      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error("Failed to create payment intent:", error);
    }
  };

  const handleBack = () => {
    setSelectedPackage(null);
    setClientSecret("");
  };

  const handleSuccess = () => {
    setShowSuccess(true);
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Subscription Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to your yoga journey! Your 7-day free trial has started.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 rounded-full transition-all"
          >
            Start Your Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Section - Content */}
        <div className="flex flex-col justify-center px-8 lg:px-16 py-12">
          {/* Yoga Image */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl max-w-md">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop"
              alt="Woman doing yoga by pool"
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight">
            <span className="text-4xl">☀️</span>{" "}
            <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
              Ready to feel stronger, calmer, and more connected—on and off the
              mat?
            </span>
          </h1>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Access 500+ Exclusive Classes 🔥
                </h3>
                <p className="text-sm text-gray-600">
                  Explore Jessica's full library of yoga and meditation sessions
                  designed for all levels, anytime, anywhere.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Ad-Free, Seamless Experience 🎬
                </h3>
                <p className="text-sm text-gray-600">
                  Focus on your practice without interruptions - enjoy a
                  completely ad-free platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Practice Anytime, Even Offline 📱
                </h3>
                <p className="text-sm text-gray-600">
                  Download your favorite sessions and flow with ease, no matter
                  where life takes you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Build a Consistent Routine ✨
                </h3>
                <p className="text-sm text-gray-600">
                  Stay accountable with curated monthly guides and challenges
                  that fit seamlessly into your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Checkout Form */}
        <div className="bg-white lg:shadow-2xl p-8 lg:p-12 flex flex-col overflow-y-auto">
          {clientSecret && selectedPackage ? (
            // Payment Form
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#ec4899",
                    colorBackground: "#ffffff",
                    colorText: "#1f2937",
                    colorDanger: "#ef4444",
                    fontFamily: "system-ui, sans-serif",
                    spacingUnit: "4px",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <CheckoutForm
                selectedPackage={selectedPackage}
                onBack={handleBack}
                onSuccess={handleSuccess}
              />
            </Elements>
          ) : (
            // Plan Selection
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  1. Confirm Your Plan
                </h2>
                <p className="text-sm text-gray-600">
                  Don't worry, you can cancel at any time.
                </p>
              </div>

              {/* Package Options */}
              <div className="space-y-3 mb-6">
                {packages?.data?.map((pkg) => (
                  <button
                    key={pkg._id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-pink-300 ${
                      selectedPackage?._id === pkg._id
                        ? "border-pink-400 bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPackage?._id === pkg._id
                              ? "border-pink-500 bg-pink-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPackage?._id === pkg._id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {pkg.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            BDT{pkg.price}/{pkg.paymentType}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          BDT{pkg.price}
                          <span className="text-sm font-normal">/month</span>
                        </div>
                        {pkg.originalPrice > pkg.price && (
                          <div className="text-xs text-gray-500 line-through">
                            BDT{pkg.originalPrice}
                          </div>
                        )}
                        <div className="text-xs text-pink-600 font-medium">
                          Includes a 7-day free trial
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-500 mt-8">
                Select a plan to continue to payment
              </p>
            </>
          )}
        </div>

        <CheckoutPage  />
      </div>
    </div>
  );
};

export default SubscriptionBeforeLogin;