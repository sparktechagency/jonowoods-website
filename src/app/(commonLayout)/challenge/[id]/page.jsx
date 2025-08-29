"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMarkWatchChallengeVideoMutation, useSingleChallengeVideoQuery } from '@/redux/featured/CommingSoon/commingSoonApi';
import Spinner from '../../Spinner';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';

const ChallengePage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const { data, isLoading, refetch } = useSingleChallengeVideoQuery(id, { skip: !id });
  const [markWatchChallengeVideo] = useMarkWatchChallengeVideoMutation();
  console.log(data?.data?.result) 
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [videos, setVideos] = useState([]);

  // Initialize videos and completed videos
  useEffect(() => {
    if (data?.data?.result) {
      // Sort videos by their order if needed
      const sortedVideos = [...data.data.result];
      setVideos(sortedVideos);

      // Find completed videos
      const completed = sortedVideos
        .filter(video => video.isVideoCompleted)
        .map(video => video._id);
      setCompletedVideos(completed);
    }
  }, [data]);

  // Handle video completion
  const handleVideoComplete = async (videoId) => {
    try {
      // Mark as completed
      await markWatchChallengeVideo(videoId).unwrap();
      
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

  if (isLoading) return <Spinner />;
  
  if (!data?.data?.result || data.data.result.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No challenge videos found</h2>
        <button 
          onClick={() => router.push('/challenge')}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];
  console.log(currentVideo)

  return (
    <div className="container mx-auto p-4">
      {/* Current Video Player */}
      <div className="mb-8">
        {currentVideo && (
          <VideoPlayer 
            data={currentVideo}
            onComplete={() => handleVideoComplete(currentVideo._id)}
          />
        )}
      </div>

      {/* Video List */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Challenge Videos</h2>
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
    </div>
  );
};

export default ChallengePage;