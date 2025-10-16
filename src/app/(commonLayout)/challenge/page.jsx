"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageUrl } from "../../../components/share/imageUrl";
import { useChallengeVideoQuery } from "../../../redux/featured/CommingSoon/commingSoonApi";
import Spinner from "../Spinner";

export default function ChallengePage() {
  const router = useRouter();
  const { data, isLoading, isError } = useChallengeVideoQuery();

  if (isLoading) {
    return (
      <section className="container mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Join a Challenge</h2>
        <p className="text-center text-gray-500">Loading challenges...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="container mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Join a Challenge</h2>
        <p className="text-center text-red-500">
          Failed to load challenges. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto mt-10 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Join a Challenge</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-2">
        {data?.data?.map((yogaClass) => (
          <div key={yogaClass._id} className="cursor-pointer group">
            <Link href={`challenge/${yogaClass._id}`}>
              <div className="relative h-28 lg:h-80 rounded-lg overflow-hidden">
                {/* Image */}
                <Image
                  src={getImageUrl(yogaClass?.image)}
                  alt={yogaClass.name}
                  layout="fill"
                  className="absolute object-cover inset-0 w-full h-full"
                />
                {/* Gradient Overlay for Desktop */}
                <div
                  // className="hidden lg:block absolute inset-0 bg-gradient-to-t"
                  // style={{
                  //   backgroundImage:
                  //     "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  // }}
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
            <h3 className="block text-[14px] lg:hidden text-black font-semibold mt-2">
              {yogaClass.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}