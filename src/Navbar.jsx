import React, { useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5"; // Mobile menu icons
import { Buttons } from './Components/UseButtons.jsx/Buttons';
import { Link } from 'react-router-dom';
import Logo from "./assets/images.png";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="p-2 m-2 border-b-2">
      {/* Navbar */}
      <div className="flex items-center justify-between h-14 w-full">
        {/* Logo with Menu Toggle */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden absolute right-4 rounded-full bg-black p-1">
            {<IoMenu size={40} className='text-white'/>}
          </button>
          <div className="w-32 h-auto rounded">
            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-10">
          <ul className="flex gap-10">
            <Link to={"/"}><li className="hover:text-blue-600">Local Services</li></Link>
            <Link to={"/Hospitals"}><li className="hover:text-blue-600">Health Care</li></Link>
            <Link to={"/malls"}><li className="hover:text-blue-600">Fashion</li></Link>
            <Link to={"/schools"}><li className="hover:text-blue-600">Education Hub</li></Link>
            <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              Dining Options <IoMdArrowDropdown className="w-5 h-5 transition-transform duration-300 hover:rotate-180" />
            </li>
          </ul>
        </nav>

        {/* Buttons (Only visible on large screens) */}
        <div className="hidden md:block">
          <Buttons label1={"Join"} label2={"Explore"} revers={false} />
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden z-20`}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 rounded-full  bg-black m-2">
          <IoClose size={28} className='text-white '/>
        </button>
        <ul className="flex flex-col gap-4 mt-8 bg-white">
          <Link to={"/"} onClick={() => setIsMenuOpen(false)}><li className="hover:text-blue-600 border-b-2 borer-black  text-lg font-semibold">Local Services</li></Link>
          <Link to={"/Hospitals"} onClick={() => setIsMenuOpen(false)}><li className="hover:text-blue-600 border-b-2 borer-black  text-lg font-semibold">Health Care</li></Link>
          <Link to={"/malls"} onClick={() => setIsMenuOpen(false)}><li className="hover:text-blue-600 border-b-2 borer-black  text-lg font-semibold">Fashion</li></Link>
          <Link to={"/schools"} onClick={() => setIsMenuOpen(false)}><li className="hover:text-blue-600 border-b-2 borer-black  text-lg font-semibold">Education Hub</li></Link>
          <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 border-b-2 borer-black  text-lg font-semibold">
            Dining Options <IoMdArrowDropdown className="w-5 h-5 transition-transform duration-300 hover:rotate-180" />
          </li>
        </ul>

        {/* Mobile Buttons */}
        <div className="flex p-2 flex-wrap">
          <Buttons label1={"Join"} label2={"Explore"} revers={false} setIsMenuOpen={setIsMenuOpen}/>
        </div>
      </div>
    </div>
  );
};
