"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const VideoCard = ({
  title = "Cooling Yoga Flow",
  imageUrl,
  route,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <section className="w-full overflow-hidden rounded-lg mb-8">
      <div className="relative h-[70vh] w-full bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
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

        {/* Silhouette overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
          <div className="w-20 h-32 md:w-32 md:h-48 opacity-30">
            <div
              className="w-full h-full bg-black rounded-t-full"
              style={{
                clipPath:
                  "polygon(30% 0%, 70% 0%, 85% 40%, 90% 70%, 85% 100%, 15% 100%, 10% 70%, 15% 40%)",
              }}
            />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-800/70 via-red-900/40 to-transparent" />

        {/* Clickable Centered Text */}
        <div
          onClick={handleClick}
          className="absolute inset-0 flex items-center mt-72 justify-center text-center text-white px-4"
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide drop-shadow-lg hover:underline transition-all duration-200">
            {title}
          </h3>
        </div>
      </div>
    </section>
  );
};