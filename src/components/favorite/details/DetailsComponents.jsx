"use client";
import "@videojs/themes/dist/city/index.css";
import { ArrowLeft, Heart, PictureInPicture } from "lucide-react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { useCategoryWithSubcategoryQuery } from "../../../redux/featured/homeApi.jsx/homeApi";
import CommentsSection from "./CommentSection";
import Spinner from "../../../app/(commonLayout)/Spinner";

export default function EnhancedVideoDetails({ params }) {
  const { id } = React.use(params);

  // const { data } = useSingleVideoQuery(id)
  const { data } = useCategoryWithSubcategoryQuery(id, {
    skip: !id,
  });

  console.log(data?.data?.result)


  const [liked, setLiked] = useState(false);
  const videoNode = useRef(null);
  const playerRef = useRef(null);

  const videoDetails = {
    id: id,
    title: "Gentle Morning Stretch",
    duration: "11 Min",
    videoUrl:
      "https://media.istockphoto.com/id/1410441629/video/fit-females-doing-warmup-exercises-in-a-fitness-class-at-a-center-training-coach-guiding-a.mp4?s=mp4-640x640-is&k=20&c=FDSJfxJGUgTijKHrIxDFL4RJYCE7V3rTG98I4JqTRQc=",
    description:
      "A holistic practice that blends physical postures, breath control, meditation, and ethical principles to promote overall well-being.",
    equipmentNeeded: "None",
    captionUrl: "/captions.vtt",
  };

  useEffect(() => {
    if (videoNode.current && !playerRef.current) {
      const player = videojs(videoNode.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2], // ✅ প্লেব্যাক স্পিড
        sources: [
          {
            src: videoDetails.videoUrl,
            type: "video/mp4",
          },
        ],
      });

      playerRef.current = player;

      // ✅ Custom Events
      player.on("ended", () => {
        console.log("🎉 Video Ended");
      });

      player.on("pause", () => {
        console.log("⏸️ Video Paused");
      });

      player.on("play", () => {
        console.log("▶️ Video Playing");
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handlePiP = () => {
    const videoEl = playerRef.current?.tech().el();
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoEl?.requestPictureInPicture();
    }
  };

  if (!id) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-gray-100 p-2 rounded-lg mr-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </div>
          <h1 className="text-lg font-bold">Today's Video</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* PiP Button */}
          <button
            onClick={handlePiP}
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
            title="Picture in Picture"
          >
            <PictureInPicture className="h-5 w-5 text-blue-500" />
          </button>

          {/* Like Button */}
          <button onClick={toggleLike} className="bg-gray-100 p-2 rounded-full">
            <Heart
              className={`h-5 w-5 ${liked ? "fill-rose-500 text-rose-500" : "text-gray-400"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-white rounded-lg  overflow-hidden">
        <div className="relative aspect-video bg-black">
          <div data-vjs-player className="w-full h-full">
            <video
              ref={videoNode}
              className="video-js vjs-theme-city vjs-big-play-centered w-full h-full"
              onContextMenu={(e) => e.preventDefault()}
              controls
              crossOrigin="anonymous"
            >
            </video>
          </div>
        </div>

        {/* Video Details */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{videoDetails.title}</h1>
          <p className="text-sm text-gray-500 mb-6">{videoDetails.duration}</p>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">About this Class</h2>
            <p className="text-gray-700">{videoDetails.description}</p>
            <p className="text-gray-700 mt-2">
              Through a variety of physical poses (asanas), yoga strengthens and
              tones the body, enhances flexibility, and improves posture...
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Props/Equipment Needed</h2>
            <p className="text-gray-700">{videoDetails.equipmentNeeded}</p>
          </div>

          {/* Comments Section */}
          <CommentsSection />
        </div>
      </div>
    </div>
  );
}
