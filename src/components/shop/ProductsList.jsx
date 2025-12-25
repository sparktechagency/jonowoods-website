"use client";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";

// Sample product data
const products = [
  {
    id: 1,
    name: "Vice City",
    description:
      "Whether you seek inspiration or relaxation, Vice City transports you to a laid-back, euphoric state, blending creativity and calm for the ultimate experience.",
    price: 107.44,
    image: "/assests/ourShop2.png",
    moodTags: ["Chill"],
    potency: "High",
    inStock: true,
  },
  {
    id: 2,
    name: "Beaf",
    description:
      "Your ticket to a mellow escape, this soothing THCa flower sends you on a smooth, euphoric journey that'll leave you as relaxed as a Sunday afternoon.",
    price: 109.97,
    image: "/assests/ourShop.png",
    moodTags: ["Soothing"],
    potency: "Medium",
    inStock: false,
  },
  {
    id: 3,
    name: "Kabab",
    description:
      "Your ticket to a mellow escape, this soothing THCa flower sends you on a smooth, euphoric journey that'll leave you as relaxed as a Sunday afternoon.",
    price: 109.97,
    image: "/assests/fresh-food.jpg",
    moodTags: ["Soothing"],
    potency: "Medium",
    inStock: false,
  },
  {
    id: 4,
    name: "Kacchi",
    description:
      "Your ticket to a mellow escape, this soothing THCa flower sends you on a smooth, euphoric journey that'll leave you as relaxed as a Sunday afternoon.",
    price: 109.97,
    image: "/assests/ourShop3.png",
    moodTags: ["Soothing"],
    potency: "Medium",
    inStock: false,
  },
  // Add more products here...
];

// Available filter options
const allMoodTags = [
  "Chill",
  "Soothing",
  "Euphoric",
  "Creative",
  "Happy",
  "Social",
];
const potencyOptions = ["High", "Medium"];

export default function ProductsList() {
  const [filteredPotency, setFilteredPotency] = useState(null);
  const [selectedMoodTags, setSelectedMoodTags] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [gridCols, setGridCols] = useState(4);

  // Toggle mood tag selection
  const toggleMoodTag = (tag) => {
    setSelectedMoodTags((prevSelected) => {
      const isSelected = prevSelected.includes(tag);
      if (isSelected) {
        // Remove the tag if already selected
        return prevSelected.filter((item) => item !== tag);
      } else {
        // Add the tag if not selected
        return [...prevSelected, tag];
      }
    });
  };

  // Filter products by selected criteria
  const filteredProducts = products.filter((product) => {
    const matchesPotency =
      !filteredPotency || product.potency === filteredPotency;
    const matchesMoodTag =
      selectedMoodTags.length === 0 ||
      selectedMoodTags.some((tag) => product.moodTags.includes(tag));
    return matchesPotency && matchesMoodTag;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "popularity") return a.id - b.id;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="text-white min-h-screen mx-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Showing All Products</h2>
        {/* Sorting */}
        <div>
          <h3 className="mb-2">Sort By:</h3>
          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-black border-gray-700">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-gray-700">
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtering Section */}
      <div className="mb-8 flex justify-between items-start">
        {/* View Section */}
        <div className="mb-4">
          <h3 className="mb-2">View:</h3>
          <div className="flex space-x-2">
            <Button
              className={`bg-black border ${
                gridCols === 3 ? "border-2" : "border"
              }`}
              onClick={() => setGridCols(3)}
            >
              3
            </Button>
            <Button
              className={`bg-black border ${
                gridCols === 4 ? "border-2" : "border"
              }`}
              onClick={() => setGridCols(4)}
            >
              4
            </Button>
          </div>
        </div>

        {/* Potency Filter */}
        <div className="mb-4">
          <h3 className="mb-2">Filter by Potency:</h3>
          <div className="flex space-x-2">
            {potencyOptions.map((potency) => (
              <Button
                key={potency}
                className={`bg-black border ${
                  filteredPotency === potency ? "border-2" : "border"
                }`}
                onClick={() =>
                  setFilteredPotency(
                    filteredPotency === potency ? null : potency
                  )
                }
              >
                {potency}
              </Button>
            ))}
          </div>
        </div>

        {/* Mood Tags Filter */}
        <div className="mb-4 hidden lg:block">
          <h3 className="mb-2">Filter by Mood:</h3>
          <div className="flex flex-wrap gap-2">
            {allMoodTags.map((tag) => (
              <Button
                key={tag}
                className={`bg-black border ${
                  selectedMoodTags.includes(tag) ? "border-2" : "border"
                }`}
                onClick={() => toggleMoodTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Tags Filter */}
      <div className="mb-4 block lg:hidden">
        <h3 className="mb-2">Filter by Mood:</h3>
        <div className="flex flex-wrap gap-2">
          {allMoodTags.map((tag) => (
            <Button
              key={tag}
              className={`bg-black border ${
                selectedMoodTags.includes(tag) ? "border-2" : "border"
              }`}
              onClick={() => toggleMoodTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:${
            gridCols === 3 ? "grid-cols-3 gap-10" : "grid-cols-4"
          } gap-6`}
        >
          {sortedProducts.map((product) => (
            <Link
              href={`/shop/${product.id}`}
              key={product.id}
              className="block"
            >
              <div className="rounded-lg overflow-hidden border-2 border-[#2E2E2EF5] transition-all">
                <div className="relative">
                  {/* Mood Tags */}
                  <div className="absolute top-2 left-2 z-10">
                    {product.moodTags.map((tag) => (
                      <Badge key={tag} className="mr-2">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Sold Out Badge */}
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 text-xs font-bold rounded">
                      SOLD OUT
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="aspect-square flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      height={150}
                      width={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="w-full rounded-xl object-contain"
                      quality={85}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="px-4 py-2">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {product.potency}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
