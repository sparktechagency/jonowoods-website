"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const VideoCard = ({
  title = "Cooling Yoga Flow",
  imageUrl,
  route,
  onClick,
}) => {
  const router = useRouter();
  const [imgLoading, setImgLoading] = useState(true);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      router.push(route);
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-lg mb-8">
      <div
        onClick={handleClick}
        className="relative h-[25vh] md:h-[30vh] lg:h-[70vh] w-full bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
      >
        {/* Image loading overlay */}
        {imgLoading && imageUrl && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {/* Background Image */}
        <div className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || "Thumbnail"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              loading="lazy"
              onLoadingComplete={() => setImgLoading(false)}
              className={`object-cover transition-opacity duration-500 ${
                imgLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="block text-[14px] lg:text-xl text-black font-semibold mt-2">
        {title}
      </h3>
    </section>
  );
};
