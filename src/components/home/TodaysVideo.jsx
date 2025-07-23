"use client"
// TodaysVideo.jsx
import { useTodayLetestVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const TodaysVideo = () => {
  const { data } = useTodayLetestVideoQuery();
  const image = `https://${data?.data?.thumbnailUrl}`;
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Today's Video</h2>
      <VideoCard
        title="Today's Video"
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
