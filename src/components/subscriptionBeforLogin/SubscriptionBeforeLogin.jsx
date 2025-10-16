"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import {
  useGetMyAccessQuery,
  useGetWebPackagesQuery,
} from "@/redux/featured/Package/packageApi";
import CheckoutPage from "./TestStripe";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SubscriptionBeforeLogin = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { data: userData } = useGetMyAccessQuery();
  // console.log("userData",userData)
  const { data: packages, isLoading } = useGetWebPackagesQuery();
  console.log(packages);

  const webPackages = packages?.data?.filter(
    (pkg) => pkg.subscriptionType === "web"
  );
  console.log("webPackages", webPackages);
  const router = useRouter();

  // Set first package as default when packages are loaded
  useEffect(() => {
    if (webPackages && webPackages?.length > 0 && !selectedPackage) {
      setSelectedPackage(webPackages[0]);
    }
  }, [webPackages, selectedPackage]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  return (
    <div className="min-h-screen mt-7 lg:mt-10 max-w-6xl  mx-auto px-4  md:px-8 lg:px-12 lg:py-12">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-x-10 min-h-screen">
        {/* Left Section - Content */}
        <div className="flex flex-col justify-center ">
          {/* Yoga Image */}
          <div className=" rounded-2xl  overflow-hidden shadow-xl w-full mb-16">
            <Image
              src="/assests/bgImage.png"
              alt="Woman doing yoga by pool"
              width={800}
              height={600}
              className="w-full h-[300px] lg:h-[300px] object-cover"
            />
          </div>

          {/* Heading */}
          <h1 className="text-xl lg:text-3xl font-bold mb-8 text-center leading-tight">
            {/* <span className=" md:text-2xl ">☀️</span>{" "} */}
            <span className=" ">
              Ready to feel stronger, calmer, and more connected—on and off the
              mat?
            </span>
          </h1>

          {/* Features */}
          <div className="space-y-4 lg:space-y-14">
            <div className="flex items-start gap-3 lg:gap-">
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold  mb-6">
                  Access 150+ Yoga Classes & Growing 🧘‍♀️
                </h3>
                <p className="text-sm text-gray-600">
                  Discover Jen’s expanding library of mindful yoga flows, quick
                  resets, and calming sessions created for busy schedules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">
                  Real-Life Yoga, Ad-Free ☁️
                </h3>
                <p className="text-sm text-gray-600">
                  Find focus and clarity with a simple, distraction-free space
                  designed to support your daily routine.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">
                  Practice Anywhere, Anytime 📲
                </h3>
                <p className="text-sm text-gray-600">
                  Stream or download your favorite sessions and stay consistent
                  at home, at work, or on the go.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">
                  Stay Consistent, Feel Grounded ✨
                </h3>
                <p className="text-sm text-gray-600">
                  Join monthly challenges and follow guided plans that help you
                  build strength, flexibility, and inner calm - one short
                  session at a time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-6">
                Grow with a Supportive Community 🌿
                </h3>
                <p className="text-sm text-gray-600">
                 Be part of a wellness journey that values balance, mindfulness, and sustainability - yoga that grows with you, not against your schedule.

                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Plan Selection & Checkout */}
        <div className="bg-white  flex flex-col overflow-y-auto">
          <div className="border p-6 rounded-lg">
            {" "}
            <div className="mb-8 ">
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
                {webPackages?.map((pkg) => (
                  <button
                    key={pkg._id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full text-left p-4 rounded-md border-2 transition-all hover:border-pink-300 ${
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
                          $ {pkg.price}
                        </div>
                        {pkg.originalPrice > pkg.price && (
                          <div className="text-xs text-gray-500 line-through">
                            $ {pkg.originalPrice}
                          </div>
                        )}
                        <div className="text-xs text-black font-medium">
                          7-day free trial
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Embedded Checkout Component */}
          {selectedPackage && <CheckoutPage packageId={selectedPackage._id} />}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBeforeLogin;
