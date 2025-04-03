import React from 'react';
import HeaderImg from "../assets/header.jpg";

export const DisplayComponent = ({ mails }) => {
  return (
    <div className='flex flex-wrap gap-4 p-2 m-2 justify-center'>
      {mails.map((item, index) => (
        <div key={index} className='w-80 m-1 h-auto bg-white shadow-md hover:scale-105 transition-transform duration-300 p-2 rounded-lg'>
          <img src={HeaderImg} alt={item.name} className='w-full h-40 object-cover rounded-md' />
          <h1 className='text-lg font-semibold mt-2'>{item.name}</h1>
          <p className='text-gray-600 text-sm'>{item.location}</p>
          <p className='text-gray-700 mt-1'><strong>Category:</strong> {item.category.join(', ')}</p>
          <p className='text-yellow-500 font-bold'>⭐ {item.rating}/5</p>
        </div>
      ))}
    </div>
  );
};
