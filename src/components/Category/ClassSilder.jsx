"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const ClassSlider = ({ data }) => {
  const router = useRouter();

  const handleVideoClick = (videoId) => {
    router.push(`/categories/class/${videoId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Classes</h2>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-2">
        {data.map((classItem, index) => (
          <div
            key={classItem._id || index}
            className="cursor-pointer group"
            onClick={() => handleVideoClick(classItem._id)}
          >
            <div className="relative h-28 lg:h-80 rounded-lg overflow-hidden">
              {/* Image */}
              <Image
                src={`https://${classItem.thumbnailUrl}`}
                alt={classItem.title}
                layout="fill"
                className="absolute object-cover inset-0 w-full h-full"
              />

              {/* Title inside image for Desktop (hover effect) */}
              <div className="hidden lg:flex absolute inset-0 flex-col justify-center items-center text-center px-4">
                <h3
                  className="text-white   tracking-wide drop-shadow-lg 
                     bg-[#A92C2C]/80 px-3 py-1 rounded
                     opacity-0 translate-y-60 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-500 ease-out"
                >
                  {classItem.title}
                </h3>
              </div>
            </div>

            {/* Title shown below image for mobile & tablet */}
            <h3 className="block text-[14px] lg:hidden text-black font-semibold mt-2">
              {classItem?.title?.length > 42
                ? classItem.title.slice(0, 42) + "..."
                : classItem?.title}
            </h3>
            <p className="text-[12px] text-gray-600 mt-1">
              Duration: { classItem?.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSlider;
