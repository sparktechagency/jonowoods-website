
import TodaysVideoPlayer from "@/components/video-play/TodayVideoPlayer";

const page = () => {
  return (
    <div>
      {/* {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />
      } */}
      <TodaysVideoPlayer/>

    </div>
  );
};

export default page;
