
import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaCheckCircle, FaClock, FaCalendarDay } from 'react-icons/fa';

export const BookingsListSidebar = ({
    bookings,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    onSelectBooking,
    selectedBookingId,
    isLoading
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="w-96 bg-white border-r border-gray-200 p-4 flex flex-col shadow-md rounded-lg m-4 h-[calc(100vh-2rem)]">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 border-b border-blue-100 pb-3">Bookings</h3>

            <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search by patient, doctor, or specialization..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200"
                    aria-label="Toggle filters"
                >
                    {showFilters ? <FaTimes size={20} /> : <FaFilter size={20} />}
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 pb-4 border-b border-gray-200 animate-fade-in transition-all duration-300 ease-in-out overflow-hidden">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Filters</h4>
                    <div className="flex flex-col space-y-3">
                        <div>
                            <label htmlFor="status-filter" className="block text-gray-600 text-sm font-medium mb-1">Status:</label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="date-filter" className="block text-gray-600 text-sm font-medium mb-1">Date Range:</label>
                            <select
                                id="date-filter"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-3 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg shadow-sm"></div>
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <p className="text-center text-gray-500 italic mt-8">No bookings found matching criteria.</p>
                ) : (
                    <ul className="space-y-3">
                        {bookings.map(booking => (
                            <li
                                key={booking._id}
                                className={`flex flex-col p-4 rounded-lg shadow-sm border ${selectedBookingId === booking._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} hover:bg-gray-50 cursor-pointer transition duration-200`}
                                onClick={() => onSelectBooking(booking)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-semibold text-gray-800">{booking.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1 flex items-center">
                                    <FaCalendarDay size={12} className="mr-1 text-blue-500" />
                                    <span className="font-medium"> Booking Date:</span> {new Date(booking?.bookingDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 mb-1 flex items-center">
                                    <FaCalendarDay size={12} className="mr-1 text-blue-500" />
                                    <span className="font-medium"> Schedule Date:</span> {new Date(booking?.ScheduleDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <FaClock size={12} className="mr-1 text-blue-500" />
                                    <span className="font-medium">Slot:</span> {booking.slot}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Doctor:</span> {booking.Doctor?.name || 'N/A'}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};