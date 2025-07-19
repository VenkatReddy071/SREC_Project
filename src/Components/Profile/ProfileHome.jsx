import React, { useState,useEffect } from 'react';
import axios from "axios"
import ProfileBanner from './ProfileBanner';
import SideNav from './SideNav';
import ContentArea from './ContentArea';
import EditProfileModal from "./EditProfile"
export const UserProfile=()=> {
 const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Reviews');
  const [userProfile, setUserProfile] = useState({
  });

    useEffect(() => {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/profile/user/Data`;
    axios.get(url, { withCredentials: true })
      .then((response) => {
        setUserProfile(response.data?.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  const tabs = {
    
    'ACTIVITY':[{name:"Reviews",link:"/user-profile/type?=reviews"},{name:"Recently Viewed",link:"/user-profile/type?=view"},{name:"Hospital Bookings",link:"/user-profile/type?=bookings"},{name:"Restaurant Orders",link:"/user-profile/type?=restaurant-orders"},{name:"Restaurant Table Bookings",link:"/user-profile/type?=restaurant-bookings"},{name:"Fashion Orders",link:"/user-profile/type?=fashion-orders" }], 
    'CONTACTS':[{name:"Hospital Contact Messages",link:"/user-profile/type?=hospital-contacts"},{name:"School Contacts",link:"/user-profile/type?=school-contact"}],
    'SETTINGS': [{name:"Notifications",link:"/user-profile/type?=notifications"}],
  };

  const handleProfileUpdate = (updatedData) => {
    setUserProfile(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <div className="h-full bg-gray-100 font-sans antialiased">
      <ProfileBanner onEditClick={() => setShowEditProfileModal(true)} userData={userProfile}/>
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 gap-6">
        <SideNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        <ContentArea activeTab={activeTab} />
      </div>

      <EditProfileModal
        show={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        currentProfileData={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
