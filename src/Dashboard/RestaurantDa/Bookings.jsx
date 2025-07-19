import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import { FaRegClock, FaCheckCircle, FaInfoCircle, FaTimesCircle, FaCalendarAlt, FaUsers, FaClipboardList, FaBan, FaSpinner, FaEdit, FaEye, FaHospital } from 'react-icons/fa';
import CustomModal from "../../Pages/CustomModol";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import {useDashboardSocket} from "../../Context/Socket/DashboardContext.jsx"
const AdminDashboardBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const {socket}=useDashboardSocket();
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showAdminCancelModal, setShowAdminCancelModal] = useState(false);
    const [adminCancelReason, setAdminCancelReason] = useState("");
    const [adminCancellationError, setAdminCancellationError] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);

    const token = localStorage.getItem("dashboard");
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const observer = useRef();
    const lastBookingElementRef = useCallback(
        (node) => {
            if (isLoading || !hasMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${SERVER_URL}/api/res/restaurant/booking/dashboard`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            setBookings(response.data);
            setHasMore(false);
        } catch (error) {
            console.error("Error fetching admin bookings:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [SERVER_URL, token]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);
    const { id } = useParams(); 
     useEffect(() => {
        if(socket && id ){
        const roomName = `dashboard_restaurant_${id}`;

        socket.emit('joinRoom', roomName);
        socket.on('newBooking', (data) => {
            setBookings(prevBookings => {
                if (!prevBookings.some(b => b._id === data.order._id)) {
                    return [data.order, ...prevBookings];
                }
                return prevBookings;
            });
        });

        socket.on('bookingUpdated', (data) => {
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === data.booking._id ? data.booking : booking
                )
            );
            if (selectedBooking && selectedBooking._id === data.booking._id) {
                setSelectedBooking(data.booking);
            }
        });

        return () => {
            socket.disconnect();
        };
    }
    }, [SERVER_URL, selectedBooking]);
    const formatDate = (dateStr) => {
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            return "N/A";
        }
        return moment(dateStr).format("DD MMM YYYY");
    };

    const formatTime = (timeStr) => {
        if (!timeStr) {
            return "N/A";
        }
        if (timeStr.includes(':') && timeStr.length <= 5) {
            return moment(timeStr, 'HH:mm').format('hh:mm A');
        }
        try {
            const date = new Date(timeStr);
            if (isNaN(date.getTime())) {
                return "N/A";
            }
            return moment(date).format('hh:mm A');
        } catch (e) {
            return "N/A";
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "accept":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
            case "user_cancel":
            case "admin_cancel":
                return "bg-red-100 text-red-800 border-red-200";
            case "pending":
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const openModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
        setAdminCancelReason("");
        setAdminCancellationError("");
        setShowAdminCancelModal(false);
    };

    const handleAdminAction = async (bookingId, status, reason = "") => {
        setIsActionLoading(true);
        setAdminCancellationError("");

        try {
            const response = await axios.put(
                `${SERVER_URL}/api/admin/${bookingId}/status`,
                { status, reason },
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking._id === bookingId ? response.data.booking : booking
                    )
                );
                if (selectedBooking && selectedBooking._id === bookingId) {
                    setSelectedBooking(response.data.booking);
                }
                closeModal();
            } else {
                setAdminCancellationError(response.data.message || "Failed to update booking status.");
            }
        } catch (error) {
            console.error(`Error updating booking to ${status}:`, error);
            setAdminCancellationError(error.response?.data?.message || `An error occurred while updating status to ${status}.`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleAcceptBooking = (bookingId) => {
        handleAdminAction(bookingId, 'accept');
    };

    const handleAdminCancelClick = () => {
        setShowAdminCancelModal(true);
        setAdminCancellationError("");
    };

    const confirmAdminCancelBooking = () => {
        if (!adminCancelReason.trim()) {
            setAdminCancellationError("Cancellation reason cannot be empty.");
            return;
        }
        if (!selectedBooking || !selectedBooking._id) {
            setAdminCancellationError("No booking selected for cancellation.");
            return;
        }
        handleAdminAction(selectedBooking._id, 'admin_cancel', adminCancelReason);
    };

    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8 font-inter">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Admin Dashboard: Table Bookings</h1>

            {isLoading && bookings.length === 0 ? (
                <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                    <FaRegClock className="mr-2 animate-spin w-6 h-6" /> Fetching all bookings...
                </div>
            ) : bookings.length > 0 ? (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Restaurant
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guests
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking, index) => {
                                const isLastBooking = bookings.length === index + 1 && hasMore;
                                return (
                                    <tr key={booking._id} ref={isLastBooking ? lastBookingElementRef : null}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{booking._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                
                                                <span>{booking.restaurant || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {booking.name || booking.user?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-1 text-blue-500" /> {formatDate(booking.scheduleDate)}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <FaRegClock className="mr-1 text-yellow-500" /> {formatTime(booking.time)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <FaUsers className="mr-1 text-purple-500" /> {booking.guest}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClass(booking.status)} capitalize`}>
                                                {booking.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleAcceptBooking(booking._id); }}
                                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-150 ease-in-out"
                                                        title="Accept Booking"
                                                        disabled={isActionLoading}
                                                    >
                                                        {isActionLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                                    </button>
                                                )}
                                                {(booking.status === 'pending' || booking.status === 'accept') && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openModal(booking); handleAdminCancelClick(); }}
                                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150 ease-in-out"
                                                        title="Cancel Booking"
                                                        disabled={isActionLoading}
                                                    >
                                                        <FaBan />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openModal(booking); }}
                                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-150 ease-in-out"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {isLoading && hasMore && (
                        <div className="text-center py-4 text-gray-500 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mr-2"></div> Loading more bookings...
                        </div>
                    )}
                    {!hasMore && !isLoading && (
                        <div className="text-center py-4 text-gray-500">You've seen all bookings.</div>
                    )}
                </div>
            ) : (
                <div className="py-10 text-center text-gray-600 text-lg">
                    No bookings found in the system.
                </div>
            )}

            <CustomModal
                isOpen={isModalOpen && selectedBooking && !showAdminCancelModal}
                onClose={closeModal}
            >
                {selectedBooking && (
                    <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                            title="Close"
                        >
                            <FaTimesCircle className="w-8 h-8" />
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                            <FaInfoCircle className="mr-2 text-blue-600 w-6 h-6" /> Booking Details
                            <span className="text-blue-600 ml-2">#{selectedBooking._id.slice(-6)}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaHospital className="mr-2 text-blue-500 w-4 h-4" /> Restaurant:
                                </p>
                                <p className="ml-5">
                                    <b>Name: </b>
                                    {selectedBooking.restaurant?.name || "N/A"}
                                </p>
                                <p className="ml-5">
                                    <b>Address:</b>
                                    {selectedBooking.restaurant?.address?.street || "N/A"}, {selectedBooking.restaurant?.address?.city || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaUsers className="mr-2 text-purple-500 w-4 h-4" /> Guests:
                                </p>
                                <p className="ml-5">{selectedBooking.guest || "N/A"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaRegClock className="mr-2 text-yellow-500 w-4 h-4" /> Booked On:
                                </p>
                                <p className="ml-5">
                                    {formatDate(selectedBooking.bookingDate)} at {formatTime(selectedBooking.bookingDate)}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-green-500 w-4 h-4" /> Scheduled Booking:
                                </p>
                                <p className="ml-5">
                                    {selectedBooking.scheduleDate
                                        ? `${formatDate(selectedBooking.scheduleDate)} at ${formatTime(selectedBooking.time)}`
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="col-span-full bg-gray-50 p-3 rounded-md border border-gray-200">
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaClipboardList className="mr-2 text-teal-500 w-4 h-4" /> Current Status:
                                </p>
                                <p className={`ml-5 font-bold capitalize ${getStatusClass(selectedBooking.status)}`}>
                                    {selectedBooking.status?.replace('_', ' ')}
                                </p>
                            </div>
                            {selectedBooking.reason && (
                                <div className="col-span-full bg-red-50 p-3 rounded-md border border-red-200">
                                    <p className="font-semibold text-gray-600 flex items-center">
                                        <FaBan className="mr-2 text-red-500 w-4 h-4" /> Reason:
                                    </p>
                                    <p className="italic ml-5">{selectedBooking.reason}</p>
                                </div>
                            )}
                        </div>

                        {selectedBooking.subStatus && selectedBooking.subStatus.length > 0 && (
                            <div className="mt-6 border-t pt-4">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Booking Timeline:</h4>
                                <ol className="relative border-l border-gray-200 ml-4">
                                    {selectedBooking.subStatus
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((statusEntry, idx) => (
                                            <li key={statusEntry._id || idx} className="mb-4 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    {statusEntry.status?.toLowerCase() === "accept" || statusEntry.status?.toLowerCase() === "approved" || statusEntry.status?.toLowerCase() === "completed" ? (
                                                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                                                    ) : statusEntry.status?.toLowerCase() === "rejected" || statusEntry.status?.toLowerCase() === "user_cancel" || statusEntry.status?.toLowerCase() === "admin_cancel" ? (
                                                        <FaTimesCircle className="w-3 h-3 text-red-500" />
                                                    ) : (
                                                        <FaRegClock className="w-3 h-3 text-yellow-500" />
                                                    )}
                                                </span>
                                                <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                                                    {statusEntry.status?.replace('_', ' ')}
                                                    {idx === selectedBooking.subStatus.length - 1 && (
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

                        {(selectedBooking.status === 'pending') && (
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                {selectedBooking.status === 'pending' && (
                                    <button
                                        onClick={() => handleAcceptBooking(selectedBooking._id)}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg text-base font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center"
                                        disabled={isActionLoading}
                                    >
                                        {isActionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                                        {isActionLoading ? "Accepting..." : "Accept Booking"}
                                    </button>
                                )}
                                <button
                                    onClick={handleAdminCancelClick}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg text-base font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center"
                                    disabled={isActionLoading}
                                >
                                    <FaBan className="mr-2" />
                                    {isActionLoading ? "Canceling..." : "Cancel Booking"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </CustomModal>

            <CustomModal
                isOpen={showAdminCancelModal}
                onClose={() => { setShowAdminCancelModal(false); setAdminCancelReason(""); setAdminCancellationError(""); }}
            >
                <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">
                    <button
                        onClick={() => { setShowAdminCancelModal(false); setAdminCancelReason(""); setAdminCancellationError(""); }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                        title="Close"
                    >
                        <FaTimesCircle className="w-8 h-8" />
                    </button>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3">Cancel Booking (Admin)</h2>
                    <p className="text-gray-700 mb-4">Please provide a reason for cancelling this booking:</p>
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y min-h-[100px]"
                        placeholder="e.g., Restaurant fully booked, Customer no-show, Invalid request..."
                        value={adminCancelReason}
                        onChange={(e) => { setAdminCancelReason(e.target.value); setAdminCancellationError(""); }}
                    ></textarea>
                    {adminCancellationError && (
                        <p className="text-red-500 text-sm mt-2">{adminCancellationError}</p>
                    )}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => { setShowAdminCancelModal(false); setAdminCancelReason(""); setAdminCancellationError(""); }}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={confirmAdminCancelBooking}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                            {isActionLoading ? "Submitting..." : "Confirm Cancellation"}
                        </button>
                    </div>
                </div>
            </CustomModal>
        </div>
    );
};

export default AdminDashboardBookings;