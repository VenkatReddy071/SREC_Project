import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("email_input");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/forgot-password`;
      const response = await Axios.post(url, { email });
      toast.success(response.data.message || "Password reset OTP sent to your email!");
      setStep("otp_verification");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send password reset OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/verify-email-otp`;
      const response = await Axios.post(url, { email, otp, otpType: "forgot_password" });
      toast.success(response.data.message || "OTP verified successfully!");
      setStep("reset_password");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error("New password must contain at least one capital letter.");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      toast.error("New password must contain at least one special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/reset-password`;
      const response = await Axios.post(url, { email, otp, newPassword });
      toast.success(response.data.message || "Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case "email_input":
        return (
          <motion.div
            key="email-input-step"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password?</h2>
            <p className="text-gray-600 mb-4 text-center">
              Enter your email address below and we'll send you an OTP to reset your password.
            </p>
            <div className="flex items-center border rounded-md px-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full py-2 px-2 focus:outline-none"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 flex items-center justify-center"
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
                  Sending OTP...
                </div>
              ) : (
                "Send Reset OTP"
              )}
            </button>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:underline self-start"
            >
              Go back to Login
            </Link>
          </motion.div>
        );

      case "otp_verification":
        return (
          <motion.div
            key="otp-verification-step"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
            <p className="text-gray-600 mb-4 text-center">
              An OTP has been sent to **{email}**. Please enter it below.
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
              onClick={handleSendOtp}
              className="text-sm text-blue-500 hover:underline self-end"
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:underline self-start"
            >
              Go back to Login
            </Link>
          </motion.div>
        );

      case "reset_password":
        return (
          <motion.div
            key="reset-password-step"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
            <p className="text-gray-600 mb-4 text-center">
              Enter your new password below. Password must be at least 8 characters long, include a capital letter and a special character.
            </p>
            <div className="flex items-center border rounded-md px-2">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="w-full py-2 px-2 focus:outline-none"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className="flex items-center border rounded-md px-2">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                className="w-full py-2 px-2 focus:outline-none"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            <button
              onClick={handleResetPassword}
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
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:underline self-start"
            >
              Go back to Login
            </Link>
          </motion.div>
        );

      default:
        return null;
    }
  };

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
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
