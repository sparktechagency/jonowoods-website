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

  
  // Handle redirect for "it'sHere" status - go to details page
  const handleItsHereRedirect = () => {
    window.location.href = "/comingSoon";
  };

  // Handle redirect for "checkThisOut" status - external link
  const handleCheckThisOutRedirect = () => {
    if (videoData?.redirectUrl) {
      // Add protocol if not present and redirect to external URL
      const url = videoData.redirectUrl.startsWith('http') 
        ? videoData.redirectUrl 
        : `https://${videoData.redirectUrl}`;
      window.open(url, '_blank');
    }
  };

  // Determine content based on isReady status
  const renderContent = () => {
    if (!videoData) {
      return (
        <div className="mb-4 px-4 lg:px-0">

          {/* Animated title - only visible on large devices */}
          <h2 className="hidden lg:block text-xl font-bold mb-2 animate-pulse">

            Coming Soon
          </h2>
          <div className="animate-pulse bg-gray-200 rounded-lg h-40"></div>
        </div>
      );
    }

    if (videoData.isReady === "comingSoon") {
      return (
        <div className="mb-4 px-4 md:px-8 lg:px-12">
          {/* Animated title - only visible on large devices */}
          <h2 className="text-xl font-bold mb-2">
            Coming Soon
          </h2>
          <div className="relative">
            <VideoCard
              title="Coming Soon"
              imageUrl={image}
              overlayText=""
              route={null}
              onClick={null}
            />
            
            {/* Lock overlay with animation - not clickable */}
            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
              <div className="text-center text-white bg-black bg-opacity-60 p-4 rounded-lg">
                <Lock 
                  size={48} 
                  className="mx-auto mb-2 animate-pulse text-primary" 
                />
                {/* Animated Coming Soon text */}
                <p className="text-lg font-semibold animate-bounce">
                  Coming Soon
                </p>
                {/* <p className="text-sm opacity-80 mt-1">
                  Content is locked
                </p> */}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (videoData.isReady === "itsHere") {
      return (
        <div className="mb-4 px-4 lg:px-0">
          <h2 className="text-xl font-bold mb-2">🎉 It's Here!</h2>
          <div className="relative">
            <VideoCard
              title={videoData.title || "New Video"}
              imageUrl={image}
              overlayText=""
              route="/comingSoon"
              onClick={handleItsHereRedirect}
            />
            
            {/* It's Here overlay */}
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              ✨ IT'S HERE!
            </div>
            
          
          </div>
        </div>
      );
    }

    if (videoData.isReady === "checkThisOut") {
      return (
        <div className="mb-4 px-4 lg:px-0">
          <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
          <div className="relative">
            <VideoCard
              title={videoData.title || "External Content"}
              imageUrl={image}
              overlayText=""
              route={null}
              onClick={handleCheckThisOutRedirect}
            />
            
            {/* Check This Out overlay */}
            {/* <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              🔗 EXTERNAL
            </div> */}
            
            {/* External link message */}
            {/* <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={handleCheckThisOutRedirect}>
              <div className="flex items-center justify-center">
                <ExternalLink size={16} className="mr-2" />
                <p className="text-sm font-medium">
                  Click to visit external site directly!
                </p>
              </div>
            </div> */}
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="mb-4 px-4 lg:px-0">
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