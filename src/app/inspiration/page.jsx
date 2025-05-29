"use client";

import VideoPlayer from "../../components/VideoPlayer";
import { useInspirationLetestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";


const page = () => {
  const { data, isLoading } = useInspirationLetestVideoQuery();
  return (
    <div>
      {
        isLoading ? <div className='h-[400px] flex justify-center items-center text-2xl font-bold'>Loading...</div> : <VideoPlayer data={data?.data} />
      }
    </div>
  );
};

export default page;