"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChallengeVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { getImageUrl, getVideoAndThumbnail } from "../share/imageUrl";
import Spinner from "../../app/(commonLayout)/Spinner";
import { useState } from "react";

export default function NewClasses() {
  const router = useRouter();
  const { data, isLoading } = useChallengeVideoQuery();
  const [showAll, setShowAll] = useState(false); // State to handle "See More"

  if (isLoading) return <Spinner />;

  // Show only the first 6 items if showAll is false, otherwise show all items
  const classesToShow = showAll ? data?.data : data?.data?.slice(0, 6);

  const handleSeeMoreClick = () => {
    // Navigate to the challenges page when "See More" is clicked
    router.push("/challenges");
  };

  return (
    <section className="my-10 mx-3">
      <div className="flex mb-4">
        <h2 className="text-xl font-semibold">Join a Challenge</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
        {classesToShow?.map((yogaClass) => (
          <div
            key={yogaClass._id}
            className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => router.push(`challenge/${yogaClass._id}`)}
          >
            <Link href={`challenge/${yogaClass._id}`}>
              <div className="relative w-full h-full">
                <Image
                  src={getImageUrl(yogaClass.image)}
                  alt={yogaClass.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  }}
                />
                {/* Hover effect for the title with animation */}
                <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                  <h3
                    className="text-white lg:text-2xl  font-bold 
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
      {data?.data?.length > 6 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSeeMoreClick} // Navigate to the challenges page on click
            variant="link"
            className="text-rose-500 cursor-pointer hover:text-rose-600"
          >
            See More
          </Button>
        </div>
      )}
    </section>
  );
}
