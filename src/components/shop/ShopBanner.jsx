"use client";

import { useState } from "react";
import { BsFillCaretRightFill } from "react-icons/bs";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar } from "react-icons/fa";
import image15 from "../.../../../../public/assests/marijoyana.png";

const allProducts = [
  {
    id: 1,
    name: "Indica Bliss",
    price: "$50",
    description: "A premium Indica strain for relaxation.",
    image: "/assests/ourShop.png",
    rating: 4.5,
    category: "Cannabis",
  },
  {
    id: 2,
    name: "Sativa Sunrise",
    price: "$60",
    description: "A refreshing Sativa strain for energy.",
    image: "/assests/ourShop2.png",
    rating: 4.8,
    category: "Cannabis",
  },
  {
    id: 3,
    name: "Sativa Sunrise",
    price: "$60",
    description: "A refreshing Sativa strain for energy.",
    image: "/assests/ourShop2.png",
    rating: 4.8,
    category: "Cannabis",
  },
  {
    id: 4,
    name: "Hybrid Harmony",
    price: "$55",
    description: "A balanced Hybrid strain for both worlds.",
    image: "/assests/ourShop3.png",
    rating: 4.3,
    category: "Concentrates",
  },
  {
    id: 5,
    name: "Hybrid Harmony",
    price: "$55",
    description: "A balanced Hybrid strain for both worlds.",
    image: "/assests/ourShop3.png",
    rating: 4.3,
    category: "Concentrates",
  },
  {
    id: 6,
    name: "Hybrid Harmony",
    price: "$55",
    description: "A balanced Hybrid strain for both worlds.",
    image: "/assests/ourShop3.png",
    rating: 4.3,
    category: "Concentrates",
  },
  {
    id: 7,
    name: "Pure Flower",
    price: "$40",
    description: "A classic flower strain for calmness.",
    image: "/assests/ourShop3.png",
    rating: 4.7,
    category: "Flowers",
  },
  {
    id: 8,
    name: "Pure Flower",
    price: "$40",
    description: "A classic flower strain for calmness.",
    image: "/assests/ourShop3.png",
    rating: 4.7,
    category: "Flowers",
  },
  {
    id: 9,
    name: "Pure Flower",
    price: "$40",
    description: "A classic flower strain for calmness.",
    image: "/assests/ourShop3.png",
    rating: 4.7,
    category: "Flowers",
  },
  {
    id: 10,
    name: "Pre-Roll Delight",
    price: "$30",
    description: "Convenient pre-roll for easy use.",
    image: "/assests/image5.png",
    rating: 4.0,
    category: "Pre-Rolls",
  },
  {
    id: 11,
    name: "Pre-Roll Delight",
    price: "$30",
    description: "Convenient pre-roll for easy use.",
    image: "/assests/image5.png",
    rating: 4.0,
    category: "Pre-Rolls",
  },
  {
    id: 12,
    name: "Pre-Roll Delight",
    price: "$30",
    description: "Convenient pre-roll for easy use.",
    image: "/assests/image5.png",
    rating: 4.0,
    category: "Pre-Rolls",
  },
];

export default function ShopBanner() {
  const [activeTab, setActiveTab] = useState("Cannabis"); // Default active tab is "Cannabis"

  // Filter products based on the active tab
  const filteredProducts = allProducts.filter(
    (product) => product.category === activeTab
  );

  return (
    <section className="relative w-full h-[500px] bg-[#18191b] my-12">
      {/* Background Image with Opacity Layer */}
      <div className="relative w-full h-full overflow-hidden rounded-b-[50px]">
        <Image
          src={image15}
          alt="Banner Image"
          fill
          sizes="100vw"
          className="opacity-50 object-cover"
          quality={85}
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="absolute inset-0 p-10">
        {/* Title and Description */}
        <div className="flex flex-col justify-center h-full md:w-[500px]">
          <h2 className="text-4xl font-bold text-white mb-10">
            Find Your <br /> Strain
          </h2>
          <p className="text-description text-sm">
            Shop our selection of dispensary-grade, American-grown THCA flower.
            Our strains are grown indoors, harvested at peak THCA levels, and
            expertly cured to emphasize the natural aroma and flavor. Enjoy the
            highest quality at the best prices, with legal door-to-door delivery
            nationwide.
          </p>
        </div>
      </div>
    </section>
  );
}
