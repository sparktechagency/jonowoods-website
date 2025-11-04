
import { useComingSoonLatestVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";
import ComingSoonPlayer from "@/components/video-play/ComingSoorPlayer";



const page = () => {
  const { data, isLoading } = useComingSoonLatestVideoQuery();

  return (
    <div>
      {/* {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />

      } */}
      <ComingSoonPlayer/>
    </div>
  );
};

export default page;