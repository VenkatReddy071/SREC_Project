
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import OrderCard from './OrderCard';
import { useDashboardSocket } from '../../../Context/Socket/DashboardContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const HospitalBookingsList = ({ searchTerm, onViewDetails, setAlertMessage, setIsAlertModalOpen }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useDashboardSocket();

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${SERVER_URL}/api/booking/admin/all`, { withCredentials: true });
            setBookings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching hospital bookings:", error);
            setAlertMessage("Failed to fetch hospital bookings. Please check your network or API endpoint.");
            setIsAlertModalOpen(true);
        } finally {
            setLoading(false);
        }
    }, [setAlertMessage, setIsAlertModalOpen]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Socket listeners for real-time updates
    useEffect(() => {
        if (!socket) {
            console.warn("Socket connection not established for HospitalBookingsList.");
            return;
        }

        const handleNewBooking = (data) => {
            const newBooking = data.booking;
            if (!newBooking || !newBooking._id) {
                console.warn("Received new hospital booking without _id or invalid data:", data);
                return;
            }
            setBookings((prev) => {
                if (prev.some(booking => booking._id === newBooking._id)) {
                    return prev;
                }
                return [newBooking, ...prev]; 
            });
            const hospitalName = newBooking.Hospital?.name || newBooking.hospitalId || 'an unknown hospital';
            toast.info(`New Hospital Booking from ${data.username || 'a user'} for ${hospitalName}.`);
        };
        const handleNewFashionOrder=()=>{
            toast.info("new Fashion Order");
        }
        const handleNewRestaurantOrder=()=>{
            toast.info("new Restaurant Order");
        }

        socket.on("newBooking", handleNewBooking);
        socket.on("newOrder_Mall", handleNewFashionOrder);
        socket.on('newOrder_Restaurant', handleNewRestaurantOrder);
        return () => {
            socket.off("newBooking", handleNewBooking);
            socket.off("newOrder_Mall", handleNewFashionOrder);
            socket.off('newOrder_Restaurant', handleNewRestaurantOrder);
        };
    }, [socket]); 
    const filteredBookings = bookings.filter(booking => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            (booking.name && booking.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (booking.Hospital?.name && booking.Hospital.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (booking.Doctor?.name && booking.Doctor.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (booking._id && String(booking._id).toLowerCase().includes(lowerCaseSearchTerm))
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48 text-gray-600">
                <FaSpinner className="animate-spin mr-2" size={30} /> Loading hospital bookings...
            </div>
        );
    }

    if (filteredBookings.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
                No hospital bookings found or matching your search.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
            {filteredBookings.map(booking => (
                <OrderCard
                    key={booking._id}
                    order={booking}
                    activeTab="hospital"
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};

export default HospitalBookingsList;