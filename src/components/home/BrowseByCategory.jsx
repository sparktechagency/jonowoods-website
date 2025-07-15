// components/BrowseByCategory.jsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BrowseByCategory({
  title,
  classes,
  onSeeMore,
  linkPath,
}) {
  console.log(classes);
  console.log(title);
  console.log(linkPath);
  console.log(onSeeMore);
  return (
    <section className="mb-10 mx-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
        {classes.map((yogaClass) => (
          <div
            key={yogaClass.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
          >
            <Link href={`${linkPath}/${yogaClass.id}`}>
              <div className="relative w-full h-full">
                {/* Image displayed on top */}
                <Image
                  src={yogaClass.image}
                  alt={yogaClass.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Gradient Overlay on top of the image */}
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

      <div className="flex justify-end mt-2">
        <Button
          variant="link"
          className="text-rose-500 hover:text-rose-600"
          onClick={onSeeMore}
        >
          See More
        </Button>
      </div>
    </section>
  );
}
