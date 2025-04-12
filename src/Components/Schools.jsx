import React, { useState } from 'react';
import HeaderImg from "../assets/header.jpg";
import { FiSearch } from 'react-icons/fi';
import { RiBox2Line } from "react-icons/ri";
import School from "../assets/SchoolHeader.jpg"
// Sample Data
const institutions = [
  { id: 1, name: "ABC High School", category: "School", location: "Nandyal", rating: 4.5 },
  { id: 2, name: "XYZ College", category: "College", location: "Nandyal", rating: 4.8 },
  { id: 3, name: "Elite Public School", category: "School", location: "Nandyal", rating: 4.2 },
  { id: 4, name: "Nandyal Degree College", category: "College", location: "Nandyal", rating: 4.7 },
  { id: 5, name: "Sunrise High School", category: "School", location: "Nandyal", rating: 4.6 },
  { id: 6, name: "Green Valley College", category: "College", location: "Nandyal", rating: 4.9 }
];

export const HomeScl = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  // Filtered Results
  const filteredInstitutions = institutions.filter(item =>
    (category === "All" || item.category === category) &&
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      {/* Header Image */}
      <div className="relative  m-2">
        <img src={School} alt="Header" className="w-full h-60 object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <h1 className="text-white text-3xl font-bold text-center">Find Your Perfect Institution</h1>
        </div>
      </div>
      <div className="md:flex p-6 md:items-center md:gap-6 w-full">
        <div className="md:w-1/2 w-full bg-gray-200 h-60 flex justify-center items-center">
          <img src="https://via.placeholder.com/300" alt="Placeholder" className="h-40 w-40" />
        </div>
        <div className="md:w-1/2 w-full md:p-8 md:m-4 m-2">
          <h2 className="text-2xl font-bold">Explore Our Comprehensive Schools & Colleges Section for Informed Decisions</h2>
          <p className="text-gray-600 mt-2">

            Discover detailed information about local schools and colleges. From curriculum to 
            admission processes, we provide everything you need to make informed choices.
          </p>
          <div className="flex mt-4 gap-6">
            <div className=' p-2'>
                <p>{<RiBox2Line/> }</p>
              <h3 className="font-semibold"> Detailed Insights</h3>
              <p className="text-gray-500 text-sm">Access essential details like fees, seat availability, and contact information.</p>
            </div>
            <div className='p-2'>
            <p>{<RiBox2Line/> }</p>
              <h3 className="font-semibold"> Get Started</h3>
              <p className="text-gray-500 text-sm">Visit our Schools & Colleges section to learn more and explore options.</p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      \<div className="sticky top-0 bg-white shadow-md p-4 z-10">
        <div className="md:flex justify-center md:gap-4 m-2">
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <FiSearch className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search schools & colleges..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 focus:outline-none"
            />
          </div>
          <div className='mx-6 my-2 flex gap-4'>
          <button onClick={() => setCategory("All")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">All</button>
          <button onClick={() => setCategory("School")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Schools</button>
          <button onClick={() => setCategory("College")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Colleges</button>
          </div>
        
        </div>
      </div>

      {/* List of Schools & Colleges */}
      <div className="flex flex-wrap gap-4 p-6 justify-center">
        {filteredInstitutions.length > 0 ? filteredInstitutions.map(item => (
          <div key={item.id} className="w-80 bg-white shadow-lg p-4 rounded-lg hover:scale-105 transition-transform">
            <img src={HeaderImg} alt="School/College" className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-bold mt-2">{item.name}</h3>
            <p className="text-gray-600">{item.location}</p>
            <p className="text-blue-500 font-semibold">{item.category}</p>
            <p className="text-yellow-500">⭐ {item.rating}/5</p>
            <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg w-full">Book a Seat</button>
            <button className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg w-full">Contact</button>
          </div>
        )) : <p className="text-gray-500 text-center w-full">No results found</p>}
      </div>

      {/* New Section Below Schools & Colleges */}
      <div className="bg-black text-white text-center p-12">
        <h2 className="text-3xl font-bold">Discover Local Services Today!</h2>
        <p className="text-gray-300 mt-2">Explore a variety of local services tailored to your needs, all in one place.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">Explore</button>
          <button className="bg-gray-700 text-white px-6 py-3 rounded-lg">Get Started</button>
        </div>
      </div>
    </div>
  );
};
