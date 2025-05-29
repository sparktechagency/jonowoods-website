"use client";
import { useInspirationLetestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const DailyInspiration = () => {
  const { data } = useInspirationLetestVideoQuery();
  const image = `https://${data?.data?.thumbnailUrl}`;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Daily Inspiration</h2>
      <VideoCard
        title="Cooling Yoga Flow"
        imageUrl={image}
        route="/inspiration"
      />
    </section>
  );
};