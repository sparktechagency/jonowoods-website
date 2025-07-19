// pages/index.js (HomePage)
import BrowseByCategory from "@/components/BrowseByCategory";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  // Sample data
  const allCategories = [
    {
      id: 1,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (15).png",
    },
    { id: 2, title: "Cooling Yoga Flow", image: "/assests/Rectangle (7).png" },
    { id: 3, title: "Cooling Yoga Flow", image: "/assests/Rectangle (9).png" },
    { id: 4, title: "Cooling Yoga Flow", image: "/assests/Rectangle (11).png" },
    { id: 5, title: "Cooling Yoga Flow", image: "/assests/Rectangle (12).png" },
    { id: 6, title: "Cooling Yoga Flow", image: "/assests/Rectangle (13).png" },
  ];

  const challengeClasses = [
    {
      id: 1,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (15).png",
    },
    { id: 2, title: "Cooling Yoga Flow", image: "/assests/Rectangle (7).png" },
    { id: 3, title: "Cooling Yoga Flow", image: "/assests/Rectangle (9).png" },
    { id: 4, title: "Cooling Yoga Flow", image: "/assests/Rectangle (11).png" },
    { id: 5, title: "Cooling Yoga Flow", image: "/assests/Rectangle (12).png" },
    { id: 6, title: "Cooling Yoga Flow", image: "/assests/Rectangle (13).png" },
  ];

  const handleAllCategoriesSeeMore = () => {
    router.push("/all-categories");
  };

  const handleChallengeSeeMore = () => {
    router.push("/join-challenge");
  };

  return (
    <div className="container mx-auto py-6">
      <BrowseByCategory
        title="All Categories"
        classes={allCategories}
        onSeeMore={handleAllCategoriesSeeMore}
        linkPath="/category"
      />

      <BrowseByCategory
        title="Join a Challenge"
        classes={challengeClasses}
        onSeeMore={handleChallengeSeeMore}
        linkPath="challenge"
      />
    </div>
  );
}
