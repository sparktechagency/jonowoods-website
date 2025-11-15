"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useMarkWatchChallengeVideoMutation,
  useSingleChallengeVideoQuery,
} from "@/redux/featured/CommingSoon/commingSoonApi";
import Image from "next/image";
import { getImageUrl } from "@/components/share/imageUrl";
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

  // Handle video completion
  const handleVideoComplete = async (videoId, shouldNavigate = false) => {
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

      // Update local state immediately
      setCompletedVideos((prev) => {
        if (prev.includes(videoId)) return prev;
        return [...prev, videoId];
      });

      // Handle time-locked next video
      if (response?.data?.nextVideoInfo?.nextUnlockTime) {
        setNextVideoUnlockTime(response.data.nextVideoInfo.nextUnlockTime);
        const countdownInfo = calculateCountdown(
          response.data.nextVideoInfo.nextUnlockTime
        );

        toast.success("Video completed!", {
          description: `Next video will unlock in ${countdownInfo.formatted}`,
          duration: 5000,
        });

        isProcessingCompletionRef.current = false;
        return; // Don't navigate if next video is time-locked
      }

      // If we should navigate to next video
      if (shouldNavigate) {
        const currentIndex = videos.findIndex((v) => v._id === videoId);

        if (currentIndex < videos.length - 1) {
          const nextVideo = videos[currentIndex + 1];

          if (nextVideo) {
            setIsNavigating(true);

            toast.success("Video completed!", {
              description: `Loading next video: ${nextVideo.title}`,
              duration: 2000,
            });

            // Refetch to get latest state
            const refetchedData = await refetch();

            // Small delay to ensure state updates
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Navigate to next video
            console.log("Navigating to next video:", nextVideo._id);
            router.push(`/challenge/${challengeId}/video/${nextVideo._id}`);
          }
        } else {
          toast.success("Congratulations!", {
            description: "You have completed all challenge videos!",
            duration: 5000,
          });
          isProcessingCompletionRef.current = false;
        }
      } else {
        // Manual complete without auto-navigation
        const currentIndex = videos.findIndex((v) => v._id === videoId);

        if (currentIndex < videos.length - 1) {
          const nextVideo = videos[currentIndex + 1];

          toast.success("Video marked as complete!", {
            description: nextVideo ? "You can now watch the next video." : "",
            duration: 3000,
          });
        } else {
          toast.success("Congratulations!", {
            description: "You have completed all challenge videos!",
            duration: 5000,
          });
        }

        // Refetch to update UI
        await refetch();
        isProcessingCompletionRef.current = false;
      }
    } catch (error) {
      console.error("Error marking video as completed:", error);
      toast.error("Failed to mark video as completed", {
        description: error?.data?.message || "Please try again later.",
      });
      // Remove from processed set if failed
      completionProcessedRef.current.delete(videoId);
      isProcessingCompletionRef.current = false;
    }
  };

  // Manual complete button handler
  const handleManualComplete = async () => {
    if (isCurrentVideoCompleted) {
      toast.info("Video already completed");
      return;
    }

    if (isMarkingComplete || isProcessingCompletionRef.current) {
      return;
    }

    // Manual complete with auto-navigation
    await handleVideoComplete(currentVideo._id, true);
  };

  // Video ended handler - AUTO NAVIGATION
  const handleVideoEnded = async () => {
    console.log("Video ended, marking as complete and navigating to next");
    if (!isCurrentVideoCompleted && !isProcessingCompletionRef.current) {
      await handleVideoComplete(currentVideo._id, true); // Auto-navigate on video end
    }
  };

  // Reset navigation state when component unmounts or video changes
  useEffect(() => {
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
            <p className="mt-4 text-gray-600">Loading next video...</p>
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
            {!showVideo ? (
              // Thumbnail block
              <div
                className="relative cursor-pointer group"
                onClick={() => setShowVideo(true)}
              >
                <Image
                  // src={getImageUrl(currentVideo.thumbnailUrl)}
                  src={
                    currentVideo?.thumbnailUrl?.startsWith("http")
                      ? currentVideo.thumbnailUrl
                      : `https://${currentVideo.thumbnailUrl}`
                  }
                  alt="Video thumbnail"
                  width={1280}
                  height={720}
                  className="rounded-2xl w-full h-[25vh] lg:h-[70vh] object-cover"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-500 rounded-full p-2  transition">
                    <svg className="w-8 h-8 text-red" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              // Video player section
              <UniversalVideoPlayer
                video={currentVideo}
                autoplay={true}
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
                onPlay={() => console.log("Playing")}
                onEnded={handleVideoEnded}
              />
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
                    ? "Loading next video..."
                    : "Marking Complete..."}
                </>
              ) : (
                <>Next Video</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;
