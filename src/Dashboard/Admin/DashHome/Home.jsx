import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaHospitalSymbol,
  FaSchool,
  FaMailBulk,
  FaStore,
  FaTachometerAlt,
  FaSignOutAlt,
  FaCog,
  FaTags,
  FaUsers,
  FaShoppingCart,
  FaQuestionCircle,
  FaComments,
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", path: "/admin-dashboard", icon: <FaTachometerAlt /> },
  { name: "Hospitals", path: "/admin-dashboard/hospitals", icon: <FaHospitalSymbol /> },
  { name: "Restaurants", path: "/admin-dashboard/restaurants", icon: <FaStore /> },
  { name: "Schools", path: "/admin-dashboard/schools", icon: <FaSchool /> },
  { name: "Mails", path: "/admin-dashboard/mails", icon: <FaMailBulk /> },
  { name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart /> },
  { name: "Offers", path: "/admin-dashboard/offers", icon: <FaTags /> },
  { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers /> },
  { name: "FAQs", path: "/admin-dashboard/faqs", icon: <FaQuestionCircle /> },
  { name: "Live Chat", path: "/admin-dashboard/chat", icon: <FaComments /> },
  { name: "Settings", path: "/admin-dashboard/settings", icon: <FaCog /> },
  { name: "Logout", path: "/logout", icon: <FaSignOutAlt /> },
];

export const DashHome = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white text-black font-serif h-full overflow-y-auto transition-all duration-300 top-0 left-0 ${
          isOpen ? "w-60" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between bg-black text-white p-4">
          {isOpen && <h1 className="text-xl font-bold">Admin Dashboard</h1>}
          <button onClick={toggleSidebar}>
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setPageTitle(item.name)}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 text-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-black text-white"
                    : "hover:bg-black hover:text-white"
                }`
              }
            >
              <span className="text-xl py-2 px-2">{item.icon}</span>
              <span className={`${isOpen ? "block" : "hidden"}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Top Bar */}
        <div className="w-full bg-gray-200 px-6 py-4 flex justify-between items-center shadow">
          <h1 className="text-2xl font-medium">{pageTitle}</h1>

          <div className="flex items-center gap-6 relative">
            {/* Notification */}
            <div className="relative cursor-pointer">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 cursor-pointer">
                <FaUserCircle className="w-6 h-6" />
                <span className="hidden md:inline">Admin</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded w-40 z-10">
                  <ul>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Renders the child route here (make sure you're using <Outlet /> from react-router-dom) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};
