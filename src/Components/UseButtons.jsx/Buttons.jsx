import React, { useState } from 'react';
import { Login } from '../../user/Login';

export const Buttons = ({ label1, label2, reverse, white,setIsMenuOpen}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLogin = () => {
  
    setIsOpen(true);
    
    
  };

  return (
    <div className="buttons ">
      {reverse ? (
        <div className='md:flex md:gap-6 w-full p-2 m-2 flex gap-6'>
          <div
            className={`button w-24   h-10 border-2 flex items-center justify-center   text-black cursor-pointer`}
            onClick={handleOpenLogin} // Direct function call
          >
            <button>{label1}</button>
          </div>
          <div className="button w-24 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black">
            <button>{label2}</button>
          </div>
        </div>
      ) : (
        <div className='flex gap-6'>
          <div
            className={`button w-24 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white cursor-pointer"}`}
            onClick={handleOpenLogin} // Direct function call
          >
            <button>{label1}</button>
          </div>
          <div className="button w-24   h-10 border flex items-center justify-center bg-black text-white">
            <button>{label2}</button>
          </div>
        </div>
      )}
      {isOpen && <Login setIsOpen={setIsOpen} />}
    </div>
  );
};