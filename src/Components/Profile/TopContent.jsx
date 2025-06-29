import React from 'react';

function TabContent({ children, activeTab }) {
    const getTabTitle = (tabId) => {
        switch (tabId) {
            case 'reviews': return 'Your Reviews';
            case 'hospital-bookings': return 'Your Hospital Bookings';
            case 'restaurant-orders': return 'Your Restaurant Orders';
            case 'fashion-orders': return 'Your Fashion Orders';
            case 'hospital-contacts': return 'Saved Hospital Contacts';
            case 'settings': return 'Account Settings';
            default: return 'Profile Details';
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-blue-500 mb-6 pb-3 border-b-2 border-gray-200">
                {getTabTitle(activeTab)}
            </h2>
            <div className="bg-white rounded-lg">
                {children}
            </div>
        </div>
    );
}

export default TabContent;