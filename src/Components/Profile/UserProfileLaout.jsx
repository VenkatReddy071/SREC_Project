import React from 'react';

// Reusable Tab Button component
const TabButton = ({ id, name, activeTab, onClick }) => (
    <button
        className={`
            relative flex-1 py-3 px-2 mx-1 rounded-t-lg text-center font-semibold text-lg
            transition-all duration-300 ease-in-out
            ${activeTab === id
                ? 'text-blue-700 bg-white border-b-2 border-blue-500 shadow-t-sm'
                : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
        `}
        onClick={() => onClick(id)}
    >
        {name}
        {activeTab === id && (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 animate-underline"></span>
        )}
    </button>
);


function UserProfileLayout({ userName, userInitials, userEmail, userBio, backendStatus, activeTab, setActiveTab, children }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Online': return 'bg-green-500';
            case 'Offline': return 'bg-red-500';
            case 'Degraded': return 'bg-orange-500';
            default: return 'bg-gray-400';
        }
    };

    const tabs = [
        { id: 'reviews', name: 'Reviews' },
        { id: 'hospital-bookings', name: 'Hospital Bookings' },
        { id: 'restaurant-orders', name: 'Restaurant Orders' },
        { id: 'fashion-orders', name: 'Fashion Orders' },
        { id: 'hospital-contacts', name: 'Hospital Contacts' },
        { id: 'settings', name: 'Settings' },
    ];

    return (
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            {/* Header / Top Bar */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 sm:p-8 flex justify-between items-center rounded-t-2xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Profile</h1>
                <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(backendStatus)}`}>
                        Backend: {backendStatus}
                    </span>
                    <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white shadow-md">
                        {userInitials}
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {/* User Summary Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100 flex items-center space-x-6">
                    <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-blue-300 flex-shrink-0 animate-fade-in">
                        {userInitials}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{userName}</h2>
                        <p className="text-lg text-gray-600 mb-2">{userEmail}</p>
                        <p className="text-md text-gray-500 italic">"{userBio}"</p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-col sm:flex-row bg-gray-50 rounded-lg p-1 mb-8 shadow-inner animate-slide-in">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            id={tab.id}
                            name={tab.name}
                            activeTab={activeTab}
                            onClick={setActiveTab}
                        />
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md animate-fade-in-up">
                    {children} {/* This will render the content of the active tab */}
                </div>
            </div>
        </div>
    );
}

export default UserProfileLayout;