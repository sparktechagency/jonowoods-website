"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChallengeVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import ImageWithLoader from "../share/ImageWithLoader";

export default function NewClasses() {
  const router = useRouter();
  const { data, isLoading, isError } = useChallengeVideoQuery();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <section className="my-10 px-4 md:px-8 lg:px-12">
        <h2 className="text-xl font-semibold mb-4">Join a Challenge</h2>
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

  if (isError) {
    return (
      <section className="my-10 px-4 md:px-8 lg:px-12">
        <h2 className="text-xl font-semibold mb-4">Join a Challenge</h2>
        <p className="text-center text-red-500">
          Failed to load challenges. Please try again later.
        </p>
      </section>
    );
  }

  const classesToShow = showAll ? data?.data : data?.data?.slice(0, 6);

  const handleSeeMoreClick = () => {
    router.push("/challenge");
  };

  return (
    <section className="my-10 px-4 md:px-8 lg:px-12">
      <div className="flex mb-4">
        <h2 className="text-xl font-semibold">Join a Challenge</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-2">
        {classesToShow?.map((yogaClass) => (
          <ClassCard key={yogaClass._id} yogaClass={yogaClass} />
        ))}
      </div>

      {data?.data?.length > 6 && (
        <div className="flex justify-end mt-4">
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

function ClassCard({ yogaClass }) {
  return (
    <div className="cursor-pointer group">
      <Link href={`/challenge/${yogaClass._id}`}>
        <ImageWithLoader
          src={yogaClass.image}
          alt={yogaClass.title || yogaClass.name}
          containerClassName="h-28 lg:h-80 rounded-lg"
        />
      </Link>

      <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
        {yogaClass.name}
      </h3>
    </div>
  );
}
