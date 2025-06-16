import React from 'react';
import { FaUtensils, FaStar, FaSeedling, FaLeaf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MenuListItem = ({ item, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center p-1 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected ? 'bg-blue-100 border-blue-500 shadow-md' : 'bg-white hover:bg-gray-50'}`}
      onClick={onClick}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
          <FaUtensils className="text-gray-500 text-3xl" />
        </div>
      )}

      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
        <p className="text-sm text-gray-600 truncate">{item.category} - {item.productType}</p>
        <p className="text-md font-bold text-green-600">₹{item.priceINR.toFixed(2)}</p>
        <div className="flex items-center gap-2 text-sm ">
          {item.isVegetarian && <span className="text-green-500"><FaSeedling title="Vegetarian" /></span>}
          {item.isVegan && <span className="text-teal-500"><FaLeaf title="Vegan" /></span>}
          {item.isAvailable ? (
            <span className="text-green-500 flex items-center"><FaCheckCircle className="mr-1" /> Available</span>
          ) : (
            <span className="text-red-500 flex items-center"><FaTimesCircle className="mr-1" /> Unavailable</span>
          )}
          {item.rating > 0 && (
            <span className="flex items-center text-yellow-500">
              <FaStar className="mr-1" /> {item.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuListItem;