// ComingSoon.jsx
"use client";
import { useComingSoonLetestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const ComingSoon = () => {
  const { data } = useComingSoonLetestVideoQuery();
  const image = `https://${data?.data?.thumbnailUrl}`;
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
      <VideoCard
        title="Coming Soon"
        imageUrl={image}
        overlayText="Coming Soon"
        route={"/comingSoon"}
      />
    </div>
  );
};
