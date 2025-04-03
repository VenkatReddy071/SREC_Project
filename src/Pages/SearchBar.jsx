import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', query);
  };

  return (
    <div className='w-full max-w-3xl p-4 mx-auto  flex items-center gap-4 rounded-lg'>
      <input 
        className='flex-1 p-2 text-black rounded-md border-2 border-black' 
        type='text' 
        placeholder='Search malls, dresses, and more...' 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button 
        onClick={handleSearch} 
        className='bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all'>
        <FiSearch size={18} /> Search
      </button>
    </div>
  );
};
