"use client";

import { useRouter } from "next/navigation";
import ImageWithLoader from "../share/ImageWithLoader";
import { getVideoAndThumbnail } from "../share/imageUrl";

const ClassSlider = ({ data }) => {
  const router = useRouter();
  // console.log( "ClassSlider data",data);

  const handleVideoClick = (videoId) => {
    router.push(`/categories/class/${videoId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">All Videos</h2>
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
              {/* Image with Loader */}
              <ImageWithLoader
                src={getVideoAndThumbnail(classItem.thumbnailUrl)}
                alt={classItem.title}
                containerClassName="h-28 lg:h-80 rounded-lg"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={85}
              />

          
            </div>

            {/* Title shown below image for mobile & tablet */}
            <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
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
