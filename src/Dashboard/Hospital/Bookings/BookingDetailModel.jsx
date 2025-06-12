// src/components/BookingDetailsModal.jsx
import React from 'react';

const BookingDetailsModal = ({ booking, onClose, doctors }) => {
  if (!booking) return null;

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full  flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            &times;
          </button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p><strong>Appointment ID:</strong> {booking._id}</p>
          <p><strong>Patient Name:</strong> {booking.name}</p>
          <p><strong>Patient Email:</strong> {booking.email}</p>
          <p><strong>Mobile Number:</strong> {booking.mobilenumber}</p>
          <p><strong>Doctor Name:</strong> {getDoctorName(booking.Doctor)}</p>
          <p><strong>Date & Time:</strong> {new Date(booking.date).toLocaleString()}</p>
          <p><strong>Service/Reason:</strong> {booking.specialization.join(', ')}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${
              booking.status === 'Confirmed' ? 'text-green-600' :
              booking.status === 'Pending' ? 'text-yellow-600' :
              booking.status === 'Completed' ? 'text-blue-600' :
              booking.status === 'Cancelled' ? 'text-red-600' :
              'text-gray-600'
            }`}>
            {booking.status}
          </span></p>
          <p><strong>Booking Source:</strong> {booking.bookingSource}</p>
          <p><strong>Age:</strong> {booking.age}</p>
          <p><strong>Gender:</strong> {booking.gender}</p>
          <p><strong>Detailed Reason for Visit:</strong> {booking.message || 'N/A'}</p>
          <p><strong>History of Previous Appointments:</strong> (Mock data for this is complex, but here you'd fetch and display past bookings for `booking.userId`)</p>
          <p><strong>Internal Notes Field:</strong> (This would typically be an editable text area in a real app)</p>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;