"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React from "react";

// Sample product data
const products = [
  {
    id: 1,
    name: "Vice City",
    description: "A premium hybrid strain for relaxation and creativity.",
    longDescription:
      "Vice City is known for its balanced effects, combining mental stimulation and physical relaxation.",
    price: 107.44,
    image: "/assests/ourShop.png",
    moodTags: ["Chill"],
    potency: "High",
    inStock: true,
    thc: "22%",
    cbd: "0.5%",
    weight: "3.5g",
    strain: "Hybrid",
    terpenes: ["Myrcene", "Limonene"],
    effects: ["Relaxed", "Creative"],
    reviews: [
      {
        name: "Alex Brown",
        profilePic: "/assests/profile.png",
        rating: 3,
        review: "Decent, but not as relaxing as I expected.",
      },
      {
        name: "John Doe",
        profilePic: "/assests/profile2.jpg",
        rating: 4,
        review: "Great product! Very relaxing and creative effects.",
      },
      {
        name: "Jane Smith",
        profilePic: "/assests/profile.png",
        rating: 5,
        review: "Amazing! Exactly what I needed for creativity and relaxation.",
      },
    ],
  },
  {
    id: 2,
    name: "Zkittles",
    description: "A soothing indica-dominant strain for relaxation.",
    longDescription:
      "Zkittles delivers a deeply relaxing experience with sweet, fruity flavors.",
    price: 109.97,
    image: "/assests/ourShop2.png",
    moodTags: ["Soothing"],
    potency: "Medium",
    inStock: false,
    thc: "18%",
    cbd: "1%",
    weight: "3.5g",
    strain: "Indica",
    terpenes: ["Caryophyllene", "Linalool"],
    effects: ["Relaxed", "Euphoric"],
    reviews: [
      {
        name: "John Doe",
        profilePic: "/assests/profile1.png",
        rating: 4,
        review: "Great product! Very relaxing and creative effects.",
      },
      {
        name: "Jane Smith",
        profilePic: "/assests/profile2.png",
        rating: 5,
        review: "Amazing! Exactly what I needed for creativity and relaxation.",
      },
    ],
  },
];

// Similar products
const similarProducts = [
  {
    id: 3,
    name: "Purple Haze",
    price: 112.99,
    image: "/assests/ourShop2.png",
    moodTags: ["Creative"],
    potency: "High",
    inStock: true,
  },
  {
    id: 4,
    name: "Zkittles",
    price: 107.57,
    image: "/assests/ourShop3.png",
    moodTags: ["Happy"],
    potency: "Medium",
    inStock: false,
  },
  {
    id: 5,
    name: "Zkittles",
    price: 107.57,
    image: "/assests/ourShop3.png",
    moodTags: ["Happy"],
    potency: "Medium",
    inStock: false,
  },
];

export default function ProductDetails({ params }) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Find the product by ID
  const product = products.find((p) => p.id === parseInt(id)) || products[0];

  // Handle quantity changes
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className=" text-white mb-10 md:mt-32">
     
  

      {/* Breadcrumb */}
      <div className="">
       

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="  rounded-lg overflow-hidden mb-2">
              <Image
                src={product.image}
                alt={product.name}
                height={300}
                width={300}
                className="w-full h-full  object-contain p-4"
              />
            </div>
            <p className="text-description mb-6">{product.description}</p>
          </div>

          {/* Product Info */}
          <div className="mx-4">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-8">
              <div className="text-3xl font-bold text-yellow-500">
                ${product.price.toFixed(2)}
              </div>
              {!product.inStock && (
                <Badge className="ml-4 px-3 py-1 bg-white text-black">
                  Sold Out
                </Badge>
              )}
            </div>
            <p className="text-description mb-6">{product.description}</p>

            {/* Product Specifications */}
            <div className="">
              <div className="flex gap-5 items-center rounded p-3">
                <div className="text-white text-sm">Mood : </div>
                {product.moodTags.map((tag) => (
                  <Badge key={tag} className="px-4 py-1 rounded-full ">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-5 items-center rounded p-3">
                <div className="text-white text-sm">Potency : </div>
                <div className="font-bold">{product.potency}</div>
              </div>
              <div className="flex gap-5 items-center rounded p-3">
                <div className="text-white text-sm">THC : </div>
                <div className="font-bold">{product.thc}</div>
              </div>
              <div className="flex gap-5 items-center rounded  p-3">
                <div className="text-white text-sm">CBD : </div>
                <div className="font-bold">{product.cbd}</div>
              </div>
              <div className="flex gap-5 items-center rounded p-3">
                <div className="text-white text-sm">Weight : </div>
                <div className="font-bold">{product.weight}</div>
              </div>
              <div className="flex gap-5 items-center rounded p-3">
                <div className="text-white text-sm">Strain : </div>
                <div className="font-bold">{product.strain}</div>
              </div>
            </div>

            {/* Add to Cart */}
            {product.inStock ? (
              <div className="flex space-x-4">
                <div className="flex border border-gray-800 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="px-4  text-xl font-bold hover:bg-gray-900"
                  >
                    -
                  </button>
                  <div className="flex-1 flex items-center justify-center px-4  min-w-[60px]">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    className="px-4  text-xl font-bold hover:bg-gray-900"
                  >
                    +
                  </button>
                </div>
                <Button className="bg-button py-8">
                  Buy Now - ${(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            ) : (
              <Button
                disabled
                className="bg-gray-700 text-white px-6 py-6 w-full opacity-60"
              >
                SOLD OUT
              </Button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 mx-4">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <hr
            className="border-t"
            style={{
              borderColor: "#2E2E2EF5",
              marginTop: "1rem",
              marginbottom: "1rem",
            }}
          />
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className=" space-x-4 border-b border-[#2E2E2EF5] my-3"
              >
                <div className="flex gap-5 mb-3">
                  <Image
                    src={review.profilePic}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="">
                    <div className="font-semibold">{review.name}</div>
                    <div className="flex items-center space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <span key={i} className="text-white">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-description mb-2">{review.review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12 mx-4">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {similarProducts.map((product) => (
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
                        className="w-full rounded-xl object-contain"
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
    </div>
  );
}
