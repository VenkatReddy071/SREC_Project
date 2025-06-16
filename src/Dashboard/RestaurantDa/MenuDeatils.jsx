import React from 'react';
import { FaEdit, FaTrash, FaRupeeSign, FaSeedling, FaLeaf, FaStar, FaCheckCircle, FaTimesCircle, FaNewspaper, FaCertificate, FaArrowUp } from 'react-icons/fa';

const MenuDetailsPanel = ({ item, onEdit, onDelete }) => {
  if (!item) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-2xl font-semibold">
        No item selected.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{item.name}</h2>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition duration-300"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition duration-300"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4">
        <div className="mb-6 flex flex-wrap gap-6 items-start">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full md:w-64 h-auto object-cover rounded-lg shadow-lg flex-shrink-0"
            />
          )}
          <div className="flex-grow">
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">{item.description || 'No description provided.'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-md">
              <p><span className="font-semibold">Category:</span> {item.category}</p>
              <p><span className="font-semibold">Product Type:</span> {item.productType}</p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Price:</span> <FaRupeeSign className="text-green-700" /> {item?.priceINR?.toFixed(2)}
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Rating:</span>
                <span className="flex items-center text-yellow-500">
                  <FaStar className="mr-1" /> {item?.rating?.toFixed(1)} / 5
                </span>
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-800">
              <p className="flex items-center">
                <span className="font-semibold mr-2">Vegetarian:</span>
                {item.isVegetarian ? <FaSeedling className="text-green-500 text-xl" /> : <FaTimesCircle className="text-red-500" />}
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Vegan:</span>
                {item.isVegan ? <FaLeaf className="text-teal-500 text-xl" /> : <FaTimesCircle className="text-red-500" />}
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Available:</span>
                {item.isAvailable ? <FaCheckCircle className="text-green-500 text-xl" /> : <FaTimesCircle className="text-red-500" />}
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Top Seller:</span>
                {item.isTopSeller ? <FaArrowUp className="text-purple-600 text-xl" /> : <FaTimesCircle className="text-gray-400" />}
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">New Arrival:</span>
                {item.isNewArrival ? <FaNewspaper className="text-blue-500 text-xl" /> : <FaTimesCircle className="text-gray-400" />}
              </p>
            </div>
            <div className="mt-6 text-sm text-gray-500 border-t pt-4">
              <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailsPanel;