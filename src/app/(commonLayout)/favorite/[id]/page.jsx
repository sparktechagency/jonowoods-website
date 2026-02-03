import DetailsComponents from "@/components/favorite/details/DetailsComponents";

export const metadata = {
  title: "Yoga With Jen | Favorite",
  description: "Favorite the world of yoga and share your favorite videos with your friends.",
  keywords: [
    "yoga favorite",
    "online yoga classes",
    "yoga with jen",
    "wellness",
    "daily inspiration",
    "coming soon",
    "challenge",
    "inspiration",
    "yoga challenge",
    "yoga inspiration",
    "yoga challenge",
    "wellness and mindfulness",
    "daily yoga routine",
    "healthy lifestyle",
    "guided yoga sessions",
    "online yoga classes",
    "yoga for beginners",
    "home yoga practice",
    "wellness and mindfulness",
    "daily yoga routine",
    "healthy lifestyle",
    "guided yoga sessions",
  ],
};

const page = ({ params }) => {
  return (
    <div>
      <DetailsComponents params={params} />
    </div>
  );
};

export default page;
