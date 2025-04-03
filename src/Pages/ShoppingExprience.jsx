import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ShoppingExperience = ({ title, description, images }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-black px-6 py-12 relative">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold">Discover</h3>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">{title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">{description}</p>
      </div>

      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
          onClick={scrollLeft}
        >
          <FaChevronLeft size={24} />
        </button>

        <div ref={scrollRef} className="flex overflow-hidden space-x-4 scrollbar-hide scroll-smooth">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Store ${index + 1}`}
              className="w-72 h-48 bg-gray-300 rounded-lg shadow-lg object-cover"
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
          onClick={scrollRight}
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ShoppingExperience;
