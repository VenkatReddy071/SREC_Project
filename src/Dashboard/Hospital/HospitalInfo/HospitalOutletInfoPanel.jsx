import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaEdit, FaTimes, FaSave, FaMapMarkerAlt, FaMedkit, FaAmbulance, FaHospitalAlt, FaCheckCircle, FaTimesCircle, FaThLarge, FaClock, FaTag
} from 'react-icons/fa';

export const HospitalOutletInfoPanel = ({ hospital, onUpdate, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableHospital, setEditableHospital] = useState(null);
    const [originalHospital, setOriginalHospital] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

    const daysOfWeekOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        if (hospital) {
            const currentOperatingHours = hospital.operatingHours || [];
            const orderedOperatingHours = daysOfWeekOrder.map(day => {
                const existing = currentOperatingHours.find(oh => oh.day === day);
                return existing ? { ...existing } : { day, openTime: '09:00', closeTime: '17:00', isClosed: false };
            });

            // Ensure glimpseInside and services are arrays
            const initialGlimpseInside = Array.isArray(hospital.glimpseInside) ? hospital.glimpseInside : [];
            const initialServices = Array.isArray(hospital.services) ? hospital.services : [];


            setEditableHospital({
                ...hospital,
                operatingHours: orderedOperatingHours,
                glimpseInside: initialGlimpseInside,
                services: initialServices
            });
            setOriginalHospital({
                ...hospital,
                operatingHours: JSON.parse(JSON.stringify(orderedOperatingHours)),
                glimpseInside: JSON.parse(JSON.stringify(initialGlimpseInside)),
                services: JSON.parse(JSON.stringify(initialServices))
            });
        }
    }, [hospital]);

    if (!hospital) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-100 p-6 m-4 rounded-lg shadow-md min-h-[400px]">
                <p className="text-gray-500 text-xl font-medium">No hospital information available.</p>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditableHospital(prev => {
            let updatedValue = value;
            if (type === 'checkbox') {
                updatedValue = checked;
            } else if (name === 'glimpseInside' || name === 'services') {
                // Split by comma, trim whitespace, and filter out empty strings
                updatedValue = value.split(',').map(item => item.trim()).filter(item => item);
            }
            return { ...prev, [name]: updatedValue };
        });
    };

    const handleOperatingHoursChange = (dayIndex, field, value) => {
        setEditableHospital(prev => {
            const updatedHours = [...prev.operatingHours];
            updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };

            if (field === 'isClosed' && value === true) {
                updatedHours[dayIndex].openTime = '';
                updatedHours[dayIndex].day = daysOfWeekOrder[dayIndex]; // Ensure day is explicitly set
                updatedHours[dayIndex].closeTime = '';
            } else if (field === 'isClosed' && value === false) {
                 // Set default times if opening when previously closed
                 if (!updatedHours[dayIndex].openTime) updatedHours[dayIndex].openTime = '09:00';
                 if (!updatedHours[dayIndex].closeTime) updatedHours[dayIndex].closeTime = '17:00';
            }
            return { ...prev, operatingHours: updatedHours };
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('dashboard');
        if (!token) {
            console.error('No authentication token found.');
            return;
        }

        const isValidOperatingHours = editableHospital.operatingHours.every(day => {
            if (day.isClosed) return true; // If closed, no time validation needed
            // Validate time format for open days
            return day.openTime && day.closeTime &&
                   /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(day.openTime) &&
                   /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(day.closeTime);
        });

        if (!isValidOperatingHours) {
            alert('Please ensure all open days have valid open and close times (HH:MM format).');
            return;
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
            };

            const payload = {
                ...editableHospital,
                // Ensure these are always arrays when sending to backend
                glimpseInside: editableHospital.glimpseInside || [],
                services: editableHospital.services || [],
            };

            const response = await axios.put(`${API_BASE_URL}/api/hospitals/profile`, payload, config);
            onUpdate(response.data); // Update parent component's state
            setIsEditing(false); // Exit editing mode
            alert('Hospital outlet info updated successfully!');
            onRefresh(); // Refresh data from server to ensure consistency
        } catch (error) {
            console.error('Error updating hospital outlet info:', error.response?.data || error.message);
            alert(`Error updating info: ${error.response?.data?.msg || error.message}`);
        }
    };

    const handleCancelEdit = () => {
        // Revert to original hospital data
        setEditableHospital(JSON.parse(JSON.stringify(originalHospital)));
        setIsEditing(false);
    };

    const renderDisplayField = (label, value, Icon = null, isList = false) => {
        if (isList && Array.isArray(value)) {
            return (
                <div className="mb-3 text-gray-700 flex items-start">
                    {Icon && <Icon size={18} className="mr-2 text-blue-600 flex-shrink-0 mt-1" />}
                    <strong className="text-blue-700 min-w-[120px] inline-block">{label}:</strong>
                    <div className="flex flex-wrap gap-2">
                        {value.length > 0 ? (
                            value.map((item, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 italic">None provided</span>
                        )}
                    </div>
                </div>
            );
        }
        return (
            <p className="mb-3 text-gray-700 flex items-center">
                {Icon && <Icon size={18} className="mr-2 text-blue-600 flex-shrink-0" />}
                <strong className="text-blue-700 min-w-[120px] inline-block">{label}:</strong>
                {/* Conditionally render boolean values as "Yes" or "No" */}
                {typeof value === 'boolean' ? (
                    value ? <FaCheckCircle className="text-green-600 ml-1" size={18} /> : <FaTimesCircle className="text-red-600 ml-1" size={18} />
                ) : (
                    <span className="break-all">{value !== undefined && value !== null ? value.toString() : 'N/A'}</span>
                )}
            </p>
        );
    };

    const renderInputField = (label, name, value, type = 'text', placeholder = '', isTextArea = false, isListInput = false) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            {isTextArea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                ></textarea>
            ) : type === 'checkbox' ? (
                <div className="flex items-center">
                    <input
                        id={name}
                        type="checkbox"
                        name={name}
                        checked={value}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={name} className="text-gray-700 text-sm">{label}</label>
                </div>
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
            )}
            {isListInput && <p className="text-sm text-gray-500 mt-1">Separate items with commas (e.g., item1, item2)</p>}
        </div>
    );

    return (
        <div className="flex-grow bg-white p-8 shadow-xl rounded-lg m-4 flex flex-col min-h-[calc(100vh-2rem)]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-200">
                <h3 className="text-3xl font-extrabold text-blue-800">
                    Hospital Outlet Information
                </h3>
                {isEditing ? (
                    <div className="space-x-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                        >
                            <FaSave className="mr-2" /> Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 transform hover:scale-105"
                        >
                            <FaTimes className="mr-2" /> Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                        <FaEdit className="mr-2" /> Edit Info
                    </button>
                )}
            </div>

            <div className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                {isEditing && editableHospital ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-100">
                            <h4 className="text-xl font-bold text-blue-800 mb-4">General Details</h4>
                            {renderInputField("Hospital Name", "name", editableHospital.name || '', 'text', 'Enter Hospital Name')}
                            {renderInputField("Address", "address", editableHospital.address || '', 'text', '123 Hospital St, City, Country')}
                            {renderInputField("Main Image URL", "image", editableHospital.image || '', 'text', 'https://example.com/hospital.jpg')}
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Current Image Preview:</label>
                                {editableHospital.image && (
                                    <img src={editableHospital.image} alt="Hospital Main" className="w-48 h-auto object-cover rounded-md shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=Error'; }} />
                                )}
                            </div>
                        </div>

                        {/* CORRECTED GLIMPSE INSIDE SECTION (EDIT MODE) */}
                        <div className="p-4 bg-orange-50 rounded-lg shadow-inner border border-orange-100">
                            <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center"><FaThLarge className="mr-2" /> Glimpse Inside Areas</h4> {/* Renamed heading */}
                            {renderInputField("Area Names (comma-separated)", "glimpseInside", editableHospital.glimpseInside?.join(', ') || '', 'text', 'Main Entrance, Waiting Area, ICU, OPD', false, true)}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {/* Display glimpseInside as tags, not images */}
                                {Array.isArray(editableHospital.glimpseInside) && editableHospital.glimpseInside.length > 0 ? (
                                    editableHospital.glimpseInside.map((item, idx) => item && (
                                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                            {item}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No areas added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-teal-50 rounded-lg shadow-inner border border-teal-100">
                            <h4 className="text-xl font-bold text-teal-800 mb-4 flex items-center"><FaMedkit className="mr-2" /> Services Offered</h4>
                            {renderInputField("Services (comma-separated)", "services", editableHospital.services?.join(', ') || '', 'text', 'Cardiology, Neurology, Pediatrics', false, true)}
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg shadow-inner border border-red-100">
                            <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center"><FaAmbulance className="mr-2" /> Emergency & 24/7</h4>
                            {renderInputField("Ambulance Service Available", "ambulance", editableHospital.ambulance, 'checkbox')}
                            {renderInputField("24/7 Service Available", "isOffer", editableHospital.isOffer, 'checkbox')}
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg shadow-inner border border-yellow-100">
                            <h4 className="text-xl font-bold text-yellow-800 mb-4 flex items-center"><FaClock className="mr-2" /> Operating Hours</h4>
                            {editableHospital.operatingHours.map((dayHour, index) => (
                                <div key={dayHour.day} className="flex items-center space-x-3 mb-2">
                                    <label className="w-28 font-medium text-gray-700">{dayHour.day}:</label>
                                    <div className="flex items-center flex-1">
                                        <input
                                            type="checkbox"
                                            checked={dayHour.isClosed}
                                            onChange={(e) => handleOperatingHoursChange(index, 'isClosed', e.target.checked)}
                                            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mr-2"
                                        />
                                        <span className="text-sm text-gray-600 mr-4">Closed</span>
                                        <input
                                            type="time"
                                            value={dayHour.openTime || ''}
                                            onChange={(e) => handleOperatingHoursChange(index, 'openTime', e.target.value)}
                                            disabled={dayHour.isClosed}
                                            className={`p-2 border border-gray-300 rounded-md flex-1 ${dayHour.isClosed ? 'bg-gray-200 text-gray-500' : ''}`}
                                        />
                                        <span className="text-gray-600 mx-2">-</span>
                                        <input
                                            type="time"
                                            value={dayHour.closeTime || ''}
                                            onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                                            disabled={dayHour.isClosed}
                                            className={`p-2 border border-gray-300 rounded-md flex-1 ${dayHour.isClosed ? 'bg-gray-200 text-gray-500' : ''}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6 mb-8 p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-100">
                            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg border-4 border-blue-400">
                                <img
                                    src={hospital.image || 'https://placehold.co/128x128/e0e0e0/888888?text=Hospital'}
                                    alt="Hospital Main"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128?text=Error'; }}
                                />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-blue-800 mb-2 flex items-center"><FaHospitalAlt className="mr-2" /> {hospital.name}</h4>
                                {renderDisplayField("Address", hospital.address, FaMapMarkerAlt)}
                            </div>
                        </div>

                        {/* CORRECTED GLIMPSE INSIDE SECTION (DISPLAY MODE) */}
                        <div className="p-4 bg-orange-50 rounded-lg shadow-inner border border-orange-100">
                            <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center"><FaThLarge className="mr-2" /> Glimpse Inside Areas</h4> {/* Renamed heading */}
                            <div className="flex flex-wrap gap-3">
                                {/* Display glimpseInside as tags, like services */}
                                {Array.isArray(hospital.glimpseInside) && hospital.glimpseInside.length > 0 ? (
                                    hospital.glimpseInside.map((item, idx) => item && (
                                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                            {item}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-600 italic">No glimpse inside areas provided.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-teal-50 rounded-lg shadow-inner border border-teal-100">
                            <h4 className="text-xl font-bold text-teal-800 mb-4 flex items-center"><FaMedkit className="mr-2" /> Services</h4>
                            {renderDisplayField("Services Offered", hospital.services, FaTag, true)}
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg shadow-inner border border-red-100">
                            <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center"><FaAmbulance className="mr-2" /> Emergency & 24/7</h4>
                            {renderDisplayField("Ambulance Service", hospital.ambulance, FaAmbulance)}
                            {renderDisplayField("24/7 Service", hospital.isOffer, FaTag)}
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg shadow-inner border border-yellow-100">
                            <h4 className="text-xl font-bold text-yellow-800 mb-4 flex items-center"><FaClock className="mr-2" /> Operating Hours</h4>
                            <div className="space-y-1">
                                {Array.isArray(hospital.operatingHours) && hospital.operatingHours.length > 0 ? (
                                    hospital.operatingHours
                                        .sort((a, b) => daysOfWeekOrder.indexOf(a.day) - daysOfWeekOrder.indexOf(b.day))
                                        .map((dayHour, idx) => (
                                            <p key={dayHour.day || idx} className="text-gray-700 flex justify-between">
                                                <span className="font-semibold w-28">{dayHour.day}:</span>
                                                {dayHour.isClosed ? (
                                                    <span className="text-red-600 font-medium">Closed</span>
                                                ) : (
                                                    <span className="text-gray-800">{dayHour.openTime} - {dayHour.closeTime}</span>
                                                )}
                                            </p>
                                        ))
                                ) : (
                                    <p className="text-gray-600 italic">Operating hours not set.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};