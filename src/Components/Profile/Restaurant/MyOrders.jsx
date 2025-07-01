import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaRegClock, FaCheckCircle, FaInfoCircle, FaTimesCircle, FaCalendarAlt, FaStore, FaUtensils, FaMoneyBillWave, FaTruck, FaTag, FaPercentage } from 'react-icons/fa'; // Added FaTag and FaPercentage
import CustomModal from "../../../Pages/CustomModol"; // Assuming this path is correct for your project

const ITEMS_PER_LOAD = 15;

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isModalOpen, setIsModalToOpen] = useState(false); // Renamed setIsModalOpen to setIsModalToOpen to avoid conflict
    const [selectedOrder, setSelectedOrder] = useState(null);

    const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

    const observer = useRef();
    const lastOrderElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchOrders = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${SERVER_URL}/api/order/orders/user?sourceType=Restaurant&page=${page}&limit=${ITEMS_PER_LOAD}`,
                {
                    withCredentials: true,
                }
            );

            const { orders: fetchedOrders, totalOrders, page: fetchedCurrentPage, hasMore: fetchedHasMore } = response.data;

            if (page === 1) {
                setOrders(fetchedOrders);
            } else {
                setOrders((prevOrders) => [...prevOrders, ...fetchedOrders]);
            }

            setHasMore(fetchedHasMore);
            setCurrentPage(fetchedCurrentPage);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [SERVER_URL]);

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage, fetchOrders]);

    const formatDate = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) {
            return "N/A";
        }
        try {
            const date = new Date(timeStr);
            if (isNaN(date.getTime())) { // Check if the date parsing failed
                if (timeStr.includes(':')) {
                    const [hours, minutes] = timeStr.split(':');
                    const tempDate = new Date();
                    tempDate.setHours(parseInt(hours, 10));
                    tempDate.setMinutes(parseInt(minutes, 10));
                    tempDate.setSeconds(0);
                    return tempDate.toLocaleTimeString("en-GB", {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                }
                return "N/A";
            }
            return date.toLocaleTimeString("en-GB", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            console.error("Error formatting time:", e, "Input:", timeStr);
            return "N/A";
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "delivered":
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "pending":
            case "processing":
            case "shipped":
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalToOpen(true);
    };

    const closeModal = () => {
        setIsModalToOpen(false);
        setSelectedOrder(null);
    };

    // Calculate subtotal from items (assuming all items have a price)
    const calculateSubtotal = (items) => {
        return items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    };

    // Calculate total taxes
    const calculateTotalTaxes = (appliedTaxes) => {
        return appliedTaxes?.reduce((sum, tax) => sum + tax.amountApplied, 0) || 0;
    };

    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Your Restaurant Orders</h1>

            {initialLoad && isLoading ? (
                <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                    <FaRegClock className="mr-2 animate-spin w-6 h-6" /> Fetching your orders...
                </div>
            ) : orders.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                        {orders.map((order, index) => {
                            const isLastOrder = orders.length === index + 1;
                            const orderItemImage = order.items?.[0]?.image || "https://placehold.co/150x150/f0f9ff/00796b?text=Order+Image";

                            return (
                                <div
                                    key={order._id}
                                    ref={isLastOrder ? lastOrderElementRef : null}
                                    className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
                                        ${selectedOrder && selectedOrder._id === order._id ? "ring-2 ring-teal-500" : ""}`}
                                    onClick={() => openModal(order)}
                                >
                                    <div className="p-4 flex flex-col items-center text-center">
                                        <div className="relative w-full mb-3">
                                            <img
                                                src={orderItemImage}
                                                alt={order.sourceId?.name || "Order"}
                                                className="w-full h-40 object-cover rounded-lg shadow-inner"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/f0f9ff/00796b?text=Order+Image"; }}
                                            />
                                            <span
                                                className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(order.orderStatus)}`}
                                            >
                                                {order.orderStatus?.toLowerCase() === "confirmed" || order.orderStatus?.toLowerCase() === "delivered" || order.orderStatus?.toLowerCase() === "completed" ? (
                                                    <FaCheckCircle className="inline mr-1 w-3 h-3" />
                                                ) : (
                                                    <FaRegClock className="inline mr-1 w-3 h-3" />
                                                )}
                                                {order.orderStatus}
                                            </span>
                                            <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                                                #{order._id.slice(-6)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{order.sourceId?.name || "N/A"}</h3>
                                        <p className="text-sm text-gray-600 mb-3 truncate w-full px-2">
                                            Ordered by: {order.customerName || "N/A"}
                                        </p>

                                        <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                                            <span className="text-sm font-semibold text-gray-800 flex items-center">
                                                <FaCalendarAlt className="mr-1 text-blue-500" /> {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                                            </span>
                                            <button className="px-4 py-2 bg-teal-500 text-white rounded-full text-sm font-semibold hover:bg-teal-600 transition-colors duration-200 shadow-md">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isLoading && (
                        <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                            <FaRegClock className="mr-2 animate-spin w-5 h-5" /> Loading more orders...
                        </div>
                    )}
                    {!hasMore && !isLoading && orders.length > 0 && (
                        <div className="text-center py-4 text-gray-500">You've seen all your orders.</div>
                    )}
                </>
            ) : (
                <div className="py-10 text-center text-gray-600 text-lg">
                    No orders found. Place your first order today!
                </div>
            )}

            <CustomModal
                isOpen={isModalOpen} // Use the renamed state here
                onClose={closeModal}
            >
                {selectedOrder && (
                    <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                            title="Close"
                        >
                            <FaTimesCircle className="w-8 h-8" />
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                            <FaInfoCircle className="mr-2 text-teal-600 w-6 h-6" /> Order Details
                            <span className="text-teal-600 ml-2">#{selectedOrder._id.slice(-6)}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                            {/* Restaurant/Mall Info */}
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaStore className="mr-2 text-blue-500 w-4 h-4" /> Restaurant:
                                </p>
                                <p className="ml-5">
                                    <b>Name: </b>
                                    {selectedOrder.sourceId?.name || "N/A"}
                                </p>
                                <p className="ml-5">
                                    <b>Address:</b>
                                    {selectedOrder.sourceId?.address?.street}, {selectedOrder.sourceId?.address?.city}, {selectedOrder.sourceId?.address?.state} - {selectedOrder.sourceId?.address?.zipCode || "N/A"}
                                </p>
                            </div>
                            {/* Order Date/Time and Payment Method */}
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-yellow-500 w-4 h-4" /> Ordered On:
                                </p>
                                <p className="ml-5">
                                    {formatDate(selectedOrder.orderDate)} at {formatTime(selectedOrder.orderDate)}
                                </p>
                                <p className="font-semibold text-gray-600 flex items-center mt-3">
                                    <FaMoneyBillWave className="mr-2 text-green-500 w-4 h-4" /> Payment Method:
                                </p>
                                <p className="ml-5">
                                    {selectedOrder.paymentMethod || "N/A"}
                                </p>
                            </div>
                            {selectedOrder.notes && (
                                <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-200">
                                    <p className="font-semibold text-gray-600 flex items-center">
                                        <FaInfoCircle className="mr-2 text-blue-500 w-4 h-4" /> Order Notes:
                                    </p>
                                    <p className="italic ml-5">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Ordered Items Section - MODIFIED */}
                        <div className="mb-6 border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                                <FaUtensils className="mr-2 text-purple-500 w-5 h-5" /> Ordered Items:
                            </h4>
                            <div className="space-y-4 text-gray-700 text-sm"> {/* Increased space-y for better separation */}
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    selectedOrder.items.map((item, idx) => (
                                        <div key={item._id || idx} className="flex flex-col sm:flex-row items-center bg-gray-50 p-3 rounded-md shadow-sm">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-md mr-4 mb-2 sm:mb-0"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/f0f9ff/00796b?text=Item"; }}
                                                />
                                            )}
                                            <div className="flex-grow text-center sm:text-left">
                                                <p className="font-medium text-base text-gray-900">{item.quantity} x {item.name}</p>
                                                {item.product?.description && (
                                                    <p className="text-xs text-gray-500 italic mt-1">{item.product.description}</p>
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-800 mt-2 sm:mt-0 sm:ml-auto">
                                                {item.price.toFixed(2)} {item.currency}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">No items found.</p>
                                )}
                            </div>
                        </div>

                        {/* Cost Breakdown Section */}
                        <div className="mb-6 border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Cost Breakdown:</h4>
                            <div className="space-y-2 text-gray-700 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Subtotal:</span>
                                    <span>{calculateSubtotal(selectedOrder.items).toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                                </div>
                                {selectedOrder.appliedTaxes && selectedOrder.appliedTaxes.length > 0 && (
                                    <>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium flex items-center">
                                                <FaPercentage className="mr-1 text-orange-500 w-3 h-3" /> Taxes:
                                            </span>
                                            <span>{calculateTotalTaxes(selectedOrder.appliedTaxes).toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                                        </div>
                                        <ul className="ml-5 text-xs text-gray-600 list-disc list-inside">
                                            {selectedOrder.appliedTaxes.map((tax, idx) => (
                                                <li key={idx}>
                                                    {tax.name}: {tax.amountApplied.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {/* Placeholder for Additional Costs - add actual data if available in your API */}
                                {/* {selectedOrder.additionalCost && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Additional Costs:</span>
                                        <span>{selectedOrder.additionalCost.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                                    </div>
                                )} */}
                                {selectedOrder.discountValue > 0 && (
                                    <div className="flex justify-between items-center text-red-600">
                                        <span className="font-medium flex items-center">
                                            <FaTag className="mr-1 w-3 h-3" /> Discount:
                                        </span>
                                        <span>- {selectedOrder.discountValue.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                                    </div>
                                )}
                                {selectedOrder.offerId && (
                                    <div className="flex justify-between items-center text-teal-700 text-xs">
                                        <span className="font-medium flex items-center">
                                            <FaTag className="mr-1 w-3 h-3" /> Offer ID:
                                        </span>
                                        <span className="ml-1">{selectedOrder.offerId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2 font-bold text-gray-900 text-base">
                                    <span>Total Amount:</span>
                                    <span>{selectedOrder.totalAmount.toFixed(2)} {selectedOrder.items?.[0]?.currency || "INR"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Section */}
                        <div className="mb-6 border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Customer Information:</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-800">Name: {selectedOrder.customerName || "N/A"}</p>
                                        <p className="text-xs text-gray-500">Email: {selectedOrder.customerEmail || "N/A"}</p>
                                        <p className="text-xs text-gray-500">Mobile: {selectedOrder.customerPhoneNumber || "N/A"}</p>
                                        <p className="text-xs text-gray-500">Country: {selectedOrder.shippingAddress?.country || "N/A"}</p>
                                        {selectedOrder.shippingAddress && (
                                            <p className="text-xs text-gray-500">Shipping Address:
                                                {selectedOrder.shippingAddress.street ? ` ${selectedOrder.shippingAddress.street},` : ''}
                                                {selectedOrder.shippingAddress.city ? ` ${selectedOrder.shippingAddress.city},` : ''}
                                                {selectedOrder.shippingAddress.state ? ` ${selectedOrder.shippingAddress.state},` : ''}
                                                {selectedOrder.shippingAddress.zipCode ? ` ${selectedOrder.shippingAddress.zipCode}` : ''}
                                                {(selectedOrder.shippingAddress.country && !selectedOrder.shippingAddress.street && !selectedOrder.shippingAddress.city && !selectedOrder.shippingAddress.state && !selectedOrder.shippingAddress.zipCode) ? ' N/A' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline Section */}
                        {selectedOrder.subStatus && selectedOrder.subStatus.length > 0 && (
                            <div className="mt-6 border-t pt-4">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Timeline:</h4>
                                <ol className="relative border-l border-gray-200 ml-4">
                                    {selectedOrder.subStatus
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((statusEntry, idx) => (
                                            <li key={statusEntry._id || idx} className="mb-4 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    {statusEntry.status?.toLowerCase() === "confirmed" || statusEntry.status?.toLowerCase() === "delivered" || statusEntry.status?.toLowerCase() === "completed" ? (
                                                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                                                    ) : statusEntry.status?.toLowerCase() === "shipped" ? (
                                                        <FaTruck className="w-3 h-3 text-blue-500" />
                                                    ) : (
                                                        <FaRegClock className="w-3 h-3 text-yellow-500" />
                                                    )}
                                                </span>
                                                <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                                                    {statusEntry.status}
                                                    {idx === selectedOrder.subStatus.length - 1 && (
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
                )}
            </CustomModal>
        </div>
    );
};

export default MyOrders;