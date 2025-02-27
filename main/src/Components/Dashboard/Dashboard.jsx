import "./Dashboard.css";
import { MdSpaceDashboard, MdFastfood, MdCloudUpload } from "react-icons/md";
import { RiMenuUnfold3Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { BiSolidOffer } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { FaBookReader } from "react-icons/fa";
import { RiCustomerService2Line } from "react-icons/ri";
import { GiHelp } from "react-icons/gi";
import { useState } from "react";

function Dashboard({ children }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation(); // To determine the active route

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const notificationCount = 3;

  // Define navigation menu items
  const menuItems = [
    { path: "/dashboard", icon: <MdSpaceDashboard />, label: "Dashboard" },
    { path: "/menu", icon: <RiMenuUnfold3Fill />, label: "Menu" },
    { path: "/offers", icon: <BiSolidOffer />, label: "Offers" },
    { path: "/upload", icon: <MdCloudUpload />, label: "Upload" },
    { path: "/orders", icon: <MdFastfood />, label: "Orders" },
    {path:"/reservation",icon:< FaBookReader/>,label:"Reservation"},
    {path:"customers",icon:<RiCustomerService2Line/>,label:"Customers"},
    {path:"help",icon:<GiHelp/>,label:"Help"},
    { path: "/settings", icon: <IoMdSettings />, label: "Settings" },
  
  ];

  return (
    <div className="dashboard">
      <div className="container">
        {/* Sidebar */}
        <div className={`left ${expanded ? "expanded" : "collapsed"}`}>
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <h2>NK</h2>
          </div>
          <div className="navbar">
            <nav>
              <ul>
                {menuItems.map((item) => (
                  <li
                    key={item.path}
                    className={location.pathname === item.path ? "active" : ""}
                  >
                    <Link to={item.path}>
                      <span className="icon">{item.icon}</span>
                      {expanded && <span>{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="right">
          <div className="content">
            <div className="topbar">
              <div className="menu-toggle" onClick={toggleSidebar}>
                <RiMenuUnfold3Fill className="toggle-icon" />
              </div>
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search here..." />
              </div>
              <div className="topbar-right">
                <div className="notification">
                  <IoMdNotificationsOutline className="notification-icon" />
                  {notificationCount > 0 && (
                    <span className="notification-count">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <div className="user-info">
                  <h2>John Doe</h2>
                  <div className="profile"></div>
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
