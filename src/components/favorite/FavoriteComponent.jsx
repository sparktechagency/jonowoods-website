// pages/index.js
"use client";
import { useFavouriteVideoListQuery } from "@/redux/featured/favouriteVideo/favouriteVideoApi";
import { Download, Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Spinner from "../../app/(commonLayout)/Spinner";
import { useVideoFavouriteMutation } from "../../redux/featured/favouritApi/favouritApi";
import { getVideoAndThumbnail } from "../share/imageUrl";

export default function FavoriteComponents() {
  const [favorite, { isLoading: isFavouriteLoading }] = useVideoFavouriteMutation();

  const { data, isLoading } = useFavouriteVideoListQuery();
  const favouriteVideos = data?.data?.favouritList || [];
  console.log(favouriteVideos);
  const pagination = data?.data?.meta || {};

  const [likedVideos, setLikedVideos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const toggleLike = async (id) => {
    // try {
    //   await favorite(id).unwrap();
    // } catch (error) {
    //   console.log(error);
    // }
    console.log(id);
  };

  const openVideoModal = (video) => {
    setCurrentVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideo(null);
  };

  // Helper function to handle null videoId entries
  const isValidVideo = (favoriteItem) => {
    return favoriteItem && favoriteItem.videoId !== null;
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-6">
        {favouriteVideos.map(
          (favorite) =>
            isValidVideo(favorite) && (
              <div
                key={favorite._id}
                className="bg-white rounded-lg overflow-hidden shadow flex flex-col md:flex-row"
              >
                {/* Left Side - Thumbnail */}
                <div className="w-full md:w-1/3 h-56 sm:h-64 md:h-80 relative">
                  <Image
                    src={getVideoAndThumbnail(favorite.videoId.thumbnailUrl)}
                    alt={favorite.videoId.title}
                    height={200}
                    width={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Side - Content */}
                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                  {/* Title and Duration */}
                  <div className="mb-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      {favorite.videoId.title}
                    </h2>
                    <span className="text-sm font-medium text-gray-500">
                      {favorite.videoId.duration}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-gray-100">
                      {favorite.videoId.type}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="border rounded-xl p-4 mb-4">
                    <h3 className="text-sm text-red-500 font-medium mb-1">
                      About this Class
                    </h3>
                    <p className="text-xs text-gray-700 mb-2">
                      Yoga is a holistic practice that blends physical postures,
                      breath control, meditation, and ethical principles to
                      promote overall well-being.
                    </p>
                    <p className="text-xs text-gray-700">
                      Through a variety of physical poses (asanas), yoga
                      strengthens and tones the body, enhances flexibility, and
                      improves posture. The focus on conscious breathing
                      (pranayama) helps calm the nervous system, reduce stress,
                      and increase mental clarity.
                    </p>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="md:hidden flex justify-between items-center w-full mt-2">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => toggleLike(favorite?.videoId?._id)}
                        className="flex items-center"
                        aria-label="Like video"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorite.liked || likedVideos[favorite._id]
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
                      <Link href={`/favorite/${favorite.videoId._id}`}>
                        <button className="px-3 py-2 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600">
                          Details
                        </button>
                      </Link>
                      <button
                        onClick={() =>
                          openVideoModal({
                            ...favorite.videoId,
                            videoUrl:
                              "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/67b9b23cbe35d27f504d4bb7-p3-m41wef7__95cf3e9af7013f8c30516ea56660faae__P360.mp4", // Placeholder URL
                          })
                        }
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
                      onClick={() => toggleLike(favorite._id)}
                      className="flex items-center"
                      aria-label="Like video"
                    >
                      <Heart
                        className={`h-5 w-5 ${favorite.liked || likedVideos[favorite._id]
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
                    <Link
                      href={`/favorite/${favorite.videoId._id}`}
                      className="w-full"
                    >
                      <button className="px-4 py-3 w-full bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600">
                        Details
                      </button>
                    </Link>
                    <button
                      onClick={() =>
                        openVideoModal({
                          ...favorite.videoId,
                          videoUrl:
                            "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rTl3vg0veiylgd0ih/67b9b23cbe35d27f504d4bb7-p3-m41wef7__95cf3e9af7013f8c30516ea56660faae__P360.mp4", // Placeholder URL
                        })
                      }
                      className="px-4 py-3 w-full bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            )
        )}
      </div>

      {/* Empty state when no favorites are available */}
      {favouriteVideos.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">
            No favorite videos found
          </h3>
          <p className="text-gray-500 mt-2">
            Add videos to your favorites to see them here
          </p>
        </div>
      )}

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

      {/* Pagination component if needed */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            {Array.from({ length: pagination.totalPage }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${pagination.page === i + 1
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
