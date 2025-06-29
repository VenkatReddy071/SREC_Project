import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otpType = location.state?.otpType; // e.g., 'email_verify' or 'forgot_password'

  useEffect(() => {
    // Redirect if email or otpType is not available (e.g., direct access)
    if (!email || !otpType) {
      toast.error("Invalid access. Please start from login or signup.");
      navigate("/login");
    }
  }, [email, otpType, navigate]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    if (!email || !otpType) {
      toast.error("Email or OTP type missing. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/verify-email-otp`;
      const response = await Axios.post(
        url,
        { email, otp, otpType },
        { withCredentials: true }
      );
      toast.info(response.data.message || "Verification successful!");
      navigate("/login"); // Redirect to login after successful verification
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || !otpType) {
      toast.error("Email or OTP type missing. Cannot resend OTP.");
      return;
    }

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

  if (!email || !otpType) {
    // Render nothing or a loading spinner while useEffect redirects
    return null;
  }

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
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
        <p className="text-gray-600 mb-4 text-center">
          An OTP has been sent to your email: **{email}**. Please enter it below.
        </p>
        <div className="flex flex-col gap-4">
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
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:underline self-start"
          >
            Go back to Login
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailVerificationPage;
