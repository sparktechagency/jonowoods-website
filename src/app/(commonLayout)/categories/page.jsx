"use client";

import { useGetCategoryQuery } from "@/redux/featured/homeApi.jsx/homeApi";
import ImageWithLoader from "@/components/share/ImageWithLoader";
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
  return (
    <div className="cursor-pointer group">
      <Link href={`/categories/${category._id}`}>
        <ImageWithLoader
          src={category.thumbnail}
          alt={category.name}
          containerClassName="h-28 lg:h-80 rounded-lg"
        />
      </Link>

      <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
        {category.name}
      </h3>
    </div>
  );
}
