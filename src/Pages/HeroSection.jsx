import React from "react";

const HeroSection = ({ title, description, primaryBtnText, secondaryBtnText, imageSrc }) => {
  return (
    <div className="relative w-full md:min-h-screen flex items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Background Image */}
      {imageSrc && (
        <div className="absolute inset-0">
          <img
            src={imageSrc}
            alt="Background"
            className="w-full h-full object-cover blur-sm md:blur-none" // Subtle blur for text readability
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" /> {/* Dark overlay */}
        </div>
      )}

      {/* Overlay with Content */}
      <div className="relative z-10 text-center text-white p-8 md:p-16 rounded-lg w-full max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>
        <p className="md:text-lg text-gray-300 mb-8">{description}</p>
        <div className="flex space-x-4 justify-center">
          {primaryBtnText && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              {primaryBtnText}
            </button>
          )}
          {secondaryBtnText && (
            <button className="border text-black border-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-md text-lg font-semibold transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              {secondaryBtnText}
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default HeroSection;