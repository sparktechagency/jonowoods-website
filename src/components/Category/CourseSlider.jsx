"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { baseUrlApi } from '../../redux/baseUrl/baseUrlApi';
import Image from 'next/image';

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
        behavior: 'smooth'
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
            className={`p-2 rounded-full shadow-lg border cursor-pointer border-gray-200 transition-all duration-200 ${currentSlide === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 hover:shadow-xl text-gray-600'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide >= getMaxSlideIndex()}
            className={`p-2 rounded-full shadow-lg border cursor-pointer border-gray-200 transition-all duration-200 ${currentSlide >= getMaxSlideIndex()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 hover:shadow-xl text-gray-600'
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

          className="flex gap-6 h-[400px] overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data?.map((classItem, index) => (
            <div
              key={classItem._id || index}
              onClick={() => handleCourseClick(classItem._id)}
              className={`flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 snap-start ${classItem.background}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`${baseUrlApi}${classItem?.thumbnail}`}
                  alt={classItem.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {classItem.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {classItem.duration}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                  </div>
                </div>
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