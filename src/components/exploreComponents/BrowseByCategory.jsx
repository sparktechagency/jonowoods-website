"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCategoryQuery } from "../../redux/featured/homeApi.jsx/homeApi";
import { getImageUrl } from "../share/imageUrl";
import { useState } from "react";

export default function BrowseByCategory({ onSeeMore, onClassClick }) {
  const router = useRouter();
  const { data, isLoading } = useGetCategoryQuery();
  const [showAll, setShowAll] = useState(false); // State to handle "See More"

  if (isLoading) return <div>Loading...</div>; // Loading state, you can customize it

  // Show only the first 6 categories if showAll is false, otherwise show all categories
  const categoriesToShow = showAll ? data?.data : data?.data?.slice(0, 6);

  const handleSeeMoreClick = () => {
    // Navigate to the categories page when "See More" is clicked
    router.push("/categories");
  };

  return (
    <section className="mb-10 mx-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Browse By Categories</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
        {categoriesToShow?.map((yogaClass) => (
          <div
            key={yogaClass._id}
            className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => router.push(`/categories/${yogaClass._id}`)}
          >
            <Link href={`/categories/${yogaClass._id}`}>
              <div className="relative w-full h-full">
                {/* Image displayed on top */}
                <Image
                  src={getImageUrl(yogaClass?.thumbnail)}
                  alt={yogaClass.name}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Gradient Overlay on top of the image */}
                <div
                  className="absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white lg:text-2xl  font-bold 
                                 md:opacity-100 md:translate-y-0
                                 lg:opacity-0 lg:translate-y-20 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 
                                 lg:transition-all lg:duration-500 lg:ease-out bg-[#A92C2C]/80
                                 px-2 py-1 rounded"
                    >
                    {yogaClass.name}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Show the "See More" button if the number of categories exceeds 6 */}
      {data?.data?.length > 6 && (
        <div className="flex justify-end">
          <Button
            variant="link"
            className="text-rose-500 hover:text-rose-600 cursor-pointer"
            onClick={handleSeeMoreClick} // Navigate to the categories page
          >
            See More
          </Button>
        </div>
      )}
    </section>
  );
}
