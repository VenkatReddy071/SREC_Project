

// import React, { useEffect, useState } from 'react';
// import { IoMdArrowDropdown } from "react-icons/io";
// import { IoMenu, IoClose } from "react-icons/io5";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import axios from 'axios';
// import Cart from './Components/Cart/Cart';
// import Logo from "./assets/images.png";

// if (typeof window !== 'undefined') {
//   window.axios = axios;
// }

// export const Navbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const type = location.pathname;
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);
//   const [name, setName] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://api.example.com";

//   const handleLogout = () => {
//     const url = `${SERVER_URL}/api/logout`;
//     axios.post(url, {}, { withCredentials: true })
//       .then(() => {
//         setIsLogin(false);
//         setName('');
//         navigate("/");
//       })
//       .catch(error => console.error("Logout error:", error));
//   };

//   useEffect(() => {
//     const url = `${SERVER_URL}/api/check-session`;
//     axios.get(url, { withCredentials: true })
//       .then((response) => {
//         setIsLogin(response.data?.loggedIn);
//         setName(response.data?.user?.username || '');
//       })
//       .catch((error) => {
//         console.error("Session check error:", error);
//       });
//   }, [SERVER_URL]);

//   const handleNavigate = (link) => {
//     setShowDropdown(false);
//     setDropdownOpen(false);
//     setIsMenuOpen(false);
//     navigate(link);
//   };
//    const handleSetIsCartOpenGlobally = (isOpen) => {
//     setIsCartOpenGlobally(isOpen);
//     if (isOpen) {
//       setIsMenuOpen(false);
//     }
//   };
//   return (
//     <div className="p-4 border-b border-gray-200 shadow-sm">
//       <div className="container mx-auto flex items-center  justify-between h-16">
//         <div className="flex items-center gap-4">
//           <Link to="/">
//             <div className="w-28 sm:w-32 h-auto rounded-md overflow-hidden">
//               <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
//             </div>
//           </Link>
//         </div>

//         <nav className="hidden mg:hidden  lg:flex md:items-center md:gap-8 lg:gap-10 text-gray-700 font-medium xl:text-xl lg:text-base ">
//           <ul className="flex gap-6 lg:gap-8">
//             <Link to={"/"}><li className="hover:text-blue-600 transition-colors duration-200">Local Services</li></Link>
//             <Link to={"/Hospitals"}><li className="hover:text-blue-600 transition-colors duration-200">Health Care</li></Link>
//             <Link to={"/malls"}><li className="hover:text-blue-600 transition-colors duration-200">Fashion</li></Link>
//             <Link to={"/schools"}><li className="hover:text-blue-600 transition-colors duration-200">Education Hub</li></Link>
//             <Link to="/restaurants">
//               <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors duration-200">
//                 Restaurants
//               </li>
//             </Link>
//           </ul>
//         </nav>

//         <div className="hidden lg:flex items-center gap-4 lg:gap-6">
//           {isLogin ? (
//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
//                 onClick={() => setShowDropdown(!showDropdown)}
//               >
//                 <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
//                   {name.substring(0, 2).toUpperCase()}
//                 </div>
//                 <span className="font-semibold text-gray-800">{name}</span>
//                 <IoMdArrowDropdown className="text-gray-600" />
//               </div>
//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20 border border-gray-100">
//                   <ul className="flex flex-col text-gray-800 py-1">
//                     <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-profile")}>Profile</li>
//                     <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-notification")}>Notifications</li>
//                     <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={handleLogout}>Logout</li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/login">
//               <button className="px-5 py-2 border border-black bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">
//                 Login/Sign Up
//               </button>
//             </Link>
//           )}
//           {type === '/' ?
//             <Link to="/join/dashboard">
//             <div className="button w-32 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black">
//                    <button>Join</button>
//                </div>
//             </Link>
//             :
//            <Cart onCartToggle={handleSetIsCartOpenGlobally} />
//           }
//         </div>

//         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-full bg-black text-white z-30">
//           {isMenuOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
//         </button>
//       </div>

