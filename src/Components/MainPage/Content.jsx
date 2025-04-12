import React from 'react';
import { IoIosArrowForward } from "react-icons/io";

export const Content = ({ item }) => {
  const { Sub, Heading, Info, divBox, Reverse, Img, Button, SubButton } = item;

  return (
    <div className={`flex flex-col md:flex-row ${Reverse ? 'md:flex-row-reverse' : ''} md:m-14 md:p-6 md:gap-10 items-center`}>
      {/* Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left p-4">
        {Sub && <h4 className="text-xl font-semibold">{Sub}</h4>}
        <h1 className="text-3xl font-bold">{Heading}</h1>
        <p className="text-gray-600 mt-4">{Info}</p>

        {/* Small Boxes Section */}
        {divBox?.length > 0 && (
          <div className="flex  gap-4 justify-center md:justify-start mt-6">
            {divBox.map((box, index) => (
              <div key={index}  className="p-4 shadow-md rounded-md w-full sm:w-1/2 md:w-auto text-center md:text-left cursor-pointer hover:scale-90 transition-transform duration-300">
                {box.Icon}
                <h3 className="text-lg font-semibold mt-2">{box.Heading}</h3>
                <p className="text-gray-500">{box.Info}</p>
              </div>
            ))}
          </div>
        )}

        {/* Buttons Section */}
        {Button && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <button className="h-10 border-2 border-black px-4 flex justify-center items-center rounded-md">
              {Button}
            </button>
            <button className="flex gap-2 items-center">
              {SubButton} <IoIosArrowForward />
            </button>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        {Img ? (
          <img src={Img} alt={Heading} className="w-full max-w-md h-auto rounded-lg" />
        ) : (
          <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};
