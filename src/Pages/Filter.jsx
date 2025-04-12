import React, { useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { FaStar } from 'react-icons/fa';

const PopupFilter = ({ onApply }) => {
  const [filters, setFilters] = useState({
    malls: false,
    shops: false,
    men: false,
    women: false,
    rating: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filter <ChevronDownIcon className={`h-5 w-5 ml-2 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 right-0 bg-white p-6 shadow-lg rounded-md md:w-72 h-full z-20 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Filter Options</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Categories</h4>
            <label className="flex items-center mb-2">
              <input type="checkbox" name="malls" checked={filters.malls} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-500 rounded mr-2" />
              Popular Malls
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" name="shops" checked={filters.shops} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-500 rounded mr-2" />
              Shopping Shops
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" name="men" checked={filters.men} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-500 rounded mr-2" />
              Men's
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" name="women" checked={filters.women} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-500 rounded mr-2" />
              Women's
            </label>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Rating</h4>
            <label className="flex items-center">
              <select
                name="rating"
                value={filters.rating}
                onChange={handleChange}
                className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Ratings</option>
                <option value="4+">
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  & Up
                </option>
                <option value="3+">
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  <FaStar className="inline-block text-yellow-500 mr-1" />
                  & Up
                </option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setIsOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              Cancel
            </button>
            <button onClick={handleApply} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupFilter;