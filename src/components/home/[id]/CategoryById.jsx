import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Spinner from "../../../app/(commonLayout)/Spinner";

export default function CategoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // This would typically come from an API or context
  // Using placeholder for demonstration
  const yogaClass = {
    id: id,
    title: "Cooling Yoga Flow",
    image: "/assests/Rectangle (15).png",
    description:
      "This calming yoga flow is designed to reduce heat in the body and mind, perfect for hot days or when you're feeling overheated or stressed. The sequence combines gentle movements with cooling breath work to help you find balance and relaxation.",
  };

  if (!id) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="text-gray-600 mb-4 mx-3"
        onClick={() => router.back()}
      >
        ← Back
      </Button>

      <div className="relative h-96 mx-3 rounded-lg overflow-hidden">
        <Image
          src={yogaClass.image}
          alt={yogaClass.title}
          layout="fill"
          objectFit="cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
          }}
        />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-white text-3xl font-bold">{yogaClass.title}</h1>
        </div>
      </div>

      <div className="mt-6 mx-3">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700">{yogaClass.description}</p>

        <Button className="mt-6 bg-rose-500 hover:bg-rose-600">
          Start Practice
        </Button>
      </div>
    </div>
  );
}
