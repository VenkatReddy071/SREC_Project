import React from 'react';

const tabs = [
    { id: 'reviews', name: 'Reviews' },
    { id: 'hospital-bookings', name: 'Hospital Bookings' },
    { id: 'restaurant-orders', name: 'Restaurant Orders' },
    { id: 'fashion-orders', name: 'Fashion Orders' },
    { id: 'hospital-contacts', name: 'Hospital Contacts' },
    { id: 'settings', name: 'Settings' },
];

function Sidebar({ activeTab, setActiveTab }) {
    return (
        <div className="w-full sm:w-64 bg-white p-6 border-b sm:border-b-0 sm:border-r border-gray-200 flex flex-col items-center">
            <div className="mb-8 text-center">
                <img
                    src="https://via.placeholder.com/100"
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 mx-auto mb-3"
                />
                <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
            </div>

            <nav className="w-full">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`
                            block w-full text-left py-3 px-4 rounded-lg mb-2 text-lg font-medium transition-colors duration-200
                            ${activeTab === tab.id
                                ? 'bg-blue-400 text-white shadow-md'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                            }
                        `}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;