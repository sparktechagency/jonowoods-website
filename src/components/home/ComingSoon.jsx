"use client";
import { useComingSoonLatestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";
import { Lock, ExternalLink } from "lucide-react";

export const ComingSoon = () => {
  const { data } = useComingSoonLatestVideoQuery();
  console.log(data);
  
  const videoData = data?.data;
  console.log(videoData);
  const image = `https://${data?.data?.thumbnailUrl}`;
  console.log(image);

  
  // Handle redirect functionality for "arrived" status
  const handleArrivedRedirect = () => {
    if (videoData?.redirectUrl) {
      // Add protocol if not present and redirect to external URL
      const url = videoData.redirectUrl.startsWith('http') 
        ? videoData.redirectUrl 
        : `https://${videoData.redirectUrl}`;
      window.open(url, '_blank');
    } else {
      // If no redirectUrl, go to /comingSoon page
      window.location.href = "/comingSoon";
    }
  };

  // Handle redirect for "ready" status - always go to /comingSoon
  const handleReadyRedirect = () => {
    window.location.href = "/comingSoon";
  };

  // Determine content based on isReady status
  const renderContent = () => {
    if (!videoData) {
      return (
        <div className="mb-4">
          {/* Animated title - only visible on large devices */}
          <h2 className="hidden lg:block text-xl font-bold mb-2 animate-pulse">
            Coming Soon
          </h2>
          <div className="animate-pulse bg-gray-200 rounded-lg h-40"></div>
        </div>
      );
    }

    if (videoData.isReady === "arrived") {
      return (
        <div className="mb-4">
          {/* Animated title - only visible on large devices */}
          <h2 className="hidden lg:block text-xl font-bold mb-2 animate-pulse">
            Coming Soon
          </h2>
          <div className="relative">
            <VideoCard
              title="Coming Soon"
              imageUrl={image}
              overlayText=""
              route={null}
              onClick={handleArrivedRedirect}
            />
            
            {/* Lock overlay with animation */}
            <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <Lock 
                  size={48} 
                  className="hidden lg:block mx-auto mb-2 animate-pulse text-yellow-400" 

                />
                {/* Animated Coming Soon text - only visible on large devices */}
                <p className="hidden lg:block text-lg font-semibold animate-bounce">
                  Coming Soon
                </p>
                <p className="hidden lg:block text-sm opacity-80 mt-1">
                  Video is arriving...
                </p>
                {videoData.redirectUrl && (
                  <button
                    onClick={handleArrivedRedirect}
                    className="mt-3 flex items-center justify-center mx-auto px-4 py-2 bg-primary cursor-pointer hover:bg-red-600 rounded-lg text-sm font-medium transition-colors"

                  >
                    <ExternalLink size={16} className="mr-1" />
                    Visit external Site
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (videoData.isReady === "ready") {
      return (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">🎉 Ready to Watch!</h2>
          <div className="relative">
            <VideoCard
              title={videoData.title || "New Video"}
              imageUrl={image}
              overlayText=""
              route="/comingSoon"
              onClick={handleReadyRedirect}
            />
            
            {/* Ready overlay - no external redirect button */}
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              ✨ READY NOW!
            </div>
            
            {/* Quick access message - no external redirect */}
            <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-lg">
              <p className="text-sm font-medium">
                🚀 Right now it is publishable! Click to watch this amazing content!
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="mb-4">
        {/* Title with animation - only visible on large devices */}
        <h2 className="hidden lg:block text-xl font-bold mb-2 animate-pulse">
          Coming Soon
        </h2>
        <VideoCard
          title="Coming Soon"
          imageUrl={image}
          overlayText="Coming Soon"
          route="/comingSoon"
        />
      </div>
    );
  };

  return renderContent();
};