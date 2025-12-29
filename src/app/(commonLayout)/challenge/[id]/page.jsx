"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSingleChallengeVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";
import Spinner from "../../Spinner";
import ImageWithLoader from "@/components/share/ImageWithLoader";
import { getImageUrl, getVideoAndThumbnail } from "@/components/share/imageUrl";
import { Button } from "@/components/ui/button";

const ChallengePage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const queryParams = [
    {
      name: "page",
      value: currentPage,
    },
    {
      name: "limit",
      value: perPage,
    },
  ];
  const { data, isLoading } = useSingleChallengeVideoQuery({
    id,
    params: queryParams,
  });
  const challengeInfo = data?.data?.categoryInfo;
  console.log(challengeInfo);
  console.log(data);

  const [videos, setVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [thumbnailLoadingStates, setThumbnailLoadingStates] = useState({});

  // Initialize videos and completed videos
  useEffect(() => {
    if (data?.data?.result) {
      const sortedVideos = [...data.data.result];
      setVideos(sortedVideos);

      // Keep track of all videos across all pages
      setAllVideos((prev) => {
        const existing = prev.filter(
          (v) => !sortedVideos.find((sv) => sv._id === v._id)
        );
        return [...existing, ...sortedVideos];
      });

      const completed = sortedVideos
        .filter((video) => video.isVideoCompleted)
        .map((video) => video._id);
      setCompletedVideos((prev) => [...new Set([...prev, ...completed])]);
    }
  }, [data]);

  // Check if a video is accessible
  const isVideoAccessible = (index) => {
    const video = videos[index];
    return video && video.isEnabled;
  };

  // Calculate countdown for locked videos
  const calculateCountdown = (unlockTime) => {
    const now = new Date().getTime();
    const unlockTimestamp = new Date(unlockTime).getTime();
    const difference = unlockTimestamp - now;

    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return "Unlocked";
    }
  };

  // Get video countdown
  const getVideoCountdown = (video) => {
    if (video.nextUnlockTime) {
      return calculateCountdown(video.nextUnlockTime);
    }
    return null;
  };

  // Handle video click
  const handleVideoClick = (video, index) => {
    if (isVideoAccessible(index)) {
      // Navigate to individual video page
      router.push(`/challenge/${id}/video/${video._id}`);
    } else {
      const countdownText = getVideoCountdown(video);
      if (countdownText && countdownText !== "Unlocked") {
        toast.info("Video locked", {
          description: `This video will unlock in ${countdownText}.`,
        });
      } else {
        toast.info("Video locked", {
          description: "Complete the previous video to unlock this one.",
        });
      }
    }
  };

  // Find next available video from current page
  const findNextAvailableVideo = () => {
    // First check current page videos
    for (let i = 0; i < videos.length; i++) {
      if (isVideoAccessible(i) && !completedVideos.includes(videos[i]._id)) {
        return videos[i];
      }
    }
    return null;
  };

  // Handle Next Flow button click
  const handleNextFlow = () => {
    const nextVideo = findNextAvailableVideo();
    if (nextVideo) {
      router.push(`/challenge/${id}/video/${nextVideo._id}`);
    } else {
      toast.info("No available video", {
        description: "You have completed all available videos!",
      });
    }
  };

  const handlePageChange = (page) => {
    const meta = data?.data?.meta;
    if (page >= 1 && page <= meta?.totalPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) return <Spinner />;

  if (!data?.data?.result || data.data.result.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No challenge videos found</h2>
        <button
          onClick={() => router.push("/challenge")}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  // Get challenge details from first video (assuming all videos belong to same challenge)
  const challengeData = data?.data?.challengeInfo || videos[0];
  console.log(challengeData);
  console.log("Pagination Debug:", {
    meta: data?.data?.meta,
    totalPage: data?.data?.meta?.totalPage,
    condition: data?.data?.meta?.totalPage > 1,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Challenge Details Header */}
      <div className="mb-8">
        {/* Back button */}
        {/* <button
          onClick={() => router.push("/challenge")}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
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
          Back to Challenges
        </button> */}

        {/* Challenge header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Challenge thumbnail */}
            <div className="md:w-1/3 lg:w-1/4">
              <ImageWithLoader
                src={getImageUrl(challengeInfo?.image)}
                alt={
                  challengeData?.name || challengeData?.title || "Challenge"
                }
                containerClassName="h-72 md:h-72"
              />
            </div>

            {/* Challenge details */}
            <div className="p-6 md:w-2/3 lg:w-3/4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                <span className="font-medium text-base">Challenge Name:</span>{" "}
                {challengeInfo?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600"></div>

              {challengeInfo?.description && (
                <p className="text-gray-700 leading-relaxed mb-4">
                  Description: {challengeInfo?.description}
                </p>
              )}

              {/* <p className="text-sm text-gray-600">
                Progress: {completedVideos.length} of {videos.length} videos
                completed
              </p> */}
              <p className=" ">
                Total Videos:{" "}
                <span className="font-bold text-primary">{videos.length}</span>
              </p>
              <p className=" ">
                Complete Videos:{" "}
                <span className="font-bold text-primary">
                  {completedVideos.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Challenge Videos</h2>

        {/* Next Flow Button - Fixed at bottom on mobile only */}
        <div className="block md:hidden fixed bottom-0 left-0 right-0 p-4   z-50">
          <div className="flex justify-end">
            <Button
              onClick={handleNextFlow}
              className="py-6 text-white font-semibold px-6 rounded-md transform transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              Next Flow
            </Button>
          </div>
        </div>

        {/* Add bottom padding to prevent content from being hidden behind fixed button */}
        <div className="block md:hidden h-20"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => {
            const isAccessible = isVideoAccessible(index);
            const isCompleted = completedVideos.includes(video._id);
            const videoCountdown = getVideoCountdown(video);
            const isThumbnailLoading = thumbnailLoadingStates[video._id] !== false;

            return (
              <div
                key={video._id}
                onClick={() => handleVideoClick(video, index)}
                className={`
                  relative rounded-lg overflow-hidden cursor-pointer border transition-all duration-300
                  ${
                    isAccessible
                      ? "hover:shadow-lg hover:scale-105 border-gray-200"
                      : "opacity-70 cursor-not-allowed border-gray-300"
                  }
                  ${isCompleted ? "ring-2 ring-green-500" : ""}
                `}
              >
                {/* Video thumbnail */}
                <div className="relative h-48">
                  <ImageWithLoader
                    src={getVideoAndThumbnail(
                      video.thumbnailUrl || video.image
                    )}
                    alt={video.title}
                    containerClassName="h-48"
                    onLoadComplete={() => {
                      setThumbnailLoadingStates((prev) => ({
                        ...prev,
                        [video._id]: false,
                      }));
                    }}
                  />

                  {/* Lock overlay for inaccessible videos - Only show when thumbnail is loaded */}
                  {!isAccessible && !isThumbnailLoading && (
                    <div className="absolute inset-0   flex items-center justify-center z-10">
                      <div className="text-center bg-red-600 text-white px-5 py-3 opacity-80 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 mx-auto mb-2"
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
                        {video.nextUnlockTime ? (
                          <div>
                            <p className="text-sm mb-1">Unlocks in</p>
                            <p className="text-xs font-bold text-yellow-300">
                              {videoCountdown || "Calculating..."}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm">Locked</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completion indicator */}
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
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

                  {/* Video number */}
                  <div className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded">
                    Video {index + 1}
                  </div>

                  {/* Play button overlay - Only show when thumbnail is loaded */}
                  {isAccessible && !isThumbnailLoading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg- bg-opacity-30 z-10">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-white "
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video details */}
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-sm line-clamp-2 text-gray-900 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{video.duration}</p>

                  {/* Status indicator */}
                  <div className="flex items-center justify-between">
                    {isCompleted ? (
                      <span className="text-xs text-green-600 font-medium flex items-center">
                        <svg
                          className="h-3 w-3 mr-1"
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
                      </span>
                    ) : isAccessible ? (
                      <span className="text-xs text-blue-600 font-medium flex items-center">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Available
                      </span>
                    ) : video.nextUnlockTime && videoCountdown ? (
                      <p className="text-xs text-yellow-600 font-medium flex items-center">
                        ⏳ Unlocks in {videoCountdown}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium flex items-center">
                        <svg
                          className="h-3 w-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {video?.lockReason}
                      </span>
                    )}
                  </div>

                  <p>
                    {video?.description.length > 200
                      ? video?.description.slice(0, 120) + "..."
                      : video?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {data?.data?.meta?.totalPage > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentPage} of {data?.data?.meta?.totalPage}
            </span>

            <button
              disabled={currentPage === data?.data?.meta?.totalPage}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === data?.data?.meta?.totalPage
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;
