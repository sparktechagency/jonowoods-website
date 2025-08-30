"use client";

import { useQuotationQuery } from "../../redux/featured/CommingSoon/commingSoonApi";

export default function YogaQuotePage() {
  const { data, isLoading, isError } = useQuotationQuery();

  // Default fallback quote
  const defaultQuote =
    "Yoga Is The Journey Of The Self, Through The Self, To The Self.";

  if (isLoading) {
    return (
      <div className="bg-white w-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center">
          <div className="animate-pulse h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white w-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-6">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
            {defaultQuote}
          </h1>
        </div>
      </div>
    );
  }

  // Get the quotation from API response or use default
  const quotation = data?.data?.quotation?.quotation
    ? data.data.quotation.quotation.replace(/<[^>]*>/g, "") // Remove HTML tags if any
    : defaultQuote;

  return (
    <div className="bg-white w-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-6">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto text-center">
        <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 leading-tight tracking-wide break-words">
          {quotation}
        </h1>
      </div>
    </div>
  );
}
