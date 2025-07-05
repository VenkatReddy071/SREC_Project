import React,{useEffect,useState} from "react";
import axios from "axios"
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import {toast} from "react-toastify"

if (typeof window !== 'undefined') {
  window.toast = toast;
  window.axios = axios;
}

export const Fotter = () => {
  const [email,setEmail]=useState('');
  const [loading,setLoading]=useState(false);

  const handleSubscribe=async()=>{
    try{
      setLoading(true);
      const serverUrl = import.meta.env.VITE_SERVER_URL || "https://api.example.com";
      const response=await axios.post(`${serverUrl}/api/subscribe`,{email},{withCredentials:true});
      if(response.status===200){
        toast.success(response.data?.message || "Thanks for Subscribing!")
        setEmail('');
      } else {
        toast.error("Failed to subscribe !");
      }
    } catch(error){
      toast.error(error?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-white border-t border-gray-200 py-10 px-4 sm:px-8 rounded-t-lg">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-gray-700">
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-extrabold text-gray-800">NANDYAL INFO</h1>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h2>
          <ul className="space-y-2 text-base">
            <Link to="/About-us" className="hover:text-blue-600 transition-colors duration-200"><li>About Us</li></Link>
            <Link to="/services" className="hover:text-blue-600 transition-colors duration-200"><li>Services</li></Link>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Stay Connected</h2>
          <ul className="space-y-2 text-base">
            <a href="#" className="hover:text-blue-600 transition-colors duration-200"><li>Facebook</li></a>
            <a href="#" className="hover:text-blue-600 transition-colors duration-200"><li>Twitter</li></a>
            <a href="#" className="hover:text-blue-600 transition-colors duration-200"><li>Instagram</li></a>
            <a href="#" className="hover:text-blue-600 transition-colors duration-200"><li>LinkedIn</li></a>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Newsletter</h2>
          <ul className="space-y-2 text-base">
            <Link to="/signup" className="hover:text-blue-600 transition-colors duration-200"><li>Sign Up</li></Link>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Subscribe</h2>
          <p className="text-sm mb-4 text-gray-600">
            Join our newsletter to stay informed on updates and promotions.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center border border-gray-400 rounded-lg overflow-hidden w-full max-w-xs sm:max-w-none">
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 text-sm focus:outline-none flex-grow rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none w-full"
            />
            <button
              className="bg-black text-white px-4 py-3 text-sm font-medium rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none hover:bg-gray-800 transition-colors duration-200 w-full sm:w-auto flex-shrink-0"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-10 pt-6 text-sm text-center text-gray-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-gray-600">
            <span>© {new Date().getFullYear()} All rights reserved.</span>
            <a href="/policy" className="hover:underline hover:text-blue-600 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline hover:text-blue-600 transition-colors duration-200">
              Terms of Service
            </a>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
