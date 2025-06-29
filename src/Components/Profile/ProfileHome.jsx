import React, { useState } from 'react';
import UserProfileLayout from './UserProfileLaout';
import ReviewList from './ReviewList';
// import BookingList from './BookingList';
// import OrderList from './OrderList';
// import ContactList from './ContactList';
// import SettingsPanel from './SettingsPanel';

// --- Dummy Data ---
// In a real application, this data would be fetched from your backend API
const dummyUserData = {
    userName: 'Aarav Sharma', // Changed name for variety
    userInitials: 'AS',
    userEmail: 'aarav.sharma@example.com',
    userBio: 'Passionate about health tech and gourmet food.',
    backendStatus: 'Online',
    // Data for tabs
    reviews: [
        { id: 1, title: 'Excellent Service', description: 'Dr. Priya Sharma provided exceptional care, very thorough and empathetic. Highly recommend!', date: 'June 15, 2025', rating: 5, category: 'Hospital' },
        { id: 2, title: 'Delicious Food Experience', description: 'The biryani at The Spice Route was heavenly! Great ambiance too.', date: 'June 01, 2025', rating: 4.5, category: 'Restaurant' },
        { id: 3, title: 'Quality Fashion Wear', description: 'Loved the fabric and fit of the dress from Zara. Quick delivery as well!', date: 'May 20, 2025', rating: 5, category: 'Fashion' },
    ],
    hospitalBookings: [
        { id: 101, hospital: 'Medanta - The Medicity', doctor: 'Dr. Rohan Mehra (Cardiology)', date: 'July 10, 2025', time: '10:00 AM', status: 'Confirmed', type: 'Consultation' },
        { id: 102, hospital: 'Max Healthcare', doctor: 'Dr. Sana Khan (Dermatology)', date: 'May 20, 2025', time: '02:30 PM', status: 'Completed', type: 'Follow-up' },
        { id: 103, hospital: 'Apollo Hospital', doctor: 'Dr. Anjali Gupta (Pediatrics)', date: 'August 01, 2025', time: '11:00 AM', status: 'Pending', type: 'New Patient' },
    ],
    restaurantOrders: [
        { id: 201, restaurant: 'The Big Chill Cafe', items: ['Penna Arrabbiata', 'Cold Coffee'], total: '₹ 1250', date: 'June 28, 2025', status: 'Delivered' },
        { id: 202, restaurant: 'Saravana Bhavan', items: ['Masala Dosa', 'Filter Coffee'], total: '₹ 450', date: 'June 20, 2025', status: 'Delivered' },
        { id: 203, restaurant: 'Burger King', items: ['Whopper Meal', 'Fries'], total: '₹ 580', date: 'June 10, 2025', status: 'Cancelled' },
    ],
    fashionOrders: [
        { id: 301, item: 'Casual Denim Jacket (L)', store: 'H&M', total: '₹ 3200', date: 'June 25, 2025', status: 'Shipped', tracking: 'HM123456789' },
        { id: 302, item: 'Ethnic Kurta Set', store: 'Fabindia', total: '₹ 4800', date: 'June 18, 2025', status: 'Delivered', tracking: 'FI987654321' },
    ],
    hospitalContacts: [
        { id: 401, name: 'AIIMS Delhi', phone: '+91 11 2658 8500', address: 'Ansari Nagar, New Delhi', emergency: 'Yes' },
        { id: 402, name: 'Fortis Hospital, Gurugram', phone: '+91 124 4962222', address: 'Sector 44, Gurugram, Haryana', emergency: 'Yes' },
        { id: 403, name: 'BLK-MAX Hospital', phone: '+91 11 3040 3040', address: 'Pusa Road, New Delhi', emergency: 'No' },
    ],
    settings: {
        email: 'aarav.sharma@example.com',
        notifications: true,
        privacy: 'public',
        theme: 'light'
    }
};

export const Dashboard=()=> {
    const [activeTab, setActiveTab] = useState('reviews'); // Default active tab

    // This function dynamically renders the correct component based on the active tab
    const renderTabComponent = () => {
        switch (activeTab) {
            case 'reviews':
                return <ReviewList reviews={dummyUserData.reviews} />;
            // case 'hospital-bookings':
            //     return <BookingList bookings={dummyUserData.hospitalBookings} type="Hospital" />;
            // case 'restaurant-orders':
            //     return <OrderList orders={dummyUserData.restaurantOrders} type="Restaurant" />;
            // case 'fashion-orders':
            //     return <OrderList orders={dummyUserData.fashionOrders} type="Fashion" />;
            // case 'hospital-contacts':
            //     return <ContactList contacts={dummyUserData.hospitalContacts} />;
            // case 'settings':
            //     return <SettingsPanel settings={dummyUserData.settings} />;
            default:
                return <p className="text-gray-600 p-6">Select a tab to view your personalized content.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
            <UserProfileLayout
                userName={dummyUserData.userName}
                userInitials={dummyUserData.userInitials}
                userEmail={dummyUserData.userEmail}
                userBio={dummyUserData.userBio}
                backendStatus={dummyUserData.backendStatus}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            >
                {renderTabComponent()}
            </UserProfileLayout>
        </div>
    );
}
