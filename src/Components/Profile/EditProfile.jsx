import { useState, useEffect } from "react"
import axios from "axios"
import {toast} from "react-toastify";
function EditProfileModal({ show, onClose, currentProfileData, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    username: currentProfileData.username || '',
    gender: currentProfileData.gender || '',
    age: currentProfileData.age || '',
    subscribe: currentProfileData.subscribe || false,
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpEmailForVerification, setOtpEmailForVerification] = useState('');
  const [otpType, setOtpType] = useState(null);

  const [showPasswordInputFields, setShowPasswordInputFields] = useState(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFormData({
        username: currentProfileData.username || '',
        gender: currentProfileData.gender || '',
        age: currentProfileData.age || '',
        subscribe: currentProfileData.subscribe || false,
        newPassword: '',
        confirmNewPassword: '',
      });
      setShowOtpVerification(false);
      setShowPasswordInputFields(false);
      setOtpInput('');
      setOtpEmailForVerification('');
      setOtpType(null);
      setMessage('');
      setLoading(false);
    }
  }, [show, currentProfileData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBasicProfileUpdate = async (payload) => {
    setLoading(true);
    setMessage('Saving changes...');
    try {
    const response=await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/${currentProfileData.id}/basic-edit`,payload,{withCredentials:true});
    if(response.status===200){
    setMessage('Profile updated successfully!');
        toast.success('Profile updated successfully!');
      onProfileUpdate({ ...currentProfileData, ...payload });
      setTimeout(onClose, 1000);
    }
    else{
    setMessage('Profile updated Failed!');
    setTimeout(onClose, 1000);
    }
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Basic profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (newPassword) => {
    console.log('Simulating API call: PATCH /api/profile/password with new password:', newPassword);
    setLoading(true);
    setMessage('Updating password...');
    try {
      const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/changePassword`,{email:currentProfileData.email,newPassword},{withCredentials:true})
      setMessage('Password updated successfully!');
      setFormData(prev => ({ ...prev, newPassword: '', confirmNewPassword: '' }));
      onProfileUpdate({});
      setTimeout(onClose, 1000);
    } catch (error) {
      setMessage('Failed to update password. Please try again.');
      console.error('Password update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordOtp = async () => {
    console.log(`Simulating API call: POST /api/auth/request-otp for password change to ${currentProfileData.email}`);
    setLoading(true);
    setMessage(`Sending OTP to ${currentProfileData.email}...`);
    try {
      const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/forgot-password`,{email:currentProfileData.email},{withCredentials:true});
      if(response.status==200){
        setShowOtpVerification(true);
      setOtpEmailForVerification(currentProfileData.email);
      setOtpType('password_reset');
      setMessage(`OTP sent to your registered email (${currentProfileData.email}). Please enter it below.`);
      }
     
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
      console.error('OTP request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    console.log(`Simulating API call: POST /api/auth/verify-otp with OTP: ${otpInput} for ${otpType}`);
    setLoading(true);
    setMessage('Verifying OTP...');
    try {
     const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/verify-email-otp`,{email:currentProfileData.email,otp:otpInput},{withCredentials:true});

      if (response.status===200) {
        setMessage('OTP verified successfully! You can now change your password.');
        setShowOtpVerification(false);
        setShowPasswordInputFields(true);
        setOtpInput('');
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('OTP verification failed. Please try again.');
      console.error('OTP verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicFormSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const updatedFields = {};
    if (formData.username !== currentProfileData.username) updatedFields.username = formData.username;
    if (formData.gender !== currentProfileData.gender) updatedFields.gender = formData.gender;
    if (formData.age !== currentProfileData.age) updatedFields.age = parseInt(formData.age);
    if (formData.subscribe !== currentProfileData.subscribe) updatedFields.subscribe = formData.subscribe;

    if (Object.keys(updatedFields).length > 0) {
      await handleBasicProfileUpdate(updatedFields);
    } else {
      setMessage('No changes detected in basic profile info.');
      setLoading(false);
      onClose();
    }
  };

  const handlePasswordChangeFormSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage('New password and confirm password do not match.');
      setLoading(false);
      return;
    }
    if (formData.newPassword.length < 8) {
                  toast.error("New password must be at least 8 characters long.");
                  return;
                }
                if (!/[A-Z]/.test(formData.newPassword)) {
                  toast.error("New password must contain at least one capital letter.");
                  return;
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
                  toast.error("New password must contain at least one special character.");
                  return;
                }

    await handlePasswordUpdate(formData.newPassword);
  };


  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 relative transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Edit Profile</h2>

        {message && (
          <div className={`p-3 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {!showOtpVerification && !showPasswordInputFields ? (
          <form onSubmit={handleBasicFormSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={currentProfileData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Email address cannot be changed directly from here.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <button
                type="button"
                onClick={requestPasswordOtp}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                disabled={loading}
              >
                {loading && otpType === 'password_reset' ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Change Password'}
              </button>
            </div>


            <div>
              <label htmlFor="gender" className="block text-gray-700 text-sm font-semibold mb-2">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-gray-700 text-sm font-semibold mb-2">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                min="0"
                max="120"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="subscribe"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="subscribe" className="ml-2 block text-gray-700 text-sm font-semibold">Subscribe to marketing emails</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              disabled={loading}
            >
              {loading && otpType !== 'password_reset' ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Save Basic Changes'}
            </button>
          </form>
        ) : showOtpVerification ? (
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Verify Password Change</h3>
            <p className="text-gray-700 mb-6">
              An OTP has been sent to your registered email address ({otpEmailForVerification}). Please enter it below to confirm.
            </p>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mb-4"
              maxLength="6"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Verify OTP'}
            </button>
            <button
              onClick={() => {
                setShowOtpVerification(false);
                setMessage('');
                setLoading(false);
              }}
              className="mt-3 w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        ) : showPasswordInputFields ? (
          <form onSubmit={handlePasswordChangeFormSubmit} className="space-y-5">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Set New Password</h3>
            <div>
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Update Password'}
            </button>
            <button
              onClick={() => {
                setShowPasswordInputFields(false);
                setMessage('');
                setLoading(false);
                setFormData(prev => ({ ...prev, newPassword: '', confirmNewPassword: '' }));
              }}
              className="mt-3 w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default EditProfileModal;