"use client";
import { useInspirationLatestVideoQuery } from "../../redux/featured/CommingSoon/commingSoonApi";
import { VideoCard } from "./VideoCard";

export const DailyInspiration = () => {
  const { data } = useInspirationLatestVideoQuery();
  console.log("daily inspiration data ",data)

  const image = `https://${data?.data?.thumbnailUrl}`;
  console.log("today video ",image)

  const title = data?.data?.title;
  console.log("today video title ",title)
  return (
    <section className="mb-8 px-4 md:px-8 lg:px-12">
      <h2 className="text-xl font-bold mb-4">Daily Inspiration</h2>
      <VideoCard
        title={title}

        imageUrl={image}
        route="/inspiration"
      />
    </section>
  );
};