import React,{useEffect,useState} from "react";
import axios from "axios"
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import {toast} from "react-toastify"
export const Fotter = () => {

  const [email,setEmail]=useState('');
    const [loading,setLoading]=useState(false);
    const handleSubscribe=async()=>{
      try{
          setLoading(true);
          const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/subscribe`,{email},{withCredentials:true});
          if(response.status===200){
            toast.success(response.data?.message || "Thanks for Subscribing!")
            setEmail('');
          }
          else{
            toast.error("Failed to subscribe !");
          }
      }
      catch(error){
        toast.error(error?.message || "Server Error");
      }
      finally{
        setLoading(false);
      }
    }
  return (
    <footer className="bg-white border-t border-gray-200 py-10 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-gray-700">
        <div>
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
          <Link to="/About-us"><li>About Us</li></Link>
          <Link to="/services"><li>Services</li></Link>
            
          </ul>
        </div>

        {/* Stay Connected */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Stay Connected</h2>
          <ul className="space-y-2">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
          <ul className="space-y-2">
            <Link to="/signup"><li>Sign Up</li></Link>
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Subscribe</h2>
          <p className="text-sm mb-4">
            Join our newsletter to stay informed on updates and promotions.
          </p>
          <div className="w-56 md:w-auto flex md:gap-1 items-center border border-gray-400 rounded ">
            <input
              type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              className="md:w-36 p-2 text-sm focus:outline-none"
            />
            <button className="bg-black text-white px-8 py-2" onClick={handleSubscribe}>
              {loading ?<div className="flex items-center">
                        
                      Sending...
                      </div>:"Subscribe"}</button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 mt-8 pt-4 text-sm text-center text-gray-500 ">
        <div className="flex flex-wrap  gap-4 items-start justify-between">
          <div className="flex gap-6">
          <span>© All rights reserved.</span>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          </div>
          <div className=" flex  space-x-4">
  <a
    href="#"
    className="text-gray-500 hover:text-black"
    aria-label="Facebook"
  >
    <FaFacebookF size={20} />
  </a>
  <a
    href="#"
    className="text-gray-500 hover:text-black"
    aria-label="Instagram"
  >
    <FaInstagram size={20} />
  </a>
  <a
    href="#"
    className="text-gray-500 hover:text-black"
    aria-label="Twitter"
  >
    <FaTwitter size={20} />
  </a>
  <a
    href="#"
    className="text-gray-500 hover:text-black"
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
