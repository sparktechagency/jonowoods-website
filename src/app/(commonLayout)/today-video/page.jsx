"use client";

import Spinner from "../Spinner";
import VideoPlayer from "../../../components/VideoPlayer";
import { useTodayLetestVideoQuery } from "../../../redux/featured/CommingSoon/commingSoonApi";


const page = () => {
  const { data, isLoading } = useTodayLetestVideoQuery();
  return (
    <div>
      {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />
      }
    </div>
  );
};

export default page;