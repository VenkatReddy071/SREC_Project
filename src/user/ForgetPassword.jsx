import React, { useState } from 'react';
import { MdArrowBack } from 'react-icons/md'; // Example icon for back button

const ForgotPassword = ({ setForget }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');

  const handleNextStep = async () => {
    setMessage('');
    setEmailError('');
    setOtpError('');
    setPasswordError('');

    
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
    setMessage('');
    setEmailError('');
    setOtpError('');
    setPasswordError('');
  };

  return (
    <div className='fixed inset-0 w-full max-h-screen flex justify-center items-center bg-black bg-opacity-60 z-[160]'>
      <div className='relative bg-white text-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md'>
        <button
          onClick={()=>setForget(false)}
          className='absolute top-3 left-3 text-gray-500 hover:text-gray-700 focus:outline-none'
        >
          <MdArrowBack className='h-6 w-6' />
        </button>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Forgot Password</h2>

        {message && <p className='mb-4 text-green-500 text-center'>{message}</p>}

        {step === 1 && (
          <div>
            <h3 className='text-lg font-medium mb-2'>Step 1: Enter Email</h3>
            <div className='mb-4'>
              <label htmlFor='email' className='block text-sm font-bold mb-1'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                  emailError ? 'border-red-500' : ''
                }`}
                placeholder='your@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className='text-red-500 text-sm mt-1'>{emailError}</p>}
            </div>
            <button
              onClick={handleNextStep}
              className='w-full bg-blue-500 text-white rounded-md py-3 font-semibold hover:bg-blue-600 focus:outline-none'
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className='text-lg font-medium mb-2'>Step 2: Verify OTP</h3>
            <p className='mb-4 text-sm text-gray-600'>
              Please enter the One-Time Password sent to <span className='font-semibold'>{email}</span>.
            </p>
            <div className='mb-4'>
              <label htmlFor='otp' className='block text-sm font-bold mb-1'>
                OTP
              </label>
              <input
                type='text'
                id='otp'
                className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                  otpError ? 'border-red-500' : ''
                }`}
                placeholder='Enter OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {otpError && <p className='text-red-500 text-sm mt-1'>{otpError}</p>}
            </div>
            <div className='flex justify-between'>
              <button
                onClick={handlePreviousStep}
                className='text-gray-600 hover:text-gray-800 focus:outline-none'
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className='bg-blue-500 text-white rounded-md py-3 px-4 font-semibold hover:bg-blue-600 focus:outline-none'
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className='text-lg font-medium mb-2'>Step 3: Reset Password</h3>
            <div className='mb-4'>
              <label htmlFor='newPassword' className='block text-sm font-bold mb-1'>
                New Password
              </label>
              <input
                type='password'
                id='newPassword'
                className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                  passwordError ? 'border-red-500' : ''
                }`}
                placeholder='Enter new password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='confirmNewPassword' className='block text-sm font-bold mb-1'>
                Confirm New Password
              </label>
              <input
                type='password'
                id='confirmNewPassword'
                className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 ${
                  passwordError ? 'border-red-500' : ''
                }`}
                placeholder='Confirm new password'
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              {passwordError && <p className='text-red-500 text-sm mt-1'>{passwordError}</p>}
            </div>
            <div className='flex justify-between'>
              <button
                onClick={handlePreviousStep}
                className='text-gray-600 hover:text-gray-800 focus:outline-none'
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className='bg-green-500 text-white rounded-md py-3 px-4 font-semibold hover:bg-green-600 focus:outline-none'
              >
                Reset Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;