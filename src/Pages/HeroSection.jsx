import React from "react";

const HeroSection = ({ title, description, primaryBtnText, secondaryBtnText, imageSrc }) => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      {/* Background Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay with Content */}
      <div className="relative z-10 text-center text-white bg-black bg-opacity-50 p-8 rounded-lg w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">{description}</p>
        <div className="flex space-x-4 justify-center">
          <button className="bg-white text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition duration-300">
            {primaryBtnText}
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-black transition duration-300">
            {secondaryBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