//       <div
//         className={`fixed top-0 right-0 h-full bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out ${
//           isMenuOpen ? "translate-x-0" : "translate-x-full"
//         } lg:hidden z-20 w-3/4 sm:w-1/2 max-w-xs`}
//       >
//         {/* <div className="flex justify-end mb-6">
//           <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full bg-black text-white">
//             <IoClose size={30} />
//           </button>
//         </div> */}

//         <ul className="flex flex-col gap-4 text-gray-800 font-semibold text-lg">
//           <Link to={"/"} onClick={() => handleNavigate("/")}>
//             <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
//               Local Services
//             </li>
//           </Link>
//           <Link to={"/Hospitals"} onClick={() => handleNavigate("/Hospitals")}>
//             <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
//               Health Care
//             </li>
//           </Link>
//           <Link to={"/malls"} onClick={() => handleNavigate("/malls")}>
//             <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
//               Fashion
//             </li>
//           </Link>
//           <Link to={"/schools"} onClick={() => handleNavigate("/schools")}>
//             <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
//               Education Hub
//             </li>
//           </Link>
//           <Link to="/restaurants" onClick={() => handleNavigate("/restaurants")}>
//             <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
//               Restaurants
//             </li>
//           </Link>
//         </ul>

//         <div className="mt-2 pt-4 border-t border-gray-100  ">
//           {isLogin ? (
//             <div className="relative">
//               <div
//                 className="flex items-center gap-2 cursor-pointer py-3 rounded-md hover:bg-gray-100 transition-colors duration-200"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-lg font-bold">
//                   {name.slice(0, 2).toUpperCase()}
//                 </div>
//                 <span className="font-semibold text-gray-800">{name}</span>
//                 <IoMdArrowDropdown className="w-5 h-5 text-gray-600" />
//               </div>

//               {dropdownOpen && (
//                 <div className="w-full bg-white shadow-inner rounded-md mt-2 border border-gray-100">
//                   <ul className="flex flex-col text-gray-800 py-1">
//                     <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-profile")}>
//                       Profile
//                     </li>
//                     <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-notification")}>
//                       Notifications
//                     </li>
//                     <li
//                       className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200"
//                       onClick={handleLogout}
//                     >
//                       Logout
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center gap-4">
//               <Link to='/login' onClick={() => handleNavigate("/login")}>
//                 <button
//                   className="w-full py-3 bg-black text-white rounded-md shadow hover:bg-gray-800 transition-colors duration-200 text-base font-medium"
//                 >
//                   Login/Sign Up
//                 </button>
//               </Link>
//             </div>
//           )}

//           {type !== '/' && (
//             <div className="mt-4 flex justify-center items-center">
//                <Cart onCartToggle={handleSetIsCartOpenGlobally} />
//             </div>
//           )}

//           <div className="mt-4 w-full">
//             <Link to="/join/dashboard" onClick={() => handleNavigate("/join/dashboard")}>
//               <button
//                 className="w-full py-3 border-2 border-black text-black rounded-md shadow hover:bg-black hover:text-white transition-all duration-200 text-base font-medium"
//               >
//                 Join
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import Cart from './Components/Cart/Cart';
import Logo from "./assets/images.png";

