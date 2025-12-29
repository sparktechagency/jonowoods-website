"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "./imageUrl";

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  containerClassName = "",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  quality = 85,
  fill = true,
  height,
  width,
  onLoadComplete,
  ...props
}) {
  const [imgLoading, setImgLoading] = useState(true);

  const imageUrl = getImageUrl(src);

  const handleLoadComplete = () => {
    setImgLoading(false);
    if (onLoadComplete) {
      onLoadComplete();
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${containerClassName}`}>
      {/* Image loading spinner */}
      {imgLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        </div>
      )}

      <Image
        src={imageUrl}
        alt={alt || ""}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        quality={quality}
        loading="lazy"
        onLoadingComplete={handleLoadComplete}
        className={`object-cover transition-opacity duration-300 ${
          imgLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        {...props}
      />
    </div>
  );
}

