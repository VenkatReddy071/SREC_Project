import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { FaRegClock, FaCheckCircle, FaHeart, FaRegHeart, FaInfoCircle, FaTimesCircle, FaCalendarAlt, FaHospital, FaUserMd } from 'react-icons/fa'; // Combined React Icons
import CustomModal from "../../../Pages/CustomModol";

const ITEMS_PER_LOAD = 15; 

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}`;

    const observer = useRef();
    const lastBookingElementRef = useCallback(
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

    const fetchBookings = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await Axios.get(
                `${SERVER_URL}/api/booking/my-bookings?page=${page}&limit=${ITEMS_PER_LOAD}`,
                {
                    withCredentials: true,
                }
            );

            const { bookings: fetchedBookings, totalBookings, page: fetchedCurrentPage, hasMore: fetchedHasMore } = response.data;
            
            if (page === 1) {
                setBookings(fetchedBookings);
            } else {
                setBookings((prevBookings) => [...prevBookings, ...fetchedBookings]);
            }

            setHasMore(fetchedHasMore);
            setCurrentPage(fetchedCurrentPage);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setInitialLoad(false);
        }
    }, [SERVER_URL]);

    useEffect(() => {
        fetchBookings(currentPage);
    }, [currentPage, fetchBookings]);

    const toggleFavorite = (event, bookingId) => {
        event.stopPropagation();
        setBookings((prevBookings) =>
            prevBookings.map((booking) =>
                booking._id === bookingId ? { ...booking, favBooking: !booking.favBooking } : booking
            )
        );

        Axios.put(
            `${SERVER_URL}/api/booking/my-bookings/Fav/${bookingId}`,
            
            {
                withCredentials: true,
            }
        )
            .then((response) => {
                console.log("Favorite status updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error toggling favorite:", error);
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking._id === bookingId ? { ...booking, fav: !booking.fav } : booking
                    )
                );
            });
    };

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
            if (timeStr.includes(':')) {
                const [hours, minutes] = timeStr.split(':');
                const date = new Date();
                date.setHours(parseInt(hours, 10));
                date.setMinutes(parseInt(minutes, 10));
                date.setSeconds(0);
                return date.toLocaleTimeString("en-GB", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            } else if (!isNaN(new Date(timeStr).getTime())) {
                return new Date(timeStr).toLocaleTimeString("en-GB", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            }
            return "N/A";
        } catch (e) {
            console.error("Error formatting time:", e, "Input:", timeStr);
            return "N/A";
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "pending":
            case "accept":
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
    };

    return (
        <div className="w-full mx-auto px-4 bg-gray-50 min-h-screen py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-4">Your Appointments</h1>

            {initialLoad && isLoading ? (
                <div className="text-center py-10 text-xl font-semibold text-gray-700 animate-pulse flex items-center justify-center">
                    <FaRegClock className="mr-2 animate-spin w-6 h-6" /> Fetching your appointments...
                </div>
            ) : bookings.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                        {bookings.map((booking, index) => {
                            const isLastBooking = bookings.length === index + 1;
                            const hospitalImage = booking.Hospital?.image || "https://placehold.co/150x150/f0f9ff/00796b?text=Hospital+Image";

                            return (
                                <div
                                    key={booking._id}
                                    ref={isLastBooking ? lastBookingElementRef : null}
                                    className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
                                        ${selectedBooking && selectedBooking._id === booking._id ? "ring-2 ring-teal-500" : ""}`}
                                    onClick={() => openModal(booking)}
                                >
                                    <div className="p-4 flex flex-col items-center text-center">
                                        <div className="relative w-full mb-3">
                                            <img
                                                src={hospitalImage}
                                                alt={booking.Hospital?.name || "Hospital"}
                                                className="w-full h-40 object-cover rounded-lg shadow-inner"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/f0f9ff/00796b?text=Hospital+Image"; }}
                                            />
                                            <span
                                                className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusClass(booking.status)}`}
                                            >
                                                {booking.status?.toLowerCase() === "approved" || booking.status?.toLowerCase() === "completed" ? (
                                                    <FaCheckCircle className="inline mr-1 w-3 h-3" />
                                                ) : (
                                                    <FaRegClock className="inline mr-1 w-3 h-3" />
                                                )}
                                                {booking.status}
                                            </span>
                                            <span className="absolute top-2 right-2 text-xs font-medium text-gray-500 bg-white bg-opacity-80 rounded-full px-2 py-1 shadow-sm">
                                                #{booking._id.slice(-6)}
                                            </span>
                                            <button
                                                className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform duration-200"
                                                onClick={(e) => toggleFavorite(e, booking._id)}
                                            >
                                                {booking.favBooking ? <FaHeart className="w-5 h-5 text-red-500" /> : <FaRegHeart className="w-5 h-5 text-gray-400" />}
                                            </button>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{booking.Hospital?.name || "N/A"}</h3>
                                        <p className="text-sm text-gray-600 mb-3 truncate w-full px-2">
                                            Doctor: {booking.Doctor?.name || "N/A"} - {booking.specialization?.join(', ') || "N/A"}
                                        </p>

                                        <div className="flex justify-between items-center w-full pt-3 border-t border-gray-100">
                                            <span className="text-sm font-semibold text-gray-800 flex items-center">
                                                <FaCalendarAlt className="mr-1 text-blue-500" /> {formatDate(booking.ScheduleDate)} at {formatTime(booking.slot)}
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
                            <FaRegClock className="mr-2 animate-spin w-5 h-5" /> Loading more appointments...
                        </div>
                    )}
                    {!hasMore && !isLoading && bookings.length > 0 && (
                        <div className="text-center py-4 text-gray-500">You've seen all your appointments.</div>
                    )}
                </>
            ) : (
                <div className="py-10 text-center text-gray-600 text-lg">
                    No appointments found. Book your first appointment today!
                </div>
            )}

            <CustomModal
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {selectedBooking && (
                    <div className="p-6 bg-white rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl transition-colors duration-200"
                            title="Close"
                        >
                            <FaTimesCircle className="w-8 h-8" />
                        </button>

                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
                            <FaInfoCircle className="mr-2 text-teal-600 w-6 h-6" /> Appointment Details
                            <span className="text-teal-600 ml-2">#{selectedBooking._id.slice(-6)}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaHospital className="mr-2 text-blue-500 w-4 h-4" /> Hospital:
                                </p>
                                <p className="ml-5">
                                    <b>Name: </b>
                                    {selectedBooking.Hospital?.name || "N/A"}
                                </p>
                                <p className="ml-5">
                                    <b>Address: </b>
                                    {selectedBooking.Hospital?.address || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 flex items-center">
                                    <FaUserMd className="mr-2 text-purple-500 w-4 h-4" /> Doctor:
                                </p>
                                <p className="ml-5">Dr. {selectedBooking.Doctor?.name || "N/A"}</p>
                                <p className="ml-5">Specialization: {selectedBooking.specialization?.join(", ") || "N/A"}</p>
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
                                    <FaCalendarAlt className="mr-2 text-green-500 w-4 h-4" /> Scheduled Appointment:
                                </p>
                                <p className="ml-5">
                                    {selectedBooking.date
                                        ? `${formatDate(selectedBooking.date)} at ${formatTime(selectedBooking.slot)}`
                                        : "N/A"}
                                </p>
                            </div>
                            {selectedBooking.message && (
                                <div className="col-span-full bg-blue-50 p-3 rounded-md border border-blue-200">
                                    <p className="font-semibold text-gray-600 flex items-center">
                                        <FaInfoCircle className="mr-2 text-blue-500 w-4 h-4" /> Patient Message:
                                    </p>
                                    <p className="italic ml-5">{selectedBooking.message}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 border-t pt-4">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">Patient Information:</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-md shadow-sm">
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-800">Name: {selectedBooking.name}</p>
                                        <p className="text-xs text-gray-500">Email: {selectedBooking.email}</p>
                                        <p className="text-xs text-gray-500">Mobile: {selectedBooking.mobilenumber}</p>
                                        <p className="text-xs text-gray-500">Age: {selectedBooking.age}</p>
                                        <p className="text-xs text-gray-500">Gender: {selectedBooking.gender}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedBooking.subStatus && selectedBooking.subStatus.length > 0 && (
                            <div className="mt-6 border-t pt-4">
                                <h4 className="font-bold text-gray-800 mb-3 text-lg">Appointment Timeline:</h4>
                                <ol className="relative border-l border-gray-200 ml-4">
                                    {selectedBooking.subStatus
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((statusEntry, idx) => (
                                            <li key={statusEntry._id || idx} className="mb-4 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    {statusEntry.status?.toLowerCase() === "approved" || statusEntry.status?.toLowerCase() === "completed" ? (
                                                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <FaRegClock className="w-3 h-3 text-yellow-500" />
                                                    )}
                                                </span>
                                                <h3 className="flex items-center mb-1 text-md font-semibold text-gray-900 capitalize">
                                                    {statusEntry.status}
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
                    </div>
                )}
            </CustomModal>
        </div>
    );
};

export default MyBookings;