import React, { useState } from 'react';
// import HeaderImg from "../assets/header.jpg"; // Keeping for fallback if needed, but not directly used in the new design
import { FiSearch } from 'react-icons/fi'; // Search icon
import { RiBox2Line } from "react-icons/ri"; // Placeholder for feature icon
import { MapPinIcon, StarIcon as SolidStarIcon } from '@heroicons/react/24/solid'; // Solid star for rating, MapPin for location
import School from "../assets/SchoolHeader.jpg"; // Main header image for the hero section

// Sample Data
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

  // Filtered Results
  const filteredInstitutions = institutions.filter(item =>
    (category === "All" || item.category === category) &&
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {/* Hero Section */}
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

      {/* About Section / Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image/Illustration Side */}
          <div className="md:w-1/2 w-full">
            <img 
              src="https://images.unsplash.com/photo-1546410531-bb4062545585?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Students Learning" 
              className="rounded-3xl  w-full h-64 md:h-96 object-cover" 
            />
          </div>
          {/* Text Content Side */}
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

      {/* Search and Filter Section (Sticky) */}
      <div className="sticky top-0 bg-white shadow-lg py-6 px-4 z-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-grow w-full sm:w-auto flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
            <FiSearch className="text-gray-500 text-lg mr-2" />
            <input 
              type="text" 
              placeholder="Search schools & colleges by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-1 text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
          {/* Category Buttons */}
          <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
            {['All', 'School', 'College'].map((catOption) => (
              <button
                key={catOption}
                onClick={() => setCategory(catOption)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
                            ${category === catOption
                              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                            }`}
              >
                {catOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List of Schools & Colleges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredInstitutions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredInstitutions.map(item => (
              <div key={item.id} className="bg-white shadow-xl rounded-xl overflow-hidden
                                         transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col">
                <img 
                  src={item.image || "https://via.placeholder.com/400x250/E0E0E0/757575?text=Institution+Image"} 
                  alt={item.name} 
                  className="w-full h-56 object-cover object-center" 
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{item.name}</h3>
                  <p className="text-gray-600 text-sm flex items-center mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                    {item.location}
                  </p>
                  <p className="text-blue-700 font-semibold text-sm mb-3">{item.category}</p>
                  <div className="flex items-center text-yellow-500 mb-4">
                    <SolidStarIcon className="h-5 w-5 mr-1" />
                    <span className="font-bold text-lg">{item.rating}</span>
                    <span className="text-gray-500 text-sm">/5</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3"> {/* Use mt-auto to push buttons to bottom */}
                    <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      Book a Seat
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-xl py-12">No institutions found matching your criteria.</p>
        )}
      </section>

      {/* Call to Action Footer Section */}
      <section className="bg-blue-800 text-white py-16 px-4 text-center rounded-t-3xl mx-2 md:mx-4 lg:mx-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
          Discover Local Services Today!
        </h2>
        <p className="text-blue-200 text-lg max-w-3xl mx-auto mb-8">
          Explore a variety of local services tailored to your needs, from education to healthcare and beyond, all in one place.
        </p>
        <div className="flex justify-center gap-6">
          <button className="bg-white text-blue-800 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
            Explore More
          </button>
          <button className="bg-blue-700 border border-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Get Started
          </button>
        </div>
      </section>

      {/* Custom CSS for Animations (if not in your global CSS) */}
      <style jsx>{`
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScaleUpDelayed {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInScaleUp 0.7s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};