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
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  const categoriesToShow = showAll ? data?.data : data?.data?.slice(0, 6);

  const handleSeeMoreClick = () => {
    router.push("/categories");
  };

  return (
    <section className="mb-10 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Browse By Categories</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-5">
        {categoriesToShow?.map((yogaClass) => (
          <div key={yogaClass._id} className="cursor-pointer group">
            <Link href={`/categories/${yogaClass._id}`}>
              <div className="relative h-66 lg:h-80 rounded-lg overflow-hidden">
                {/* Image */}
                <Image
                  src={getImageUrl(yogaClass?.thumbnail)}
                  alt={yogaClass.name}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Gradient Overlay for Desktop */}
                <div
                  className="hidden lg:block absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  }}
                />
                {/* Title inside image for Desktop (hover effect) */}
                <div className="hidden lg:flex absolute inset-0 flex-col justify-center items-center text-center px-4">
                  <h3
                    className="text-white text-2xl font-bold tracking-wide drop-shadow-lg 
                       bg-[#A92C2C]/80 px-3 py-1 rounded
                       opacity-0 translate-y-60 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-500 ease-out"
                  >
                    {yogaClass.name}
                  </h3>
                </div>
              </div>
            </Link>
            {/* Title shown below image for mobile & tablet */}
            <h3 className="block lg:hidden text-black font-semibold mt-2">
              {yogaClass.name}
            </h3>
          </div>
        ))}
      </div>
      {/* Show the "See More" button if the number of categories exceeds 6 */}
      {data?.data?.length > 6 && (
        <div className="flex justify-end">
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