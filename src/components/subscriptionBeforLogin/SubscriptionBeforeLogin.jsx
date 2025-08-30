"use client";

import {
  useGetWebPackagesQuery,
  useCheckoutForSubscriptionMutation,
} from "@/redux/featured/Package/packageApi";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Star, Shield, Headphones } from "lucide-react";
import { toast } from "sonner";

const SubscriptionBeforeLogin = () => {
  const { data, isLoading } = useGetWebPackagesQuery();
  const [checkoutForSubscription, { isLoading: isCheckoutLoading }] =
    useCheckoutForSubscriptionMutation();
  const [loadingPackageId, setLoadingPackageId] = React.useState(null);

  // Filter only web packages
  const webPackages =
    data?.data?.filter((pkg) => pkg.subscriptionType === "web") || [];

  const handleSubscription = async (packageId) => {
    try {
      setLoadingPackageId(packageId);
      const response = await checkoutForSubscription(packageId).unwrap();

      if (response.success && response.data?.url) {
        // Redirect to Stripe checkout URL
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoadingPackageId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <Skeleton className="h-8 md:h-12 w-64 md:w-96 mx-auto mb-4" />
            <Skeleton className="h-4 md:h-6 w-80 md:w-[600px] mx-auto mb-2" />
            <Skeleton className="h-3 md:h-4 w-32 md:w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Skeleton className="h-[500px] md:h-[600px] rounded-2xl" />
            <Skeleton className="h-[500px] md:h-[600px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const PackageCard = ({ pkg }) => (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-slate-200 hover:border-[#ca3939]/30 h-fit">
      <CardHeader className="space-y-3 ">
        <div className="flex items-center justify-between">
          <Badge
            variant="default"
            className="text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-100"
          >
            WEB PLAN
          </Badge>
          {pkg.discount > 0 && (
            <Badge
              variant="destructive"
              className="bg-red-100 text-red-700 hover:bg-red-100"
            >
              {pkg.discount}% OFF
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-[#ca3939] transition-colors">
          {pkg.title.replace(" (WEB)", "")}
        </CardTitle>

        <p className="text-sm md:text-base text-slate-600 leading-relaxed">{pkg.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 ">
        {/* Pricing Section */}
        <div className="space-y-2">
          <div className="flex items-end gap-2 md:gap-3">
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
              ${pkg.price}
            </span>
            {pkg.originalPrice > pkg.price && (
              <span className="text-lg md:text-xl text-slate-500 line-through mb-1 md:mb-2">
                ${pkg.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
            <span className="font-medium">{pkg.duration}</span>
            <span>•</span>
            <span className="font-medium">{pkg.paymentType} billing</span>
          </div>
          {pkg.originalPrice > pkg.price && (
            <p className="text-xs md:text-sm text-green-600 font-medium">
              You save ${(pkg.originalPrice - pkg.price).toFixed(2)}!
            </p>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-3 md:space-y-4">
          <h4 className="font-semibold text-slate-900 text-base md:text-lg">
            What&apos;s included:
          </h4>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm lg:text-base text-slate-700">
                Full access to all premium features
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm lg:text-base text-slate-700">Priority customer support</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm lg:text-base text-slate-700">
                Advanced web dashboard & analytics
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm lg:text-base text-slate-700">
                Regular updates & new features
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => handleSubscription(pkg._id)}
          disabled={loadingPackageId === pkg._id}
          className="w-full bg-[#ca3939] hover:bg-[#7a141a] text-white font-bold py-3 md:py-4 text-sm md:text-base lg:text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loadingPackageId === pkg._id ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            "🎉 Start 7 Days Free Trial"
          )}
        </Button>

        {/* <p className="text-center text-xs text-slate-500">
          No credit card required • Cancel anytime during trial
        </p> */}
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ca3939]/5 to-[#7a141a]/5"></div>
        <div className="relative container mx-auto px-4 py-4 md:py-6 lg:py-10">
          <div className="text-center mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
              Choose Your Perfect
              <span className="bg-gradient-to-r from-[#ca3939] to-[#7a141a] bg-clip-text text-transparent">
                {" "}
                Plan
              </span>
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-slate-600 mb-4 md:mb-6 leading-relaxed max-w-xl md:max-w-2xl mx-auto px-4">
              Unlock the full potential of our web platform with premium
              features, priority support, and exclusive access to advanced
              tools.
            </p>
            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="container mx-auto px-4 mt-6 pb-6  md:pb-10 lg:pb-12">
        <div
          className={`grid gap-6 md:gap-8 mx-auto ${
            webPackages.length === 1
              ? "grid-cols-1 max-w-sm md:max-w-lg"
              : webPackages.length === 2
              ? "grid-cols-1 lg:grid-cols-2 max-w-5xl"
              : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl"
          }`}
        >
          {webPackages.map((pkg, index) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 md:mt-24 text-center">
          <p className="text-slate-500 mb-8 md:mb-12 text-sm md:text-base lg:text-lg">
            Trusted by thousands of users worldwide
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-2xl md:max-w-3xl mx-auto">
            <Card className="border-none shadow-sm bg-white/50">
              <CardContent className="flex items-center justify-center gap-2 md:gap-3 py-4 md:py-6">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm md:text-base">4.9/5</div>
                  <div className="text-xs md:text-sm text-slate-600">User Rating</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/50">
              <CardContent className="flex items-center justify-center gap-2 md:gap-3 py-4 md:py-6">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm md:text-base">99.9%</div>
                  <div className="text-xs md:text-sm text-slate-600">Uptime</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white/50">
              <CardContent className="flex items-center justify-center gap-2 md:gap-3 py-4 md:py-6">
                <Headphones className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm md:text-base">24/7</div>
                  <div className="text-xs md:text-sm text-slate-600">Support</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SubscriptionBeforeLogin;