"use client";
import { getImageUrl } from "@/components/share/imageUrl";
import { useGetCategoryQuery } from "@/redux/featured/homeApi.jsx/homeApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCategoryQuery();

  if (isLoading) {
    return (
      <section className="container mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>
        <p className="text-center text-gray-500">Loading categories...</p>
      </section>
    );
  }

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
          <div key={category._id} className="cursor-pointer group">
            <Link href={`/categories/${category._id}`}>
              <div className="relative h-28 lg:h-80 rounded-lg overflow-hidden">
                {/* Image */}
                <Image
                  src={getImageUrl(category.thumbnail)}
                  alt={category.name}
                  layout="fill"
                  className="absolute object-cover  inset-0 w-full h-full"
                />
                {/* Gradient Overlay for Desktop */}
                <div
               
                />
                {/* Title inside image for Desktop (hover effect) */}
                {/* <div className="hidden lg:flex absolute inset-0 flex-col justify-center items-center text-center px-4">
                  <h3
                    className="text-white text-2xl font-bold tracking-wide drop-shadow-lg 
                       bg-[#A92C2C]/80 px-3 py-1 rounded
                       opacity-0 translate-y-60 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-500 ease-out"
                  >
                    {category.name}
                  </h3>
                </div> */}
              </div>
            </Link>
            {/* Title shown below image for mobile & tablet */}
            <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}