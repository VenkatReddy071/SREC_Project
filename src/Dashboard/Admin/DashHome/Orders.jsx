// src/components/Orders.jsx (Main file)
import React, { useState, useEffect } from 'react';
import { FaHospital, FaUtensils, FaTshirt, FaSearch, FaClipboardList } from 'react-icons/fa';
import CustomModal from "../../../Pages/CustomModol"; // Assuming CustomModal.jsx is correct
import OrderDetailsModal from './OrderDeatilModel'; // New dedicated modal component
import HospitalBookingsList from './HospitalBookings'; // New list components
import RestaurantOrdersList from './Restaruabt';
import FashionOrdersList from './FashionOrdr';

export const Orders = () => {
    const [activeTab, setActiveTab] = useState('hospital');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States for the detail view
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderType, setSelectedOrderType] = useState(''); // To pass activeTab to modal

    // General alert/confirm modals (can also be moved to a separate general modal context/component)
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");

    // Function to open the detail modal, called from OrderCard
    const handleViewDetails = (order, orderType) => {
        setSelectedOrder(order);
        setSelectedOrderType(orderType); // Store the type for modal context
        setIsDetailModalOpen(true);
    };

    // Render the appropriate list component based on active tab
    const renderActiveList = () => {
        const commonProps = {
            searchTerm: searchTerm,
            onViewDetails: handleViewDetails, // Pass the central handler
            setAlertMessage: setAlertMessage,
            setIsAlertModalOpen: setIsAlertModalOpen
        };

        switch (activeTab) {
            case 'hospital':
                return <HospitalBookingsList {...commonProps} />;
            case 'restaurant':
                return <RestaurantOrdersList {...commonProps} />;
            case 'fashion':
                return <FashionOrdersList {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                <FaClipboardList className="inline-block mr-3 text-blue-600" /> Order Management Dashboard
            </h1>

            <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'hospital' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                        onClick={() => {
                            setActiveTab('hospital');
                            setSearchTerm(''); // Clear search when tab changes
                        }}
                    >
                        <FaHospital className="inline-block mr-2" /> Hospital Bookings
                    </button>
                    <button
                        className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'restaurant' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}
                        onClick={() => {
                            setActiveTab('restaurant');
                            setSearchTerm('');
                        }}
                    >
                        <FaUtensils className="inline-block mr-2" /> Restaurant Orders
                    </button>
                    <button
                        className={`flex-1 py-3 text-lg font-semibold transition-all duration-300 ${activeTab === 'fashion' ? 'border-b-4 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-purple-500'}`}
                        onClick={() => {
                            setActiveTab('fashion');
                            setSearchTerm('');
                        }}
                    >
                        <FaTshirt className="inline-block mr-2" /> Fashion Orders
                    </button>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab} orders...`}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                {/* Render the active list component */}
                {renderActiveList()}
            </div>

            {/* Reusable OrderDetailsModal */}
            <OrderDetailsModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={selectedOrder}
                activeTab={selectedOrderType} // Pass the type for conditional rendering inside modal
            />

            {/* Alert Modal */}
            <CustomModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)}>
                <div className="p-6 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Information</h2>
                    <p className="text-gray-700 mb-6">{alertMessage}</p>
                    <button
                        onClick={() => setIsAlertModalOpen(false)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        OK
                    </button>
                </div>
            </CustomModal>

            {/* Confirm Modal */}
            <CustomModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
                <div className="p-6 bg-white rounded-lg shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Action</h2>
                    <p className="text-gray-700 mb-6">{confirmMessage}</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (confirmAction) confirmAction();
                                setIsConfirmModalOpen(false);
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
};