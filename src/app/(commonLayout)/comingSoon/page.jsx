"use client";

import VideoPlayer from "@/components/VideoPlayer";
import Spinner from "../Spinner";
import { useComingSoonLatestVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";

// import Spinner from "../(commonLayout)/Spinner";
// import VideoPlayer from "../../components/VideoPlayer";
// import { useComingSoonLatestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";


const page = () => {
  const { data, isLoading } = useComingSoonLatestVideoQuery();
  return (
    <div>
      {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />
      }
    </div>
  );
};

export default page;