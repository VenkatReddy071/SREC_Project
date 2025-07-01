import React from 'react';
import { FaRegClock, FaCheckCircle, FaTag, FaInfoCircle, FaTimesCircle, FaUtensils, FaUserCircle, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';

const OrderPopup = ({ order, onClose }) => {
    if (!order) return null;

    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return "N/A";
        }
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return "N/A";
        }
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="p-6 rounded-xl shadow-2xl relative max-w-lg w-11/12 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl transition-all duration-300 transform hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                title="Close Order Details"
            >
                <FaTimesCircle className="w-9 h-9" />
            </button>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 pb-4 border-b-2 border-indigo-100 flex items-center">
                <FaInfoCircle className="mr-3 text-indigo-600 w-8 h-8" /> Order Details
                <span className="text-indigo-600 ml-3 font-mono text-xl tracking-wider">#{order._id.slice(-6)}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-gray-700 text-base mb-8">
                <div className="flex items-start">
                    <FaUtensils className="mr-3 mt-1 text-orange-600 w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Restaurant:</p>
                        <p className="text-sm">
                            <span className="font-medium">Name:</span> {order.sourceId?.name || "N/A"}
                        </p>
                        <p className="text-sm leading-relaxed">
                            <span className="font-medium">Address:</span> {order.sourceId?.address?.street}, {order.sourceId?.address?.city}, {order.sourceId?.address?.state}, {order.sourceId?.address?.zipCode || "N/A"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start">
                    <FaRegClock className="mr-3 mt-1 text-yellow-600 w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Ordered On:</p>
                        <p className="text-sm">
                            {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start">
                    <FaMoneyBillWave className="mr-3 mt-1 text-green-600 w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Total Amount:</p>
                        <p className="text-sm font-bold text-green-700">₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <FaTag className="mr-3 mt-1 text-purple-600 w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Payment Method:</p>
                        <p className="text-sm">{order.paymentMethod || "N/A"}</p>
                    </div>
                </div>

                {order.notes && (
                    <div className="col-span-full bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                        <p className="font-semibold text-gray-800 flex items-center mb-2">
                            <FaInfoCircle className="mr-3 text-blue-600 w-5 h-5" /> Order Notes:
                        </p>
                        <p className="italic text-gray-700 leading-relaxed text-sm">{order.notes}</p>
                    </div>
                )}
            </div>

            <div className="mb-8 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
                    <FaUserCircle className="mr-2 text-gray-500 w-6 h-6" /> Customer Information:
                </h4>
                <div className="bg-indigo-50 p-4 rounded-lg shadow-md flex items-center">
                    <FaUserCircle className="text-indigo-400 w-10 h-10 mr-4 flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800 text-base">Name: {order.customerName || "N/A"}</p>
                        <p className="text-sm text-gray-600">Email: {order.customerEmail || "N/A"}</p>
                        <p className="text-sm text-gray-600">Mobile: {order.customerPhoneNumber || "N/A"}</p>
                    </div>
                </div>
            </div>

            {order.items && order.items.length > 0 && (
                <div className="mb-8 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 text-xl">Order Items:</h4>
                    <ul className="space-y-3">
                        {order.items.map((item, idx) => (
                            <li key={item._id || idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
                                <span className="font-medium text-gray-700 text-base">{item.quantity}x {item.name}</span>
                                <span className="font-semibold text-gray-800 text-base">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {order.appliedTaxes && order.appliedTaxes.length > 0 && (
                <div className="mb-8 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 text-xl">Applied Taxes:</h4>
                    <ul className="space-y-3">
                        {order.appliedTaxes.map((tax, idx) => (
                            <li key={tax._id || idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100">
                                <span className="font-medium text-gray-700 text-base">{tax.name}:</span>
                                <span className="font-semibold text-gray-800 text-base">₹{tax.amountApplied?.toFixed(2) || "0.00"}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {order.subStatus && order.subStatus.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 text-xl">Order Timeline:</h4>
                    <ol className="relative border-l-2 border-indigo-200 ml-4 pl-6">
                        {order.subStatus
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((statusEntry, idx) => (
                                <li key={statusEntry._id || idx} className="mb-6 relative">
                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full -left-10 top-0.5 ring-4 ring-white shadow-sm">
                                        {statusEntry.status?.toLowerCase() === "delivered" || statusEntry.status?.toLowerCase() === "completed" ? (
                                            <FaCheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <FaRegClock className="w-4 h-4 text-yellow-500" />
                                        )}
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 capitalize">
                                        {statusEntry.status}
                                        {idx === order.subStatus.length - 1 && (
                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium ml-3 px-3 py-1 rounded-full border border-indigo-200 shadow-xs">Latest Status</span>
                                        )}
                                    </h3>
                                    <time className="block text-sm font-normal leading-none text-gray-500">
                                        On {formatDate(statusEntry.date)} at {formatTime(statusEntry.date)}
                                    </time>
                                </li>
                            ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default OrderPopup;