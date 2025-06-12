// src/components/hospital-dashboard/DashHome.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios"; 

import {
  FaHospitalSymbol,
  FaTachometerAlt,
  FaCog,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaQuestionCircle,
  FaComments,
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaInfoCircle,
  FaClinicMedical
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/hospital-dashboard", icon: <FaTachometerAlt /> },
  { name: "Doctors", path: "/hospital-dashboard/doctors", icon: <FaHospitalSymbol /> },
  { name: "Bookings", path: "/hospital-dashboard/bookings", icon: <FaShoppingCart /> },
  { name: "Offers", path: "/hospital-dashboard/offers", icon: <FaTags /> },
  { name: "Customer Notifications", path: "/hospital-dashboard/notifications", icon: <FaBell /> },
  { name: "Services Page", path: "/hospital-dashboard/services", icon: <FaClinicMedical /> },
  { name: "CMS (General)", path: "/hospital-dashboard/cms", icon: <FaComments /> },
  { name: "Settings", path: "/hospital-dashboard/settings", icon: <FaCog /> },
];


export const DashHomeHospital = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState("Dashboard"); 
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false); 
  const [name, setName] = useState('Admin'); 
  
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Set initial page title based on current path
    const currentPath = window.location.pathname;
    const activeItem = menuItems.find(item => currentPath.startsWith(item.path));
    if (activeItem) {
      setPageTitle(activeItem.name);
    } else {
      setPageTitle("Dashboard"); 
    }
    const token=localStorage.getItem("dashboard");
    const url = `${import.meta.env.VITE_SERVER_URL}/api/profile`;
    axios.get(url, {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    withCredentials: true
})
      .then((response) => {
        console.log(response.data)
        setIsLogin(response.data?.loggedIn);
        setName(response.data?.user?.username || 'Admin'); 
      })
      .catch((error) => {
        console.error("Session check error:", error);
        setIsLogin(false);
        setName('Guest'); 
      });
  }, []);

  // Update page title when route changes
  // This effect ensures the header title updates when NavLink is clicked or URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      const activeItem = menuItems.find(item => currentPath.startsWith(item.path));
      if (activeItem) {
        setPageTitle(activeItem.name);
      } else {
        setPageTitle("Dashboard");
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);


  return (
    <div className="flex h-screen bg-gray-100"> {/* Added h-screen here */}
      {/* Sidebar */}
      <div
        className={`bg-white text-black font-serif h-full transition-all duration-300 relative z-20 shadow-lg ${
          isOpen ? "w-64" : "w-20"
        }`}
      >

        <div className="flex items-center justify-between bg-blue-800 text-white p-4 h-16 shadow-md">
          {isOpen && <h1 className="text-xl font-bold truncate">Hospital Admin</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-blue-700 transition-colors">
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4 flex flex-col gap-1 overflow-y-auto" style={{ height: 'calc(100% - 4rem - 4rem)' }}> {/* Adjusted height for scrollable area, 4rem for header, 4rem for potential logout */}
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 mx-2 rounded-lg text-lg transition-colors duration-200 
                 ${isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                 }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`${isOpen ? "block" : "hidden"} whitespace-nowrap overflow-hidden text-ellipsis`}>
                {item.name}
              </span>
            </NavLink>
          ))}
          {/* Logout Button (Moved outside menuItems for distinct styling if desired) */}
          <NavLink
            to="/logout" // Assuming you have a logout route
            className="flex items-center gap-4 p-3 mx-2 rounded-lg text-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
            // You might need to adjust 'mt-auto' or container height if this is pushed too far down
          >
            <span className="text-xl"><FaSignOutAlt /></span>
            <span className={`${isOpen ? "block" : "hidden"} whitespace-nowrap overflow-hidden text-ellipsis`}>
              Logout
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Top Bar */}
        <header className=" bg-white px-6 py-4 flex justify-between items-center shadow-md z-10">
          <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>

          <div className="flex items-center gap-6 relative">
            {/* Notification Bell (for internal notifications) */}
            <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
              <FaBell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-white">
                0 {/* Dynamic notification count */}
              </span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 cursor-pointer focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold ring-2 ring-blue-300">
                  {name ? name.substring(0, 2).toUpperCase() : <FaUserCircle className="w-6 h-6" />}
                </div>
                <span className="hidden md:inline font-medium text-gray-800">{name}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
                  {/* You can add a profile settings link here */}
                  <NavLink to="/hospital-dashboard/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</NavLink>
                  <NavLink to="/logout" className="block px-4 py-2 text-red-600 hover:bg-red-50">Logout</NavLink>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* This is where your specific dashboard components will render */}
        </main>
      </div>
    </div>
  );
};