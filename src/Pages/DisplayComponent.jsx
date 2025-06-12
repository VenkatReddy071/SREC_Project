import React from 'react';
import HeaderImg from '../assets/header.jpg';
import { FaStar } from 'react-icons/fa';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

export const DisplayComponent = ({ mails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {mails.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img
            src={item?.image || HeaderImg} // Use item.image if available, fallback to HeaderImg
            alt={item?.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-gray-600 text-sm flex items-center mb-1">
              <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
              {item?.location}
            </p>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Category:</strong> {item?.categories?.join(', ')}
            </p>
            <div className="flex items-center mb-2">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="text-yellow-500 font-semibold">{item?.rating}</span>
              <span className="text-gray-500 text-sm">/5</span>
            </div>
            <p className="text-gray-600 text-sm flex items-center">
              <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
              {item.contact}
            </p>
            <p className="text-gray-500 text-xs mt-2">Timing: {item.timing}</p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};