
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookingsListSidebar } from './BookingListSidebar';
import { BookingDetailsPanel } from './BookingDetailModel';

const BookingsSection = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'upcoming', 'past'
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    const fetchBookings = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('dashboard');
        if (!token) {
            console.error('No authentication token found.');
            setIsLoading(false);
            return;
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true,
                params: {
                    searchTerm,
                    status: statusFilter === 'all' ? '' : statusFilter,
                    dateRange: dateFilter === 'all' ? '' : dateFilter,
                },
            };
            const response = await axios.get(`${API_BASE_URL}/api/booking/admin/hospital`, config);
            setBookings(response.data);
            setFilteredBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [searchTerm, statusFilter, dateFilter]);

    const handleSelectBooking = (booking) => {
        setSelectedBooking(booking);
    };

    const handleUpdateBookingStatus = (updatedBooking) => {
        setBookings(prevBookings => prevBookings.map(b =>
            b._id === updatedBooking._id ? updatedBooking : b
        ));
        if (selectedBooking && selectedBooking._id === updatedBooking._id) {
            setSelectedBooking(updatedBooking);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-inter">
            <div className="w-[35%]">
                <BookingsListSidebar
                    bookings={filteredBookings}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    onSelectBooking={handleSelectBooking}
                    selectedBookingId={selectedBooking ? selectedBooking._id : null}
                    isLoading={isLoading}
                />
            </div>
            <div className="w-full h-screen overflow-hidden"> {/* Changed to hidden for panel to manage its scroll */}
                <BookingDetailsPanel
                    booking={selectedBooking}
                    onUpdateStatus={handleUpdateBookingStatus}
                    onCancel={() => setSelectedBooking(null)}
                />
            </div>
        </div>
    );
};

export default BookingsSection;