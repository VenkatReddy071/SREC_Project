import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";
import { Link } from 'react-router-dom';

import Logo from "./assets/images.png";
import { Login } from './user/Login';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Cart from './Components/Cart/Cart';
export const Navbar = () => {
  const location = useLocation();
  const type=location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOpen,setDropdownOpen]=useState(false)
  const handleLogout = () => {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/logout`;
    axios.post(url, {}, { withCredentials: true })
      .then(() => {
        setIsLogin(false);
        setName('');
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/check-session`;
    axios.get(url, { withCredentials: true })
      .then((response) => {
        setIsLogin(response.data?.loggedIn);
        setName(response.data?.user?.username || '');
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="p-2 m-2 border-b-2">
      {/* Navbar */}
      <div className="flex items-center justify-between h-14 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden absolute right-4 rounded-full bg-black p-1">
            {<IoMenu size={40} className='text-white' />}
          </button>
          <div className="w-32 h-auto rounded">
            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-10">
          <ul className="flex gap-10">
            <Link to={"/"}><li className="hover:text-blue-600">Local Services</li></Link>
            <Link to={"/Hospitals"}><li className="hover:text-blue-600">Health Care</li></Link>
            <Link to={"/malls"}><li className="hover:text-blue-600">Fashion</li></Link>
            <Link to={"/schools"}><li className="hover:text-blue-600">Education Hub</li></Link>
            <Link to="/restaurants">
            <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              Restaurants
            </li>
            </Link>
          </ul>
        </nav>
        <div className="hidden md:block">
          <div className="flex items-center gap-6">
            {isLogin ? (
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                    {name.substring(0, 2).toUpperCase()}
                  </div>
                   <span className="font-semibold">{name}</span>
                  <IoMdArrowDropdown />
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-20">
                    <ul className="flex flex-col text-black">
                      <li className="p-2 hover:bg-gray-200 cursor-pointer">Profile</li>
                      <li className="p-2 hover:bg-gray-200 cursor-pointer">Notifications</li>
                      <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
              <div
                className="button w-32 h-12 border-2 flex items-center justify-center bg-black text-white cursor-pointer"
                
              >
                <button>Login/Sign Up</button>
              </div>
              </Link>
            )}
            {type==='/'?
            <Link to="/join/dashboard">
          <div className="button w-32 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black">
            <button>Join</button>
          </div>
          </Link>
          :
          <>
          <div className="button  h-12  flex items-center justify-center  ">
            <Cart/>
          </div>
          </>
            }
          </div>
        </div>
      </div>
      <div
  className={`fixed top-0 right-0 h-full bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out ${
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  } md:hidden z-20`}
>
  <button
    onClick={() => setIsMenuOpen(false)}
    className="absolute top-4 right-4 rounded-full bg-black m-2"
  >
    <IoClose size={28} className="text-white" />
  </button>

  <ul className="flex flex-col gap-4 mt-8 bg-white">
    <Link to={"/"} onClick={() => setIsMenuOpen(false)}>
      <li className="hover:text-blue-600 border-b-2 text-lg font-semibold">
        Local Services
      </li>
    </Link>
    <Link to={"/Hospitals"} onClick={() => setIsMenuOpen(false)}>
      <li className="hover:text-blue-600 border-b-2 text-lg font-semibold">
        Health Care
      </li>
    </Link>
    <Link to={"/malls"} onClick={() => setIsMenuOpen(false)}>
      <li className="hover:text-blue-600 border-b-2 text-lg font-semibold">
        Fashion
      </li>
    </Link>
    <Link to={"/schools"} onClick={() => setIsMenuOpen(false)}>
      <li className="hover:text-blue-600 border-b-2 text-lg font-semibold">
        Education Hub
      </li>
    </Link>
    <Link to="/restaurants">
    <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 border-b-2 text-lg font-semibold">
      Restaurants <IoMdArrowDropdown className="w-5 h-5" />
    </li>
    </Link>
  </ul>

  {/* User Profile or Login/Signup */}
  <div className="mt-6">
    {isLogin ? (
      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {/* Avatar */}
          <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full">
            {name.slice(0, 2).toUpperCase()}
          </div>
          {/* Full Name */}
          <span className="font-semibold">{name}</span>
          {/* Dropdown Icon */}
          <IoMdArrowDropdown className="w-5 h-5" />
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-md rounded-md">
            <ul className="flex flex-col">
              <Link to={"/user-profile"} onClick={() => setDropdownOpen(false)}>
                <li className="hover:text-blue-600 border-b-2 text-lg font-semibold">
                  Profile
                </li>
              </Link>
              <Link to={"/user-notification"} onClick={() => setDropdownOpen(false)}>
                <li className="hover:text-blue-600 border-b-2 text-lg font-semibold">
                  Notifications
                </li>
              </Link>
              <li
                className="hover:text-blue-600 border-b-2 text-lg font-semibold"
                onClick={() => {
                  setIsLogin(false);
                  setDropdownOpen(false);
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </li>
            </ul>
            <div className="py-2">
              <Link to="/join/dashboard">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 transition-all duration-200"
                >
                  Join Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center gap-4">
        <Link to='/login'>
        <button
          className="w-32 py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 transition-colors duration-200"
        >
          Login/Sign Up
        </button>
        </Link>
        <Link to="/join/dashboard">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-32 py-2 border-2 border-black text-black rounded-md shadow hover:bg-black hover:text-white transition-all duration-200"
          >
            Join
          </button>
        </Link>
      </div>
    )}
  </div>
</div>



    </div>
  );
};
