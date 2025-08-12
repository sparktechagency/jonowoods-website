"use client";
import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

const VideoPlayer = ({ data, onComplete }) => {
  const videoRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  console.log(data, onComplete);

  // Check if content is ready
  const isContentReady = data?.isReady === 'ready';
  const hasRedirectUrl = data?.redirectUrl && data.redirectUrl.trim() !== '';
  const hasThumbnail = data?.thumbnailUrl && data.thumbnailUrl.trim() !== '';
  console.log(hasThumbnail, "hasThumbnail");


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

  // Track video progress with throttling to prevent infinite renders
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const currentProgress = (video.currentTime / video.duration) * 100;
      
      // Only update progress if there's a significant change (reduce renders)
      if (Math.abs(currentProgress - progress) > 1) {
        setProgress(currentProgress);
      }
      
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

  // Prevent navigation for non-ready content
  useEffect(() => {
    if (!isContentReady) {
      // Prevent back/forward navigation or any navigation attempts
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      // You can add additional navigation blocking logic here if needed
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isContentReady]);

  // Handle redirect button click
  const handleRedirect = () => {
    if (hasRedirectUrl) {
      // Check if URL starts with http/https, if not add https://
      const url = data.redirectUrl.startsWith('http') 
        ? data.redirectUrl 
        : `https://${data.redirectUrl}`;
      
      window.open(url, '_blank');
    }
  };

  // If content is not ready (coming soon)
  if (!isContentReady) {
    return (
      <div className="relative">
        <style jsx>{`
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          .animate-fade-in {
            animation: fade-in 2s ease-in-out infinite alternate;
          }
          
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
            50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
          }
          
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>
        <div>
          <h2 className='lg:text-3xl font-bold mt-8 text-xl'>
            {data?.title}
          </h2>
        </div>
        <div className="container mx-auto bg-white">
          {/* Coming Soon Section with Thumbnail */}
          <div className="mt-4 relative">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center border rounded-md overflow-hidden relative">
              {/* Thumbnail Image */}
              {hasThumbnail && (
                <img
                  src={`getVideoAndThumbnail(data.thumbnailUrl)`}

                  alt={data?.title || 'Video Thumbnail'}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay for Coming Soon */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔒</div>
                  <h3 className="text-2xl font-semibold text-white mb-2 animate-pulse animate-glow">
                    Coming Soon
                    <span className="inline-block animate-bounce ml-1">.</span>
                    <span className="inline-block animate-bounce ml-1" style={{animationDelay: '0.1s'}}>.</span>
                    <span className="inline-block animate-bounce ml-1" style={{animationDelay: '0.2s'}}>.</span>
                  </h3>
                  <p className="text-gray-200 animate-fade-in">This content will be available soon!</p>
                  
                  {/* External Button */}
                  {hasRedirectUrl && (
                    <div className="mt-4">
                      <button
                        onClick={handleRedirect}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-lg"
                      >
                        Access External Content
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Title and Details */}
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Title: {data?.title}</h1>
              <p className="text-sm text-gray-600 mb-1">Duration: {data?.duration} Min</p>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Description: {data?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If content is ready, show normal video player
  return (
    <div className="relative">
      <div>
        <h2 className='lg:text-3xl font-bold mt-8 text-xl'>
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
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Title: {data?.title}</h1>
            <p className="text-sm text-gray-600 mb-1">Duration: {data?.duration} Min</p>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Description: {data?.description}
            </p>
            
            {/* Redirect Button if redirectUrl exists */}
            {hasRedirectUrl && (
              <button
                onClick={handleRedirect}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Access Additional Resource
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;