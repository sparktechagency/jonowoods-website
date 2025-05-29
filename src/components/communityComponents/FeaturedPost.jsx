import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { useGetFeaturedPostQuery } from "@/redux/featured/community/communityApi";
import { getVideoAndThumbnail } from "../share/imageUrl";
import Image from "next/image";

const VideoPostCard = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <Card className="w-full mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="">
          {/* Video Thumbnail Section */}
          <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-100">
            {/* Left: Video or Thumbnail */}
            <div className="relative w-full h-full">
              {!isPlaying ? (
                <>
                  <Image
                    src={getVideoAndThumbnail(post.thumbnailUrl)}
                    height={400}
                    width={600}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Button Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 cursor-pointer group"
                    onClick={handlePlayVideo}
                  >
                    <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all duration-300">
                      <Play className="w-6 h-6 text-gray-800 fill-current" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-black bg-opacity-70 text-white hover:bg-opacity-80"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(parseInt(post.duration))}
                    </Badge>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="default" className="capitalize">
                      {post.type}
                    </Badge>
                  </div>
                </>
              ) : (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsPlaying(false)}
                >
                  <source src={`https://${post.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Right: Text Content Section */}
            <div className="w-full p-6 flex flex-col justify-between bg-gray-50 lg:bg-white">
              <div className="space-y-4">
                {/* Title */}
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm lg:text-base line-clamp-4 leading-relaxed">
                  {post.description}
                </p>

                {/* Equipment Tags */}
                {post.equipment && post.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.equipment.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {post.equipment.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500"
                      >
                        +{post.equipment.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 gap-2">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <span>Created: {formatDate(post.createdAt)}</span>
                  {post.updatedAt !== post.createdAt && (
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                  )}
                </div>
                <Badge
                  variant={post.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {post.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Usage Example with RTK Query
const FeaturedPostSection = () => {
  const { data: postData, isLoading, error } = useGetFeaturedPostQuery();

  if (isLoading) {
    return (
      <div className="w-full mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="aspect-video bg-gray-300"></div>
              <div className="p-6 space-y-4 bg-gray-50">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mt-8"></div>
              </div>
                    </div>
                   
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-6 text-center">
        <p className="text-red-500">Failed to load featured post</p>
      </div>
    );
  }

  if (!postData?.success || !postData?.data) {
    return (
      <div className="w-full mx-auto p-6 text-center">
        <p className="text-gray-500">No featured post available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Featured Video
      </h2>
      <VideoPostCard post={postData.data} />
    </div>
  );
};

export default VideoPostCard;
export { FeaturedPostSection };