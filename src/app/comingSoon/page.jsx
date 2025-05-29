"use client";

import Spinner from "../(commonLayout)/Spinner";
import VideoPlayer from "../../components/VideoPlayer";
import { useComingSoonLetestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";


const page = () => {
  const { data, isLoading } = useComingSoonLetestVideoQuery();
  return (
    <div>
      {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />
      }
    </div>
  );
};

export default page;