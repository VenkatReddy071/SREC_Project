import React, { useState } from 'react';

const PopupFilter = ({ onApply }) => {
  const [filters, setFilters] = useState({
    malls: false,
    shops: false,
    men: false,
    women: false,
    rating: ''
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={()=>setIsOpen(true)}>
        Open Filters
      </button>
      {isOpen && (
        <div className="fixed inset-0 right-0  bg-white p-4 shadow-lg rounded-lg w-64 h-full ">
          <h3 className="text-lg font-semibold mb-2">Filter Options</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center">
              <input type="checkbox" name="malls" checked={filters.malls} onChange={handleChange} className="mr-2" /> Popular Malls
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="shops" checked={filters.shops} onChange={handleChange} className="mr-2" /> Shopping Shops
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="men" checked={filters.men} onChange={handleChange} className="mr-2" /> Men's
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="women" checked={filters.women} onChange={handleChange} className="mr-2" /> Women's
            </label>
            <label className="flex items-center">
              <span className="mr-2">Rating:</span>
              <select name="rating" value={filters.rating} onChange={handleChange} className="border rounded p-1">
                <option value="">All</option>
                <option value="4+">4+ Stars</option>
                <option value="3+">3+ Stars</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsOpen(false)} className="text-gray-500">Cancel</button>
            <button onClick={handleApply} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupFilter;
