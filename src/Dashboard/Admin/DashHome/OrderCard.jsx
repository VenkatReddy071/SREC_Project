
import React from 'react';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaRegClock, FaHospital, FaUtensils, FaTshirt, FaShoppingBag, FaStore } from 'react-icons/fa';
import { getStatusClass, formatDate, formatTime } from '../../../utils/orderUtils'; // Import utilities

const OrderCard = ({ order, activeTab, onViewDetails }) => {
    const orderItemImage = activeTab === 'hospital'
        ? "https://placehold.co/150x150/f0f9ff/00796b?text=Hospital+Booking"
        : order.items?.[0]?.image || "https://placehold.co/150x150/e0f2f7/2196f3?text=Order+Item";

    const currentStatus = activeTab === 'hospital' ? order.status : order.orderStatus;

    let mainHeading = "N/A";
    let description = "N/A";
    let dateDisplay = "N/A";
    let icon = null;

    if (activeTab === 'hospital') {
        mainHeading = order.Hospital?.name || "Hospital Booking";
        description = `Patient: ${order.name || "N/A"}`;
        dateDisplay = `${formatDate(order.ScheduleDate)} at ${order.slot}`;
        icon = <FaHospital className="inline-block mr-2 text-blue-600" />;
    } else if (activeTab === 'restaurant') {
        mainHeading = `Order ID: ${order._id?.slice(-6)}`;
        description = `Customer: ${order.customerName || "N/A"}`;
        dateDisplay = `${formatDate(order.orderDate)} at ${formatTime(order.orderDate)}`;
        icon = <FaUtensils className="inline-block mr-2 text-orange-600" />;
    } else if (activeTab === 'fashion') {
        mainHeading = `Order ID: ${order._id?.slice(-6)}`;
        description = `Customer: ${order.customerName || "N/A"}`;
        dateDisplay = `${formatDate(order.orderDate)} at ${formatTime(order.orderDate)}`;
        icon = <FaTshirt className="inline-block mr-2 text-purple-600" />;
    }

    return (
        <div
            key={order._id} // Ensure _id is present for keys
            className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group`}
            onClick={() => onViewDetails(order, activeTab)} // Pass activeTab to modal for context
        >
            <div className="p-4 flex flex-col items-center text-center">
                <div className="relative w-full mb-3">
                    <img
                        src={orderItemImage}
                        alt={mainHeading}
                        className="w-full h-40 object-cover rounded-lg shadow-inner"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/e0f2f7/2196f3?text=Order+Image"; }}
                    />
                    <span
                        className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(currentStatus)}`}
                    >
                        {currentStatus?.toLowerCase() === "completed" || currentStatus?.toLowerCase() === "delivered" || currentStatus?.toLowerCase() === "approved" ? (
                            <FaCheckCircle className="inline mr-1 w-3 h-3" />
                        ) : currentStatus?.toLowerCase() === "cancelled" || currentStatus?.toLowerCase() === "returned" ? (
                            <FaTimesCircle className="inline mr-1 w-3 h-3" />
                        ) : (
                            <FaRegClock className="inline mr-1 w-3 h-3" />
                        )}
                        {currentStatus}
                    </span>
                    <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                        #{order._id?.slice(-6) || 'N/A'}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{mainHeading}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate w-full px-2">
                    {description}
                </p>

                <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-800 flex items-center">
                        <FaCalendarAlt className="mr-1 text-blue-500" /> {dateDisplay}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(order, activeTab); }}
                        className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors duration-200 shadow-md"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;