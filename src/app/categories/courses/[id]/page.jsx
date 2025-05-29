"use client";

import React, { useEffect, useState } from 'react';
import { useSubCategoryVideoQuery } from '../../../../redux/featured/homeApi.jsx/homeApi';
import Spinner from '../../../(commonLayout)/Spinner';

export default function CoursePage({ params }) {
  const { id } = React.use(params);
  const { data: course, isLoading: courseLoading } = useSubCategoryVideoQuery(id, { skip: !id });
  const [completedVideos, setCompletedVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videos, setVideos] = useState([]);

  // Initialize videos and sort by serial number
  useEffect(() => {
    if (course?.data?.result) {
      const sortedVideos = [...course.data.result].sort((a, b) => a.serial - b.serial);
      setVideos(sortedVideos);
    }
  }, [course]);

  const markVideoAsCompleted = (videoId) => {
    if (!completedVideos.includes(videoId)) {
      const newCompletedVideos = [...completedVideos, videoId];
      setCompletedVideos(newCompletedVideos);

      // Save to localStorage for persistence
      localStorage.setItem(`completedVideos-${id}`, JSON.stringify(newCompletedVideos));
    }
  };

  // Load completed videos from localStorage on component mount
  useEffect(() => {
    const savedCompletedVideos = localStorage.getItem(`completedVideos-${id}`);
    if (savedCompletedVideos) {
      setCompletedVideos(JSON.parse(savedCompletedVideos));
    }
  }, [id]);

  const isVideoAccessible = (videoIndex) => {
    // First video is always accessible
    if (videoIndex === 0) return true;

    // Video is accessible if the previous one is completed
    const previousVideo = videos[videoIndex - 1];
    return previousVideo && completedVideos.includes(previousVideo._id);
  };

  const handleVideoEnd = () => {
    const currentVideoData = videos[currentVideo];
    markVideoAsCompleted(currentVideoData._id);

    // Auto-play next video if available and accessible
    if (currentVideo < videos.length - 1 && isVideoAccessible(currentVideo + 1)) {
      setCurrentVideo(currentVideo + 1);
    }
  };

  const handleThumbnailClick = (index) => {
    if (isVideoAccessible(index)) {
      setCurrentVideo(index);
    }
  };

  if (courseLoading) {
    return <Spinner />;
  }

  if (!videos.length) {
    return <div className="flex justify-center items-center h-screen">No videos found.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Main Video Player */}
      <div className="mb-8 bg-black rounded-lg overflow-hidden">
        <video
          key={videos[currentVideo]?._id}
          controls
          src={`https://${videos[currentVideo]?.videoUrl}`}
          className="w-full h-auto max-h-[70vh] mx-auto"
          onEnded={handleVideoEnd}
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Course Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
        <h3 className="text-xl font-semibold mb-2">{videos[currentVideo]?.title}</h3>
        <p className="text-gray-600 mb-3">Duration: {videos[currentVideo]?.duration}</p>
        <p className="text-gray-700 mb-4">{videos[currentVideo]?.description}</p>

        {videos[currentVideo]?.equipment?.length > 0 && (
          <>
            <p className="text-sm font-bold mb-2">Props/Equipment Needed:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {videos[currentVideo]?.equipment?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => {
          const isAccessible = isVideoAccessible(index);
          const isCurrent = currentVideo === index;
          const isCompleted = completedVideos.includes(video._id);

          return (
            <div
              key={video._id}
              onClick={() => isAccessible && handleThumbnailClick(index)}
              className={`relative rounded-lg overflow-hidden transition-all duration-200 ${isAccessible
                ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                : 'opacity-70 cursor-not-allowed'
                } ${isCurrent ? 'ring-4 ring-blue-500' : ''
                }`}
            >
              <div className="relative">
                <img
                  src={`https://${video.thumbnailUrl}`}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />

                {/* Overlay for locked videos */}
                {!isAccessible && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="text-white text-center p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-auto mb-1"
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
                      <span className="text-sm font-medium">Complete previous video to unlock</span>
                    </div>
                  </div>
                )}

                {/* Completion checkmark */}
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

                {/* Video duration */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>

              <div className="p-3 bg-white">
                <div className="flex items-start">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2 py-0.5 rounded">
                    {video.serial}
                  </span>
                  <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}