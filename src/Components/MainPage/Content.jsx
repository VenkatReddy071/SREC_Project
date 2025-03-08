import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
export const Content = ({ item }) => {
  const { Sub, Heading, Info, divBox, Reverse, Img,Button,SubButton } = item;

  return (
    <div
      className={`m-14 p-6 flex gap-10 ${
        Reverse ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Text Content */}
      <div className="div-1 w-1/2 m-8">
        {Sub && <h4 className="text-xl font-semibold">{Sub}</h4>}
        <h1 className="text-3xl font-bold">{Heading}</h1>
        <p className="text-gray-600 mt-4">{Info}</p>
        {divBox?.length > 0 && (
          <div className="flex gap-8 mt-6">
            {divBox.map((box, index) => (
              <div key={index} className="p-4 shadow-md rounded-md">
                {box.Icon}
                <h3 className="text-lg font-semibold mt-2">{box.Heading}</h3>
                <p className="text-gray-500">{box.Info}</p>
              </div>
            ))}
          </div>
        )}
        <div className='mt-8'>
          {Button &&
            <div className='flex gap-4'>
              <button className=' h-8 border-2 border-black p-2 m-2 flex justify-center items-center'>
                {Button}
              </button>
              <button className='flex gap-2  justify-center items-center'>
                {SubButton} {<IoIosArrowForward />}
              </button>
            </div>
            
            
          }
        
        </div>
      </div>

      {/* Image or Placeholder */}
      <div className="div-2 w-1/2">
        {Img ? (
          <img src={Img} alt={Heading} className="w-full h-auto rounded-lg" />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};
