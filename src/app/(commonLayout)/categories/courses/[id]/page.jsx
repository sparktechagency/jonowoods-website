"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// import { useMarkWatchCourseVideoMutation, useSubCategoryVideoQuery } from '@/redux/featured/homeApi.jsx/homeApi';
import Spinner from '../../../Spinner';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { useSubCategoryVideoQuery } from '@/redux/featured/homeApi.jsx/homeApi';
import {  useMarkWatchCoursesVideoMutation } from '@/redux/featured/CommingSoon/commingSoonApi';

const CourseVideoPage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: videoData, isLoading: videoLoading, refetch } = useSubCategoryVideoQuery(id, { skip: !id });
  const [markWatchCourseVideo] = useMarkWatchCoursesVideoMutation();
  console.log("videoData", videoData)

  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [videos, setVideos] = useState([]);

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
    }
  }, [videoData]);

  // Handle video completion
  const handleVideoComplete = async (videoId) => {
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
    if (index === 0) return true; // First video always accessible
    const prevVideo = videos[index - 1];
    return prevVideo && completedVideos.includes(prevVideo._id);
  };

  if (videoLoading) return <Spinner />;

  if (!videoData?.data || (Array.isArray(videoData.data) && videoData.data.length === 0)) {
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

  return (
    <div className="container mx-auto p-4">
      {/* Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Courses
        </button>
      </div>

      {/* Current Video Player */}
      <div className="mb-8">
        {currentVideo && (
          <div>
            {/* <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentVideo.title}</h1> */}
            <VideoPlayer 
              data={currentVideo}
              onComplete={() => handleVideoComplete(currentVideo._id)}
            />
            
            {/* Video Description */}
            {/* {currentVideo.description && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{currentVideo.description}</p>
              </div>
            )} */}
            
            {/* Equipment Needed */}
            {currentVideo.equipmentNeeded && currentVideo.equipmentNeeded.length > 0 && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Equipment Needed</h2>
                <ul className="list-disc list-inside space-y-2">
                  {currentVideo.equipmentNeeded.map((equipment, index) => (
                    <li key={index} className="text-gray-700">{equipment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video List - Only show if there are multiple videos */}
      {videos.length > 1 && (
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Course Videos</h2>
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
                    } else {
                      toast.info('Video locked', {
                        description: 'Complete the previous video to unlock this one.'
                      });
                    }
                  }}
                  className={`
                    relative rounded-lg overflow-hidden cursor-pointer border
                    ${isAccessible ? 'hover:shadow-lg' : 'opacity-70 cursor-not-allowed'}
                    ${isCurrent ? 'ring-2 ring-red-500' : ''}
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
                  </div>
                  
                  {/* Video details */}
                  <div className="p-3 bg-white">
                    <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{video.duration} min</p>
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