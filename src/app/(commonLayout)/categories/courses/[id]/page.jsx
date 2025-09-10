"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSubCategoryVideoQuery } from '@/redux/featured/homeApi.jsx/homeApi';
import { useMarkWatchCoursesVideoMutation } from '@/redux/featured/CommingSoon/commingSoonApi';
import Spinner from '../../../Spinner';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';

const CourseVideoPage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: videoData, isLoading: videoLoading, refetch } = useSubCategoryVideoQuery(id, { skip: !id });
  const [markWatchCourseVideo] = useMarkWatchCoursesVideoMutation();
  console.log("videoData", videoData)

  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const completionProcessedRef = useRef(new Set()); // Track processed video completions

  // Initialize videos and completed videos
  useEffect(() => {
    if (videoData?.data.result) {
      // If videoData.data is an array, use it directly; if single video, wrap in array
      const courseVideos = Array.isArray(videoData.data.result) ? videoData.data.result : [videoData.data.result];
      
      // Sort videos by their order if needed
      const sortedVideos = [...courseVideos];
      setVideos(sortedVideos);

      // Find completed videos
      const completed = sortedVideos
        .filter(video => video.isVideoCompleted)
        .map(video => video._id);
      setCompletedVideos(completed);
      
      // Reset completion tracking when data changes
      completionProcessedRef.current.clear();
    }
  }, [videoData]);
  
  // Reset completion tracking when current video changes
  useEffect(() => {
    completionProcessedRef.current.clear();
  }, [currentVideoIndex]);

  // Handle video completion
  const handleVideoComplete = async (videoId) => {
    // Prevent duplicate completion processing
    if (completionProcessedRef.current.has(videoId)) {
      return;
    }
    
    completionProcessedRef.current.add(videoId);
    
    try {
      // Mark as completed
      await markWatchCourseVideo(videoId).unwrap();
      
      // Update local state
      setCompletedVideos(prev => [...prev, videoId]);
      
      // Find next video index
      const currentIndex = videos.findIndex(v => v._id === videoId);
      
      // If there's a next video, show the notification about it
      if (currentIndex < videos.length - 1) {
        const nextVideo = videos[currentIndex + 1];
        
        toast.success('Video completed!', {
          description: `You've unlocked "${nextVideo.title}"!`,
          duration: 5000,
          action: {
            label: 'Watch Next',
            onClick: () => setCurrentVideoIndex(currentIndex + 1)
          },
        });
      } else {
        // Last video completed
        toast.success('Course completed!', {
          description: 'Congratulations! You have completed all videos in this course.',
          duration: 5000,
        });
      }
      
      // Refresh data to get updated completion status
      refetch();
    } catch (error) {
      console.error('Error marking video as completed:', error);
      toast.error('Failed to mark video as completed', {
        description: 'Please try again later.'
      });
    }
  };
  
  // Check if a video is accessible
  const isVideoAccessible = (index) => {
    const video = videos[index];
    console.log(`Video ${index}:`, video, 'isEnabled:', video?.isEnabled);
    return video && video.isEnabled;
  };

  if (videoLoading) return <Spinner />;

  if (!videoData?.data?.result || (Array.isArray(videoData.data.result) && videoData.data.result.length === 0)) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No course videos found</h2>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];
  console.log(currentVideo)

  return (
    <div className="mx-auto p-4">
      {/* Fixed Video Player - Sticky on mobile only */}
      <div className="md:relative md:mb-4 sticky top-0 z-10 bg-white shadow-lg mb-4 pb-4 pt-2">
        {currentVideo && (
          <div className="">
            <h2 className="text-lg md:text-2xl font-bold mb-2">{currentVideo.title}</h2>
            <div className="relative">
              <video
                controls
                 controlsList="nodownload"
                src={`https://${currentVideo?.videoUrl}`}
                className="w-full h-48 md:h-64 lg:h-[500px] object-cover border rounded-md"
                autoPlay
                onEnded={() => handleVideoComplete(currentVideo._id)}
                onTimeUpdate={(e) => {
                  const video = e.target;
                  const currentProgress = (video.currentTime / video.duration) * 100;
                  if (currentProgress >= 90 && !completionProcessedRef.current.has(currentVideo._id)) {
                    handleVideoComplete(currentVideo._id);
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Current video indicator */}
              <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                Now Playing: Video {currentVideoIndex + 1}
              </div>
            </div>
            
            {/* Video details */}
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Duration: {currentVideo?.duration} Min
              </p>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {currentVideo?.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Equipment Needed - Moved to sticky section */}
      {currentVideo?.equipmentNeeded && currentVideo.equipmentNeeded.length > 0 && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Equipment Needed</h3>
          <ul className="list-disc list-inside space-y-1">
            {currentVideo.equipmentNeeded.map((equipment, index) => (
              <li key={index} className="text-gray-700 text-sm">{equipment}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Video List - Only show if there are multiple videos */}
      {videos.length > 1 && (
        <div className="my-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">All Course Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video, index) => {
              const isAccessible = isVideoAccessible(index);
              const isCompleted = completedVideos.includes(video._id);
              const isCurrent = currentVideoIndex === index;
              
              return (
                <div 
                  key={video._id}
                  onClick={() => {
                    if (isAccessible) {
                      setCurrentVideoIndex(index);
                      // Smooth scroll to top on mobile to show the video player
                      if (window.innerWidth < 768) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    } else {
                      toast.info('Video locked', {
                        description: 'Complete the previous video to unlock this one.'
                      });
                    }
                  }}
                  className={`
                    relative rounded-lg overflow-hidden cursor-pointer border
                    ${isAccessible ? 'hover:shadow-lg hover:scale-105' : 'opacity-70 cursor-not-allowed'}
                    ${isCurrent ? 'ring-4 ring-red-500 bg-red-50 shadow-xl scale-95' : ''}
                    transition-all duration-300
                  `}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40">
                    <Image
                      src={`https://${video.thumbnailUrl || video.image}`}
                      alt={video.title}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Lock overlay for inaccessible videos */}
                    {!isAccessible && (
                      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                        <div className="text-center text-white">
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
                          <p className="text-sm">Complete previous video</p>
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
                    
                    {/* Currently playing indicator */}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                        <div className="text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          NOW PLAYING
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Video details */}
                  <div className={`p-3 transition-colors duration-300 ${
                    isCurrent ? 'bg-red-50' : 'bg-white'
                  }`}>
                    <h3 className={`font-medium text-sm line-clamp-2 transition-colors duration-300 ${
                      isCurrent ? 'text-red-700' : 'text-gray-900'
                    }`}>{video.title}</h3>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${
                      isCurrent ? 'text-red-600' : 'text-gray-500'
                    }`}>{video.duration} min</p>
                    {isCurrent && (
                      <p className="text-xs text-red-600 font-medium mt-1">▶ Currently Playing</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseVideoPage;