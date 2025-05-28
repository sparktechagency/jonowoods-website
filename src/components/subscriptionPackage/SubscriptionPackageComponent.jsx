"use client";

import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  useGetWebPackagesQuery,
  useCheckoutForSubscriptionMutation,
} from "@/redux/featured/Package/packageApi";
import Spinner from "@/app/(commonLayout)/Spinner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SubscriptionPageComponent = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetWebPackagesQuery();
  const [checkoutForSubscription, { isLoading: isCheckoutLoading }] =
    useCheckoutForSubscriptionMutation();
  const [selectedPlan, setSelectedPlan] = useState("");

  // Filter packages to show only web subscription types
  const webPackages = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((pkg) => pkg.subscriptionType === "web");
  }, [data]);

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    try {
      const response = await checkoutForSubscription(selectedPlan).unwrap();

      if (response.success && response.data?.url) {
        // Redirect to Stripe checkout URL
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
              <Image
                src="/assests/payerImage.png"
                alt="Yoga pose demonstration"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>

            <Link
              href="/profile-dashboard"
              className="absolute -top-12 -left-6 text-white hover:text-gray-700 bg-red px-3 py-1 rounded-full text-sm"
            >
              Skip
            </Link>
          </div>

          {/* Right Side - Subscription Plans */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Plan
              </h1>
              <p className="text-gray-600">
                Get more access to entire yoga with jen! library of classes,
                meditations and courses.
              </p>
            </div>

            <Card className="p-6">
              <CardContent className="p-0">
                <RadioGroup
                  value={selectedPlan}
                  onValueChange={setSelectedPlan}
                  className="space-y-4"
                >
                  {webPackages.map((pkg, index) => (
                    <div
                      key={pkg._id}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem
                        value={pkg._id}
                        id={pkg._id}
                        className="text-red-500"
                      />
                      <Label
                        htmlFor={pkg._id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {pkg.title}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              {pkg.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${pkg.price}
                            </div>
                            <div className="text-sm text-gray-500">
                              per {pkg.duration}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubscribe}
              disabled={!selectedPlan || isCheckoutLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPageComponent;
