

import React, { useState } from "react";
import { FaUser, FaGoogle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Axios from "axios";
import {useNavigate} from "react-router-dom"
Axios.defaults.withCredentials = true;
import Toast from "../Pages/Toast";
import { toast } from "react-toastify";
import ForgotPassword from "./ForgetPassword";

export const Login = ({ }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [forget, setForget] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate=useNavigate();

  const tabs = ["Login", "Sign Up"];

  const handleTabClick = (tab) => setActiveTab(tab.toLowerCase());

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/login`;
      const { email, password } = formData;
      const response = await Axios.post(url, { email, password }, { withCredentials: true });
      toast.success(response.data.message || "Login successful");
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleSignUp = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/sign`;
      const { email, password, username } = formData;
      const response = await Axios.post(
        url,
        { email, password, username, type: "user" },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Sign up successful");
      navigate("/")
      localStorage.setItem("dasboard",response.data?.token)
      setIsOpen(false);
      setActiveTab("login");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed");
    }
  };

  const renderInputField = (icon, type, name, placeholder) => (
    <div className="flex items-center border rounded-md px-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full py-2 px-2 focus:outline-none"
        value={formData[name]}
        onChange={handleInputChange}
        required
      />
    </div>
  );

  return (
    <div className="fixed inset-0 w-full max-h-screen flex justify-center items-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">

        {!forget ? (
          <>
            <div className="flex border-b border-gray-300 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 text-lg font-semibold ${
                    activeTab === tab.toLowerCase()
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "login" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Login to your account</h2>
                {renderInputField(<FaUser />, "email", "email", "Email")}
                {renderInputField(null, "password", "password", "Password")}
                <button
                  className="text-sm text-blue-500 hover:underline self-end"
                  onClick={() => setForget(true)}
                >
                  Forgot password?
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Log In
                </button>
              </div>
            )}

            {activeTab === "sign up" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Create a new account</h2>
                {renderInputField(<FaUser />, "text", "username", "Username")}
                {renderInputField(null, "email", "email", "Email")}
                {renderInputField(null, "password", "password", "Password")}
                <button
                  onClick={handleSignUp}
                  className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                  Sign Up
                </button>
              </div>
            )}

            <div className="border-t border-gray-300 mt-6 pt-4">
              <button
                className="w-full py-3 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2"
                onClick={() => alert("Google login not implemented yet")}
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
