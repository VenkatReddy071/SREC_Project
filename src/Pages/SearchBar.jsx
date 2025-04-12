import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    console.log('Searching for:', query);
    // Implement your search logic here
  };

  return (
    <div className="w-full md:max-w-3xl mx-auto rounded-lg shadow-md transition-shadow duration-300">
      <div className={`flex items-center bg-white rounded-lg p-2 ${isFocused ? 'border-blue-500 border-2' : 'border border-gray-300'}`}>
        <input
          className="flex-1 py-2 px-3 text-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Search malls, dresses, and more..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          <FiSearch size={18} /> <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </div>
  );
};