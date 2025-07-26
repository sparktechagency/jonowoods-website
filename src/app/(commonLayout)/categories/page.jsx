"use client";
import { baseUrlApi } from "@/redux/baseUrl/baseUrlApi";
import { useGetCategoryQuery } from "@/redux/featured/homeApi.jsx/homeApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCategoryQuery();
  console.log(data?.data);

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
    <section className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Categories</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
        {data?.data.map((category) => (
          <div
            key={category._id}
            className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => router.push(`/categories/${category._id}`)}
          >
            <Link href={`/categories/${category._id}`}>
              <div className="relative w-full h-full">
                {/* Category Image */}
                <Image
                  src={`${baseUrlApi}${category.thumbnail}`}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  }}
                />
                {/* Category Name */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white lg:text-3xl text-xl font-bold 
                                 md:opacity-100 md:translate-y-0
                                 lg:opacity-0 lg:translate-y-20 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 
                                 lg:transition-all lg:duration-500 lg:ease-out bg-[#A92C2C]/80
                                 px-2 py-1 rounded"
                    >
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}