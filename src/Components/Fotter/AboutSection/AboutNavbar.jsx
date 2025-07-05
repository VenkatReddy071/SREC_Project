import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Header from "../../../assets/images.png"; // Assuming this is your logo

export const AboutNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const menus = [
    { name: "About", link: "#" },
    {
      name: "Development Team",
      heading: "Team Members",
      subItems: [
        { name: "Sai Prasad", link: "#developers" },
        { name: "Jonnagiri Venkat Reddy", link: "#developers" },
        { name: "Praveen Elaheed", link: "#developers" },
        { name: "Gangadhara Sai", link: "#developers" },
      ],
    },
    {
      name: "Partner Us",
      heading: "Join Us As",
      subItems: [
        { name: "Restaurant", link: "#partner-restaurant" },
        { name: "Hospital", link: "#partner-hospital" },
        { name: "Fashion", link: "#partner-fashion" }
      ],
    },
    { name: "What We Do", link: "#what-we-do" }, // Add link for What We Do
    {
      name: "Follow Us",
      heading: "Connect With Us",
      subItems: [
        { name: "Twitter", link: "https://twitter.com" },
        { name: "Instagram", link: "https://instagram.com" },
        { name: "LinkedIn", link: "https://linkedin.com" }
      ],
    },
  ];

  const dropdownMenus = ["Development Team", "Partner Us", "Follow Us"];

  return (
    <div className="bg-white text-gray-800 font-sans sticky top-0 shadow-lg p-4 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <img src={Header} alt="NANDYAL INFO Logo" className="h-10 md:h-12 w-auto" />

        <button
          className="lg:hidden block text-gray-700 hover:text-blue-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <GiHamburgerMenu size={30} />
        </button>

        <nav className="hidden lg:flex">
          <ul className="flex gap-8 text-lg font-medium">
            {menus.map((menu, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() =>
                  dropdownMenus.includes(menu.name) ? setActiveMenu(index) : null
                }
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menu.link ? (
                  <a href={menu.link} className="flex items-center space-x-1 cursor-pointer text-gray-800 hover:text-blue-600 transition-colors py-2">
                    <span>{menu.name}</span>
                  </a>
                ) : (
                  <div className="flex items-center space-x-1 cursor-pointer text-gray-800 hover:text-blue-600 transition-colors py-2">
                    <span>{menu.name}</span>
                    {dropdownMenus.includes(menu.name) && (
                      <FaChevronDown size={12} className="mt-0.5 text-blue-600" />
                    )}
                  </div>
                )}

                {activeMenu === index && dropdownMenus.includes(menu.name) && (
                  <div
                    className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px] transition-all duration-300 ease-in-out transform opacity-100 scale-100 group-hover:opacity-100 group-hover:scale-100
                      ${menu.name === "Follow Us" ? "right-0 text-right" : "left-0 text-left"}
                    `}
                    style={{ zIndex: 100 }}
                  >
                    <h3 className="font-semibold text-sm mb-3 border-b border-blue-300 pb-2 text-gray-900">
                      {menu.heading}
                    </h3>
                    <ul>
                      {menu.subItems.map((item, subIndex) => (
                        <li
                          key={subIndex}
                          className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors"
                        >
                          <a href={item.link || '#'} target={item.link && item.link.startsWith('http') ? '_blank' : '_self'} rel={item.link && item.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                            {item.name}
                          </a>
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

      {isMobileMenuOpen && (
        <nav className="lg:hidden mt-4 border-t border-gray-200 py-4">
          <ul className="flex flex-col gap-2 text-base font-medium px-4">
            {menus.map((menu, index) => (
              <li key={index} className="relative">
                {menu.link ? (
                  <a href={menu.link} className="flex justify-between items-center px-3 py-3 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors rounded-md">
                    <span>{menu.name}</span>
                  </a>
                ) : (
                  <div
                    className="flex justify-between items-center px-3 py-3 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors rounded-md"
                    onClick={() =>
                      dropdownMenus.includes(menu.name)
                        ? setActiveMenu(activeMenu === index ? null : index)
                        : null
                    }
                  >
                    <span>{menu.name}</span>
                    {dropdownMenus.includes(menu.name) && (
                      activeMenu === index ? (
                        <FaChevronUp size={16} className="text-blue-600" />
                      ) : (
                        <FaChevronDown size={16} className="text-blue-600" />
                      )
                    )}
                  </div>
                )}


                {activeMenu === index && dropdownMenus.includes(menu.name) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-inner px-4 py-3 mt-2 w-full transition-all duration-300 ease-in-out transform opacity-100 scale-100">
                    <h3 className="font-semibold text-sm mb-3 border-b border-blue-200 pb-2 text-gray-900">
                      {menu.heading}
                    </h3>
                    <ul>
                      {menu.subItems.map((item, subIndex) => (
                        <li
                          key={subIndex}
                          className="py-2 px-2 text-gray-700 hover:bg-blue-100 hover:text-blue-800 rounded-md cursor-pointer transition-colors"
                        >
                          <a href={item.link || '#'} target={item.link && item.link.startsWith('http') ? '_blank' : '_self'} rel={item.link && item.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                            {item.name}
                          </a>
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
