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
  const [showAll, setShowAll] = useState(false);

  if (isLoading) return <Spinner />;

  const classesToShow = showAll ? data?.data : data?.data?.slice(0, 6);

  const handleSeeMoreClick = () => {
    router.push("/challenge");
  };

  return (
    <section className="my-10 px-4 md:px-8 lg:px-12">
      <div className="flex mb-4">
        <h2 className="text-xl font-semibold">Join a Challenge</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-5">
        {classesToShow?.map((yogaClass) => (
          <div key={yogaClass._id} className="cursor-pointer group">
            <Link href={`challenge/${yogaClass._id}`}>
              <div className="relative h-52 lg:h-80 rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(yogaClass.image)}
                  alt={yogaClass.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="lg:object-cover object-fill"
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
                <div className="hidden lg:flex absolute inset-0 items-center justify-center text-center px-4">
                  <h3
                    className="text-white text-2xl font-bold 
                                 bg-[#A92C2C]/80 px-3 py-1 rounded
                                 opacity-0 translate-y-20 group-hover:opacity-100 group-hover:translate-y-0 
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
      {data?.data?.length > 6 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSeeMoreClick}
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