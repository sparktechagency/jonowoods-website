"use client"
// TodaysVideo.jsx
import { useTodayLetestVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";
import { getVideoAndThumbnail } from "@/components/share/imageUrl";

export const TodaysVideo = () => {
   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = useTodayLetestVideoQuery(timezone);
  console.log("today video data ",data)

 if (!data?.data) return null;

   const image = data?.data?.thumbnailUrl
    ? getVideoAndThumbnail(data?.data?.thumbnailUrl)
    : null;
  console.log("today video image ",image)

  const title = data?.data?.title;
  console.log("today video title ",title)


  console.log(image)
  return (
    <div className="mb-4 px-4 md:px-8 lg:px-12 ">
      <h2 className="text-xl lg:text-2xl font-bold mb-2">Today's Video</h2>
      <VideoCard
        title={title}
        imageUrl={image}
        overlayText="Cooling Yoga Flow"
        route={"/today-video"}
      />
    </div>
  );
};


