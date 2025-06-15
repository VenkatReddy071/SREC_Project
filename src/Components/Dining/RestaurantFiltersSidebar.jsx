import React, { useState, useEffect } from 'react';

export const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  allCuisines,
  onCuisineSelect,
  selectedCuisines,
}) => {
  // State to manage the search term locally within the sidebar before applying
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm);

  // Effect to synchronize local search term with external filter changes
  useEffect(() => {
    setLocalSearchTerm(filters.searchTerm);
  }, [filters.searchTerm]);

  // Handler for changes in the local search input field
  const handleLocalSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  // Handler to apply the filters and close the sidebar
  const handleApplyFilters = () => {
    onFilterChange('searchTerm', localSearchTerm); // Apply the local search term
    onClose(); // Close the sidebar
  };

  // Handler to clear all filters and reset sorting
  const handleClearFilters = () => {
    onFilterChange('searchTerm', '');
    onFilterChange('minRating', 0);
    onFilterChange('priceLevels', []);
    onFilterChange('cuisines', []); // Clear selected cuisines
    onFilterChange('isVegetarian', false);
    onFilterChange('services', []);
    onSortChange(''); 
    setLocalSearchTerm('');
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Overlay to close sidebar when clicked outside */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-75" onClick={onClose}></div>

      {/* Sidebar content area */}
      <div className="fixed top-0 right-0 w-80 md:w-96 h-full bg-white shadow-lg overflow-y-auto p-6 font-['Inter']">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filters & Sort</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Search Term Filter */}
        <div className="mb-6">
          <label htmlFor="sidebarSearch" className="block text-gray-700 text-sm font-bold mb-2">
            Search Restaurant:
          </label>
          <input
            type="text"
            id="sidebarSearch"
            placeholder="Name or description..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={localSearchTerm}
            onChange={handleLocalSearchChange}
          />
        </div>

        {/* Minimum Rating Filter */}
        <div className="mb-6">
          <label htmlFor="sidebarMinRating" className="block text-gray-700 text-sm font-bold mb-2">
            Minimum Rating:
          </label>
          <select
            id="sidebarMinRating"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={filters.minRating}
            onChange={(e) => onFilterChange('minRating', Number(e.target.value))}
          >
            <option value="0">Any Rating</option>
            <option value="1">1⭐ & Up</option>
            <option value="2">2⭐ & Up</option>
            <option value="3">3⭐ & Up</option>
            <option value="4">4⭐ & Up</option>
            <option value="4.5">4.5⭐ & Up</option>
          </select>
        </div>


        {/* Cuisine Filter */}
        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-2">Cuisines:</span>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-hide pr-1">
            {allCuisines.map((cuisine) => (
              <button
                key={cuisine}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCuisines.includes(cuisine)
                    ? 'bg-blue-500 text-white' // Selected state
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Unselected state
                }`}
                onClick={() => onCuisineSelect(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* isVegetarian Filter */}
        <div className="mb-6">
          <label className="flex items-center text-gray-700 text-sm font-bold mb-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-green-600 rounded mr-2"
              checked={filters.isVegetarian || false} // Ensure it's a boolean
              onChange={(e) => onFilterChange('isVegetarian', e.target.checked)}
            />
            Vegetarian Options Only
          </label>
        </div>

        {/* Services Filter */}
        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-2">Services:</span>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-hide pr-1">
            {['Dine-in', 'WiFi', 'Parking', 'Outdoor Seating', 'Live Music', 'Private Dining', 'Takeaway', 'Delivery'].map(
              (service) => (
                <button
                  key={service}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filters.services?.includes(service) // Use optional chaining for safety
                      ? 'bg-indigo-500 text-white' // Selected state
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Unselected state
                  }`}
                  onClick={() => {
                    const newServices = filters.services?.includes(service)
                      ? filters.services.filter((s) => s !== service) // Remove if selected
                      : [...(filters.services || []), service]; // Add if not selected, initialize if null/undefined
                    onFilterChange('services', newServices);
                  }}
                >
                  {service}
                </button>
              )
            )}
          </div>
        </div>

        {/* Rating Sort Buttons */}
        <div className="mb-6">
          <span className="block text-gray-700 text-sm font-bold mb-2">Sort By Rating:</span>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                sortBy === 'rating-desc'
                  ? 'bg-orange-500 text-white' // Selected state
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Unselected state
              }`}
              onClick={() => onSortChange('rating-desc')}
            >
              High to Low
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                sortBy === 'rating-asc'
                  ? 'bg-orange-500 text-white' // Selected state
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Unselected state
              }`}
              onClick={() => onSortChange('rating-asc')}
            >
              Low to High
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleClearFilters}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};