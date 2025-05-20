import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Header from "../../../assets/images.png";

export const AboutNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const menus = [
    { name: "About" },
    {
      name: "Development Team",
      heading: "Team Members",
      subItems: [
        "Sai Prasad",
        "Jonnagiri Venkat Reddy",
        "Praveen Elaheed",
        "Gangadhara Sai",
      ],
    },
    {
      name: "Partner Us",
      heading: "Join Us As",
      subItems: ["Restaurant", "Hospital", "Fashion"],
    },
    { name: "What We Do" },
    {
      name: "Follow Us",
      heading: "Connect With Us",
      subItems: ["Twitter", "Instagram", "LinkedIn"],
    },
  ];

  const dropdownMenus = ["Development Team", "Partner Us", "Follow Us"];

  return (
    <div className="bg-white text-black font-sans sticky top-0 shadow-md p-4 z-50">
      {/* Navbar container */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        {/* Logo */}
        <img src={Header} alt="Logo" className="w-36 h-auto" />

        {/* Hamburger Icon (Mobile) */}
        <button
          className="lg:hidden block text-gray-600 hover:text-gray-800 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <GiHamburgerMenu size={28} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <ul className="flex gap-10 text-lg font-semibold mr-10">
            {menus.map((menu, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() =>
                  dropdownMenus.includes(menu.name) ? setActiveMenu(index) : null
                }
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div className="flex items-center space-x-1 cursor-pointer hover:text-indigo-600 transition">
                  <span>{menu.name}</span>
                  {/* Show down arrow if dropdown exists */}
                  {dropdownMenus.includes(menu.name) && (
                    <FaChevronDown size={12} className="mt-0.5 text-indigo-600" />
                  )}
                </div>

                {/* Dropdown Menu - only for specific menus */}
                {activeMenu === index && dropdownMenus.includes(menu.name) && (
                  <div
                    className={`absolute top-full mt-2 bg-white border rounded-lg shadow-xl p-5 min-w-[250px] transition duration-300 ease-in-out
                      ${
                        menu.name === "Follow Us"
                          ? "right-0 text-right" // align Follow Us to right
                          : "left-0 text-left"  // others align left
                      }
                    `}
                    style={{ zIndex: 100 }}
                  >
                    <h3 className="font-semibold text-sm mb-3 border-b border-indigo-300 pb-2">
                      {menu.heading}
                    </h3>
                    <ul>
                      {menu.subItems.map((item, subIndex) => (
                        <li
                          key={subIndex}
                          className="px-4 py-2 rounded hover:bg-indigo-50 cursor-pointer transition"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden mt-4 border-t border-gray-200">
          <ul className="flex flex-col gap-4 text-base font-medium max-w-md mx-auto">
            {menus.map((menu, index) => (
              <li key={index} className="relative">
                <div
                  className="flex justify-between items-center px-3 py-3 hover:text-indigo-600 cursor-pointer transition rounded-md"
                  onClick={() =>
                    dropdownMenus.includes(menu.name)
                      ? setActiveMenu(activeMenu === index ? null : index)
                      : null
                  }
                >
                  <span>{menu.name}</span>
                  {/* Show dropdown icon only if dropdown exists */}
                  {dropdownMenus.includes(menu.name) && (
                    activeMenu === index ? (
                      <FaChevronUp size={16} />
                    ) : (
                      <FaChevronDown size={16} />
                    )
                  )}
                </div>

                {/* Dropdown Menu (Mobile) */}
                {activeMenu === index && dropdownMenus.includes(menu.name) && (
                  <div className="bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-4 w-full max-w-xl mx-auto transition duration-300 ease-in-out">
                    <h3 className="font-semibold text-sm mb-3 border-b border-indigo-300 pb-2">
                      {menu.heading}
                    </h3>
                    <ul>
                      {menu.subItems.map((item, subIndex) => (
                        <li
                          key={subIndex}
                          className="py-2 px-2 hover:bg-indigo-50 rounded cursor-pointer transition"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};
