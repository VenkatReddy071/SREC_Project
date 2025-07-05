
import { useState, useEffect } from 'react';
import { ConfirmationModal } from './ConfirmationModel';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStethoscope, FaHospital, FaClock, FaClipboardList, FaInfoCircle, FaCalendarCheck, FaTimesCircle,FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

export const BookingDetailsPanel = ({ booking, onUpdateStatus, onCancel }) => {
    const [editableBooking, setEditableBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        setEditableBooking(booking);
    }, [booking]);

    if (!booking) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-100 p-6 m-4 rounded-lg shadow-md h-[calc(100vh-2rem)]">
                <p className="text-gray-500 text-xl font-medium">Select a booking to view details.</p>
            </div>
        );
    }

    const handleStatusChange = (newStatus) => {
        setEditableBooking(prev => ({ ...prev, status: newStatus }));
        handleSave(newStatus);
    };

    const handleSave = async (newStatus = editableBooking.status) => {
        const token = localStorage.getItem('dashboard');
        if (!token) {
            console.error('No authentication token found.');
            return;
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
            };
            const updatePayload = { status: newStatus };
            const response = await axios.put(`${API_BASE_URL}/api/booking/admin/${editableBooking._id}/status`, updatePayload, config);
            onUpdateStatus(response.data);
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error updating booking status:', error.response?.data || error.message);
        }
    };

    const confirmAction = (type) => {
        setActionType(type);
        setShowConfirmModal(true);
    };

    const executeAction = () => {
        if (actionType === 'approve') {
            handleSave('Approved');
        } else if (actionType === 'complete') {
            handleSave('Completed');
        } else if (actionType === 'cancel') {
            handleSave('Cancelled');
        }
    };

    const renderDetailField = (label, value, Icon = null) => (
        <p className="mb-2 text-gray-700 flex items-center">
            {Icon && <Icon size={18} className="mr-2 text-blue-600 flex-shrink-0" />}
            <strong className="text-blue-700 min-w-[120px] inline-block">{label}:</strong>
            <span>{value || 'N/A'}</span>
        </p>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Approved': return 'bg-blue-100 text-blue-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex-grow bg-white p-8 shadow-xl rounded-lg m-4 flex flex-col h-[calc(100vh-2rem)]">
            <h3 className="text-3xl font-extrabold text-blue-800 mb-6 pb-4 border-b-2 border-blue-200 sticky top-0 bg-white z-10">
                Booking Details - {booking.name}
            </h3>

            <div className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-100">
                        <h4 className="text-xl font-bold text-blue-800 mb-4">Patient Information</h4>
                        {renderDetailField("Patient Name", booking.name, FaUser)}
                        {renderDetailField("Email", booking.email, FaEnvelope)}
                        {renderDetailField("Mobile", booking.mobilenumber, FaPhone)}
                        {renderDetailField("Age", booking.age, FaUser)}
                        {renderDetailField("Gender", booking.gender, FaUser)}
                        {renderDetailField("Message", booking.message || 'No message provided.', FaInfoCircle)}
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg shadow-inner border border-green-100">
                        <h4 className="text-xl font-bold text-green-800 mb-4">Appointment Details</h4>
                        {renderDetailField("Doctor", booking.Doctor?.name || 'N/A', FaStethoscope)}
                        {renderDetailField("Specialization", booking.specialization?.join(', ') || 'N/A', FaStethoscope)}
                        {renderDetailField("Booking Date", new Date(booking?.bookingDate).toLocaleDateString(), FaCalendarAlt)}
                        {renderDetailField("Schedule Date", new Date(booking?.ScheduleDate).toLocaleDateString(), FaCalendarAlt)}
                        {renderDetailField("Time Slot", booking.slot, FaClock)}
                        {renderDetailField("Hospital", booking.Hospital?.name || 'N/A', FaHospital)} {/* Assuming Hospital is populated */}
                        {booking.offer && renderDetailField("Offer", booking.offer?.name || 'N/A', FaClipboardList)} {/* Assuming Offer is populated */}
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg shadow-inner border border-yellow-100 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">Current Status:</span>
                        <span className={`px-4 py-2 rounded-full text-lg font-bold ${getStatusColor(editableBooking?.status)}`}>
                            {editableBooking?.status}
                        </span>
                        
                    </div>
                    {editableBooking?.reasion &&(
                    <div className="p-4 bg-yellow-50 rounded-lg shadow-inner border border-yellow-100 flex items-center justify-between">
                        
                            <span className={`px-4 py-2 rounded-full text-lg `}>
                            <b>Reasion:</b> {editableBooking?.reasion}
                        </span>
                        </div>
                    )}
                    
                    

                    <div className="mt-6 flex justify-end space-x-4">
                        {editableBooking?.status === 'Pending' && (
                            <>
                                <button
                                    onClick={() => confirmAction('approve')}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                                >
                                    <FaCalendarCheck size={20} className="mr-2" /> Approve
                                </button>
                                <button
                                    onClick={() => confirmAction('cancel')}
                                    className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
                                >
                                    <FaTimesCircle size={20} className="mr-2" /> Cancel
                                </button>
                            </>
                        )}
                        {editableBooking?.status === 'Approved' && (
                            <>
                                <button
                                    onClick={() => confirmAction('complete')}
                                    className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                                >
                                    <FaCheckCircle size={20} className="mr-2" /> Mark as Completed
                                </button>
                                <button
                                    onClick={() => confirmAction('cancel')}
                                    className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 transform hover:scale-105"
                                >
                                    <FaTimesCircle size={20} className="mr-2" /> Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showConfirmModal}
                message={`Are you sure you want to ${actionType} this booking?`}
                onConfirm={executeAction}
                onCancel={() => setShowConfirmModal(false)}
            />
        </div>
    );
};