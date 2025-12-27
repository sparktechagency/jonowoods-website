"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCategoryQuery } from "../../redux/featured/homeApi.jsx/homeApi";
import ImageWithLoader from "../share/ImageWithLoader";

export default function BrowseByCategory({ onSeeMore, onClassClick }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCategoryQuery();
  const [showAll, setShowAll] = useState(false);

  /* ======================
     API Loading State
  ====================== */
  if (isLoading) {
    return (
      <section className="mb-10 px-4 md:px-8 lg:px-12">
        <h2 className="text-xl font-semibold mb-4">Browse By Categories</h2>
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

  /* ======================
     API Error State
  ====================== */
  if (isError) {
    return (
      <section className="mb-10 px-4 md:px-8 lg:px-12">
        <h2 className="text-xl font-semibold mb-4">Browse By Categories</h2>
        <p className="text-center text-red-500">
          Failed to load categories. Please try again later.
        </p>
      </section>
    );
  }

  const categoriesToShow = showAll ? data?.data : data?.data?.slice(0, 6);

  const handleSeeMoreClick = () => {
    router.push("/categories");
  };

  return (
    <section className="mb-10 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Browse By Categories</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-2">
        {categoriesToShow?.map((yogaClass) => (
          <CategoryCard key={yogaClass._id} yogaClass={yogaClass} />
        ))}
      </div>

      {/* Show the "See More" button if the number of categories exceeds 6 */}
      {data?.data?.length > 6 && (
        <div className="flex justify-end mt-4">
          <Button
            variant="link"
            className="text-rose-500 hover:text-rose-600 cursor-pointer"
            onClick={handleSeeMoreClick}
          >
            See More
          </Button>
        </div>
      )}
    </section>
  );
}

/* =========================
   Single Category Card
========================= */
function CategoryCard({ yogaClass }) {
  return (
    <div className="cursor-pointer group">
      <Link href={`/categories/${yogaClass._id}`}>
        <ImageWithLoader
          src={yogaClass?.thumbnail}
          alt={yogaClass.name}
          containerClassName="h-28 lg:h-80 rounded-lg"
        />
      </Link>

      <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
        {yogaClass.name}
      </h3>
    </div>
  );
}
