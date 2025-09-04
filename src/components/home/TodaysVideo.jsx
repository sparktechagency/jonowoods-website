"use client"
// TodaysVideo.jsx
import { useTodayLetestVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const TodaysVideo = () => {
  const { data } = useTodayLetestVideoQuery();
  console.log("today video data ",data)

  const image = `https://${data?.data?.thumbnailUrl}`;
  console.log("today video image ",image)

  const title = data?.data?.title;
  console.log("today video title ",title)


  console.log(image)
  return (
    <div className="mb-4 px-4 lg:px-0">
      <h2 className="text-xl font-bold mb-2">Today's Video</h2>
      <VideoCard
        title={title}
        imageUrl={image}
        overlayText="Cooling Yoga Flow"
        route={"/today-video"}
      />
    </div>
  );
};


// // TodaysVideo.jsx
// "use client";
// import { useTodayLetestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
// import { VideoCard } from "./VideoCard";

// export const TodaysVideo = () => {
//   const { data } = useTodayLetestVideoQuery();
//   const image = `https://${data?.data?.thumbnailUrl}`;
//   return (
//     <div className="mb-4">
//       <h2 className="text-xl font-bold mb-2">Today's Video</h2>
//       <VideoCard
//         title="Today's Video"
//         imageUrl={image}
//         overlayText="Cooling Yoga Flow"
//         route={"/today-video"}
//       />
//     </div>
//   );
// };
