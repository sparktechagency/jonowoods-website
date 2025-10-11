"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const VideoCard = ({
  title = "Cooling Yoga Flow",
  imageUrl,
  route,
  onClick,
}) => {
  const router = useRouter();

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
        className="relative h-[25vh] lg:h-[70vh] w-full bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || "Thumbnail"}
              fill
              className="lg:object-cover object-fill"
              unoptimized
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-800"></div>
          )}
        </div>

        {/* Gradient Overlay (only for large screens) */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-red-800/70 via-red-900/40 to-transparent" />

        {/* Title - shown inside image on large screens */}
        <div className="hidden lg:flex absolute inset-0 flex-col justify-end lg:justify-center items-center text-center px-4">
          <h3
            className="text-white text-2xl font-bold tracking-wide drop-shadow-lg 
                       bg-[#A92C2C]/80 px-3 py-1 rounded
                       opacity-0 translate-y-60 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-500 ease-out"
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Title - shown below image on mobile & tablet */}
      <h3 className="block lg:hidden  text-black  font-semibold mt-2">
        {title}
      </h3>
    </section>
  );
};
