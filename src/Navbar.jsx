import React from 'react'
import Logo from "./assets/images.jpeg";
import { IoMdArrowDropdown } from "react-icons/io";
import { Buttons } from './Components/UseButtons.jsx/Buttons';
import { Heading } from './Components/MainPage/Heading';
export const Navbar = () => {
  return (
    
    <div>
        <div className="p-2 m-2 flex items-center h-14 border-b-2">
        {/* Navbar */}
        <div className="navbar p-2 flex gap-10 items-center h-14 w-full min-w-max">
          <div className="logo w-18 h-14 rounded">
            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <nav>
            <ul className="flex gap-10">
              <li>Local Services</li>
              <li>Health Care</li>
              <li>Education Hub</li>
              <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                Dining Options
                <IoMdArrowDropdown className="w-5 h-5 transition-transform duration-300 hover:rotate-180" />
              </li>
            </ul>
          </nav>
        </div>
        <Buttons label1={"Join"} label2={"Explore"} revers={false}/>
        </div>
        
    </div>
  )
}
