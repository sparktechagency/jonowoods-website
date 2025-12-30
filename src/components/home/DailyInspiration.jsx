"use client";
import { useInspirationLatestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const DailyInspiration = () => {
  const { data } = useInspirationLatestVideoQuery();

  // If no data, render nothing
  if (!data?.data) return null;

  const image = data?.data?.thumbnailUrl
    ? `https://${data?.data?.thumbnailUrl}`
    : null; // no default image

  const title = data?.data?.title;

  return (
    <section className="mb-8 px-4 md:px-8 lg:px-12">
      <h2 className="text-xl lg:text-2xl font-bold mb-4">Daily Inspiration</h2>
      <VideoCard
        title={title}
        imageUrl={image}
        route="/inspiration"
      />
    </section>
  );
};
