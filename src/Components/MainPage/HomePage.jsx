import React, { useState } from 'react';

import Header from '../../assets/Header.jpg';

// Define a simple Search Icon component
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-gray-500" // Added text-gray-500 for icon color
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const HomePage = () => {
  // Search input is always shown, so no need for showSearchInput state for visibility toggle
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Performing search for:', searchTerm);
      // Integrate your actual search logic here.
      // E.g., navigate('/search?query=${searchTerm}'); or filter content.

      setSearchTerm(''); // Optionally clear the search term after search
    }
  };

  return (
    <div className="relative  w-full h-[400px] md:h-[400px] overflow-hidden rounded-lg shadow-lg"> {/* Container for image and overlay */}
      {/* Background Image */}
      <img
        src={Header}
        alt="Local Services"
        className="absolute inset-0 w-full h-full object-cover" // Image covers the entire container
      />

      {/* Overlay Content (Search Bar & Text) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white  bg-black bg-opacity-50"> {/* Dark overlay for readability */}
        {/* Search Bar with Integrated Icon */}
        <form onSubmit={handleSearchSubmit} className="relative md:w-full w-80 md:max-w-lg mb-8"> {/* max-w-xl for a defined width, mb-8 for spacing */}
          <input
            type="text"
            placeholder="Search for restaurants, schools, mechanics..."
            className="w-full p-4 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg" // Added pl-12 for icon space, text-gray-900 for input text
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Search Icon inside the input field */}
          <button
            type="submit" // Set type to submit to trigger form submission
            aria-label="Submit search"
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <SearchIcon />
          </button>
        </form>

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Discover Local Services at Your Fingertips
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl">
          Explore a wide range of local services tailored to your needs. Find everything you need in one place.
        </p>
      </div>
    </div>
  );
};

export default HomePage;