"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baseUrlApi } from "../../redux/baseUrl/baseUrlApi";
import { useGetCategoryQuery } from "../../redux/featured/homeApi.jsx/homeApi";
import { getImageUrl } from "../share/imageUrl";

export default function BrowseByCategory({ onSeeMore, onClassClick }) {
  const router = useRouter();
  const { data, isLoading } = useGetCategoryQuery();
  console.log(data);


  return (
    <section className="mb-10 mx-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Browse By Categories</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
        {data?.data.map((yogaClass) => (
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
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">
                    {yogaClass.name}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          variant="link"
          className="text-rose-500 hover:text-rose-600 cursor-pointer"
          onClick={() => router.push("/categories")}
        >
          See More
        </Button>
      </div>
    </section>
  );
}
