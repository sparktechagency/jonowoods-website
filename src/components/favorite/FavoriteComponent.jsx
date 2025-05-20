// pages/index.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Download, X } from "lucide-react";

export default function FavoriteComponents() {
  const [likedVideos, setLikedVideos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const meditationVideos = [
    {
      id: "1",
      title: "Gentle Morning Stretch",
      duration: "11 Min",
      thumbnail: "/assests/payerImage.png",
      videoUrl:
        "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/67b9b23cbe35d27f504d4bb7-p3-m41wef7__95cf3e9af7013f8c30516ea56660faae__P360.mp4",
      description:
        "Yoga is a holistic practice that blends physical postures, breath control, meditation, and ethical principles to promote overall well-being. Rooted in ancient Indian traditions, yoga offers a pathway to connect the mind, body, and spirit, fostering balance and harmony in daily life.",
    },
    {
      id: "2",
      title: "Gentle Morning Stretch",
      duration: "11 Min",
      thumbnail: "/assests/payerImage.png",
      videoUrl:
        "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/67b9b23cbe35d27f504d4bb7-p3-m41wef7__95cf3e9af7013f8c30516ea56660faae__P360.mp4",
      description:
        "Yoga is a holistic practice that blends physical postures, breath control, meditation, and ethical principles to promote overall well-being. Rooted in ancient Indian traditions, yoga offers a pathway to connect the mind, body, and spirit, fostering balance and harmony in daily life.",
    },
    {
      id: "3",
      title: "Gentle Morning Stretch",
      duration: "11 Min",
      thumbnail: "/assests/payerImage.png",
      videoUrl:
        "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/67b9b23cbe35d27f504d4bb7-p3-m41wef7__95cf3e9af7013f8c30516ea56660faae__P360.mp4",
      description:
        "Yoga is a holistic practice that blends physical postures, breath control, meditation, and ethical principles to promote overall well-being. Rooted in ancient Indian traditions, yoga offers a pathway to connect the mind, body, and spirit, fostering balance and harmony in daily life.",
    },
    {
      id: "4",
      title: "Gentle Morning Stretch",
      duration: "11 Min",
      thumbnail: "/assests/payerImage.png",
      videoUrl:
        "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/67b9b23cbe35d27f504d4bb7-p3-m41wef7__95cf3e9af7013f8c30516ea56660faae__P360.mp4",
      description:
        "Yoga is a holistic practice that blends physical postures, breath control, meditation, and ethical principles to promote overall well-being. Rooted in ancient Indian traditions, yoga offers a pathway to connect the mind, body, and spirit, fostering balance and harmony in daily life.",
    },
  ];

  const toggleLike = (id) => {
    setLikedVideos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openVideoModal = (video) => {
    setCurrentVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideo(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-6">
        {meditationVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg overflow-hidden shadow flex flex-col md:flex-row"
          >
            {/* Left Side - Thumbnail */}
            <div className="w-full md:w-1/3 h-56 sm:h-64 md:h-auto relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Side - Content */}
            <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
              {/* Title and Duration */}
              <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {video.title}
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {video.duration}
                </span>
              </div>

              {/* Description */}
              <div className="border rounded-xl p-4 mb-4">
                <h3 className="text-sm text-red-500 font-medium mb-1">
                  About this Class
                </h3>
                <p className="text-xs text-gray-700 mb-2">
                  {video.description}
                </p>
                <p className="text-xs text-gray-700">
                  Through a variety of physical poses (asanas), yoga strengthens
                  and tones the body, enhances flexibility, and improves
                  posture. The focus on conscious breathing (pranayama) helps
                  calm the nervous system, reduce stress, and increase mental
                  clarity.
                </p>
              </div>

              {/* Mobile Action Buttons */}
              <div className="md:hidden flex justify-between items-center w-full mt-2">
                <div className="flex space-x-4">
                  <button
                    onClick={() => toggleLike(video.id)}
                    className="flex items-center"
                    aria-label="Like video"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        likedVideos[video.id]
                          ? "fill-rose-500 text-rose-500"
                          : "text-rose-500"
                      }`}
                    />
                  </button>
                  <button
                    className="flex items-center"
                    aria-label="Download video"
                  >
                    <Download className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/favorite/${video.id}`}>
                    <button className="px-3 py-2 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600">
                      Details
                    </button>
                  </Link>
                  <button
                    onClick={() => openVideoModal(video)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                  >
                    Watch
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex flex-col justify-between items-center p-4 my-0 md:mb-6">
              <div className="flex space-x-6 items-center">
                <button
                  onClick={() => toggleLike(video.id)}
                  className="flex items-center"
                  aria-label="Like video"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      likedVideos[video.id]
                        ? "fill-rose-500 text-rose-500"
                        : "text-rose-500"
                    }`}
                  />
                </button>
                <button
                  className="flex items-center"
                  aria-label="Download video"
                >
                  <Download className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4 w-28">
                <Link href={`/favorite/${video.id}`} className="w-full">
                  <button className="px-4 py-3 w-full bg-red text-white rounded text-xs font-medium hover:bg-red">
                    Details
                  </button>
                </Link>
                <button
                  onClick={() => openVideoModal(video)}
                  className="px-4 py-3 w-full bg-red text-white rounded text-xs font-medium hover:bg-red"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {showModal && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-1 bg-black bg-opacity-50 rounded-full"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <div className="aspect-video bg-black">
              <video className="w-full h-full" controls autoPlay>
                <source src={currentVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
              <span className="text-sm text-gray-500">
                {currentVideo.duration}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
