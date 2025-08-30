"use client";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

const VideoPlayer = ({ data, onComplete }) => {
  const videoRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const progressRef = useRef(0); // 👈 state এর পরিবর্তে ref ব্যবহার

  const hasRedirectUrl = data?.redirectUrl && data.redirectUrl.trim() !== "";

  // Handle video completion
  const handleVideoEnd = () => {
    if (!isCompleted && onComplete) {
      setIsCompleted(true);
      toast.success("Video Completed!", {
        description: "Great job finishing this video.",
      });
      onComplete();
    }
  };

  // Track video progress with throttling (using ref to avoid re-renders)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const currentProgress = (video.currentTime / video.duration) * 100;

      if (Math.abs(currentProgress - progressRef.current) > 1) {
        progressRef.current = currentProgress; // 👈 re-render হবে না
      }

      if (currentProgress >= 90 && !isCompleted && onComplete) {
        setIsCompleted(true);
        toast.success("Video Completed!", {
          description: "Great job finishing this video.",
        });
        onComplete();
      }
    }
  };

  // Reset completion state when video changes
  useEffect(() => {
    setIsCompleted(false);
    progressRef.current = 0;
  }, [data?.videoUrl]);

  // Handle redirect button click
  const handleRedirect = () => {
    if (hasRedirectUrl) {
      const url = data.redirectUrl.startsWith("http")
        ? data.redirectUrl
        : `https://${data.redirectUrl}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative">
      <div>
        <h2 className="lg:text-3xl font-bold mt-8 text-xl">{data?.title}</h2>
      </div>
      <div className="container mx-auto bg-white">
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
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Title: {data?.title}
            </h1>
            <p className="text-sm text-gray-600 mb-1">
              Duration: {data?.duration} Min
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Description: {data?.description}
            </p>

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