if (typeof window !== 'undefined') {
  window.axios = axios;
}

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://api.example.com";

  const handleLogout = () => {
    const url = `${SERVER_URL}/api/logout`;
    axios.post(url, {}, { withCredentials: true })
      .then(() => {
        setIsLogin(false);
        setName('');
        navigate("/");
      })
      .catch(error => console.error("Logout error:", error));
  };

  useEffect(() => {
    const url = `${SERVER_URL}/api/check-session`;
    axios.get(url, { withCredentials: true })
      .then((response) => {
        setIsLogin(response.data?.loggedIn);
        setName(response.data?.user?.username || '');
      })
      .catch((error) => {
        console.error("Session check error:", error);
      });
  }, [SERVER_URL]);

  const handleNavigate = (link) => {
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate(link);
  };

  return (
    <div className="p-4 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Link to="/">
            <div className="w-28 sm:w-32 h-auto rounded-md overflow-hidden">
              <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex md:items-center md:gap-8 lg:gap-10 text-gray-700 font-medium xl:text-xl lg:text-base">
          <ul className="flex gap-6 lg:gap-8">
            <Link to={"/"}><li className="hover:text-blue-600 transition-colors duration-200">Local Services</li></Link>
            <Link to={"/Hospitals"}><li className="hover:text-blue-600 transition-colors duration-200">Health Care</li></Link>
            <Link to={"/malls"}><li className="hover:text-blue-600 transition-colors duration-200">Fashion</li></Link>
            <Link to={"/schools"}><li className="hover:text-blue-600 transition-colors duration-200">Education Hub</li></Link>
            <Link to="/restaurants">
              <li className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors duration-200">
                Restaurants
              </li>
            </Link>
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-4 lg:gap-6">
          {isLogin ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{name.substring(0,8)}</span>
                <IoMdArrowDropdown className="text-gray-600" />
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20 border border-gray-100">
                  <ul className="flex flex-col text-gray-800 py-1">
                    <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-profile/type?=reviews")}>Profile</li>
                    <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-notification")}>Notifications</li>
                    <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="button w-32 h-12 border-2 bg-black flex items-center justify-center hover:bg-black hover:text-white text-white">
                Login/Sign Up
              </button>
            </Link>
          )}

          {type === '/' ?
            <Link to="/join/dashboard">
              <div className="button w-32 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black">
                <button>Join</button>
              </div>
            </Link>
            :
            <Cart setIsMenuOpen={setIsMenuOpen} />
          }
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-full bg-black text-white z-30">
          {isMenuOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden z-20 w-3/4 sm:w-1/2 max-w-xs`}
      >
        <ul className="flex flex-col gap-4 text-gray-800 font-semibold text-lg">
          <Link to={"/"} onClick={() => handleNavigate("/")}>
            <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
              Local Services
            </li>
          </Link>
          <Link to={"/Hospitals"} onClick={() => handleNavigate("/Hospitals")}>
            <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
              Health Care
            </li>
          </Link>
          <Link to={"/malls"} onClick={() => handleNavigate("/malls")}>
            <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
              Fashion
            </li>
          </Link>
          <Link to={"/schools"} onClick={() => handleNavigate("/schools")}>
            <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
              Education Hub
            </li>
          </Link>
          <Link to="/restaurants" onClick={() => handleNavigate("/restaurants")}>
            <li className="py-2 border-b border-gray-100 hover:text-blue-600 transition-colors duration-200">
              Restaurants
            </li>
          </Link>
        </ul>

        <div className="mt-2 pt-4 border-t border-gray-100">
          {isLogin ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer py-3 rounded-md hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-lg font-bold">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{name.substring(0,8)}</span>
                <IoMdArrowDropdown className="w-5 h-5 text-gray-600" />
              </div>

              {showDropdown && (
                <div className="w-full bg-white shadow-inner rounded-md mt-2 border border-gray-100">
                  <ul className="flex flex-col text-gray-800 py-1">
                    <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-profile/type?=reviews")}>
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200" onClick={() => handleNavigate("/user-notification")}>
                      Notifications
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Link to='/login' onClick={() => handleNavigate("/login")}>
                <button
                  className="button w-32 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white text-black"
                >
                  Login/Sign Up
                </button>
              </Link>
            </div>
          )}

          {type !== '/' && (
            <div className="mt-4 flex justify-center items-center">
              <Cart setIsMenuOpen={setIsMenuOpen} />
            </div>
          )}

          <div className="mt-4 w-full">
            <Link to="/join/dashboard" onClick={() => handleNavigate("/join/dashboard")}>
              <button
                className="w-full py-3 border-2 border-black text-black rounded-md shadow hover:bg-black hover:text-white transition-all duration-200 text-base font-medium"
              >
                Join
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};