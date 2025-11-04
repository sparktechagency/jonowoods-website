
import TodaysVideoPlayer from "@/components/video-play/TodayVideoPlayer";

const page = () => {
  return (
    <div>
      {/* {
        isLoading ? <Spinner /> : <VideoPlayer data={data?.data} />
      } */}
      <TodaysVideoPlayer/>
      {/* <div className="container mx-auto px-4 h-96">
        <UniversalVideoPlayer
          video={data?.data}
          autoplay={false}
          showControls={true}
          muted={true}
          aspectRatio="16:9"
          style={{ width: "100%", height: "auto" }}
          className="rounded-lg shadow-lg"
          watermark={{ text: "Yoga With Jen", position: "top-right" }}
        />
      </div> */}
    </div>
  );
};

export default page;
