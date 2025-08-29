// components/ClassDetails.jsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Clock, BarChart } from "lucide-react";
import { useState } from "react";

export default function ClassDetails({ classId, onBack }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample data for the classes
  const allClasses = [
    {
      id: 1,
      title: "Cooling Yoga Flow",
      image: "/yoga-1.jpg",
      instructor: "Mia Chen",
      duration: "30 min",
      level: "Beginner",
      description:
        "This cooling yoga flow is designed to reduce heat and tension in the body. The gentle, fluid movements combined with deep breathing will help you feel refreshed and balanced.",
    },
    {
      id: 2,
      title: "Cooling Yoga Flow",
      image: "/yoga-2.jpg",
      instructor: "Sophie Kim",
      duration: "45 min",
      level: "Intermediate",
      description:
        "This cooling yoga flow is designed to reduce heat and tension in the body. The gentle, fluid movements combined with deep breathing will help you feel refreshed and balanced.",
    },
    // Add more class data as needed
  ];

  // Find the selected class
  const yogaClass = allClasses.find((c) => c.id === classId) || allClasses[0];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={yogaClass.image}
              alt={yogaClass.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-2">{yogaClass.title}</h1>
          <p className="text-gray-600 mb-4">
            Instructor: {yogaClass.instructor}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-500" />
              <span>{yogaClass.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart size={16} className="text-gray-500" />
              <span>{yogaClass.level}</span>
            </div>
          </div>

          <Button className="w-full bg-rose-500 hover:bg-rose-600 mb-4">
            Start Class
          </Button>

          <Button
            variant="outline"
            className={`w-full flex items-center justify-center gap-2 ${
              isFavorite ? "bg-rose-50 border-rose-200 text-rose-500" : ""
            }`}
            onClick={toggleFavorite}
          >
            <Heart
              size={16}
              className={isFavorite ? "fill-rose-500 text-rose-500" : ""}
            />
            {isFavorite ? "Added to favorites" : "Add to favorites"}
          </Button>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-600">{yogaClass.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
