"use client";

import { useState } from "react";
import { getImageUrl } from "@/components/share/imageUrl";
import { useGetCategoryQuery } from "@/redux/featured/homeApi.jsx/homeApi";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesPage() {
  const { data, isLoading, isError } = useGetCategoryQuery();

  // API loading state
  if (isLoading) {
    return (
      <section className="container mx-auto mt-10 px-4 md:px-8 lg:px-12">
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 lg:h-80 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // API error state
  if (isError) {
    return (
      <section className="container mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>
        <p className="text-center text-red-500">
          Failed to load categories. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto mt-10 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Categories</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-2">
        {data?.data.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
}

/* =========================
   Single Category Card
========================= */
function CategoryCard({ category }) {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div className="cursor-pointer group">
      <Link href={`/categories/${category._id}`}>
        <div className="relative h-28 lg:h-80 rounded-lg overflow-hidden bg-gray-200">

          {/* Image loading spinner */}
          {imgLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            </div>
          )}

          <Image
            src={getImageUrl(category.thumbnail)}
            alt={category.name}
            layout="fill"
            loading="lazy"
            onLoadingComplete={() => setImgLoading(false)}
            className={`object-cover transition-opacity duration-300 ${
              imgLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </Link>

      <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
        {category.name}
      </h3>
    </div>
  );
}
