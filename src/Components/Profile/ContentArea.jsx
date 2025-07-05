import {useEffect} from "react"
import axios from "axios"
import HospitalBooking from "./HospitalBookins/BookingList"
import RestaurantOrders from "./Restaurant/MyOrders"
import FashionOrders from "./Restaurant/FashionOrders"
import SchoolContact from "./Submission/School"
import HospitalContact from "./Submission/Hospital"
import Notifications from "./Submission/Notification";
import View from "./RecentlyViewd"

function ContentArea({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'Reviews':
        return <div><h2 className="text-2xl font-semibold text-blue-700 mb-4">My Reviews</h2><p className="text-gray-700">You haven't written any reviews yet.</p></div>;
      case 'Recently Viewed':
        return <div><View/></div>;
      case 'Hospital Bookings':
        return <div><HospitalBooking/></div>
      case 'Restaurant Orders':
        return <div><RestaurantOrders/></div>;
      case 'Fashion Orders':
        return <div><FashionOrders/></div>;
      case 'Hospital Contact Messages':
        return <div><HospitalContact/></div>;
      case 'School Contacts':
        return <div><SchoolContact/></div>;
      case 'Edit Options':
        return <div><h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Profile & Settings</h2><p className="text-gray-700">Please click "Edit Profile" button on the banner to edit your profile.</p></div>;
      case 'Notifications':
        return <div><Notifications/></div>;
      default:
        return <div><h2 className="text-2xl font-semibold text-blue-700 mb-4">Welcome to your Profile!</h2><p className="text-gray-700">Select a tab from the left to view your activity.</p></div>;
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-md md:p-6 h-screen overflow-y-scroll">
      {renderContent()}
      {activeTab === 'Reviews' && (
          <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">My Addresses</h3>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <svg className="w-8 h-8 text-red-500 mr-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 20S3 10.87 3 7a7 7 0 1114 0c0 3.87-7 13-7 13zM10 9a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                  <p className="text-gray-700">No addresses added yet. Add one to get started!</p>
              </div>
          </div>
      )}
    </div>
  );
}
export default ContentArea;