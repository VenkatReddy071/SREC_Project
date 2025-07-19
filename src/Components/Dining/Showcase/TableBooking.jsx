import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {toast} from "react-toastify"
const TableBookingForm = ({ restaurantId }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [displayDate, setDisplayDate] = useState(moment().toDate());
    const [timeSlots, setTimeSlots] = useState([]);
    const [isClosed, setIsClosed] = useState(false);
    const [closedMessage, setClosedMessage] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [guest, setGuest] = useState(1);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [loadingBooking, setLoadingBooking] = useState(false); // New state for booking loading

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        fetchTimeSlots(displayDate);
    }, [displayDate, restaurantId]);

    const fetchTimeSlots = async (dateToFetch) => {
        setLoadingSlots(true);
        setSlotsError(null);
        setIsClosed(false);
        setClosedMessage('');
        setTimeSlots([]);
        setSelectedTimeSlot('');

        try {
            const formattedDate = moment(dateToFetch).format('YYYY-MM-DD');
            const url = `${import.meta.env.VITE_SERVER_URL}/api/res/${restaurantId}/timeslots` + (selectedDate ? `?date=${formattedDate}` : '');

            const response = await axios.get(url);

            if (response.data.isClosed) {
                setIsClosed(true);
                setClosedMessage(response.data.message);
            } else {
                setTimeSlots(response?.data?.timeSlots);
                if (response.data?.timeSlots?.length > 0) {
                    setSelectedTimeSlot(response.data.timeSlots[0]);
                } else {
                    setClosedMessage("No available time slots for this date.");
                }
            }
        } catch (err) {
            console.error("Error fetching time slots:", err);
            setSlotsError("Failed to fetch time slots. Please try again.");
            setIsClosed(true);
            setClosedMessage("An error occurred. Unable to retrieve time slots.");
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        const newDate = moment(dateValue).toDate();
        setSelectedDate(newDate);
        setDisplayDate(newDate);
    };

    const handleGuestChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setGuest(Math.max(1, Math.min(10, value)));
        } else {
            setGuest(1);
        }
    };

    const showToastNotification = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            setToastMessage('');
            setToastType('');
        }, 3000); // Hide after 3 seconds
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingMessage('');
        setBookingError('');
        setLoadingBooking(true); // Start loading

        if (!name || !email || !mobileNumber || !selectedTimeSlot || !guest) {
            setBookingError("Please fill in all booking details.");
            setLoadingBooking(false); // Stop loading if validation fails
            return;
        }
        if (guest < 1 || guest > 10) {
            setBookingError("Number of guests must be between 1 and 10.");
            setLoadingBooking(false); // Stop loading if validation fails
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/book`, {
                name,
                email,
                mobileNumber,
                scheduleDate: moment(displayDate).toDate(),
                timeSlot: selectedTimeSlot,
                guest,
                restaurantId,
            });
            setBookingMessage('Table booked successfully!');
        toast.success('Table booked successfully!', 'success'); // Show success toast
            setName('');
            setEmail('');
            setMobileNumber('');
            setGuest(1);
            setSelectedTimeSlot('');
            fetchTimeSlots(displayDate);
        } catch (err) {
            console.error("Error booking table:", err);
            const errorMessage = err.response?.data?.message || "Failed to book table. Please try again.";
            setBookingError(errorMessage);
            showToastNotification(errorMessage, 'error'); // Show error toast
        } finally {
            setLoadingBooking(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="w-4/5 mx-auto p-8 bg-white rounded-xl mt-10 font-inter border border-gray-200">
            {showToast && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toastMessage}
                </div>
            )}

            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Book Your Table</h2>

            <div className="mb-6">
                <label htmlFor="bookingDate" className="block text-gray-800 text-lg font-semibold mb-3">
                    Choose a Date:
                </label>
                <input
                    type="date"
                    id="bookingDate"
                    value={moment(displayDate).format('YYYY-MM-DD')}
                    onChange={handleDateChange}
                    min={moment().format('YYYY-MM-DD')} // Prevent selecting past dates
                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
            </div>

            {loadingSlots && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="ml-3 text-blue-600">Loading available slots...</p>
                </div>
            )}
            {slotsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{slotsError}</span>
                </div>
            )}

            {isClosed ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Closed!</strong>
                    <span className="block sm:inline ml-2">{closedMessage}</span>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <label className="block text-gray-800 text-lg font-semibold mb-3">
                            Select Time Slot:
                        </label>
                        {timeSlots?.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {timeSlots?.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedTimeSlot(slot)}
                                        className={`p-3 rounded-lg text-center font-medium transition-all duration-200 ease-in-out border border-gray-300
                                            ${selectedTimeSlot === slot ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-700'}
                                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-4">{closedMessage || "No time slots available for this date."}</p>
                        )}
                    </div>

                    {selectedTimeSlot && timeSlots.length > 0 && (
                        <form onSubmit={handleBookingSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                    Your Name:
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-bold mb-2">
                                    Mobile Number:
                                </label>
                                <input
                                    type="tel"
                                    id="mobileNumber"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="guest" className="block text-gray-700 text-sm font-bold mb-2">
                                    Number of Guests:
                                </label>
                                <input
                                    type="number"
                                    id="guest"
                                    value={guest}
                                    onChange={handleGuestChange}
                                    min="1"
                                    max="10"
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    required
                                />
                            </div>
                            {bookingError && <p className="text-red-500 text-center text-sm">{bookingError}</p>}
                            {bookingMessage && <p className="text-green-600 text-center text-sm">{bookingMessage}</p>}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 relative"
                                disabled={loadingBooking} // Disable button when loading
                            >
                                {loadingBooking ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Booking...
                                    </div>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default TableBookingForm;
