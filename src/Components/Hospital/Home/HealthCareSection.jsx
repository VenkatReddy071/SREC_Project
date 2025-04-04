import React from "react";
import HeaderImg from "../../../assets/Header.jpg";
import { HiArrowNarrowRight } from "react-icons/hi";

const HealthcareSection = () => {
  return (
    <div className="md:grid md:gap-6 md:p-6 p-4 max-w-7xl mx-auto">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gird-rows-2 gap-6">
        <div className="border border-gray-300 p-6 flex flex-col justify-between">
          <p className="text-xs uppercase font-semibold text-gray-500">Tagline</p>
          <h2 className="text-2xl font-bold my-3">
            Comprehensive Healthcare Tailored for You
          </h2>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 text-black font-semibold rounded border-2 border-black">Learn More</button>
            <button className="px-4 py-2 font-semibold rounded">Sign Up</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2  grid-rows-2 gap-3">
        <img src={HeaderImg} alt="Emergency Room" className="w-full h-full object-cover rounded-lg" />
        <div className="border border-gray-300 p-6">
          <p className="text-xs uppercase font-semibold text-gray-500">Tagline</p>
          <h2 className="text-lg font-bold my-2">24/7 Emergency Services for Urgent Care</h2>
          <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <button className="mt-3 px-4 py-2 border border-black font-semibold rounded">Button</button>
        </div>
      </div>
      </div>

      {/* Middle Section */}
      <div className="grid md:grid-cols-2 gird-rows-2 gap-6 mt-4">
        <div className="">
          <img src={HeaderImg} alt="Medical Technology" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="border border-gray-300 p-6 flex flex-col justify-between">
          <p className="text-xs uppercase font-semibold text-gray-500">Tagline</p>
          <h2 className="text-3xl font-bold my-3">Medium length section heading goes here</h2>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 border border-black font-semibold rounded">Button</button>
            <button className="px-4 py-2 border border-black font-semibold rounded">Button</button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 grid-rows-2 gap-6">
        <div className="grid md:grid-cols-2 grid-rows-2">
        <div className="border border-gray-300 p-6 flex flex-col justify-between shadow-sm">
          <h2 className="text-xl font-bold mt-3">Specialized Departments for Every Health Concern</h2>
          <p className="text-gray-600 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <button className="mt-4 flex items-center text-black font-semibold">
            Button <HiArrowNarrowRight className="ml-2 w-4 h-4" />
          </button>
          </div>
          <div className="border border-gray-300 p-6 flex flex-col justify-between shadow-sm">
          <h2 className="text-xl font-bold mt-3">State-of-the-Art Medical Equipment and Technology</h2>
          <p className="text-gray-600 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <button className="mt-4 flex items-center text-black font-semibold">
            Button <HiArrowNarrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
        </div>

        <img src={HeaderImg} alt="Emergency Room" className="w-full md:h-full h-72 object-cover rounded-lg" />
        
      </div>

      {/* Full-Width Bottom Image */}
     
    </div>
  );
};

export default HealthcareSection;
