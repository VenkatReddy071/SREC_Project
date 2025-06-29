import React, { useState } from "react";
import { FaUser, FaGoogle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
Axios.defaults.withCredentials = true;
import { toast } from "react-toastify";
import ForgotPassword from "./ForgetPassword";
import { motion, AnimatePresence } from "framer-motion";

const EmailVerification = ({
  email,
  setForget,
  setActiveTab,
  setVerificationSuccess,
  setIsOpen,
  otpType,
}) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/verify-email-otp`;
      const response = await Axios.post(
        url,
        { email, otp, otpType },
        { withCredentials: true }
      );
      toast.info(response.data.message || "Email verified successfully!");
      setVerificationSuccess(true);
      setForget(false);
      setActiveTab("login");
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/resend-otp`;
      const response = await Axios.post(url, { email, otpType });
      toast.success(response.data.message || "New OTP sent to your email!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold">Verify Your Email</h2>
      <p className="text-gray-600">
        An OTP has been sent to your email: **{email}**. Please enter it below
        to verify your account.
      </p>
      <div className="flex items-center border rounded-md px-2">
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="w-full py-2 px-2 focus:outline-none"
          value={otp}
          onChange={handleOtpChange}
          required
        />
      </div>
      <button
        onClick={handleVerifyOtp}
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
            Verifying...
          </div>
        ) : (
          "Verify OTP"
        )}
      </button>
      <button
        onClick={handleResendOtp}
        className="text-sm text-blue-500 hover:underline self-end"
        disabled={loading}
      >
        {loading ? "Sending..." : "Resend OTP"}
      </button>
      <button
        className="text-sm text-gray-500 hover:underline self-start"
        onClick={() => {
          setForget(false);
          setActiveTab("login");
        }}
      >
        Go back to Login
      </button>
    </motion.div>
  );
};

export const Login = ({ setIsOpen }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [forget, setForget] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otpType, setOtpType] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const tabs = ["Login", "Sign Up"];

  const handleTabClick = (tab) => {
    setActiveTab(tab.toLowerCase());
    setForget(false);
    setShowOtpVerification(false);
    setOtpType("");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/login`;
      const { email, password } = formData;
      const response = await Axios.post(
        url,
        { email, password },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Login successful");
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/sign`;
      const { email, password, username } = formData;
      const response = await Axios.post(
        url,
        { email, password, username, type: "user" },
        { withCredentials: true }
      );
      toast.success(
        response.data.message ||
          "Sign up successful! Please check your email for verification."
      );
      setEmailForVerification(email);
      setOtpType("email_verify");
      setShowOtpVerification(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed");
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full max-h-screen flex justify-center items-center bg-black bg-opacity-60 z-50"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        {setIsOpen && (
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <MdClose size={24} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {!forget && !showOtpVerification && (
            <motion.div
              key="main-form"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
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
                </motion.div>
              )}

              {activeTab === "sign up" && (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-xl font-semibold">Create a new account</h2>
                  {renderInputField(<FaUser />, "text", "username", "Username")}
                  {renderInputField(null, "email", "email", "Email")}
                  {renderInputField(null, "password", "password", "Password")}
                  <button
                    onClick={handleSignUp}
                    className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
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
                        Signing up...
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </motion.div>
              )}

              <div className="border-t border-gray-300 mt-6 pt-4">
                <button
                  className="w-full py-3 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2"
                  onClick={() => toast.info("Google login not implemented yet")}
                >
                  <FaGoogle className="text-red-500" />
                  Continue with Google
                </button>
              </div>
            </motion.div>
          )}

          {forget && (
            <motion.div
              key="forgot-password"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ForgotPassword setForget={setForget} />
            </motion.div>
          )}

          {showOtpVerification && otpType === "email_verify" && (
            <EmailVerification
              email={emailForVerification}
              setForget={setForget}
              setActiveTab={setActiveTab}
              setVerificationSuccess={setVerificationSuccess}
              setIsOpen={setIsOpen}
              otpType={otpType}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};