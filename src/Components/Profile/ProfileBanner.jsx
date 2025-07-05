import { useState, useEffect } from "react";
import axios from "axios"
import {toast} from "react-toastify"
function ProfileBanner({ onEditClick, userData }) {
  const [userProfile, setUserProfile] = useState(null);
  const [profileCount,setProfileCount]=useState({});
  useEffect(() => {
    if (userData) {
      setUserProfile(userData);
    }
  }, [userData]);
  useEffect(()=>{
    const fetchCount=async()=>{
      try{
        const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/stats`,{withCredentials:true});
        if(response.status===200){
          setProfileCount(response.data);
        }
        else{
          toast.info(response.data?.message);
        }
      }
      catch(error){
        toast.error(error.message);
      }
    }

    fetchCount();
  },[])
  const initials = userProfile?.username
    ? userProfile.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '';


  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-6 shadow-lg rounded-b-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative">
        <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
          <div className="w-28 h-28 rounded-full border-4 border-white bg-white text-blue-700 flex items-center justify-center text-4xl font-bold uppercase overflow-hidden flex-shrink-0">
            {initials}
          </div>
          <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <h1 className="text-3xl font-bold">{userProfile?.username || "Guest User"}</h1>
            
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 text-lg">
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg text-center">
                <span className="font-semibold text-2xl block">{0}</span>
                <span className="text-sm">Reviews</span>
              </div>
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg text-center">
                <span className="font-semibold text-2xl block">{profileCount?.resCount}</span>
                <span className="text-sm">Restaurant Orders</span>
              </div>
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg text-center">
                <span className="font-semibold text-2xl block">{profileCount?.mallCount}</span>
                <span className="text-sm">Mall Orders</span>
              </div>
              <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg text-center">
                <span className="font-semibold text-2xl block">{profileCount?.bookingCount}</span>
                <span className="text-sm">Hospital Bookings</span>
              </div>
            
            </div>
          </div>
        </div>
        <button
          onClick={onEditClick}
          className="bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mt-6 md:mt-16"
        >
          Edit profile
        </button>
      </div>
    </div>
  );
}

export default ProfileBanner;
