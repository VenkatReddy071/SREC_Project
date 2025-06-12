import React, { useState, useEffect } from 'react';
import BookingTable from '../Dashboard/Hospital/Bookings/BookingTable';
import BookingFilters from '../Dashboard/Hospital/Bookings/BookingFilters';
import BookingDetailsModal from '../Dashboard/Hospital/Bookings/BookingDetailModel';
import axios from "axios";

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Currently commented out in render
    const [doctors, setDoctors] = useState([]); // Initialize as empty array
    const [specialization, setSpecialization] = useState([]); // Initialize as empty array, corrected typo
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [errorBookings, setErrorBookings] = useState(null);
    const [errorDoctors, setErrorDoctors] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        dateRange: '',
        doctor: '',
        status: '',
        specialization: '', // Changed from 'service' to 'specialization' for consistency
    });

    // --- EFFECT HOOK: Fetch Bookings ---
    useEffect(() => {
        const fetchBookings = async () => {
            setLoadingBookings(true);
            setErrorBookings(null);
            const token = localStorage.getItem("dashboard");
            const url = `${import.meta.env.VITE_SERVER_URL}/api/booking/admin/hospital`;

            try {
                const response = await axios.get(url, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true // Corrected typo here
                });
                console.log(response.data)
                setBookings(response.data);
                setFilteredBookings(response.data); // Initialize filtered bookings with all bookings
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setErrorBookings("Failed to load bookings.");
                setBookings([]); // Clear bookings on error
                setFilteredBookings([]);
            } finally {
                setLoadingBookings(false);
            }
        };
        fetchBookings();
    }, []);

    // --- EFFECT HOOK: Fetch Doctors and Specializations ---
    useEffect(() => {
        const fetchDoctorsAndSpecializations = async () => {
            setLoadingDoctors(true);
            setErrorDoctors(null);
            const url = `${import.meta.env.VITE_SERVER_URL}/api/hospitals/hospital/email`; // Confirm this is the correct endpoint for doctors
            const token = localStorage.getItem("dashboard");

            try {
                const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
                const fetchedDoctors = response.data.doctors || [];
                setDoctors(fetchedDoctors);

                const allSpecializations = fetchedDoctors.flatMap(doc => {
                    return Array.isArray(doc.specialization) ? doc.specialization : [doc.specialization];
                }).filter(Boolean);

                const uniqueSpecializations = [...new Set(allSpecializations)];
                setSpecialization(uniqueSpecializations); // Corrected typo
            } catch (error) {
                console.error("Error fetching doctors and specializations:", error);
                setErrorDoctors("Failed to load doctor data.");
                setDoctors([]);
                setSpecialization([]);
            } finally {
                setLoadingDoctors(false);
            }
        };
        fetchDoctorsAndSpecializations();
    }, []);

    // --- EFFECT HOOK: Apply Filters and Search ---
    useEffect(() => {
        // Ensure bookings and doctors are loaded before attempting to filter
        if (loadingBookings || loadingDoctors) return;

        let currentBookings = [...bookings];

        // Apply Search Term
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentBookings = currentBookings.filter(booking => {
                const patientMatch = booking.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
                                    booking.email?.toLowerCase().includes(lowerCaseSearchTerm);
                const doctorMatch = doctors.find(doc => doc._id === booking.Doctor?._id)?.name?.toLowerCase().includes(lowerCaseSearchTerm);
                return patientMatch || doctorMatch;
            });
        }

        // Apply Filters
        if (filters.dateRange) {
            const today = new Date();
            currentBookings = currentBookings.filter(booking => {
                const bookingDate = new Date(booking.date);
                if (filters.dateRange === 'today') {
                    return bookingDate.toDateString() === today.toDateString();
                }
                // Add more date range logic here (e.g., "this week", "this month")
                return true;
            });
        }

        if (filters.doctor) {
          console.log(filters.doctor);
            currentBookings = currentBookings.filter(booking => booking.Doctor?._id === filters.doctor);
        }

        if (filters.status) {
            currentBookings = currentBookings.filter(booking => booking.status === filters.status);
        }

        if (filters.specialization) { // Now filtering by 'specialization'
            currentBookings = currentBookings.filter(booking =>
                Array.isArray(booking.specialization) && booking.specialization.includes(filters.specialization)
            );
        }

        setFilteredBookings(currentBookings);
    }, [bookings, searchTerm, filters, doctors, loadingBookings, loadingDoctors]); // Added loading states to dependencies

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsDetailsModalOpen(true);
    };

    const handleReschedule = (bookingId) => {
        alert(`Reschedule booking with ID: ${bookingId}`);
        // In a real app, you'd open a modal for rescheduling or navigate
    };

    const handleCancel = (bookingId) => {
        if (window.confirm(`Are you sure you want to cancel booking with ID: ${bookingId}?`)) {
            // Optimistic UI update, then call API to update status
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === bookingId ? { ...booking, status: "Cancelled" } : booking
                )
            );
            // TODO: Call API to actually cancel the booking on the backend
            // axios.put(`${import.meta.env.VITE_SERVER_URL}/api/booking/${bookingId}/cancel`, { status: "Cancelled" }, { headers: { Authorization: `Bearer ${localStorage.getItem("dashboard")}` } });
        }
    };

    const handleMarkStatus = (bookingId, newStatus) => {
        setBookings(prevBookings =>
            prevBookings.map(booking =>
                booking._id === bookingId ? { ...booking, status: newStatus } : booking
            )
        );
        
        axios.put(`${import.meta.env.VITE_SERVER_URL}/api/booking/admin/${bookingId}/status`, { status: newStatus },{withCredentails:true} )
        .then((response)=>{
            alert("successfully updated");

        })
        .catch((error)=>{
            console.log(error);
            alert("error");
        })
    };

    const handleAddBooking = (newBooking) => {
        // In a real app, you'd send this to your backend and then refresh your state
        setBookings(prevBookings => [...prevBookings, { ...newBooking, _id: `bkg${Date.now()}` }]);
        setIsAddModalOpen(false);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen"> {/* Added padding */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Bookings</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search by patient or doctor name..."
                        className="p-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Optional: Add booking button if needed */}
                    {/* <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add New Booking
                    </button> */}
                </div>

                {/* Pass doctors and specialization to filters */}
                <BookingFilters
                    filters={filters}
                    setFilters={setFilters}
                    doctors={doctors}
                    specialization={specialization} // Corrected prop name
                />
            </div>

            {(loadingBookings || loadingDoctors) && <div className="text-center text-blue-700">Loading bookings...</div>}
            {errorBookings && <div className="text-center text-red-600 mb-4">{errorBookings}</div>}
            {errorDoctors && <div className="text-center text-red-600 mb-4">{errorDoctors}</div>}

            {!loadingBookings && !loadingDoctors && filteredBookings.length === 0 && !errorBookings && !errorDoctors && (
                <div className="text-center text-gray-600 mt-8">No bookings found matching your criteria.</div>
            )}

            {!loadingBookings && !errorBookings && filteredBookings.length > 0 && (
                <BookingTable
                    bookings={filteredBookings}
                    onViewDetails={handleViewDetails}
                    onReschedule={handleReschedule}
                    onCancel={handleCancel}
                    onMarkStatus={handleMarkStatus}
                    doctors={doctors} // Pass doctors to table for display
                />
            )}


            {isDetailsModalOpen && selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setIsDetailsModalOpen(false)}
                    doctors={doctors} // Pass doctors to modal for display
                />
            )}

            {/* {isAddModalOpen && (
                <AddBookingModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAddBooking={handleAddBooking}
                    doctors={doctors} // Pass doctors to add booking modal (use actual doctors, not dummy)
                />
            )} */}
        </div>
    );
};

export default BookingsPage;