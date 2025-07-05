// import React from 'react';
// import { IoIosArrowForward } from "react-icons/io";
// import { Link } from 'react-router-dom';
// export const Content = ({ item }) => {
//   const { Sub, Heading, Info, divBox, Reverse, Img, Button, SubButton } = item;

//   return (
//     <div className={`flex flex-col md:flex-row ${Reverse ? 'md:flex-row-reverse' : ''} md:m-14 md:p-6 md:gap-10 items-center`}>
//       {/* Text Content */}
//       <div className="w-full md:w-1/2 text-center md:text-left p-4">
//         {Sub && <h4 className="text-xl font-semibold">{Sub}</h4>}
//         <h1 className="text-3xl font-bold">{Heading}</h1>
//         <p className="text-gray-600 mt-4">{Info}</p>

//         {/* Small Boxes Section */}
//         {divBox?.length > 0 && (
//           <div className="flex  gap-4 justify-center md:justify-start mt-6">
//             {divBox.map((box, index) => (
//               <div key={index}  className="p-4 shadow-md rounded-md w-full sm:w-1/2 md:w-auto text-center md:text-left cursor-pointer hover:scale-90 transition-transform duration-300">
//                 {box.Icon}
//                 <h3 className="text-lg font-semibold mt-2">{box.Heading}</h3>
//                 <p className="text-gray-500">{box.Info}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Buttons Section */}
//         {Button && (
//           <Link to={item.link}>
//           <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
//             <button className="h-10 border-2 border-black px-4 flex justify-center items-center rounded-md hover:bg-black hover:text-white">
//               {Button}
//             </button>
            
//           </div>
//           </Link>
//         )}
//       </div>

//       {/* Image Section */}
//       <div className="w-full md:w-1/2 flex justify-center">
//         {Img ? (
//           <img src={Img} alt={Heading} className="w-full max-w-md h-auto rounded-lg" />
//         ) : (
//           <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg"></div>
//         )}
//       </div>
//     </div>
//   );
// };

import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';

export const Content = ({ item }) => {
  const { Sub, Heading, Info, divBox, Reverse, Img, Button, SubButton } = item;

  return (
    <div className={`flex flex-col ${Reverse ? 'md:flex-row-reverse' : 'md:flex-row'} 
                    py-8 px-4 md:py-16 md:px-8 lg:px-16 gap-8 md:gap-12 items-center 
                    max-w-7xl mx-auto`}>
      <div className="w-full md:w-1/2 text-center md:text-left">
        {Sub && <h4 className="text-base sm:text-lg font-semibold text-blue-600 mb-2">{Sub}</h4>}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          {Heading}
        </h1>
        <p className="text-gray-700 mt-4 text-sm sm:text-base leading-relaxed">
          {Info}
        </p>

        {divBox?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center md:justify-items-start mt-8">
            {divBox.map((box, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-xl w-full max-w-xs text-center md:text-left 
                                         cursor-pointer hover:scale-[1.02] transition-transform duration-300 
                                         border border-gray-100 hover:border-blue-300">
                <div className="text-blue-600 text-4xl mb-3 flex justify-center md:justify-start">
                  {box.Icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{box.Heading}</h3>
                <p className="text-gray-600 text-sm mt-1">{box.Info}</p>
              </div>
            ))}
          </div>
        )}

        {Button && (
          <Link to={item.link}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <button className="h-12 px-6 bg-black text-white font-semibold rounded-lg 
                                 flex justify-center items-center hover:bg-gray-800 
                                 transition-colors duration-300 shadow-md">
                {Button}
              </button>
              {SubButton && (
                <button className="h-12 px-6 border-2 border-black text-black font-semibold rounded-lg 
                                   flex justify-center items-center hover:bg-black hover:text-white 
                                   transition-colors duration-300 shadow-md">
                  {SubButton} <IoIosArrowForward className="ml-2" />
                </button>
              )}
            </div>
          </Link>
        )}
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-0">
        {Img ? (
          <img src={Img} alt={Heading} className="w-full max-w-lg h-auto rounded-xl shadow-lg" />
        ) : (
          <div className="w-full max-w-lg h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg">
            Placeholder Image
          </div>
        )}
      </div>
    </div>
  );
};
