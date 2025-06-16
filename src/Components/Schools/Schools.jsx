import React, { useState } from 'react';
import Student from "../../assets/student.avif";
import { FiSearch } from 'react-icons/fi';
import { RiBox2Line } from "react-icons/ri";
import { MapPinIcon, StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import School from "../../assets/SchoolHeader.jpg";
import SchoolShow from "./SchoolShow"

const institutions = [
  { id: 1, name: "ABC High School", category: "School", location: "Nandyal", rating: 4.5, image: "https://images.unsplash.com/photo-1546410531-bb4062545585?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "XYZ College", category: "College", location: "Nandyal", rating: 4.8, image: "https://images.unsplash.com/photo-1509062522221-c42a20b78d2b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "Elite Public School", category: "School", location: "Nandyal", rating: 4.2, image: "https://images.unsplash.com/photo-1546410531-bb4062545585?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4, name: "Nandyal Degree College", category: "College", location: "Nandyal", rating: 4.7, image: "https://images.unsplash.com/photo-1509062522221-c42a20b78d2b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 5, name: "Sunrise High School", category: "School", location: "Nandyal", rating: 4.6, image: "https://images.unsplash.com/photo-1546410531-bb4062545585?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6, name: "Green Valley College", category: "College", location: "Nandyal", rating: 4.9, image: "https://images.unsplash.com/photo-1509062522221-c42a20b78d2b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

export const HomeScl = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filteredInstitutions = institutions.filter(item =>
    (category === "All" || item.category === category) &&
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">

      <div className="relative h-96 overflow-hidden rounded-b-3xl shadow-xl mx-2 md:mx-4 lg:mx-6 mb-12">
        <img src={School} alt="School Header" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Find Your Perfect Institution
          </h1>
          <p className="text-white text-lg sm:text-xl max-w-2xl animate-fade-in-up animation-delay-300">
            Discover and compare local schools and colleges to make informed decisions for your future.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 w-full">
            <img 
              src={Student}
              alt="Students Learning" 
              className="rounded-3xl  w-full h-64 md:h-96 object-cover" 
            />
          </div>
          <div className="md:w-1/2 w-full text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              Explore Our Comprehensive Schools & Colleges Section for Informed Decisions
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Discover detailed information about local schools and colleges. From curriculum to 
              admission processes, we provide everything you need to make informed choices.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-4 bg-blue-50 rounded-lg shadow-md flex flex-col items-center md:items-start text-center md:text-left">
                <RiBox2Line className="text-blue-600 text-4xl mb-3" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">Detailed Insights</h3>
                <p className="text-gray-600 text-base">Access essential details like fees, seat availability, and contact information.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg shadow-md flex flex-col items-center md:items-start text-center md:text-left">
                <RiBox2Line className="text-green-600 text-4xl mb-3" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">Get Started</h3>
                <p className="text-gray-600 text-base">Visit our Schools & Colleges section to learn more and explore options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SchoolShow/>
    </div>
  );
};