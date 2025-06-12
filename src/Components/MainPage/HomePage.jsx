import React, { useState } from 'react';

import Header from '../../assets/Header.jpg'; // Ensure this image is high-quality and relevant to Nandyal

// Define a simple Search Icon component
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-gray-500" // Icon color remains
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]); // State to store search results

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Performing search for:', searchTerm);
      // *** Integrate your actual search logic here. ***
      // This is a placeholder for demonstration.
      // In a real application, you'd fetch data from an API.
      const dummyResults = [
        { id: 1, name: 'Nandyal Grand Restaurant', category: 'Restaurant', address: 'Main Road, Nandyal' },
        { id: 2, name: 'Delhi Public School, Nandyal', category: 'School', address: 'Bypass Road, Nandyal' },
        { id: 3, name: 'Sri Venkateswara Motors', category: 'Mechanic', address: 'Industrial Area, Nandyal' },
        { id: 4, name: 'Apollo Pharmacy', category: 'Pharmacy', address: 'Gandhi Chowk, Nandyal' },
        { id: 5, name: 'Hotel Mayuri', category: 'Hotel', address: 'Near Railway Station, Nandyal' },
        { id: 6, name: 'Reliance Digital', category: 'Electronics', address: 'RTC Bus Stand Road, Nandyal' },
        { id: 7, name: 'Dominos Pizza', category: 'Food', address: 'Mahanandi Road, Nandyal' },
      ];

      // Filter dummy results based on search term
      const filteredResults = dummyResults.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredResults);
      setSearchTerm(''); // Optionally clear the search term after search
    } else {
      setSearchResults([]); // Clear results if search term is empty
    }
  };

  return (
    <div>
      {/* Header Section - Takes full width */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <img
          src={Header}
          alt="Nandyal Cityscape"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-60 p-4 sm:p-6 md:p-8">
          {/* Website Name */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 drop-shadow-lg font-serif">
            Nandyal Info
          </h1>

          {/* Search Bar with Integrated Icon - Wider */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mb-8 px-4"> {/* Increased max-w and added horizontal padding */}
            <input
              type="text"
              placeholder="Search for restaurants, schools, mechanics..."
              className="w-full p-4 pl-14 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-400 text-gray-900 text-lg shadow-xl transition-all duration-300 ease-in-out hover:border-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Search Icon inside the input field */}
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <SearchIcon />
            </button>
          </form>
          {searchResults.length > 0 && (
        <div className="container mx-auto mt-10 p-4 md:p-6 bg-white shadow-lg rounded-lg z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <div key={result.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{result.name}</h3>
                <p className="text-blue-600 font-medium mb-1">{result.category}</p>
                <p className="text-gray-600 text-sm">{result.address}</p>
                {/* You can add more details here, e.g., ratings, phone number, etc. */}
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && searchTerm.trim() && ( // Show no results message only if a search was attempted and found nothing
        <div className="container mx-auto mt-10 p-4 text-center text-gray-600">
          <p className="text-xl">No results found for "{searchTerm}". Please try a different search term.</p>
        </div>
      )}

          {/* Descriptive Text */}
          <p className="text-lg md:text-xl text-center max-w-2xl px-4 leading-relaxed font-light">
            Discover local services at your fingertips. Explore a wide range of businesses and services tailored to your needs in Nandyal. Find everything you need in one place.
          </p>
        </div>
      </div>

      {/* Search Results Section - Appears below the header */}
      
    </div>
  );
};

export default HomePage;