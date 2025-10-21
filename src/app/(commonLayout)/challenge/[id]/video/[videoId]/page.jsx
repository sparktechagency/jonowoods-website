"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useMarkWatchChallengeVideoMutation,
  useSingleChallengeVideoQuery,
} from "@/redux/featured/CommingSoon/commingSoonApi";
// import Spinner from '../../../Spinner';
import Image from "next/image";
import { getImageUrl } from "@/components/share/imageUrl";
import Spinner from "@/app/(commonLayout)/Spinner";

const VideoPlayerPage = ({ params }) => {
  const { id: challengeId, videoId } = React.use(params);
  console.log(challengeId, videoId);
  const router = useRouter();
  const { data, isLoading, refetch } = useSingleChallengeVideoQuery(
    { id: challengeId },
    { skip: !challengeId }
  );

  const [markWatchChallengeVideo] = useMarkWatchChallengeVideoMutation();
  console.log(data);

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [nextVideoUnlockTime, setNextVideoUnlockTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const completionProcessedRef = useRef(new Set());
  const countdownIntervalRef = useRef(null);

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

      // Check if current video is accessible
      if (current && !current.isEnabled) {
        toast.error("Video not accessible", {
          description:
            "This video is locked. Please complete previous videos first.",
        });
        router.push(`/challenge/${challengeId}`);
      }

      completionProcessedRef.current.clear();
    }
  }, [data, videoId, challengeId, router]);

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
  const handleVideoComplete = async (videoId) => {
    if (completionProcessedRef.current.has(videoId)) {
      return;
    }

    completionProcessedRef.current.add(videoId);

    try {
      const response = await markWatchChallengeVideo(videoId).unwrap();

      setCompletedVideos((prev) => [...prev, videoId]);

      if (response?.data?.nextVideoInfo?.nextUnlockTime) {
        // Video completed but next video has timer
        setNextVideoUnlockTime(response.data.nextVideoInfo.nextUnlockTime);

        const countdownInfo = calculateCountdown(
          response.data.nextVideoInfo.nextUnlockTime
        );

        toast.success("Video completed!", {
          description: `Next video will unlock in ${countdownInfo.formatted}.`,
          duration: 5000,
        });
      } else {
        // Video completed and next video is immediately available
        const currentIndex = videos.findIndex((v) => v._id === videoId);

        if (currentIndex < videos.length - 1) {
          const nextVideo = videos[currentIndex + 1];

          if (nextVideo && nextVideo.isEnabled) {
            toast.success("Video completed!", {
              description: `You've unlocked "${nextVideo.title}"! Click to watch next video.`,
              duration: 5000,
              action: {
                label: "Watch Next",
                onClick: () =>
                  router.push(
                    `/challenge/${challengeId}/video/${nextVideo._id}`
                  ),
              },
            });
          } else {
            toast.success("Video completed!", {
              description: "Please wait for the next video to unlock.",
              duration: 5000,
            });
          }
        } else {
          toast.success("Congratulations!", {
            description: "You have completed all challenge videos!",
            duration: 5000,
          });
        }
      }

      refetch();
    } catch (error) {
      console.error("Error marking video as completed:", error);
      toast.error("Failed to mark video as completed", {
        description: "Please try again later.",
      });
    }
  };

  // Get next and previous video
  const currentIndex = videos.findIndex((v) => v._id === videoId);
  const nextVideo =
    currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;

  if (isLoading) return <Spinner />;

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

  return (
    <div className="container mx-auto px-4 py-6">
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="relative">
          <video
            key={currentVideo._id}
            controls
            controlsList="nodownload"
            src={`https://${currentVideo?.videoUrl}`}
            className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
            autoPlay
            onEnded={() => handleVideoComplete(currentVideo._id)}
          >
            Your browser does not support the video tag.
          </video>

          {/* Completion status overlay */}
          {isCurrentVideoCompleted && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center">
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

        {/* Video Info */}
        <div className="p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {currentVideo.title}
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Duration: {currentVideo.duration}
          </p>

          {currentVideo.description && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {currentVideo.description}
            </p>
          )}

          {/* Completion status and next unlock info */}
          {isCurrentVideoCompleted && nextVideoUnlockTime && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                🎉 Video completed! Next video unlocks in{" "}
                <strong>{countdown}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mb-6">
        {prevVideo ? (
          <button
            onClick={() =>
              router.push(`/challenge/${challengeId}/${prevVideo._id}`)
            }
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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

        {/* {nextVideo && nextVideo.isEnabled ? (
          <button
            onClick={() => router.push(`/challenge/${challengeId}/${nextVideo._id}`)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Next Video
            <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : nextVideo ? (
          <div className="text-sm text-gray-500 px-4 py-2">
            Next video locked
            {nextVideoUnlockTime && ` - unlocks in ${countdown}`}
          </div>
        ) : (
          <div className="text-sm text-gray-500 px-4 py-2">
            Last video in challenge
          </div>
        )} */}
      </div>

      {/* Related Videos */}
      {/* <div>
        <h2 className="text-lg font-semibold mb-4">Other Videos in This Challenge</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video, index) => {
            const isAccessible = video.isEnabled;
            const isCompleted = completedVideos.includes(video._id);
            const isCurrent = video._id === videoId;
            
            return (
              <div 
                key={video._id}
                onClick={() => {
                  if (isAccessible && !isCurrent) {
                    router.push(`/challenge/${challengeId}/${video._id}`);
                  } else if (!isAccessible) {
                    toast.info('Video locked', {
                      description: 'Complete previous videos to unlock this one.'
                    });
                  }
                }}
                className={`
                  relative rounded-lg overflow-hidden cursor-pointer border transition-all duration-300
                  ${isAccessible && !isCurrent ? 'hover:shadow-lg hover:scale-105 border-gray-200' : 'border-gray-300'}
                  ${isCurrent ? 'ring-2 ring-red-500 opacity-75' : ''}
                  ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isCompleted ? 'ring-1 ring-green-400' : ''}
                `}
              >
                <div className="relative h-32">
                  <Image
                    src={getImageUrl(video.thumbnailUrl || video.image)}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  
                  {!isAccessible && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 text-white" 
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
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute inset-0 bg-red-600 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                        NOW PLAYING
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3 text-white" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  )}
                  
                  <div className="absolute top-1 left-1 bg-white text-gray-800 text-xs font-medium px-1 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
                
                <div className="p-2">
                  <h3 className="font-medium text-xs line-clamp-2 text-gray-900 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500">{video.duration}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default VideoPlayerPage;
