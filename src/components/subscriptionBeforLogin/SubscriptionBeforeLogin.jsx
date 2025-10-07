"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { useGetWebPackagesQuery } from "@/redux/featured/Package/packageApi";
import CheckoutPage from "./TestStripe";
import { useRouter } from "next/navigation";

const SubscriptionBeforeLogin = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { data: packages, isLoading } = useGetWebPackagesQuery();
  const router = useRouter();

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

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

        {/* Right Section - Plan Selection & Checkout */}
        <div className="bg-white lg:shadow-2xl p-8 lg:p-12 flex flex-col overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              1. Confirm Your Plan
            </h2>
            <p className="text-sm text-gray-600">
              Don't worry, you can cancel at any time.
            </p>
          </div>

          {/* Package Options */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : (
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
                          {pkg.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        BDT{pkg.price}
                      </div>
                      {pkg.originalPrice > pkg.price && (
                        <div className="text-xs text-gray-500 line-through">
                          BDT{pkg.originalPrice}
                        </div>
                      )}
                      <div className="text-xs text-pink-600 font-medium">
                        7-day free trial
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Embedded Checkout Component */}
          {selectedPackage && <CheckoutPage packageId={selectedPackage._id} />}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBeforeLogin;