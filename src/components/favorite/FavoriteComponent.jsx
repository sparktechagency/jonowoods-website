// pages/index.js
"use client";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "../../app/(commonLayout)/Spinner";
import { getVideoAndThumbnail } from "../share/imageUrl";
import { useVideoFavoriteMutation } from "@/redux/featured/favoriteApi/favoriteApi";
import { useFavoriteVideoListQuery } from "@/redux/featured/favoriteVideo/favoriteVideoApi";

export default function FavoriteComponents() {
  const router = useRouter();
  const [favorite, { isLoading: isFavoriteLoading }] = useVideoFavoriteMutation();
  const { data, isLoading, isError, refetch } = useFavoriteVideoListQuery();

  const [likedVideos, setLikedVideos] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const favoriteVideos = data?.data?.favoriteList || [];
  const pagination = data?.data?.meta || {};
  console.log(favoriteVideos)

  console.log(favoriteVideos)

  const toggleLike = async (id) => {
    try {
      setErrorMessage('');
      await favorite(id).unwrap();
      // No need for manual refetch - RTK Query will auto-invalidate cache
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setErrorMessage('Failed to update favorite. Please try again.');
    }
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700">
          Error loading favorite videos
        </h3>
        <p className="text-gray-500 mt-2">
          Please try refreshing the page or check your connection
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">My favorite Videos</h1>

      <div className="grid grid-cols-1 gap-6">
        {favoriteVideos.length > 0 ? (
          favoriteVideos.map(
            (favorite) =>
              isValidVideo(favorite) && (
                <div
                  key={favorite._id}
                  className="bg-white rounded-lg overflow-hidden shadow flex flex-col md:flex-row"
                >
                  {/* Left Side - Thumbnail */}
                  <div className="w-full md:w-1/3 h-56 sm:h-64 md:h-80 relative">
                    {favorite.videoId.thumbnailUrl ? (
                      <Image
                        src={getVideoAndThumbnail(favorite.videoId.thumbnailUrl)}
                        alt={favorite.videoId.title || 'favorite video thumbnail'}
                        height={200}
                        width={300}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-thumbnail.jpg'; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No favorite Video available</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Content */}
                  <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                    {/* Title and Duration */}
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        Title: {favorite.videoId.title || 'Untitled Video'}
                      </h2>
                      Duration: {favorite.videoId.duration && (
                        <span className="text-sm font-medium text-gray-500">
                          {favorite.videoId.duration}
                        </span>
                      )}
                      {/* {favorite.videoId.type && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded bg-gray-100">
                          {favorite.videoId.type}
                        </span>
                      )} */}
                    </div>

                    {/* Description */}
                    <div className="border rounded-xl p-4 mb-4">
                      <h3 className="text-sm text-red-500 font-medium mb-1">
                        About this Class
                      </h3>
                      {favorite.videoId.description ? (
                        <p className="text-xs text-gray-700">
                          {favorite.videoId.description}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 italic">
                          No description available
                        </p>
                      )}
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="md:hidden flex justify-between items-center w-full mt-2">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => toggleLike(favorite?.videoId?._id)}
                          className="flex items-center"
                          aria-label="Like video"
                          disabled={isFavoriteLoading}
                        >
                          <Heart
                            className={`h-5 w-5 ${favorite.liked || likedVideos[favorite._id]
                              ? "fill-rose-500 text-rose-500"
                              : "text-rose-500"
                              }`}
                          />
                        </button>
                        {/* <button
                          className="flex items-center"
                          aria-label="Download video"
                        >
                          <Download className="h-5 w-5 text-gray-500" />
                        </button> */}
                      </div>
                      <div className="flex space-x-2">
                        {favorite.videoId._id && (
                          <Link href={`/categories/class/${favorite.videoId._id}`}>
                            <button className="px-3 py-2 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600">
                              Details
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => router.push(`/categories/class/${favorite.videoId._id}`)}
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
                        onClick={() => toggleLike(favorite?.videoId?._id)}
                        className="flex items-center"
                        aria-label="Like video"
                        disabled={isFavoriteLoading}
                      >

                        <Heart
                          className={`h-5 cursor-pointer w-5 ${favorite.liked || likedVideos[favorite._id]
                            ? "fill-rose-500 text-rose-500"
                            : "text-rose-500"
                            }`}
                        />

                      </button>
                      {/* <button
                        className="flex items-center"
                        aria-label="Download video"
                      >
                        <Download className="h-5 w-5 text-gray-500" />
                      </button> */}
                    </div>

                    <div className="flex flex-col gap-4 w-28">
                      {favorite.videoId._id && (
                        <Link
                          href={`/categories/class/${favorite.videoId._id}`}
                          className="w-full"
                        >
                          <button className="px-4 py-3 cursor-pointer w-full bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600">
                            Details
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => router.push(`/categories/class/${favorite.videoId._id}`)}
                        className="px-4 py-3 w-full cursor-pointer bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                      >
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              )
          )
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
              <Heart className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No favorite videos yet
            </h3>
            <p className="text-gray-500 mt-2">
              You haven't added any videos to your favorites. Start exploring and add some!
            </p>
            <Link href="/explore">

              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Browse Videos
              </button>
            </Link>
          </div>
        )}
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
              {currentVideo.videoUrl ? (
                <video className="w-full h-full" controls autoPlay>
                  <source src={currentVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  Video not available
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{currentVideo.title || 'Untitled Video'}</h2>
              {currentVideo.duration && (
                <span className="text-sm text-gray-500">
                  {currentVideo.duration}
                </span>
              )}
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