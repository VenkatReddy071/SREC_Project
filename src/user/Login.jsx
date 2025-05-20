import React, { useState } from 'react';
import { FaUser, FaGoogle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Axios from 'axios';
Axios.defaults.withCredentials = true;
import Toast from "../Pages/Toast";
import { toast } from 'react-toastify';
import ForgotPassword from './ForgetPassword';

export const Login = ({ setIsOpen }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [forget, setForget] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const tabs = ['Login', 'Sign Up'];

  const handleTabClick = (tab) => {
    setActiveTab(tab.toLowerCase());
  };

  const handleLogin = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/login`;
      const response = await Axios.post(url, { email, password },{withCredentials:true});
      toast.success(response.data.message || 'Login successful');
      setIsOpen(false);
      
      
    } catch (error) {
         toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSign = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/sign`;
      const response = await Axios.post(url, {
        email,
        password,
        username,
        type: 'user',
      },{withCredentials:true});
      console.log(response.data.message);
      
      setIsOpen(false);
      setActiveTab('login');
 toast.success(response.data.message || 'Sign in successful');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed');
    }
  };


  return (
    <div className="md:fixed inset-0 w-full max-h-screen flex justify-center items-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <MdClose className="h-5 w-5" />
        </button>

        {!forget ? (
          <>
            <div className="flex border-b border-gray-300 mb-6">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 text-lg font-semibold focus:outline-none ${
                    activeTab === tab.toLowerCase()
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Login Section */}
            {activeTab === 'login' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Login to your account</h2>
                <div className="flex items-center border rounded-md px-2">
                  <FaUser className="text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full py-2 px-2 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center border rounded-md px-2">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full py-2 px-2 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end mb-2">
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => setForget(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Sign Up Section */}
            {activeTab === 'sign up' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Create a new account</h2>
                <div className="flex items-center border rounded-md px-2">
                  <FaUser className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full py-2 px-2 focus:outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center border rounded-md px-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full py-2 px-2 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center border rounded-md px-2">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full py-2 px-2 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  onClick={handleSign}
                  className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Google Auth */}
            <div className="border-t border-gray-300 mt-6 pt-4">
              <button
                className="w-full py-3 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2"
                onClick={() => alert('Google login not implemented yet')}
              >
                <FaGoogle className="text-red-500" />
                Continue with Google
              </button>
            </div>
          </>
        ) : (
          <ForgotPassword setForget={setForget} />
        )}
      </div>
        
    </div>
  );
};
