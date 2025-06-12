// src/components/ServiceList.jsx
import React from 'react';

// This component now expects an array of service NAMES (strings)
const ServiceList = ({ services, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {services?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No services available. Add one using the form!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Adjusted grid for better responsiveness */}
          {services?.map((serviceName, index) => (
            <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{serviceName}</h3> {/* Truncate for long names */}

              <div className="flex space-x-2 mt-auto pt-2">
                <button
                  onClick={() => onEdit(serviceName, index)} // Pass service name and its index
                  className="flex-1 px-3 py-1 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[70px]"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(index)} // Pass only the index for deletion
                  className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 min-w-[70px]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;