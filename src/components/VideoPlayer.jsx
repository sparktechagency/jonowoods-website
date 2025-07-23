"use client";

import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

const VideoPlayer = ({ data, onComplete }) => {
  const videoRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle video completion
  const handleVideoEnd = () => {
    if (!isCompleted && onComplete) {
      setIsCompleted(true);
      
      // Show completion toast
      toast.success('Video Completed!', {
        description: 'Great job finishing this video.'
      });
      
      onComplete();
    }
  };

  // Track video progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      
      // Consider video completed if user watched 90% of it
      if (currentProgress >= 90 && !isCompleted && onComplete) {
        setIsCompleted(true);
        
        // Show completion toast
        toast.success('Video Completed!', {
          description: 'Great job finishing this video.'
        });
        
        onComplete();
      }
    }
  };

  // Reset completion state when video changes
  useEffect(() => {
    setIsCompleted(false);
    setProgress(0);
  }, [data?.videoUrl]);

  return (
    <div className="relative">
      <div>
        <h2 className='lg:text-3xl font-bold mt-8 text-xl '>
          {data?.title}
        </h2>
      </div>
      <div className="container mx-auto bg-white">
        {/* Video Section */}
        <div className="mt-4 relative">
          <video
            ref={videoRef}
            controls
            src={`https://${data?.videoUrl}`}
            className="w-full h-auto max-h-[70vh] mx-auto border rounded-md"
            autoPlay
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Progress indicator */}
          {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div> */}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Details */}
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Title : {data?.title}</h1>
            <p className="text-sm text-gray-600 mb-1">Duration : {data?.duration} Min</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Description : {data?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;