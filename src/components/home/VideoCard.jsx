import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export const VideoCard = ({ title, imageUrl, overlayText }) => {
  // Display the image inside the video card
  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-md mb-8">
      <CardContent className="p-0 relative">
        <div className=" w-full h-48 md:h-64 lg:h-[570px]">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-500/70 to-blue-500/30 mix-blend-overlay" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-xl font-medium">{overlayText}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
