// TodaysVideo.jsx
import React from "react";
import { VideoCard } from "./VideoCard";

export const TodaysVideo = () => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Today's Video</h2>
      <VideoCard
        title="Today's Video"
        imageUrl="/assests/todayVideo.png"
        overlayText="Cooling Yoga Flow"
        route = {"/today-video"}
      />
    </div>
  );
};
