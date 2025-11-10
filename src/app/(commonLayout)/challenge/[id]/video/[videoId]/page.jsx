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

const VideoPlayerPage = ({ params }) => {
  const { id: challengeId, videoId } = React.use(params);
  const router = useRouter();
  const { data, isLoading, refetch } = useSingleChallengeVideoQuery(
    { id: challengeId },
    { skip: !challengeId }
  );

  const [markWatchChallengeVideo, { isLoading: isMarkingComplete }] = useMarkWatchChallengeVideoMutation();

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
      if (current && !current.isEnabled && !hasCheckedAccessRef.current && !isNavigating) {
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
    if (completionProcessedRef.current.has(videoId) || isProcessingCompletionRef.current) {
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
        const countdownInfo = calculateCountdown(response.data.nextVideoInfo.nextUnlockTime);
        
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
            await new Promise(resolve => setTimeout(resolve, 500));
            
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
  const canGoToNext = nextVideo && (nextVideo.isEnabled || isCurrentVideoCompleted);

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

        <div className="text-sm text-gray-600">
          Video {currentIndex + 1} of {videos.length}
        </div>
      </div>

      {/* Video Player Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
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
        <h1 className="md:text-xl lg:text-2xl font-bold mb-2">
          {currentVideo.title}
        </h1>
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

        {/* Manual Complete Button - Only show if not completed */}
        {!isCurrentVideoCompleted && (
          <div className="mt-4">
            <button
              onClick={handleManualComplete}
              disabled={isMarkingComplete || isProcessingCompletionRef.current || isNavigating}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMarkingComplete || isProcessingCompletionRef.current || isNavigating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isNavigating ? "Loading next video..." : "Marking Complete..."}
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mark as Complete
                </>
              )}
            </button>
          </div>
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

      {/* Navigation Controls */}
      {/* <div className="flex justify-between items-center mt-6">
        {prevVideo ? (
          <button
            onClick={() =>
              router.push(`/challenge/${challengeId}/video/${prevVideo._id}`)
            }
            disabled={isNavigating}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <svg
              className="h-4 w-4 mr-2"
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
            Previous Video
          </button>
        ) : (
          <div></div>
        )}

        {nextVideo ? (
          canGoToNext ? (
            <button
              onClick={() =>
                router.push(`/challenge/${challengeId}/video/${nextVideo._id}`)
              }
              disabled={isNavigating}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Next Video
              <svg
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Next Video (Locked)
              <svg
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </button>
          )
        ) : (
          <div></div>
        )}
      </div> */}
    </div>
  );
};

export default VideoPlayerPage;