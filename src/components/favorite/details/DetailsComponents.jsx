"use client"
import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CommentsSection from "./CommentSection";

export default function EnhancedVideoDetails() {
  const params = useParams();
  const id = params?.id;

  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Ensure we have an ID
  if (!id) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  // Video details
  const videoDetails = {
    id: id,
    title: "Gentle Morning Stretch",
    duration: "11 Min",
    videoUrl:
      "https://media.istockphoto.com/id/1410441629/video/fit-females-doing-warmup-exercises-in-a-fitness-class-at-a-center-training-coach-guiding-a.mp4?s=mp4-640x640-is&k=20&c=FDSJfxJGUgTijKHrIxDFL4RJYCE7V3rTG98I4JqTRQc=",
    description:
      "A holistic practice that blends physical postures, breath control, meditation, and ethical principles to promote overall well-being.",
    equipmentNeeded: "None",
  };

  const togglePlayback = () => {
    setIsPlaying(true);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  // Prevent right-clicking on the video player
  const preventRightClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto py-8 px-4 ">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-gray-100 p-2 rounded-lg mr-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </div>
          <h1 className="text-lg font-bold">Today's Video</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className="bg-gray-100 p-2 rounded-full">
            <Heart
              className={`h-5 w-5 ${
                liked ? "fill-rose-500 text-rose-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative aspect-video bg-black">
          {isPlaying ? (
            // Video player with controls and right-click disabled
            <div className="w-full h-full flex items-center justify-center">
              <video
                className="w-full h-full"
                controls
                autoPlay
                onContextMenu={preventRightClick}
              >
                <source src={videoDetails.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            // Video thumbnail with play button
            <div className="w-full h-full relative">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Video Thumbnail</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayback}
                  className="w-16 h-16 bg-white bg-opacity-75 rounded-full flex items-center justify-center"
                >
                  <Play className="h-8 w-8 text-rose-500 ml-1" fill="none" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{videoDetails.title}</h1>
          <div className="mb-6">
            <span className="text-sm text-gray-500">
              {videoDetails.duration}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">About this Class</h2>
            <p className="text-gray-700">
              Yoga is a holistic practice that blends physical postures, breath
              control, meditation, and ethical principles to promote overall
              well-being. Rooted in ancient Indian traditions, yoga offers a
              pathway to connect the mind, body, and spirit, fostering balance
              and harmony in daily life.
            </p>
            <p className="text-gray-700 mt-2">
              Through a variety of physical poses (asanas), yoga strengthens and
              tones the body, enhances flexibility, and improves posture. The
              focus on conscious breathing (pranayama) helps calm the nervous
              system, reduce stress, and increase mental clarity. Additionally,
              yoga encourages mindfulness and self-awareness, cultivating a
              sense of inner peace and relaxation.
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
