import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaHospitalSymbol,
  FaMailBulk,
  FaQuestionCircle,
  FaSchool,
  FaShoppingCart,
  FaSignOutAlt,
  FaStore,
  FaTachometerAlt,
  FaTags,
  FaUsers
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useDashboardSocket } from "../../../Context/Socket/DashboardContext";

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
  { name: "HistoryLogs", path: "/admin-dashboard/logs", icon: <FaSignOutAlt /> },
];


export const DashHome = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { socket } = useDashboardSocket();

  useEffect(() => {
    const token = localStorage.getItem("dashboard");
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setIsLogin(response.data?.loggedIn);
        setName(response.data?.user?.username || response.data?.userDataFromToken?.username || "Admin");
      } catch (error) {
        setIsLogin(false);
        setName("Guest");
      }
    };
    if (token) {
      fetchProfile();
    } else {
      setIsLogin(false);
      setName("Guest");
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('dashboardConnected', (data) => {
      });

      socket.on("orderNotification", (data) => {
        toast.info("New general order is placed..");
      });

      socket.on("newBooking", (data) => {
        const hospitalName = data.booking?.Hospital?.name || data.hospitalId || 'an unknown hospital';
        toast.info(`New Hospital Booking from ${data.username || 'a user'} for ${hospitalName}.`);
      });

      socket.on("newRestaurantNotification", (data) => {
        toast.info("New Restaurant Orders!");
      });

      socket.on("newFashionNotification", (data) => {
        toast.info("New Fashion Orders!");
      });

      return () => {
        socket.off("dashboardConnected");
        socket.off("orderNotification");
        socket.off("newBooking");
        socket.off("newRestaurantNotification");
        socket.off("newFashionNotification");
      };
    } else {
    }
  }, [socket]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`bg-white text-black font-serif h-full overflow-y-auto transition-all duration-300 top-0 left-0 flex flex-col ${
          isOpen ? "w-60" : "w-20"
        }`}
      >
        <div className="flex flex-grow items-center justify-between bg-black text-white p-4">
          {isOpen && <h1 className="text-xl font-bold">Admin Dashboard</h1>}
          <button onClick={toggleSidebar}>
            <FaBars className="w-6 h-6" />
          </button>
        </div>

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

      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="w-full bg-gray-200 px-6 py-4 flex justify-between items-center shadow">
          <h1 className="text-2xl font-medium">{pageTitle}</h1>

          <div className="flex items-center gap-6 relative">
            <div className="relative cursor-pointer">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </div>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:inline">{name}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};