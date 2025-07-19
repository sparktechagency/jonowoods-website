import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JoinChallengePage() {
  const router = useRouter();

  // Sample data for challenges
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
    { id: 7, title: "Cooling Yoga Flow", image: "/assests/Rectangle (15).png" },
    { id: 8, title: "Cooling Yoga Flow", image: "/assests/Rectangle (7).png" },
    { id: 9, title: "Cooling Yoga Flow", image: "/assests/Rectangle (9).png" },
    {
      id: 10,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (11).png",
    },
    {
      id: 11,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (12).png",
    },
    {
      id: 12,
      title: "Cooling Yoga Flow",
      image: "/assests/Rectangle (13).png",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6 mx-3">
        <Button
          variant="ghost"
          className="text-gray-600"
          onClick={() => router.back()}
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold ml-2">Join a Challenge</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 mx-3">
        {challengeClasses.map((yogaClass) => (
          <div
            key={yogaClass.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
          >
            <Link href={`challenge/${yogaClass.id}`}>
              <div className="relative w-full h-full">
                <Image
                  src={yogaClass.image}
                  alt={yogaClass.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #FFFFFF00, #FFFFFF00, #A92C2C)",
                  }}
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">
                    {yogaClass.title}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
