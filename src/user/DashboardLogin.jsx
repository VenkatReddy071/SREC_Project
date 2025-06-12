import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import Doctor from "../assets/Doctor.avif";
import Restaurant from "../assets/Restaurant.avif";
import Shopping from "../assets/Shopping.jpg";
import Schools from "../assets/Schools.jpg";
import {useNavigate} from "react-router-dom";
import { Hospital, Utensils, School, GraduationCap, ShoppingBag, UserPlus, Square, ArrowRight, LogIn, Briefcase, Handshake, X } from 'lucide-react'; // Added X for close icon
import Axios from "axios"
const ForgetPassword = ({ setOpen }) => {
  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = () => {
    console.log("Password reset requested for:", resetEmail);
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      text-align: center;
      font-family: 'Inter', sans-serif;
    `;
    messageBox.innerHTML = `
      <p style="margin-bottom: 15px; font-size: 1.1em;">Password reset link sent to your email (simulated).</p>
      <button onclick="this.parentNode.remove()" style="
        background-color: #4F46E5;
        color: white;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
      ">OK</button>
    `;
    document.body.appendChild(messageBox);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        <div className="mb-4">
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-600">Email Address</label>
          <input
            type="email"
            id="reset-email"
            placeholder="Enter your email"
            required
            onChange={(e) => setResetEmail(e.target.value)}
            value={resetEmail}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password? <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setOpen(false)}>Back to Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Content = ({ item, reverse }) => (
  <div className={`flex flex-col md:flex-row items-center gap-8 py-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className="md:w-1/2 flex-shrink-0">
      <img
        src={item.Img}
        alt={item.Heading}
        className="w-full h-auto rounded-lg shadow-lg object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/ccc/white?text=Image+Error" }}
      />
    </div>
    <div className="md:w-1/2 text-center md:text-left">
      {item.Sub && <p className="text-indigo-600 text-sm font-semibold uppercase mb-2">{item.Sub}</p>}
      <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.Heading}</h3>
      <p className="text-gray-700 text-lg mb-6">{item.Info}</p>
      {item.divBox && Array.isArray(item.divBox) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {item.divBox.map((box, idx) => (
            <div key={idx} className="flex items-start bg-gray-100 p-4 rounded-lg shadow-sm">
              <span className="text-indigo-600 text-2xl mr-3">{box.Icon}</span>
              <div>
                <h4 className="font-semibold text-gray-800">{box.Heading}</h4>
                <p className="text-gray-600 text-sm">{box.Info}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {item.Button && (
        <a href={item.link || '#'} className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 font-semibold">
          {item.Button} <ArrowRight className="ml-2" />
        </a>
      )}
    </div>
  </div>
);

const PartnerAuthModal = ({ onClose, setOpenForgotPassword }) => {
  const navigate=useNavigate();
  const [dashboardType, setDashboardType] = useState('admin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleDashboardChange = (e) => {
    setDashboardType(e.target.value);
  };

  const handleDashboardLogin = async(e) => {
    e.preventDefault();
    console.log(`Attempting to login as ${dashboardType} with email: ${email}, password: ${password}`);
    if (email && password) {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/dashboard`;
    const response = await Axios.post(url, { email, password }, { withCredentials: true });
    navigate(`/dashboard/type?=${response.data.url}`)
    } else {
      console.error("Login failed: Please enter email and password.");
    }
  };

  const handleSignupSubmit =async (e) => {
    e.preventDefault();
    if (signupName && signupEmail && signupPassword) {
        const url = `${import.meta.env.VITE_SERVER_URL}/api/sign`;
              const response = await Axios.post(
                url,
                { email:signupEmail, password:signupPassword, username:signupName, type: dashboardType },
                { withCredentials: true }
              );
              console.log(response.data)
              localStorage.setItem("dashboard",response.data?.token)
              setLoginMode(true);
    } else {
      console.error("Signup failed: Please fill all fields.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Partner {isLoginMode ? 'Login' : 'Signup'}
        </h2>
        <div className="flex justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-l-lg font-semibold transition-colors duration-300 ${isLoginMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-r-lg font-semibold transition-colors duration-300 ${!isLoginMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setIsLoginMode(false)}
          >
            Sign Up
          </button>
        </div>

        {isLoginMode ? (
          <form onSubmit={handleDashboardLogin} className="space-y-6">
            <div>
              <label htmlFor="dashboard-type-login" className="block text-sm font-medium text-gray-700">
                Dashboard Type
              </label>
              <select
                id="dashboard-type-login"
                name="dashboardType"
                value={dashboardType}
                onChange={handleDashboardChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="admin">Admin</option>
                <option value="hospital">Hospital</option>
                <option value="school">School</option>
                <option value="restaurant">Restaurant</option>
                <option value="mall">Mall</option>
              </select>
            </div>
            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email-login"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password-login"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="text-sm text-right">
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => setOpenForgotPassword(true)}>
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiLogIn className="mr-2 h-5 w-5" /> Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <div>
              <label htmlFor="dashboard-type-signup" className="block text-sm font-medium text-gray-700">
                Dashboard Type
              </label>
              <select
                id="dashboard-type-signup"
                name="dashboardType"
                value={dashboardType}
                onChange={handleDashboardChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="admin">Admin</option>
                <option value="hospital">Hospital</option>
                <option value="school">School</option>
                <option value="restaurant">Restaurant</option>
                <option value="mall">Mall</option>
              </select>
            </div>
            <div>
              <label htmlFor="name-signup" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name-signup"
                name="name"
                autoComplete="name"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email-signup"
                name="email"
                autoComplete="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password-signup"
                name="password"
                autoComplete="new-password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="mr-2 h-5 w-5" /> Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


const DashboardLogin = () => {
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const content = [
    {
      id: "school-college-service",
      Sub: 'Education',
      Heading: 'Explore Our Comprehensive Schools & Colleges Section for Informed Decisions',
      Info: 'Discover detailed information about the local schools and colleges. From curriculum to admission Process, we provide everything you need to make informed choices.',
      divBox: [
        {
          Icon: <Square />,
          Heading: 'Detailed Insights',
          Info: 'Access essential details like fees, seat Availability, and contact information.',
        },
        {
          Icon: <Square />,
          Heading: 'Get Started',
          Info: 'Visit our schools & Colleges section to learn more and explore options.',
        },
      ],
      Button: 'Learn More',
      link: "/schools",
      Img: Schools,
      Reverse: false,
    },
    {
      id: "hospital-service",
      Sub: 'Health',
      Heading: 'Explore Top Hospitals in Your Area',
      Info: 'Discover a range of hospitals with specialization services tailored to your needs. Easily find doctors, book appointments, and access essential healthcare information.',
      divBox: [
        {
          Icon: <Square />,
          Heading: 'Find Doctors',
          Info: 'Search for quality doctors by specialization and location effortlessly.',
        },
        {
          Icon: <Square />,
          Heading: 'Book Appointments',
          Info: 'Schedule your appointments with just a few clicks.',
        },
      ],
      Button: 'Learn More',
      Img: Doctor,
      link: "/Hospitals",
      Reverse: true,
    },
    {
      id: "restaurant-service",
      Sub: 'Culinary Delights',
      Heading: 'Discover Local Dining: Explore the Best Restaurants in Your Area ',
      Info: 'Indulge in a culinary adventure with our curated list of local restaurants. From cozy cafes to fine dining, find the perfect spot to satisfy your cravings.',
      divBox: [
        {
          Icon: <Square />,
          Heading: 'Diverse Cuisines',
          Info: 'Explore a variety of dining options from around the world.',
        },
        {
          Icon: <Square />,
          Heading: 'Easy Booking',
          Info: 'Reserve your table effortlessly with our integrated booking system.',
        }
      ],
      Button: 'Explore Restaurants',
      link: "/restaurants",
      Img: Restaurant,
      Reverse: false,
    },
    {
      id: "mall-service",
      Sub: 'Shopping & Retail',
      Heading: 'Discover the best shopping malls near you with exclusive offers and promotions. ',
      Info: 'Explore a wide range of stores from fashion to electronics in our shopping malls section. Find the latest deals and plan your visit today!',
      divBox: [
        {
          Icon: <Square />,
          Heading: 'Exclusive Deals',
          Info: 'Access special discounts and promotions from your favorite brands.',
        },
        {
          Icon: <Square />,
          Heading: 'Event Listings',
          Info: 'Stay updated on all the exciting events happening at the malls.',
        }
      ],
      Button: 'Find Malls',
      link: "/malls",
      Img: Shopping,
      Reverse: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-inter">
      <nav className="bg-white shadow-md py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 rounded-b-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-3xl font-extrabold text-indigo-700 mb-4 sm:mb-0">
            NDLCART
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm sm:text-base font-medium">
            <a href="#hospital-service" className="text-gray-600 hover:text-indigo-700 transition-colors duration-300 px-3 py-1 rounded-lg">Hospitals</a>
            <a href="#school-college-service" className="text-gray-600 hover:text-indigo-700 transition-colors duration-300 px-3 py-1 rounded-lg">Schools & Colleges</a>
            <a href="#restaurant-service" className="text-gray-600 hover:text-indigo-700 transition-colors duration-300 px-3 py-1 rounded-lg">Restaurants</a>
            <a href="#mall-service" className="text-gray-600 hover:text-indigo-700 transition-colors duration-300 px-3 py-1 rounded-lg">Shopping Malls</a>
          </div>

          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowPartnerModal(true)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 font-semibold"
            >
              Partner Login
            </button>
          </div>
        </div>
      </nav>

      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-b-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Connecting Communities, Empowering Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-10">
            Whether you're looking for local services or aiming to expand your reach, NDLCART is your ultimate platform.
            Discover top-tier institutions and businesses, or join our network to grow your service.
          </p>
        </div>
      </section>

      <section id="why-partner" className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50 rounded-xl max-w-7xl mx-auto my-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Why Partner With NDLCART?
        </h2>
        <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
          Join our growing network of top-tier hospitals, leading educational institutions, beloved restaurants,
          and thriving shopping malls. Expand your visibility, streamline operations, and connect with a wider audience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center">
            <Handshake size={48} className="text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reach New Customers</h3>
            <p className="text-gray-600 text-sm">
              Showcase your services to a vast and engaged user base actively searching for local solutions.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl flex flex-col items-center">
            <Briefcase size={48} className="text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamline Operations</h3>
            <p className="text-gray-600 text-sm">
              Leverage our intuitive dashboard to manage your profile, services, and customer interactions efficiently.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center">
            <ArrowRight size={48} className="text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow Your Business</h3>
            <p className="text-gray-600 text-sm">
              Access powerful tools and insights designed to help your business thrive and expand its footprint.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPartnerModal(true)}
          className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300 font-semibold text-lg"
        >
          Join Our Partner Network <ArrowRight className="ml-3" />
        </button>
      </section>

      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg max-w-7xl mx-auto my-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Discover Comprehensive Local Services
        </h2>
        <div className="flex flex-col gap-16">
          {content.map((item, index) => (
            <Content key={index} item={item} reverse={item.Reverse} />
          ))}
        </div>
      </section>

      {showPartnerModal && (
        <PartnerAuthModal onClose={() => setShowPartnerModal(false)} setOpenForgotPassword={setOpenForgotPassword} />
      )}

      {openForgotPassword && <ForgetPassword setOpen={setOpenForgotPassword} />}
    </div>
  );
};

export default DashboardLogin;