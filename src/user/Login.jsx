import React, { useState } from 'react';
import { FaUser, FaGoogle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import ForgotPassword from './ForgetPassword';

export const Login = ({ setIsOpen }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [forget, setForget] = useState(false);
  const tabs = ['Login', 'Sign Up'];

  const handleTabClick = (tab) => {
    setActiveTab(tab.toLowerCase());
  };

  return (
    <div className="md:fixed inset-0 w-full max-h-screen flex justify-center items-center bg-black bg-opacity-60 z-50">
      <div className="absolute bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1"
        >
          <MdClose className="h-5 w-5" />
        </button>

        {/* Conditional Rendering */}
        {!forget ? (
          <>
            {/* Tabs */}
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

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="py-4">
                <h2 className="text-xl font-semibold mb-4">Login to your account</h2>
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex items-center border rounded-md focus-within:border-blue-500">
                    <FaUser className="ml-3 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="block w-full py-2 pl-3 pr-3 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-md focus-within:border-blue-500">
                    <input
                      type="password"
                      placeholder="Password"
                      className="block w-full py-2 pl-3 pr-3 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end mb-2">
                    <button
                      type="button"
                      className="text-sm text-blue-500 hover:underline focus:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setForget(true);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md py-3 font-semibold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Log In
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() => handleTabClick('Sign Up')}
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            {activeTab === 'sign up' && (
              <div className="py-4">
                <h2 className="text-xl font-semibold mb-4">Create a new account</h2>
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex items-center border rounded-md focus-within:border-blue-500">
                    <FaUser className="ml-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Username"
                      className="block w-full py-2 pl-3 pr-3 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-md focus-within:border-blue-500">
                    <input
                      type="email"
                      placeholder="Email"
                      className="block w-full py-2 pl-3 pr-3 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center border rounded-md focus-within:border-blue-500">
                    <input
                      type="password"
                      placeholder="Password"
                      className="block w-full py-2 pl-3 pr-3 rounded-md focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white rounded-md py-3 font-semibold hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                  >
                    Sign Up
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() => handleTabClick('Login')}
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Google Button */}
            <div className="border-t border-gray-300 mt-6 pt-4">
              <button
                className="w-full py-3 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Add your Google login logic
                }}
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
