"use client";

import Spinner from "../(commonLayout)/Spinner";
import VideoPlayer from "../../components/VideoPlayer";
import { useInspirationLetestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";


const page = () => {
  const { data, isLoading } = useInspirationLetestVideoQuery();
  return (
    <div>
      {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />
      }
    </div>
  );
};

export default page;