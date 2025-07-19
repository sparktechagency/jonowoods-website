"use client";
import { useInspirationLatestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const DailyInspiration = () => {
  const { data } = useInspirationLatestVideoQuery();
  console.log(data)
  const image = `https://${data?.data?.thumbnailUrl}`;
console.log(image)
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