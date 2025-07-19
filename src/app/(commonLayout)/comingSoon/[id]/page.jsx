"use client";
import { useComingSoonLetestSingleVideoQuery } from "@/redux/featured/homeApi.jsx/homeApi";
import React from "react";
import Spinner from "../../Spinner";
import Image from "next/image";
// import { useComingSoonLetestSingleVideoQuery } from "../../../redux/featured/homeApi.jsx/homeApi";
// import Spinner from "../../(commonLayout)/Spinner";



const SingleVideoPage = ({ params }) => {
  const { id } = React.use(params);
  const { data, isLoading, isError } = useComingSoonLetestSingleVideoQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load video details.
      </div>
    );
  }

  const video = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 md:px-8">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:shadow-3xl">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 cursor-pointer px-4 py-2 my-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
        >
          {/* Arrow Icon (using Heroicons style) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.82 9.586H17a1 1 0 110 2H5.82l3.879 3.879a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
        {/* Thumbnail Banner */}
        <div className="relative">
          <Image
            src={`https://${video.thumbnailUrl}`}
            alt={video.title}
            width={100}
            height={100}
            className="w-full h-72 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-red-400 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {video.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {video.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>🕒 {video.duration}</span>
            {video.equipment.length > 0 && (
              <span>🏋️ Equipment: {video.equipment.join(", ")}</span>
            )}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {video.description ||
              "No description available for this video."}
          </p>

          {/* Video Player */}
          <div className="mt-6 rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <video
              controls
              className="w-full h-auto"
              src={`https://${video.videoUrl}`}
              poster={`https://${video.thumbnailUrl}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SingleVideoPage;