"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSingleVidoeQuery } from '@/redux/featured/homeApi.jsx/homeApi';
import Spinner from '../../../../Spinner';
import VideoPlayer from '@/components/VideoPlayer';

const CourseVideoItemPage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: videoData, isLoading: videoLoading } = useSingleVidoeQuery(id, { skip: !id });
  console.log(videoData)

  
  useEffect(() => {
    if (videoData) {
      setIsLoading(false);
    }
  }, [videoData]);

  if (videoLoading || isLoading) return <Spinner />;
  
  if (!videoData?.data) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Video not found</h3>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const video = videoData.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{video.title}</h1>
        <p className="text-gray-600 mb-4">{video.duration}</p>
      </div>
      
      <VideoPlayer 
        videoUrl={`https://${video.videoUrl}`}
        thumbnailUrl={`https://${video.thumbnailUrl}`}
        title={video.title}
        autoPlay={true}
        controls={true}
        className="mb-8"
      />

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700">{video.description}</p>
        
        {video.equipment && video.equipment.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Equipment Needed</h3>
            <ul className="list-disc pl-5">
              {video.equipment.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseVideoItemPage;