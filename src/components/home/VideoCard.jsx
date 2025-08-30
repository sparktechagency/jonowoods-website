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
      <div onClick={handleClick} className="relative h-[25vh] lg:h-[55vh] w-full bg-gray-800 rounded-lg overflow-hidden cursor-pointer group">
        {/* Background Image using next/image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || "Thumbnail"}
              fill
              className="object-cover"
              unoptimized // use if CDN doesn't support resizing or optimization
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-800"></div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-800/70 via-red-900/40 to-transparent" />

        {/* Title - Static on mobile/tablet, animated on larger screens */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <h3 className="text-2xl lg:text-2xl font-bold tracking-wide drop-shadow-lg 
                         md:opacity-100 md:translate-y-0
                         lg:opacity-0 lg:translate-y-60 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 
                         lg:transition-all lg:duration-500 lg:ease-out bg-[#A92C2C]/80 px-2 py-1 rounded"
                        >
            {title}
          </h3>
        </div>
      </div>
    </section>
  );
};