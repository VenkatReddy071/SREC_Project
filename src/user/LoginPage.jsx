import React, { useState } from "react";
import { FaUser, FaGoogle } from "react-icons/fa";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {

    if (formData.password.length < 8) {
          toast.error("New password must be at least 8 characters long.");
          return;
        }
        if (!/[A-Z]/.test(formData.password)) {
          toast.error("New password must contain at least one capital letter.");
          return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
          toast.error("New password must contain at least one special character.");
          return;
        }
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/login`;
      const { email, password } = formData;
      const response = await Axios.post(url, { email, password }, { withCredentials: true });
      toast.success(response.data.message || "Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex justify-center items-center bg-gray-100 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>
        <div className="flex flex-col gap-4">
          {renderInputField(<FaUser />, "email", "email", "Email")}
          {renderInputField(null, "password", "password", "Password")}
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline self-end"
          >
            Forgot password?
          </Link>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <div className="border-t border-gray-300 mt-6 pt-4 text-center">
          <p className="text-gray-600 mb-4">Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link></p>
          <button
            className="w-full py-3 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2"
            onClick={() => toast.info("Google login not implemented yet")}
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
