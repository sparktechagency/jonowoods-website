"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { baseUrlApi } from "../../redux/baseUrl/baseUrlApi";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";

const CourseSlider = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter();

  const getVisibleCards = () => {
    const container = containerRef.current;
    if (!container) return 1;

    const containerWidth = container.clientWidth;
    const cardWidth = 320 + 24; // 320px card width + 24px gap
    return Math.floor(containerWidth / cardWidth);
  };

  const getMaxSlideIndex = () => {
    const visibleCards = getVisibleCards();
    return Math.max(0, data.length - visibleCards);
  };

  const scrollToSlide = (index) => {
    const container = containerRef.current;
    if (container) {
      const slideWidth = 320 + 24; // 320px card width + 24px gap
      const clampedIndex = Math.min(index, getMaxSlideIndex());
      container.scrollTo({
        left: slideWidth * clampedIndex,
        behavior: "smooth",
      });
      setCurrentSlide(clampedIndex);
    }
  };

  const nextSlide = () => {
    const visibleCards = getVisibleCards();
    const maxIndex = getMaxSlideIndex();
    const nextIndex = Math.min(currentSlide + visibleCards, maxIndex);
    scrollToSlide(nextIndex);
  };

  const prevSlide = () => {
    const visibleCards = getVisibleCards();
    const prevIndex = Math.max(currentSlide - visibleCards, 0);
    scrollToSlide(prevIndex);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const slideWidth = 320 + 24; // 320px card width + 24px gap
      const newIndex = Math.round(container.scrollLeft / slideWidth);
      const maxIndex = getMaxSlideIndex();
      const clampedIndex = Math.min(Math.max(newIndex, 0), maxIndex);
      if (clampedIndex !== currentSlide) {
        setCurrentSlide(clampedIndex);
      }
    }
  };

  const handleCourseClick = (courseId) => {
    // Use the correct path for Next.js App Router with route groups
    router.push(`/categories/courses/${courseId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Courses</h2>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`p-2 rounded-full shadow-lg border cursor-pointer border-gray-200 transition-all duration-200 ${
              currentSlide === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 hover:shadow-xl text-gray-600"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide >= getMaxSlideIndex()}
            className={`p-2 rounded-full shadow-lg border cursor-pointer border-gray-200 transition-all duration-200 ${
              currentSlide >= getMaxSlideIndex()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 hover:shadow-xl text-gray-600"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Classes Slider */}
      <div className="relative">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-6 h-[460px] overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data?.map((classItem, index) => (
            <div
              key={classItem._id || index}
              className="flex-shrink-0 w-80 snap-start"
            >
              {/* Image (clickable) */}
              <div
                onClick={() => handleCourseClick(classItem._id)}
                className="w-full h-90 overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={getImageUrl(classItem?.thumbnail)}
                  alt={classItem.name}
                  width={100}
                  height={100}
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="w-full h-full object-cover rounded-md"
                  quality={85}
                  loading="lazy"
                />
              </div>

              {/* Title & duration below the image */}
              <div className="mt-3 px-1">
                <h3 className="text-gray-900 text-lg font-semibold leading-tight">
                  {classItem.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {classItem.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CourseSlider;
