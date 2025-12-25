"use client";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Play } from "lucide-react";
import Image from "next/image";

const VideoPlayer = ({ data, onComplete }) => {
  console.log("data", data);
  const videoRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(0);

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
        progressRef.current = currentProgress;
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
    setIsPlaying(false);
    progressRef.current = 0;
  }, [data?.videoUrl]);

  // Handle play button click
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

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
    <div className="relative px-4 md:px-8 lg:px-12">
      <div>
        <h2 className="lg:text-3xl font-bold mt-8 text-xl">{data?.title}</h2>
      </div>
      <div className="bg-white">
        <div className="mt-4 relative">
          {!isPlaying && (
            <div 
              className="absolute inset-0 z-10 cursor-pointer group"
              onClick={handlePlay}
            >
              <Image
                src={`https://${data?.thumbnailUrl}`}
                alt={data?.title}
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                className="w-full h-full object-cover rounded-md"
                quality={85}
                loading="lazy"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center  group-hover:bg-opacity-40 transition-all duration-200 rounded-md">
                <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-4 md:p-6 transition-all duration-200 transform group-hover:scale-110">
                  <Play className="w-12 h-12 md:w-16 md:h-16 text-red-600" fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          {/* Video element */}

          
          <video
            ref={videoRef}
            controls={isPlaying}
            controlsList="nodownload"
            src={`https://${data?.videoUrl}`}
            className="w-full h-auto max-h-[70vh] mx-auto border rounded-md"
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-4 shadow-md rounded-b-md">
          <div className="mb-4 pt-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Title: {data?.title}
            </h1>
            <p className="text-sm text-gray-600 mb-1">
              Duration: <span className="font-medium text-red-500">{data?.duration}</span> 
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              <span className="font-medium">Description:</span> {data?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;