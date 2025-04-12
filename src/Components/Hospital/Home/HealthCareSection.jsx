import React from "react";
import HeaderImg from "../../../assets/Header.jpg";
import { HiArrowNarrowRight } from "react-icons/hi";
import Ambulance from "../../../assets/Ambulance.jpg";
import header3 from "../../../assets/header3.jpg"
import header from "../../../assets/HospitalHeader.jpg"
const HealthcareSection = () => {
  return (
    <div className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <p className="text-sm uppercase font-semibold text-blue-500 mb-2">
                Your Health, Our Priority
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Comprehensive Healthcare Tailored for You
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Discover a healthcare experience designed around your needs. From
                preventive care to specialized treatments, we're committed to
                your well-being.
              </p>
              <div className="flex gap-3">
                <button className="bg-transparent hover:bg-blue-500 text-blue-500 font-semibold hover:text-white py-3 px-6 border border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                  Learn More
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <img
              src={Ambulance}
              alt="Emergency Room"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <p className="text-sm uppercase font-semibold text-red-500 mb-2">
                  Immediate Care
                </p>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  24/7 Emergency Services for Urgent Care
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  When you need immediate medical attention, our dedicated
                  emergency team is here for you around the clock.
                </p>
                <button className="bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
                  Find Emergency Care
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="rounded-lg shadow-md overflow-hidden">
            <img
              src={header3}
              alt="Medical Technology"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 flex flex-col justify-between h-full">
              <p className="text-sm uppercase font-semibold text-purple-500 mb-2">
                Innovation in Healthcare
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Advancing Healthcare with Cutting-Edge Technology
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We leverage the latest medical equipment and technology to provide
                accurate diagnoses and effective treatments for a wide range of
                conditions.
              </p>
              <div className="flex gap-3">
                <button className="bg-transparent hover:bg-purple-500 text-purple-500 font-semibold hover:text-white py-3 px-6 border border-purple-500 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75">
                  Explore Technologies
                </button>
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75">
                  Our Services
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Specialized Departments for Every Health Concern
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  Our hospital features a wide array of specialized departments,
                  ensuring you receive expert care tailored to your specific
                  needs.
                </p>
                <button className="flex items-center text-blue-500 font-semibold hover:text-blue-700 focus:outline-none">
                  Learn About Departments
                  <HiArrowNarrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Compassionate and Experienced Medical Professionals
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  Our team of doctors, nurses, and support staff are dedicated to
                  providing you with the highest level of care and empathy.
                </p>
                <button className="flex items-center text-green-500 font-semibold hover:text-green-700 focus:outline-none">
                  Meet Our Team
                  <HiArrowNarrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-lg shadow-md overflow-hidden">
            <img
              src={header}
              alt="Modern Hospital Interior"
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareSection;