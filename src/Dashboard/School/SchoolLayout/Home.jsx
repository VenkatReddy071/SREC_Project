// import React, { useState, useEffect } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import axios from "axios";
// import { useParams, Link, useLocation } from 'react-router-dom'; 
// import {
//     FaTachometerAlt,
//     FaCog,
//     FaUsers,
//     FaBars,
//     FaBell,
//     FaUserCircle,
//     FaSignOutAlt,
//     FaInfoCircle,
//     FaGraduationCap,
//     FaChalkboardTeacher,
//     FaEnvelope,
//     FaBuilding,
//     FaHome,
// } from "react-icons/fa";


// const menuItems = [
//     { name: "Dashboard", path: "/education-dashboard/:id", icon: <FaTachometerAlt /> },
//     { name: "Institution Info", path: "/education-dashboard/:id/info", icon: <FaHome /> },
//     { name: "Teachers", path: "/education-dashboard/:id/teachers", icon: <FaChalkboardTeacher /> },
//     { name: "Contact Us", path: "/education-dashboard/:id/contact", icon: <FaEnvelope /> },
// ];

// export const SchoolCollegeDashboard = () => {
//      const { id } = useParams();
//     const location = useLocation();
//     const [isOpen, setIsOpen] = useState(true);
//     const [pageTitle, setPageTitle] = useState("Dashboard");
//     const [profileOpen, setProfileOpen] = useState(false);
//     const [isLogin, setIsLogin] = useState(false);
//     const [name, setName] = useState("Guest");
//     const [institutionData, setInstitutionData] = useState(null);

//     const toggleSidebar = () => setIsOpen(!isOpen);
//      const getMenuItemPath = (basePath) => {
//         return id ? basePath.replace(":id", id) : basePath;
//     };
//     useEffect(() => {
//         const currentPath = window.location.pathname;
//         const activeItem = menuItems.find((item) => currentPath.startsWith(item.path));
//         if (activeItem) {
//             setPageTitle(activeItem.name);
//         } else {
//             setPageTitle("Dashboard");
//         }

//         const token = localStorage.getItem("dashboard");

//         const fetchPromises = [
//             axios.get(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
//                 headers: { Authorization: `Bearer ${token}` },
//                 withCredentials: true,
//             }),
//             axios.get(`${import.meta.env.VITE_SERVER_URL}/api/school/by-email/profile`, {
//                 headers: { Authorization: `Bearer ${token}` },
//                 withCredentials: true,
//             }),
//         ];

//         Promise.all(fetchPromises)
//             .then(([profileResponse, institutionResponse]) => {
//                 setIsLogin(profileResponse.data?.loggedIn);
//                 setName(profileResponse.data?.user?.username || profileResponse.data?.userDataFromToken?.username || "Admin");

//                 if (institutionResponse.data?.success && institutionResponse.data.institution) {
//                     setInstitutionData(institutionResponse.data.institution);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Dashboard data fetch error:", error);
//                 setIsLogin(false);
//                 setName("Guest");
//                 setInstitutionData(null);
//             });
//     }, []);

//     useEffect(() => {
//         const handleLocationChange = () => {
//             const currentPath = window.location.pathname;
//             const activeItem = menuItems.find((item) => currentPath.startsWith(item.path));
//             if (activeItem) {
//                 setPageTitle(activeItem.name);
//             } else {
//                 setPageTitle("Dashboard");
//             }
//         };

//         window.addEventListener("popstate", handleLocationChange);
//         return () => {
//             window.removeEventListener("popstate", handleLocationChange);
//         };
//     }, []);

//     return (
//         <div className="flex h-screen bg-gray-100">
//             <div
//                 className={`bg-white text-black font-serif h-full transition-all duration-300 relative z-20 shadow-lg ${
//                     isOpen ? "w-64" : "w-20"
//                 }`}
//             >
//                 <div className="flex items-center justify-between bg-blue-800 text-white p-4 h-16 shadow-md">
//                     {isOpen && <h1 className="text-xl font-bold truncate">School/College Admin</h1>}
//                     <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-blue-700 transition-colors">
//                         <FaBars className="w-6 h-6" />
//                     </button>
//                 </div>

//                 <nav className="mt-4 flex flex-col gap-1 overflow-y-scroll h-[calc(100%-10rem)]">
//                     {menuItems.map((item, index) => (
//                         <NavLink
//                             key={index}
//                             to={item.path}
//                             className={({ isActive }) =>
//                                 `flex items-center gap-4 p-4 mx-2 rounded-lg text-lg transition-colors duration-200
//                                     ${
//                                         isActive
//                                             ? "bg-blue-600 text-white shadow-md"
//                                             : "text-gray-700 hover:bg-blue-100 hover:text-blue-800"
//                                     }`
//                             }
//                         >
//                             <span className="text-xl">{item.icon}</span>
//                             <span className={`${isOpen ? "block" : "hidden"} whitespace-nowrap overflow-hidden text-ellipsis`}>
//                                 {item.name}
//                             </span>
//                         </NavLink>
//                     ))}
                    
//                 </nav>
//                 <div
//                     className={`absolute bottom-0 bg-blue-800 text-gray-300 p-4 border-t border-gray-700 ${
//                         isOpen ? "w-64" : "w-20 h-20 flex items-center justify-center"
//                     }`}
//                 >
//                     {isOpen ? (
//                         institutionData ? (
//                             <div>
//                                 <h2 className="font-semibold text-lg text-white truncate">{institutionData.name || 'Institution Name'}</h2>
//                                 <p className="text-sm text-gray-400 truncate">Type: {institutionData.institutionType || 'N/A'}</p>
//                                 <p className="text-sm text-gray-400 truncate">Location: {institutionData.location || 'N/A'}</p>
//                                 <p className="text-sm text-gray-400 truncate">Email: {institutionData.email || 'N/A'}</p>
//                             </div>
//                         ) : (
//                             <div className="text-sm text-gray-400">Loading Institution Info...</div>
//                         )
//                     ) : (
//                         <FaInfoCircle className="w-8 h-8 text-gray-300" title="Institution Info" />
//                     )}
//                 </div>
//             </div>

//             <div className="flex-1 flex flex-col bg-gray-100">
//                 <header className=" bg-white px-6 py-4 flex justify-between items-center shadow-md z-10">
//                     <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
//                     <div className="flex items-center gap-6 relative">
//                         <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
//                             <FaBell className="w-6 h-6" />
//                             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-white">
//                                 0
//                             </span>
//                         </div>

//                         <div className="relative">
//                             <button
//                                 onClick={() => setProfileOpen(!profileOpen)}
//                                 className="flex items-center gap-2 cursor-pointer focus:outline-none"
//                             >
//                                 <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold ring-2 ring-blue-300">
//                                     {name ? name.substring(0, 2).toUpperCase() : <FaUserCircle className="w-6 h-6" />}
//                                 </div>
//                                 <span className="hidden md:inline font-medium text-gray-800">{name}</span>
//                             </button>
//                             {profileOpen && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
//                                     <NavLink
//                                         to="/school-dashboard/profile"
//                                         className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                                     >
//                                         Profile
//                                     </NavLink>
//                                     <NavLink to="/logout" className="block px-4 py-2 text-red-600 hover:bg-red-50">
//                                         Logout
//                                     </NavLink>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </header>

//                 <main className="flex-1 overflow-y-auto p-6">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>

//     );
// };

import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
    FaTachometerAlt,
    FaBars,
    FaBell,
    FaUserCircle,
    FaInfoCircle,
    FaChalkboardTeacher,
    FaEnvelope,
    FaHome,
} from "react-icons/fa";

const baseMenuItems = [
    { name: "Dashboard", path: "/education-dashboard/:id", icon: <FaTachometerAlt /> },
    { name: "Institution Info", path: "/education-dashboard/:id/info", icon: <FaHome /> },
    { name: "Teachers", path: "/education-dashboard/:id/teachers", icon: <FaChalkboardTeacher /> },
    { name: "Contact Us", path: "/education-dashboard/:id/contact", icon: <FaEnvelope /> },
];

export const SchoolCollegeDashboard = () => {
    const { id } = useParams();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(true);
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState("Guest");
    const [institutionData, setInstitutionData] = useState(null);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const getMenuItemPath = (basePath) => {
        return id ? basePath.replace(":id", id) : basePath;
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const activeItem = baseMenuItems.find((item) => {
            const fullPath = getMenuItemPath(item.path);
            if (item.name === "Dashboard") {
                return currentPath === fullPath;
            }
            return currentPath.startsWith(fullPath);
        });

        if (activeItem) {
            setPageTitle(activeItem.name);
        } else {
            setPageTitle("Dashboard");
        }

        const token = localStorage.getItem("dashboard");

        if (id) {
            const fetchPromises = [
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }),
                axios.get(`${import.meta.env.VITE_SERVER_URL}/api/school/${id}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }),
            ];

            Promise.all(fetchPromises)
                .then(([profileResponse, institutionResponse]) => {
                    setIsLogin(profileResponse.data?.loggedIn);
                    setName(profileResponse.data?.user?.username || profileResponse.data?.userDataFromToken?.username || "Admin");
                    if (institutionResponse.data?.success && institutionResponse.data.institution) {
                        setInstitutionData(institutionResponse.data.institution);
                    }
                })
                .catch((error) => {
                    console.error("Dashboard data fetch error:", error);
                    setIsLogin(false);
                    setName("Guest");
                    setInstitutionData(null);
                });
        }
    }, [id, location.pathname]);

    return (
        <div className="flex h-screen bg-gray-100">
            <div
                className={`bg-white text-black font-serif h-full transition-all duration-300 relative z-20 shadow-lg ${
                    isOpen ? "w-64" : "w-20"
                }`}
            >
                <div className="flex items-center justify-between bg-blue-800 text-white p-4 h-16 shadow-md">
                    {isOpen && <h1 className="text-xl font-bold truncate">School/College Admin</h1>}
                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <FaBars className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-4 flex flex-col gap-1 overflow-y-scroll h-[calc(100%-10rem)]">
                    {baseMenuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={getMenuItemPath(item.path)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 p-4 mx-2 rounded-lg text-lg transition-colors duration-200
                                    ${
                                        isActive
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
                </nav>
                <div
                    className={`absolute bottom-0 bg-blue-800 text-gray-300 p-4 border-t border-gray-700 ${
                        isOpen ? "w-64" : "w-20 h-20 flex items-center justify-center"
                    }`}
                >
                    {isOpen ? (
                        institutionData ? (
                            <div>
                                <h2 className="font-semibold text-lg text-white truncate">{institutionData.name || 'Institution Name'}</h2>
                                <p className="text-sm text-gray-400 truncate">Type: {institutionData.institutionType || 'N/A'}</p>
                                <p className="text-sm text-gray-400 truncate">Location: {institutionData.location || 'N/A'}</p>
                                <p className="text-sm text-gray-400 truncate">Email: {institutionData.email || 'N/A'}</p>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400">Loading Institution Info...</div>
                        )
                    ) : (
                        <FaInfoCircle className="w-8 h-8 text-gray-300" title="Institution Info" />
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-gray-100">
                <header className=" bg-white px-6 py-4 flex justify-between items-center shadow-md z-10">
                    <h1 className="text-2xl font-semibold text-gray-800">{pageTitle}</h1>
                    <div className="flex items-center gap-6 relative">
                        <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
                            <FaBell className="w-6 h-6" />
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-white">
                                0
                            </span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 cursor-pointer focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold ring-2 ring-blue-300">
                                    {name ? name.substring(0, 2).toUpperCase() : <FaUserCircle className="w-6 h-6" />}
                                </div>
                                <span className="hidden md:inline font-medium text-gray-800">{name}</span>
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
                                    <NavLink
                                        to={`/education-dashboard/${id}/profile`}
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink to="/logout" className="block px-4 py-2 text-red-600 hover:bg-red-50">
                                        Logout
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};