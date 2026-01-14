"use client";
import { useComingSoonLatestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";
import { Lock } from "lucide-react";
import { getVideoAndThumbnail } from "@/components/share/imageUrl";

export const ComingSoon = () => {
  const { data, isLoading, isError } = useComingSoonLatestVideoQuery();
  console.log("ComingSoon data:", data);

  const videoData = data?.data;
  console.log(videoData);
  
  // Fallback image - jodi kono data na thake ba thumbnailUrl na thake
 if (isLoading || isError || !data?.data) return null;

  const image = videoData?.thumbnailUrl
    ? getVideoAndThumbnail(videoData.thumbnailUrl)
    : null; // no default image
  console.log(image);

  // Handle redirect for "itsHere" status - navigate based on type
  const handleItsHereRedirect = () => {
    if (videoData?.type === "challenge" && videoData?.challengeId) {
      // Navigate to challenge details page
      window.location.href = `/challenge/${videoData.challengeId}`;
    } else if (videoData?.type === "video") {
      // Navigate to coming-soon page for videos
      window.location.href = "/comingSoon";
    }
  };

  // Handle redirect for "checkThisOut" status - external link
  const handleCheckThisOutRedirect = () => {
    if (videoData?.redirectUrl) {
      // Add protocol if not present and redirect to external URL
      const url = videoData.redirectUrl.startsWith("http")
        ? videoData.redirectUrl
        : `https://${videoData.redirectUrl}`;
      window.open(url, "_blank");
    }
  };

  // Determine content based on isReady status
  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="mb-4 px-4 md:px-8 lg:px-12">
          <h2 className="hidden lg:block text-xl lg:text-2xl font-bold mb-2 animate-pulse">
            Coming Soon
          </h2>
          <div className="animate-pulse bg-gray-200 rounded-lg h-[25vh] md:h-[50vh] lg:h-[70vh]"></div>
        </div>
      );
    }

    // Error state or no data - fallback image dekhabe
    if (isError || !videoData) {
      return (
        <div className="mb-4 px-4 md:px-8 lg:px-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">Coming Soon</h2>
          <VideoCard
            title="Coming Soon"
            imageUrl={fallbackImage}
            overlayText=""
            route={null}
            onClick={null}
          />
        </div>
      );
    }

    if (videoData.isReady === "comingSoon") {
      return (
        <div className="mb-4 px-4 md:px-8 lg:px-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">Coming Soon</h2>
          <div className="relative">
            <VideoCard
              title={videoData.title || "Coming Soon"}
              imageUrl={image}
              overlayText=""
              route={null}
              onClick={null}
            />

            {/* Lock overlay with animation - not clickable */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none">
              <div className="text-center text-white bg-black bg-opacity-60 p-4 rounded-lg">
                <Lock
                  size={48}
                  className="mx-auto mb-2 animate-pulse text-primary"
                />
                <p className="text-lg font-semibold animate-bounce">
                  Coming Soon
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (videoData.isReady === "itsHere") {
      // Determine the route based on type
      const route =
        videoData.type === "challenge" && videoData.challengeId
          ? `/challenge/${videoData.challengeId}`
          : videoData.type === "video"
          ? "/comingSoon"
          : null;

      return (
        <div className="mb-4 px-4 md:px-8 lg:px-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">It's Here!</h2>
          <div className="relative">
            <VideoCard
              title={videoData.title || "New Content"}
              imageUrl={image}
              overlayText=""
              route={route}
              onClick={handleItsHereRedirect}
            />
          </div>
        </div>
      );
    }

    if (videoData.isReady === "checkThisOut") {
      return (
        <div className="mb-4 px-4 md:px-8 lg:px-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">Check This Out</h2>
          <div className="relative">
            <VideoCard
              title={videoData.title || "External Content"}
              imageUrl={image}
              overlayText=""
              route={null}
              onClick={handleCheckThisOutRedirect}
            />
          </div>
        </div>
      );
    }

    // Default fallback - jodi kono condition match na kore
    return (
      <div className="mb-4 px-4 md:px-8 lg:px-12">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">Coming Soon</h2>
        <VideoCard
          title="Coming Soon"
          imageUrl={fallbackImage}
          overlayText=""
          route={null}
          onClick={null}
        />
      </div>
    );
  };

  return renderContent();
};