
import React from 'react';
import CustomModal from '../../../Pages/CustomModol';
import { FaTimesCircle, FaInfoCircle, FaUser, FaHospital, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle, FaUtensils, FaTag, FaPercentage, FaTruck, FaRegClock, FaStore, FaShoppingBag } from 'react-icons/fa';
import { formatDate, formatTime, calculateSubtotal, calculateTotalTaxes } from '../../../utils/orderUtils'; 

const OrderDetailsModal = ({ isOpen, onClose, order, activeTab }) => {
    if (!order) return null;

    return (
        <CustomModal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                    title="Close"
                >
                    <FaTimesCircle className="w-8 h-8" />
                </button>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-teal-600 w-6 h-6" /> Order Details
                    <span className="text-teal-600 ml-2">#{order._id?.slice(-6) || 'N/A'}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                    {activeTab === 'hospital' && (
                        <>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Patient:
                                </p>
                                <p className="ml-5"><b>Name:</b> {order.name || "N/A"}</p>
                                <p className="ml-5"><b>Email:</b> {order.email || "N/A"}</p>
                                <p className="ml-5"><b>Phone:</b> {order.mobilenumber || "N/A"}</p>
                                <p className="ml-5"><b>Age:</b> {order.age || "N/A"}</p>
                                <p className="ml-5"><b>Gender:</b> {order.gender || "N/A"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaHospital className="mr-2 text-blue-500 w-4 h-4" /> Hospital:
                                </p>
                                <p className="ml-5"><b>Name:</b> {order.Hospital?.name || "N/A"}</p>
                                <p className="ml-5"><b>Address:</b> {order.Hospital?.address || "N/A"}</p>
                                <p className="font-semibold text-gray-600 flex items-center mt-3">
                                    <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Doctor:
                                </p>
                                <p className="ml-5"><b>Name:</b> {order.Doctor?.name || "N/A"}</p>
                                <p className="ml-5"><b>Specialization:</b> {order.Doctor?.specialization?.join(', ') || "N/A"}</p>
                            </div>
                            <div className="col-span-full">
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Appointment Details:
                                </p>
                                <p className="ml-5"><b>Scheduled:</b> {formatDate(order.ScheduleDate)} at {order.slot}</p>
                                <p className="ml-5"><b>Booked On:</b> {formatDate(order.bookingDate)} at {formatTime(order.bookingDate)}</p>
                                <p className="ml-5"><b>Status:</b> {order.status || "N/A"}</p>
                                <p className="ml-5"><b>Reason:</b> {order.message || 'N/A'}</p>
                            </div>
                        </>
                    )}
                    {(activeTab === 'restaurant' || activeTab === 'fashion') && (
                        <>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaUser className="mr-2 text-blue-500 w-4 h-4" /> Customer:
                                </p>
                                <p className="ml-5"><b>Name:</b> {order.customerName || "N/A"}</p>
                                <p className="ml-5"><b>Email:</b> {order.customerEmail || "N/A"}</p>
                                <p className="ml-5"><b>Phone:</b> {order.customerPhoneNumber || "N/A"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    {activeTab === 'restaurant' ? <FaStore className="mr-2 text-blue-500 w-4 h-4" /> : <FaShoppingBag className="mr-2 text-blue-500 w-4 h-4" />} Source:
                                </p>
                                <p className="ml-5"><b>Type:</b> {order.sourceType || "N/A"}</p>
                                <p className="ml-5"><b>ID:</b> {order.sourceId || "N/A"}</p>
                                <p className="font-semibold text-gray-600 flex items-center mt-3">
                                    <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Ordered On:
                                </p>
                                <p className="ml-5">
                                    {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                                </p>
                            </div>
                            <div className="col-span-full">
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-blue-500 w-4 h-4" /> Shipping Address:
                                </p>
                                <p className="ml-5">
                                    {order.shippingAddress?.street ? `${order.shippingAddress.street}, ` : ''}
                                    {order.shippingAddress?.city ? `${order.shippingAddress.city}, ` : ''}
                                    {order.shippingAddress?.state ? `${order.shippingAddress.state}, ` : ''}
                                    {order.shippingAddress?.zipCode ? `${order.shippingAddress.zipCode}, ` : ''}
                                    {order.shippingAddress?.country || 'N/A'}
                                </p>
                                <p className="font-semibold text-gray-600 flex items-center mt-3">
                                    <FaMoneyBillWave className="mr-2 text-green-500 w-4 h-4" /> Payment Method:
                                </p>
                                <p className="ml-5">
                                    {order.paymentMethod || "N/A"}
                                </p>
                                <p className="font-semibold text-gray-600 flex items-center mt-3">
                                    <FaCheckCircle className="inline mr-2 text-blue-500" /> Order Status:
                                </p>
                                <p className="ml-5 capitalize">{order.orderStatus || "N/A"}</p>
                            </div>
                            {order.notes && (
                                <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-200">
                                    <p className="font-semibold text-gray-600 flex items-center">
                                        <FaInfoCircle className="mr-2 text-blue-500 w-4 h-4" /> Order Notes:
                                    </p>
                                    <p className="italic ml-5">{order.notes}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {(activeTab === 'restaurant' || activeTab === 'fashion') && (
                    <div className="mb-6 border-t pt-4">
                        <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                            <FaUtensils className="mr-2 text-purple-500 w-5 h-5" /> Ordered Items:
                        </h4>
                        <div className="space-y-4 text-gray-700 text-sm">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, idx) => (
                                    <div key={item._id || idx} className="flex flex-col sm:flex-row items-center bg-gray-50 p-3 rounded-md shadow-sm">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-md mr-4 mb-2 sm:mb-0"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/e0f2f7/2196f3?text=Item"; }}
                                            />
                                        )}
                                        <div className="flex-grow text-center sm:text-left">
                                            <p className="font-medium text-base text-gray-900">{item.quantity} x {item.name}</p>
                                            {item.product?.description && (
                                                <p className="text-xs text-gray-500 italic mt-1">{item.product.description}</p>
                                            )}
                                            {(item.size || item.color) && (
                                                <p className="text-xs text-gray-500 italic mt-1">
                                                    {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                                                </p>
                                            )}
                                        </div>
                                        <span className="font-semibold text-gray-800 mt-2 sm:mt-0 sm:ml-auto">
                                            ₹{(item.price * item.quantity).toFixed(2)} {item.currency || "INR"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No items found.</p>
                            )}
                        </div>
                    </div>
                )}

                {(activeTab === 'restaurant' || activeTab === 'fashion') && (
                    <div className="mb-6 border-t pt-4">
                        <h4 className="font-bold text-gray-800 mb-3 text-lg">Cost Breakdown:</h4>
                        <div className="space-y-2 text-gray-700 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Subtotal:</span>
                                <span>₹{calculateSubtotal(order.items).toFixed(2)} {order.items?.[0]?.currency || "INR"}</span>
                            </div>
                            {order.appliedTaxes && order.appliedTaxes.length > 0 && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium flex items-center">
                                            <FaPercentage className="mr-1 text-orange-500 w-3 h-3" /> Taxes:
                                        </span>
                                        <span>₹{calculateTotalTaxes(order.appliedTaxes).toFixed(2)} {order.items?.[0]?.currency || "INR"}</span>
                                    </div>
                                    <ul className="ml-5 text-xs text-gray-600 list-disc list-inside">
                                        {order.appliedTaxes.map((tax, idx) => (
                                            <li key={idx}>
                                                {tax.name}: ₹{tax.amountApplied.toFixed(2)} {order.items?.[0]?.currency || "INR"}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {order.discountValue > 0 && (
                                <div className="flex justify-between items-center text-red-600">
                                    <span className="font-medium flex items-center">
                                        <FaTag className="mr-1 w-3 h-3" /> Discount:
                                    </span>
                                    <span>- ₹{order.discountValue.toFixed(2)} {order.items?.[0]?.currency || "INR"}</span>
                                </div>
                            )}
                            {order.offerId && (
                                <div className="flex justify-between items-center text-teal-700 text-xs">
                                    <span className="font-medium flex items-center">
                                        <FaTag className="mr-1 w-3 h-3" /> Offer ID:
                                    </span>
                                    <span className="ml-1">{order.offerId}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2 font-bold text-gray-900 text-base">
                                <span>Total Amount:</span>
                                <span>₹{order?.totalAmount?.toFixed(2)} {order.items?.[0]?.currency || "INR"}</span>
                            </div>
                        </div>
                    </div>
                )}

                {order.subStatus && order.subStatus.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                        <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Timeline:</h4>
                        <ol className="relative border-l border-gray-200 ml-4">
                            {order.subStatus
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map((statusEntry, idx) => (
                                    <li key={statusEntry._id || idx} className="mb-4 ml-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                            {statusEntry.status?.toLowerCase() === "completed" || statusEntry.status?.toLowerCase() === "delivered" || statusEntry.status?.toLowerCase() === "approved" ? (
                                                <FaCheckCircle className="w-3 h-3 text-green-500" />
                                            ) : statusEntry.status?.toLowerCase() === "shipped" || statusEntry.status?.toLowerCase() === "processing" ? (
                                                <FaTruck className="w-3 h-3 text-blue-500" />
                                            ) : statusEntry.status?.toLowerCase() === "cancelled" ? (
                                                <FaTimesCircle className="w-3 h-3 text-red-500" />
                                            ) : (
                                                <FaRegClock className="w-3 h-3 text-yellow-500" />
                                            )}
                                        </span>
                                        <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                                            {statusEntry.status}
                                            {idx === order.subStatus.length - 1 && (
                                                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>
                                            )}
                                        </h3>
                                        <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                                            On {formatDate(statusEntry.date)} at {formatTime(statusEntry.date)}
                                        </time>
                                    </li>
                                ))}
                        </ol>
                    </div>
                )}
            </div>
        </CustomModal>
    );
};

export default OrderDetailsModal;