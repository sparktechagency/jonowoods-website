"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChallengeVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { getVideoAndThumbnail } from "../share/imageUrl";
import Spinner from "../../app/(commonLayout)/Spinner";


export default function NewClasses() {
  const router = useRouter();
  const { data, isLoading } = useChallengeVideoQuery();

  if (isLoading) return <Spinner />;

  return (
    <section className="my-10 mx-3">
      <div className="flex mb-4">
        <h2 className="text-xl font-semibold">Join a Challenge</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-10">
        {data?.data?.map((yogaClass) => (
          <div
            key={yogaClass._id} // Changed from id to _id
            className="relative h-80 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => router.push(`/challenge/${yogaClass._id}`)}
          >
            <Link href={`/challenge/${yogaClass._id}`}>
              <div className="relative w-full h-full">
                <Image
                  src={getVideoAndThumbnail(yogaClass.thumbnailUrl)}
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
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">
                    {yogaClass.title}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={() => router.push("/challenge")} variant="link" className="text-rose-500 cursor-pointer hover:text-rose-600">
          See More
        </Button>
      </div>
    </section>
  );
}