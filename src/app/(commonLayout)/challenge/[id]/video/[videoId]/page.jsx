"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useMarkWatchChallengeVideoMutation,
  useSingleChallengeVideoQuery,
} from "@/redux/featured/CommingSoon/commingSoonApi";
import ImageWithLoader from "@/components/share/ImageWithLoader";
import { getImageUrl, getVideoAndThumbnail } from "@/components/share/imageUrl";
import Spinner from "@/app/(commonLayout)/Spinner";
import UniversalVideoPlayer from "@/components/UniversalVideoPlayer";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoPlayerPage = ({ params }) => {
  const { id: challengeId, videoId } = React.use(params);
  const router = useRouter();
  const { data, isLoading, refetch } = useSingleChallengeVideoQuery(
    { id: challengeId },
    { skip: !challengeId }
  );

  const [markWatchChallengeVideo, { isLoading: isMarkingComplete }] =
    useMarkWatchChallengeVideoMutation();

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [nextVideoUnlockTime, setNextVideoUnlockTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const completionProcessedRef = useRef(new Set());
  const countdownIntervalRef = useRef(null);
  const isProcessingCompletionRef = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const hasCheckedAccessRef = useRef(false);
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  // Function to calculate countdown
  const calculateCountdown = (unlockTime) => {
    const now = new Date().getTime();
    const unlockTimestamp = new Date(unlockTime).getTime();
    const difference = unlockTimestamp - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        formatted: `${hours}h ${minutes}m ${seconds}s`,
        isExpired: false,
      };
    } else {
      return {
        formatted: "Unlocked",
        isExpired: true,
      };
    }
  };

  // Initialize videos and find current video
  useEffect(() => {
    if (data?.data?.result && videoId) {
      const sortedVideos = [...data.data.result];
      setVideos(sortedVideos);

      const current = sortedVideos.find((video) => video._id === videoId);
      setCurrentVideo(current);

      // Reset thumbnail loading when video changes
      if (current?.thumbnailUrl) {
        setThumbnailLoading(true);
      }

      const completed = sortedVideos
        .filter((video) => video.isVideoCompleted)
        .map((video) => video._id);
      setCompletedVideos(completed);

      // Only check accessibility once on initial load
      if (
        current &&
        !current.isEnabled &&
        !hasCheckedAccessRef.current &&
        !isNavigating
      ) {
        hasCheckedAccessRef.current = true;
        toast.error("This video is locked", {
          description: "Please complete previous videos first.",
        });
        router.push(`/challenge/${challengeId}`);
      }
    }
  }, [data, videoId, challengeId, router, isNavigating]);

  // Countdown timer effect
  useEffect(() => {
    if (nextVideoUnlockTime) {
      const updateCountdown = () => {
        const countdownInfo = calculateCountdown(nextVideoUnlockTime);
        setCountdown(countdownInfo.formatted);

        if (countdownInfo.isExpired) {
          setNextVideoUnlockTime(null);
          refetch();
          toast.success("New video unlocked!", {
            description: "You can now watch the next video.",
            duration: 5000,
          });
        }
      };

      updateCountdown();
      countdownIntervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
  }, [nextVideoUnlockTime, refetch]);

  // Handle video completion - Navigate back to challenge list page
  const handleVideoComplete = useCallback(async (videoId) => {
    // Prevent duplicate processing
    if (
      completionProcessedRef.current.has(videoId) ||
      isProcessingCompletionRef.current
    ) {
      console.log("Already processing or completed:", videoId);
      return;
    }

    isProcessingCompletionRef.current = true;
    completionProcessedRef.current.add(videoId);

    try {
      console.log("Marking video as complete:", videoId);
      const response = await markWatchChallengeVideo(videoId).unwrap();

      // Check if there are more videos
      const currentIndex = videos.findIndex((v) => v._id === videoId);
      const hasMoreVideos = currentIndex < videos.length - 1;

      // Handle time-locked next video - Still navigate back but show message
      if (response?.data?.nextVideoInfo?.nextUnlockTime) {
        const countdownInfo = calculateCountdown(
          response.data.nextVideoInfo.nextUnlockTime
        );

        toast.success("Video completed!", {
          description: `Next video will unlock in ${countdownInfo.formatted}`,
          duration: 3000,
        });

        // Small delay for toast to show
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Navigate back to challenge list page
        setIsNavigating(true);
        router.push(`/challenge/${challengeId}`);
        return;
      }

      // Show success message based on whether there are more videos
      if (hasMoreVideos) {
        toast.success("Video completed!", {
          description: "Next video is now unlocked. You can watch it from the challenge list.",
          duration: 3000,
        });
      } else {
        toast.success("Congratulations!", {
          description: "You have completed all challenge videos!",
          duration: 3000,
        });
      }

      // Important: Wait for mutation to fully settle before navigation
      // This ensures RTK Query mutation completes and doesn't get cancelled
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate back to challenge list page
      setIsNavigating(true);
      router.push(`/challenge/${challengeId}`);
    } catch (error) {
      console.error("Error marking video as completed:", error);
      toast.error("Failed to mark video as completed", {
        description: error?.data?.message || "Please try again later.",
      });
      // Remove from processed set if failed
      completionProcessedRef.current.delete(videoId);
      isProcessingCompletionRef.current = false;
    }
  }, [videos, markWatchChallengeVideo, challengeId, router]);

  // Manual complete button handler
  const handleManualComplete = async () => {
    if (isCurrentVideoCompleted) {
      toast.info("Video already completed");
      return;
    }

    if (isMarkingComplete || isProcessingCompletionRef.current) {
      return;
    }

    // Manual complete - will navigate back to challenge list
    await handleVideoComplete(currentVideo._id);
  };

  // Video ended handler - Automatically trigger the "Mark Complete & Go Back" button action
  // IMPORTANT: Don't await here - fire and forget to prevent component unmount issues
  const handleVideoEnded = useCallback(() => {
    console.log("🎬 ===== VIDEO ENDED EVENT TRIGGERED =====");
    console.log("Video ended - Automatically triggering Mark Complete & Go Back button action");
    console.log("Current video:", currentVideo?._id);
    console.log("Completed videos:", completedVideos);
    console.log("Is marking complete:", isMarkingComplete);
    console.log("Is processing:", isProcessingCompletionRef.current);
    
    if (!currentVideo?._id) {
      console.log("❌ No current video ID, skipping");
      return;
    }

    // Check if already completed - same check as button uses (isCurrentVideoCompleted)
    if (completedVideos.includes(currentVideo._id)) {
      console.log("⚠️ Video already completed, skipping");
      return;
    }

    // Check if already processing - same check as button
    if (isMarkingComplete || isProcessingCompletionRef.current) {
      console.log("⚠️ Already processing completion, skipping");
      return;
    }

    // Fire and forget - don't await to prevent unmount issues
    // handleVideoComplete will handle the async operations
    console.log("✅ Auto-executing: Mark Complete & Go Back");
    console.log("Calling handleVideoComplete for video:", currentVideo._id);
    handleVideoComplete(currentVideo._id).catch((error) => {
      console.error("Error in handleVideoComplete:", error);
    });
  }, [currentVideo, completedVideos, isMarkingComplete, handleVideoComplete]);

  // Reset state when video changes
  useEffect(() => {
    // Reset processing state when video changes
    isProcessingCompletionRef.current = false;
    setIsNavigating(false);
    
    return () => {
      setIsNavigating(false);
      isProcessingCompletionRef.current = false;
    };
  }, [videoId]);

  // Get next and previous video
  const currentIndex = videos.findIndex((v) => v._id === videoId);
  const nextVideo =
    currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;

  if (isLoading || isNavigating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner />
          {isNavigating && (
            <p className="mt-4 text-gray-600">Completing video and redirecting...</p>
          )}
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <button
          onClick={() => router.push(`/challenge/${challengeId}`)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Challenge
        </button>
      </div>
    );
  }

  const isCurrentVideoCompleted = completedVideos.includes(currentVideo._id);
  const canGoToNext =
    nextVideo && (nextVideo.isEnabled || isCurrentVideoCompleted);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 lg:py-8">
      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.push(`/challenge/${challengeId}`)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Challenge
        </button>
      </div>

      {/* Video Player Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          {/* <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <UniversalVideoPlayer
              video={currentVideo}
              autoplay={false}
              aspectRatio="16:9"
              watermark={{
                text: ` Yoga With Jen`,
                position: "top-right",
              }}
              onSecurityViolation={(type) => {
                fetch("/api/security-log", {
                  method: "POST",
                  body: JSON.stringify({
                    videoId: currentVideo._id,
                    violationType: type,
                  }),
                });
              }}
              onPlay={() => console.log("Playing")}
              onEnded={handleVideoEnded}
            />
          </div> */}

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Player always mounted - never unmount */}
            <UniversalVideoPlayer
              video={currentVideo}
              autoplay={showVideo} // Control autoplay, not mounting
              aspectRatio="16:9"
              watermark={{
                text: `Yoga With Jen`,
                position: "top-right",
              }}
              onSecurityViolation={(type) => {
                fetch("/api/security-log", {
                  method: "POST",
                  body: JSON.stringify({
                    videoId: currentVideo._id,
                    violationType: type,
                  }),
                });
              }}
              onPlay={() => {
                console.log("Playing");
                setShowVideo(true); // Hide thumbnail when playing starts
              }}
              onEnded={handleVideoEnded}
            />

            {/* Thumbnail overlay - shown when video not started */}
            {!showVideo && (
              <div
                className="absolute inset-0 cursor-pointer group z-30"
                onClick={() => setShowVideo(true)}
              >
                <ImageWithLoader
                  src={getVideoAndThumbnail(currentVideo?.thumbnailUrl)}
                  alt="Video thumbnail"
                  containerClassName="rounded-2xl w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                  quality={85}
                  onLoadComplete={() => setThumbnailLoading(false)}
                />

                {/* Play Button Overlay - Only show when thumbnail is loaded */}
                {!thumbnailLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-red-500 rounded-full p-4 transition hover:scale-110">
                      <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" fill="white" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion status overlay */}
          {isCurrentVideoCompleted && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center z-10">
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6 rounded-lg mt-6 shadow-md">
        <div className="w-full flex justify-between">
          <h1 className="md:text-xl lg:text-2xl font-bold mb-2">
            {currentVideo.title}
          </h1>
          <div></div>
        </div>

        <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4 text-gray-600 mr-2" />
          {currentVideo.duration}
        </p>

        {/* Equipment */}
        {currentVideo.equipment && currentVideo.equipment.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mt-2">
              {currentVideo.equipment.map((item, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-4 py-2 rounded-xl"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {currentVideo.description && (
          <p className="text-gray-700 leading-relaxed mb-4">
            Description: {currentVideo.description}
          </p>
        )}

        {/* Completion status and next unlock info */}
        {isCurrentVideoCompleted && nextVideoUnlockTime && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
            <p className="text-sm text-yellow-800">
              🎉 Video completed! Next video unlocks in{" "}
              <strong>{countdown}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        {" "}
        {/* Manual Complete Button - Only show if not completed */}
        {!isCurrentVideoCompleted && (
          <div className="">
            <button
              onClick={handleManualComplete}
              disabled={
                isMarkingComplete ||
                isProcessingCompletionRef.current ||
                isNavigating
              }
              className="flex items-center px-2 py-1 lg:px-6 lg:py-3 bg-primary cursor-pointer text-white rounded-sm hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMarkingComplete ||
              isProcessingCompletionRef.current ||
              isNavigating ? (
                <>
                  {isNavigating
                    ? "Redirecting..."
                    : "Marking Complete..."}
                </>
              ) : (
                <>Mark Complete & Go Back</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;
